const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';

async function testFlow() {
  const prisma = new PrismaClient();

  try {
    console.log('\n=== FLOW TEST ===\n');

    // 1. Register a user
    console.log('1️⃣ Registering user...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      email: 'testuser@example.com',
      password: 'password123',
    });
    console.log('✅ User registered');
    const accessToken = registerRes.data.accessToken;

    // 2. Try to complete profile setup
    console.log('\n2️⃣ Completing profile setup...');
    try {
      const setupRes = await axios.post(
        `${API_URL}/profile/complete-setup`,
        {
          firstName: 'Test',
          lastName: 'User',
          bio: 'This is a test',
          location: 'Test Location'
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      console.log('✅ Profile setup completed');
      console.log('Response:', JSON.stringify(setupRes.data, null, 2));
    } catch (error) {
      console.error('❌ Profile setup failed:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Error:', error.message);
      }
    }

    // 3. Check user count
    console.log('\n3️⃣ Checking database...');
    const userCount = await prisma.user.count();
    console.log(`✅ Total users: ${userCount}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testFlow();
