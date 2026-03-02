const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('Creating test data...');

    // Create 5 test users with profiles
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const user = await prisma.user.upsert({
        where: { email: `provider${i}@example.com` },
        update: {},
        create: {
          email: `provider${i}@example.com`,
          passwordHash: '$2b$10$HKIJ7hD2nP7RJ8j9.XvJOeW5Rc3vZ7V6gF5E3R2Q1S0P9K8L7M6N5',
          profile: {
            create: {
              firstName: `Jean${i}`,
              lastName: `Dupont${i}`,
              bio: `Prestataire professionnel avec ${3 + i} ans d'expérience`,
              city: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'][i - 1],
              hourlyRate: 40 + i * 5,
              responseTime: i,
              avatarUrl: `/avatars/user${i}.jpg`,
            },
          },
        },
        include: { profile: true },
      });
      users.push(user);
      console.log(`Created user ${i}:`, user.email);
    }

    // Get skills with categories
    const skills = await prisma.skill.findMany({
      include: { category: true },
    });

    if (skills.length === 0) {
      console.log('No skills found. Run "npx prisma db seed" first.');
      return;
    }

    console.log(`Found ${skills.length} skills across categories`);

    // Create 15 test services
    const servicesTitles = [
      { skillIdx: 0, title: 'Nettoyage complet d\'appartement', desc: 'Service de nettoyage professionnel complet', price: 80, type: 'FIXED' },
      { skillIdx: 1, title: 'Aide ménagère hebdomadaire', desc: 'Aide ménagère régulière et fiable', price: 25, type: 'HOURLY' },
      { skillIdx: 2, title: 'Réparation plomberie', desc: 'Dépannage et réparation plomberie', price: 60, type: 'HOURLY' },
      { skillIdx: 3, title: 'Peinture intérieure', desc: 'Peinture de murs et plafonds', price: 120, type: 'FIXED' },
      { skillIdx: 4, title: 'Entretien jardin', desc: 'Tonte, taille et entretien jardin', price: 50, type: 'HOURLY' },
      { skillIdx: 5, title: 'Paysagiste consultation', desc: 'Consultation et aménagement jardin', price: 200, type: 'FIXED' },
      { skillIdx: 6, title: 'Déménagement petit volume', desc: 'Transport petit/moyen déménagement', price: 150, type: 'FIXED' },
      { skillIdx: 7, title: 'Aide déménagement', desc: 'Aide pour déménagement à la journée', price: 30, type: 'HOURLY' },
      { skillIdx: 8, title: 'Garde enfants/Baby-sitting', desc: 'Garde d\'enfants fiable et expérimentée', price: 15, type: 'HOURLY' },
      { skillIdx: 9, title: 'Cours particuliers', desc: 'Aide scolaire et cours particuliers', price: 40, type: 'HOURLY' },
      { skillIdx: 10, title: 'Dog-sitting/Promenade chiens', desc: 'Garde et promenade de chiens', price: 20, type: 'HOURLY' },
      { skillIdx: 11, title: 'Pet-sitting complet', desc: 'Garde complète d\'animaux à domicile', price: 35, type: 'HOURLY' },
      { skillIdx: 12, title: 'Dépannage informatique', desc: 'Aide informatique et dépannage PC', price: 50, type: 'HOURLY' },
      { skillIdx: 13, title: 'Installation alarme', desc: 'Installation et configuration alarme', price: 200, type: 'FIXED' },
      { skillIdx: 14, title: 'Aide aux personnes âgées', desc: 'Assistance et aide aux personnes âgées', price: 20, type: 'HOURLY' },
    ];

    for (let i = 0; i < servicesTitles.length; i++) {
      const config = servicesTitles[i];
      const user = users[i % users.length];
      const skill = skills[config.skillIdx % skills.length];

      const service = await prisma.service.create({
        data: {
          title: config.title,
          description: config.desc,
          basePrice: config.price,
          currency: 'EUR',
          priceType: config.type,
          estimatedDuration: config.type === 'HOURLY' ? 60 : 180,
          tags: [config.title.split(' ')[0].toLowerCase(), 'professionnel'].join(','),
          location: user.profile.city,
          maxDistance: 20,
          onsite: true,
          remote: i % 3 === 0,
          categoryId: skill.categoryId,
          skillId: skill.id,
          userId: user.id,
        },
      });

      console.log(`Created service ${i + 1}: ${service.title}`);

      // Create bookings and reviews for this service
      for (let j = 0; j < 2; j++) {
        const reviewer = users[(i + j + 1) % users.length];
        
        // Create a booking first
        const booking = await prisma.booking.create({
          data: {
            serviceId: service.id,
            customerId: reviewer.id,
            providerId: user.id,
            title: `Booking: ${service.title}`,
            description: `Booking created for testing`,
            price: service.basePrice,
            currency: 'EUR',
            status: 'COMPLETED',
            scheduledDate: new Date(),
          },
        });

        // Then create a review for the booking
        const rating = 3 + Math.floor(Math.random() * 3); // 3, 4, 5
        await prisma.review.create({
          data: {
            bookingId: booking.id,
            fromUserId: reviewer.id,
            toUserId: user.id,
            overallRating: rating,
            quality: 3 + Math.floor(Math.random() * 3),
            professionalism: 3 + Math.floor(Math.random() * 3),
            punctuality: 3 + Math.floor(Math.random() * 3),
            communication: 3 + Math.floor(Math.random() * 3),
            comment: ['Excellent!', 'Très satisfait', 'Recommandé', 'Très professionnel'][Math.floor(Math.random() * 4)],
            tags: 'excellent,recommande',
          },
        });
      }
    }

    console.log('\n✅ Test data created successfully!');
    console.log(`   Created ${users.length} users`);
    console.log(`   Created ${servicesTitles.length} services with reviews`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

createTestData();
