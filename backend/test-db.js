const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();

  try {
    // Count users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: { id: true, email: true },
        take: 5,
      });
      console.log('\n👥 Users in database:');
      users.forEach(u => console.log(`  - ${u.email}`));
    } else {
      console.log('✅ Database is EMPTY - no users!');
    }
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
