'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const FEATURED_SKILLS = [
  { name: 'Développement', icon: '💻', count: '2,450+', color: 'from-blue-500 to-cyan-500' },
  { name: 'Design', icon: '🎨', count: '1,890+', color: 'from-purple-500 to-pink-500' },
  { name: 'Marketing', icon: '📱', count: '1,620+', color: 'from-orange-500 to-red-500' },
  { name: 'Rédaction', icon: '✍️', count: '980+', color: 'from-green-500 to-emerald-500' },
  { name: 'Coaching', icon: '⭐', count: '1,450+', color: 'from-indigo-500 to-blue-500' },
  { name: 'Formation', icon: '🎓', count: '1,230+', color: 'from-yellow-500 to-orange-500' },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Alexis Mercier',
    role: 'Entrepreneur',
    text: 'J\'ai trouvé 3 développeurs talentueux en moins de 24h. Le processus est ultra simple et les profils sont vérifiés.',
    image: '👨‍💼',
    skill: 'Développement'
  },
  {
    id: 2,
    name: 'Valérie Fontaine',
    role: 'Designer Freelance',
    text: 'Kyndex m\'a permis de monétiser mes compétences facilement. Mes clients reviennent toujours!',
    image: '👩‍🎨',
    skill: 'Design'
  },
  {
    id: 3,
    name: 'Thomas Renard',
    role: 'Startup Founder',
    text: 'Le matching est impressionnant. Aucune plateforme n\'arrive à la cheville de Kyndex pour la qualité.',
    image: '👨‍💻',
    skill: 'Tech'
  }
];

const STEPS = [
  { 
    number: '01', 
    title: 'Créez votre profil', 
    description: 'Décrivez vos talents, compétences et disponibilités en quelques minutes',
    icon: '✨'
  },
  {
    number: '02',
    title: 'Parcourez les talents',
    description: 'Découvrez une communauté de 10,000+ experts vérifiés et notés',
    icon: '🔍'
  },
  {
    number: '03',
    title: 'Connectez-vous',
    description: 'Messagerie instantanée, vérification de profils et paiements sécurisés',
    icon: '🤝'
  },
  {
    number: '04',
    title: 'Échangez & Apprenez',
    description: 'Collaborez, notez et construisez une relation durable',
    icon: '🚀'
  }
];

const DEMO_SERVICES = [
  {
    id: 1,
    name: 'Marie Dubois',
    skill: 'Développeuse Web',
    rate: '$45/h',
    rating: 4.9,
    reviews: 152,
    image: '👩‍💻',
    bio: 'React & Node.js'
  },
  {
    id: 2,
    name: 'Jean Martin',
    skill: 'Designer UX/UI',
    rate: '$50/h',
    rating: 4.8,
    reviews: 98,
    image: '🎨',
    bio: 'Design système'
  },
  {
    id: 3,
    name: 'Sophie Leclerc',
    skill: 'Coach Business',
    rate: '$60/h',
    rating: 5.0,
    reviews: 234,
    image: '💼',
    bio: 'Croissance startup'
  },
  {
    id: 4,
    name: 'Pierre Durand',
    skill: 'Formateur Python',
    rate: '$40/h',
    rating: 4.7,
    reviews: 89,
    image: '🐍',
    bio: 'Programmation'
  },
  {
    id: 5,
    name: 'Isabelle Moreau',
    skill: 'Rédactrice SEO',
    rate: '$35/h',
    rating: 4.9,
    reviews: 178,
    image: '✍️',
    bio: 'Content marketing'
  },
  {
    id: 6,
    name: 'Thomas Lefevre',
    skill: 'Expert Marketing',
    rate: '$55/h',
    rating: 4.7,
    reviews: 145,
    image: '📊',
    bio: 'Stratégie digitale'
  },
];

export default function Home() {
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kyndex
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20">2026</div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm rounded-lg hover:bg-white/10 transition border border-white/20"
            >
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 text-sm bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section Asymétrique */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenu */}
            <div className="space-y-8 z-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium">Plateforme en temps réel</span>
                </div>
                <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                  Échangez vos <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">talents</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-xl">
                  Connectez-vous avec 10,000+ experts vérifiés. Trouvez, collaborez et apprenez de la meilleure communauté de talents.
                </p>
              </div>

              {/* Search Premium */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-xl opacity-25 group-hover:opacity-40 transition" />
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 flex items-center gap-3 hover:border-white/40 transition">
                  <span className="text-xl">🔍</span>
                  <input 
                    type="text"
                    placeholder="Développeur, Designer, Coach..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition font-semibold text-sm">
                    Chercher
                  </button>
                </div>
              </div>

              {/* Stats Elegantes */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">10K+</p>
                  <p className="text-sm text-gray-400">Experts vérifiés</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">4.9★</p>
                  <p className="text-sm text-gray-400">Évaluation moyenne</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text">50K+</p>
                  <p className="text-sm text-gray-400">Collaborations</p>
                </div>
              </div>
            </div>

            {/* Visuel asymétrique */}
            <div className="relative h-96 hidden lg:block">
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                {/* Floating Cards */}
                <div className="absolute top-10 left-10 w-40 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 rounded-xl p-4 space-y-2 animate-float">
                  <p className="font-semibold text-sm">👩‍💻 Marie</p>
                  <p className="text-xs text-gray-300">Dev React Senior</p>
                  <div className="flex gap-1">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="absolute bottom-20 right-10 w-40 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-xl p-4 space-y-2 animate-float animation-delay-2000">
                  <p className="font-semibold text-sm">🎨 Jean</p>
                  <p className="text-xs text-gray-300">Designer UX/UI</p>
                  <div className="flex gap-1">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="absolute top-1/2 right-5 w-40 h-32 bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-xl border border-white/20 rounded-xl p-4 space-y-2 animate-float animation-delay-4000">
                  <p className="font-semibold text-sm">💼 Sophie</p>
                  <p className="text-xs text-gray-300">Coach Business</p>
                  <div className="flex gap-1">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Grid Section */}
      <section className="relative py-24 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Talents les plus demandés</h2>
            <p className="text-gray-400 text-lg">Parcourez les domaines d'expertise les plus populaires</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_SKILLS.map((skill, idx) => (
              <div
                key={skill.name}
                onMouseEnter={() => setHoveredSkill(idx)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/5 rounded-xl blur transition" />
                <div className={`relative bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition rounded-xl absolute inset-0`} />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-white/30 rounded-xl p-6 transition transform group-hover:scale-105 h-full flex flex-col items-center justify-center text-center space-y-3">
                  <div className="text-3xl">{skill.icon}</div>
                  <div>
                    <p className="font-semibold text-sm">{skill.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{skill.count} experts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche - Timeline Interactive */}
      <section className="relative py-24 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-gray-400 text-lg">Commencez en 4 étapes simples</p>
          </div>

          <div className="space-y-8">
            {STEPS.map((step, idx) => (
              <div 
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className="group cursor-pointer"
              >
                <div className="flex gap-6 items-start">
                  {/* Ligne de connexion */}
                  {idx < STEPS.length - 1 && (
                    <div className="absolute left-[2.75rem] top-24 w-px h-20 bg-gradient-to-b from-white/30 to-transparent" />
                  )}
                  
                  {/* Numéro */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg transition-all transform group-hover:scale-110 ${
                      activeStep === idx 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-purple-500/50' 
                        : 'bg-white/10 border border-white/20'
                    }`}>
                      {activeStep === idx ? step.icon : step.number}
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className={`flex-1 pt-2 transition-all ${
                    activeStep === idx ? 'opacity-100' : 'opacity-70 group-hover:opacity-85'
                  }`}>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Talents */}
      <section className="relative py-24 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Talents vedettes</h2>
            <p className="text-gray-400 text-lg">Les meilleurs experts de notre communauté</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_SERVICES.map((service) => (
              <div
                key={service.id}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 hover:bg-white/10 transition overflow-hidden"
              >
                {/* Gradient Background au hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition" />
                
                <div className="relative">
                  {/* Avatar */}
                  <div className="text-6xl mb-4 text-center group-hover:scale-110 transition transform">
                    {service.image}
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-bold text-center mb-1">{service.name}</h3>
                  <p className="text-sm text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-center mb-2 font-semibold">
                    {service.skill}
                  </p>
                  <p className="text-xs text-gray-400 text-center mb-4">{service.bio}</p>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-sm font-bold">{service.rating}</span>
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-xs text-gray-500">({service.reviews})</span>
                  </div>

                  {/* Price */}
                  <p className="text-2xl font-bold text-center mb-4 text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                    {service.rate}
                  </p>

                  {/* Button */}
                  <Link
                    href="/auth/register"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-purple-500/50 transition block"
                  >
                    Voir le profil
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center">Ce que disent nos utilisateurs</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl lg:text-6xl font-bold">Prêt à commencer?</h2>
          <p className="text-xl text-gray-400">
            Rejoignez la communauté Kyndex et trouvez les talents qu'il vous faut
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition hover:scale-105 transform"
            >
              Créer un compte gratuitement
            </Link>
            <Link
              href="/discover"
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-lg font-bold hover:bg-white/20 transition"
            >
              Parcourir les talents
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-bold mb-4">Découvrir</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Services</a></li>
                <li><a href="#" className="hover:text-white transition">Talents</a></li>
                <li><a href="#" className="hover:text-white transition">Parcourir</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4">Entreprise</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">À propos</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Carrières</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4">Légal</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4">Réseaux</p>
              <div className="space-y-2 text-sm text-gray-400">
                <p><a href="#" className="hover:text-white transition">Twitter/X</a></p>
                <p><a href="#" className="hover:text-white transition">LinkedIn</a></p>
                <p><a href="#" className="hover:text-white transition">Instagram</a></p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 Kyndex. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
