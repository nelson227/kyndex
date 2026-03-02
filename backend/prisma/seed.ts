import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create skill categories like Yoojo
  const categories = [
    {
      name: 'Ménage',
      slug: 'cleaning',
      icon: '🧹',
      color: '#FF6B6B',
      description: 'Services de nettoyage et ménage à domicile',
    },
    {
      name: 'Bricolage',
      slug: 'diy',
      icon: '🔨',
      color: '#4ECDC4',
      description: 'Petits travaux de bricolage et réparations',
    },
    {
      name: 'Jardinage',
      slug: 'gardening',
      icon: '🌱',
      color: '#95E1D3',
      description: 'Services d\'entretien de jardin et espaces verts',
    },
    {
      name: 'Déménagement',
      slug: 'removal',
      icon: '🚚',
      color: '#F38181',
      description: 'Services de déménagement et transport',
    },
    {
      name: 'Enfants',
      slug: 'childcare',
      icon: '👶',
      color: '#AA96DA',
      description: 'Garde d\'enfants et babysitting',
    },
    {
      name: 'Animaux',
      slug: 'petcare',
      icon: '🐕',
      color: '#FCBAD3',
      description: 'Garde et soin des animaux domestiques',
    },
    {
      name: 'Informatique',
      slug: 'it',
      icon: '💻',
      color: '#A8D8EA',
      description: 'Services informatiques et dépannage',
    },
    {
      name: 'Aide à domicile',
      slug: 'home-care',
      icon: '🏥',
      color: '#F7DC6F',
      description: 'Services d\'aide et assistance à domicile',
    },
    {
      name: 'Cours particuliers',
      slug: 'tutoring',
      icon: '📚',
      color: '#BB8FCE',
      description: 'Cours et formations personnalisées',
    },
  ];

  console.log('🌱 Seeding skill categories...');
  for (const category of categories) {
    const created = await prisma.skillCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`✅ Created category: ${created.name}`);
  }

  // Create some default skills for each category
  console.log('\n🌱 Seeding skills...');
  const defaultSkills = {
    cleaning: ['Ménage général', 'Nettoyage profond', 'Repassage', 'Vitres'],
    diy: ['Peinture', 'Électricité', 'Plomberie', 'Fixation d\'étagères'],
    gardening: ['Tonte de pelouse', 'Taille de haies', 'Entretien jardins', 'Élagage'],
    removal: ['Déménagement complet', 'Transport petits objets', 'Location camion'],
    childcare: ['Babysitting', 'Garde après école', 'Baby-sitting événement'],
    petcare: ['Dog-sitting', 'Pet-sitter', 'Promenade chiens'],
    it: ['Dépannage PC', 'Installation Wi-Fi', 'Malware removal'],
    'home-care': ['Aide ménagère', 'Assistance personnes âgées', 'Aide mobilité'],
    tutoring: ['Français', 'Mathématiques', 'Anglais', 'Lycée'],
  };

  for (const [slug, skillNames] of Object.entries(defaultSkills)) {
    const category = await prisma.skillCategory.findUnique({ where: { slug } });
    if (category) {
      for (const skillName of skillNames) {
        await prisma.skill.upsert({
          where: { name_categoryId: { name: skillName, categoryId: category.id } },
          update: {},
          create: {
            name: skillName,
            categoryId: category.id,
            description: `Compétence: ${skillName}`,
          },
        });
      }
      console.log(`✅ Created skills for category: ${category.name}`);
    }
  }

  // Create some default badges
  console.log('\n🌱 Seeding badges...');
  const badges = [
    {
      name: 'Prestataire Vérifié',
      slug: 'verified',
      icon: '✅',
      color: '#2ECC71',
      requirement: 'Identité vérifiée et document d\'identification',
    },
    {
      name: 'Top Prestataire',
      slug: 'top-rated',
      icon: '⭐',
      color: '#F1C40F',
      requirement: 'Plus de 100 avis avec note moyenne 4.8+',
    },
    {
      name: 'Réactif',
      slug: 'responsive',
      icon: '⚡',
      color: '#3498DB',
      requirement: 'Temps de réponse moyen < 30 min pendant 30 jours',
    },
    {
      name: 'Service d\'Excellence',
      slug: 'excellent',
      icon: '🏆',
      color: '#E74C3C',
      requirement: 'Note moyenne 4.9+ ET Plus de 200 services complétés',
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: badge,
    });
    console.log(`✅ Created badge: ${badge.name}`);
  }

  console.log('\n✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore - process is available in Node.js runtime
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
