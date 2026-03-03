import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface BriefGeneratorInput {
  description: string;
  language?: string;
}

export interface GeneratedBrief {
  title: string;
  description: string;
  requiredSkills: string;
  estimatedBudget: number;
  estimatedDuration: string;
  location?: string;
  rawResponse: string;
}

@Injectable()
export class AiService {
  private openai!: OpenAI;

  constructor(private configService: ConfigService) {
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    // Initialize OpenAI with proper error handling
    if (openaiApiKey && !openaiApiKey.includes('your-actual-key')) {
      this.openai = new OpenAI({ apiKey: openaiApiKey });
    } else {
      console.warn('OpenAI API key not configured properly');
    }
  }

  /**
   * Generate a structured brief from user description
   */
  async generateServiceBrief(input: BriefGeneratorInput): Promise<GeneratedBrief> {
    const { description, language = 'fr' } = input;

    if (!this.openai) {
      return this.generateSmartFallbackBrief(description, language);
    }

    try {
      return await this.generateBriefWithOpenAI(description, language);
    } catch (error) {
      console.error('OpenAI error:', error);
      return this.generateSmartFallbackBrief(description, language);
    }
  }

  /**
   * Generate brief using OpenAI GPT-3.5 with intelligent context understanding
   */
  private async generateBriefWithOpenAI(description: string, language: string): Promise<GeneratedBrief> {
    const systemPrompt = language === 'fr' 
      ? `Tu es un expert en gestion de projets et services. Analyse attentivement la demande et génère un brief structuré qui reflète vraiment le besoin. Les budgets et durées doivent être réalistes basés sur le type de service demandé.`
      : `You are an expert project manager. Analyze the request carefully and generate a structured brief reflecting the actual need. Budget and timeline must be realistic based on the service type.`;

    const userPrompt = language === 'fr'
      ? `Génère un brief JSON pour: "${description}"

Réponds UNIQUEMENT avec du JSON valide, rien d'autre:
{
  "title": "Titre court (max 80 caractères)",
  "description": "Description",
  "requiredSkills": "Compétences requises, séparées par des virgules",
  "estimatedBudget": nombre EUR,
  "estimatedDuration": "Durée estimée",
  "location": "Localisation ou Remote"
}`
      : `Generate a JSON brief for: "${description}"

Respond ONLY with valid JSON, nothing else:
{
  "title": "Short title (max 80 chars)",
  "description": "Description",
  "requiredSkills": "Required skills, comma-separated",
  "estimatedBudget": number EUR,
  "estimatedDuration": "Estimated duration",
  "location": "Location or Remote"
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const content = response.choices[0]?.message?.content || '';

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        title: (parsed.title || 'Request').substring(0, 80),
        description: parsed.description || description,
        requiredSkills: parsed.requiredSkills || 'Professional expertise',
        estimatedBudget: Number(parsed.estimatedBudget) || 500,
        estimatedDuration: parsed.estimatedDuration || '1-2 weeks',
        location: parsed.location || 'Not specified',
        rawResponse: content,
      };
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      return this.generateSmartFallbackBrief(description, language);
    }
  }

  /**
   * Refine an existing brief based on user feedback
   */
  async refineBrief(
    brief: Partial<GeneratedBrief>,
    feedback: string,
    language: string = 'fr',
  ): Promise<GeneratedBrief> {
    if (!this.openai) {
      return brief as GeneratedBrief;
    }

    try {
      return await this.refineBriefWithOpenAI(brief, feedback, language);
    } catch (error) {
      console.error('Refinement error:', error);
      return brief as GeneratedBrief;
    }
  }

  /**
   * Refine brief with OpenAI
   */
  private async refineBriefWithOpenAI(
    brief: Partial<GeneratedBrief>,
    feedback: string,
    language: string,
  ): Promise<GeneratedBrief> {
    const prompt = language === 'fr'
      ? `Le brief actuel: ${JSON.stringify(brief)}
Feedback utilisateur: "${feedback}"

Affine le brief en tenant compte du feedback. Réponds UNIQUEMENT avec du JSON valide:
{"title": "...", "description": "...", "requiredSkills": "...", "estimatedBudget": 0, "estimatedDuration": "...", "location": "..."}`
      : `Current brief: ${JSON.stringify(brief)}
User feedback: "${feedback}"

Refine the brief. Respond ONLY with valid JSON:
{"title": "...", "description": "...", "requiredSkills": "...", "estimatedBudget": 0, "estimatedDuration": "...", "location": "..."}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    });

    const content = response.choices[0]?.message?.content || '';

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return brief as GeneratedBrief;
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        title: parsed.title || brief.title || 'Request',
        description: parsed.description || brief.description || '',
        requiredSkills: parsed.requiredSkills || brief.requiredSkills || '',
        estimatedBudget: Number(parsed.estimatedBudget) || brief.estimatedBudget || 0,
        estimatedDuration: parsed.estimatedDuration || brief.estimatedDuration || '',
        location: parsed.location || brief.location || '',
        rawResponse: content,
      };
    } catch (error) {
      return brief as GeneratedBrief;
    }
  }

  /**
   * Generate list of relevant service categories
   */
  async generateHomePageServices(description: string): Promise<string[]> {
    try {
      if (!this.openai) {
        console.log('[AI] OpenAI not initialized, using fallback for:', description);
        return this.getSmartServiceCategories(description);
      }

      const result = await this.classifyServicesWithOpenAI(description);
      
      // If OpenAI returned nothing, use fallback
      if (!result || result.length === 0) {
        console.log('[AI] OpenAI returned empty, using fallback');
        return this.getSmartServiceCategories(description);
      }

      console.log('[AI] OpenAI services:', result);
      return result;
    } catch (error) {
      console.error('[AI] Service generation error:', error);
      console.log('[AI] Using fallback due to error');
      return this.getSmartServiceCategories(description);
    }
  }

  /**
   * Alias for generateHomePageServices - generates brief for homepage
   */
  async generateHomePageBrief(description: string): Promise<GeneratedBrief> {
    return this.generateServiceBrief({ description, language: 'fr' });
  }

  /**
   * Use OpenAI to classify services
   */
  private async classifyServicesWithOpenAI(description: string): Promise<string[]> {
    const categories = [
      'Travaux & Rénovation',
      'Design & Créativité',
      'Développement Web & Mobile',
      'Marketing & Acquisition',
      'Coaching & Apprentissage',
      'Contenu & Copywriting',
      'Photographie & Vidéo',
      'Consulting & Expertise',
    ];

    const categoryDescriptions = {
      'Travaux & Rénovation': 'construction, plomberie, électricité, rénovation, aménagement, bricolage, décoration intérieure',
      'Design & Créativité': 'design graphique, logo, branding, ui/ux, illustration, créativité',
      'Développement Web & Mobile': 'application mobile, site web, développement logiciel, code, programmation',
      'Marketing & Acquisition': 'marketing digital, seo, réseaux sociaux, publicité, growth hacking, stratégie marketing',
      'Coaching & Apprentissage': 'coaching, formation, formation professionelle, apprentissage, mentorat, sport, fitness',
      'Contenu & Copywriting': 'rédaction, copywriting, contenu, blog, articles, textes',
      'Photographie & Vidéo': 'photographie, vidéo, film, montage vidéo, production audiovisuelle',
      'Consulting & Expertise': 'consultation, conseil, stratégie, expertise, audit',
    };

    const prompt = `Tu es expert en classification de services. Analyse cette demande et identifie les 2-3 catégories EXACTEMENT APPROPRIÉES.

DEMANDE: "${description}"

CATÉGORIES AVEC DESCRIPTIONS:
${Object.entries(categoryDescriptions).map(([cat, desc]) => `- ${cat}: ${desc}`).join('\n')}

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide. RIEN D'AUTRE.
Réponds avec les noms EXACTS des catégories de la liste ci-dessus.
["Catégorie1", "Catégorie2"]`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 150,
      });

      const content = response.choices[0]?.message?.content || '';
      
      // Extract JSON array from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No JSON array found in response:', content);
        return this.getSmartServiceCategories(description);
      }

      const classified = JSON.parse(jsonMatch[0]) as string[];
      
      // Validate that all returned categories exist in our list
      const valid = classified.filter((c: string) => 
        categories.some(cat => cat.toLowerCase() === c.toLowerCase())
      );
      
      if (valid.length === 0) {
        console.warn('No valid categories returned:', classified);
        return this.getSmartServiceCategories(description);
      }

      return valid.slice(0, 3);
    } catch (error) {
      console.error('OpenAI classification failed:', error);
      return this.getSmartServiceCategories(description);
    }
  }

  /**
   * Smart fallback brief generation with advanced analysis
   */
  private generateSmartFallbackBrief(description: string, language: string): GeneratedBrief {
    const analysis = this.analyzeDescription(description);

    const title = description.split(/[.!?]/)[0].trim().substring(0, 80) || 
                  (language === 'fr' ? 'Nouvelle demande' : 'New Request');

    const skills = this.detectSkillsFromDescription(description);

    const budget = this.estimateBudgetFromAnalysis(analysis);

    const duration = this.estimateDurationFromAnalysis(analysis);

    return {
      title,
      description,
      requiredSkills: skills,
      estimatedBudget: budget,
      estimatedDuration: duration,
      location: analysis.isRemote ? 'Remote' : (language === 'fr' ? 'Non spécifié' : 'Not specified'),
      rawResponse: '[Smart Fallback Analysis]',
    };
  }

  /**
   * Analyze description for key characteristics
   */
  private analyzeDescription(desc: string): any {
    const lower = desc.toLowerCase();
    const wordCount = desc.split(/\s+/).length;
    const isRemote = /remote|online|home|distance|en ligne|maison/.test(lower);
    const isUrgent = /urgent|asap|rapidement|immédiat|quickly|emergency/.test(lower);

    return { wordCount, isRemote, isUrgent };
  }

  /**
   * Detect skills from description
   */
  private detectSkillsFromDescription(desc: string): string {
    const lower = desc.toLowerCase();

    const skillMap: Record<string, string[]> = {
      'Coaching & Training': ['coaching', 'training', 'sport', 'fitness', 'nager', 'swimming', 'yoga', 'pilates'],
      'Web Development': ['développement', 'web', 'code', 'javascript', 'react', 'python', 'php', 'application'],
      'Design': ['design', 'ui', 'ux', 'logo', 'branding', 'graphique', 'créatif'],
      'Marketing': ['marketing', 'seo', 'social', 'digital', 'growth', 'publicité', 'google ads'],
      'Content Creation': ['contenu', 'rédaction', 'blog', 'article', 'copywriting', 'writing'],
      'Photography & Video': ['photo', 'vidéo', 'video', 'filming', 'photographie', 'montage'],
      'Consulting': ['consultation', 'conseil', 'stratégie', 'expertise', 'audit'],
    };

    const detected: string[] = [];

    for (const [skill, keywords] of Object.entries(skillMap)) {
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          detected.push(skill);
          break;
        }
      }
    }

    return detected.slice(0, 3).join(', ') || 'Professional Services';
  }

  /**
   * Estimate budget based on analysis
   */
  private estimateBudgetFromAnalysis(analysis: any): number {
    let base = 500;

    if (analysis.wordCount > 150) base *= 1.5;
    if (analysis.isUrgent) base *= 1.3;

    const tiers = [300, 500, 800, 1200, 2000, 3500, 5000];
    return tiers.reduce((prev, curr) =>
      Math.abs(curr - base) < Math.abs(prev - base) ? curr : prev
    );
  }

  /**
   * Estimate timeline based on analysis
   */
  private estimateDurationFromAnalysis(analysis: any): string {
    if (analysis.isUrgent) {
      return analysis.wordCount > 100 ? '3-5 days' : '1-2 days';
    }

    return analysis.wordCount > 150 ? '2-3 weeks' : '1-2 weeks';
  }

  /**
   * Smart service category detection
   */
  private getSmartServiceCategories(desc: string): string[] {
    const lower = desc.toLowerCase();

    const categories: Record<string, string[]> = {
      'Travaux & Rénovation': ['travaux', 'rénovation', 'construction', 'maçonnerie', 'plomberie', 'électricité', 'aménager', 'bricolage', 'décoration'],
      'Design & Créativité': ['design', 'créatif', 'logo', 'branding', 'graphique', 'ui/ux', 'illustration', 'landing page', 'wireframe', 'ux'],
      'Développement Web & Mobile': ['développement', 'web', 'code', 'javascript', 'react', 'app', 'application', 'saas', 'website', 'site'],
      'Marketing & Acquisition': ['marketing', 'seo', 'social', 'growth', 'publicité', 'digital', 'conversion', 'newsletter', 'acquisition'],
      'Coaching & Apprentissage': ['coaching', 'formation', 'apprentissage', 'sport', 'training', 'mentorat', 'babysitter', 'baby sitter', 'nourrice', 'bébé', 'enfant'],
      'Contenu & Copywriting': ['contenu', 'rédaction', 'blog', 'copywriting', 'article', 'texte', 'écriture'],
      'Photographie & Vidéo': ['photo', 'vidéo', 'photographie', 'filming', 'montage', 'production', 'video'],
      'Consulting & Expertise': ['consultation', 'conseil', 'stratégie', 'expertise', 'audit', 'consulter'],
    };

    const scores: Record<string, number> = {};

    for (const [cat, keywords] of Object.entries(categories)) {
      let score = 0;
      for (const kw of keywords) {
        if (lower.includes(kw)) score += 2;
      }
      if (score > 0) scores[cat] = score;
    }

    const results = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((r) => r[0]);

    // If no categories found, return default mix based on context
    if (results.length === 0) {
      console.log('[AI Fallback] No categories matched for:', desc);
      return ['Coaching & Apprentissage', 'Design & Créativité', 'Consulting & Expertise'];
    }

    console.log('[AI Fallback] Detected categories:', results);
    return results;
  }
}
