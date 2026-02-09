// Firebase Admin SDK for seeding users
const admin = require('firebase-admin');

// Initialize Firebase Admin with your service account
// You'll need to download the service account key from Firebase Console
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

// Test users to create
const testUsers = [
  {
    email: 'john.doe@chefio.com',
    password: 'Test123!',
    firstName: 'John',
    middleName: 'Michael',
    lastName: 'Doe',
    birthdate: '1990-05-15',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    country: 'USA'
  },
  {
    email: 'jane.smith@chefio.com',
    password: 'Test123!',
    firstName: 'Jane',
    middleName: 'Elizabeth',
    lastName: 'Smith',
    birthdate: '1992-08-22',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    country: 'USA'
  },
  {
    email: 'mike.johnson@chefio.com',
    password: 'Test123!',
    firstName: 'Mike',
    middleName: '',
    lastName: 'Johnson',
    birthdate: '1988-03-10',
    phone: '+1 (555) 345-6789',
    address: '789 Pine Road',
    city: 'Chicago',
    country: 'USA'
  },
  {
    email: 'sarah.williams@chefio.com',
    password: 'Test123!',
    firstName: 'Sarah',
    middleName: 'Anne',
    lastName: 'Williams',
    birthdate: '1995-11-30',
    phone: '+1 (555) 456-7890',
    address: '321 Elm Street',
    city: 'Houston',
    country: 'USA'
  },
  {
    email: 'david.brown@chefio.com',
    password: 'Test123!',
    firstName: 'David',
    middleName: 'James',
    lastName: 'Brown',
    birthdate: '1987-07-18',
    phone: '+1 (555) 567-8901',
    address: '654 Maple Drive',
    city: 'Phoenix',
    country: 'USA'
  },
  {
    email: 'emily.davis@chefio.com',
    password: 'Test123!',
    firstName: 'Emily',
    middleName: 'Rose',
    lastName: 'Davis',
    birthdate: '1993-12-05',
    phone: '+1 (555) 678-9012',
    address: '987 Cedar Lane',
    city: 'Philadelphia',
    country: 'USA'
  },
  {
    email: 'chris.miller@chefio.com',
    password: 'Test123!',
    firstName: 'Chris',
    middleName: '',
    lastName: 'Miller',
    birthdate: '1991-04-25',
    phone: '+1 (555) 789-0123',
    address: '147 Birch Court',
    city: 'San Antonio',
    country: 'USA'
  },
  {
    email: 'lisa.wilson@chefio.com',
    password: 'Test123!',
    firstName: 'Lisa',
    middleName: 'Marie',
    lastName: 'Wilson',
    birthdate: '1989-09-14',
    phone: '+1 (555) 890-1234',
    address: '258 Spruce Way',
    city: 'San Diego',
    country: 'USA'
  },
  {
    email: 'admin@chefio.com',
    password: 'Admin123!',
    firstName: 'Admin',
    middleName: '',
    lastName: 'User',
    birthdate: '1985-01-01',
    phone: '+1 (555) 000-0000',
    address: '1 Admin Plaza',
    city: 'San Francisco',
    country: 'USA',
    role: 'admin'
  },
  {
    email: 'test@chefio.com',
    password: 'Test123!',
    firstName: 'Test',
    middleName: '',
    lastName: 'User',
    birthdate: '2000-06-15',
    phone: '+1 (555) 999-9999',
    address: '999 Test Street',
    city: 'Seattle',
    country: 'USA'
  }
];

async function createUser(userData) {
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: `${userData.firstName} ${userData.middleName ? userData.middleName + ' ' : ''}${userData.lastName}`.trim(),
      emailVerified: true // Auto-verify for test accounts
    });

    console.log(`✅ Created auth user: ${userData.email}`);

    // Create user document in Firestore
    const fullName = `${userData.firstName} ${userData.middleName ? userData.middleName + ' ' : ''}${userData.lastName}`.trim();
    
    await db.collection('users').doc(userRecord.uid).set({
      // Basic Info
      uid: userRecord.uid,
      email: userData.email,
      name: fullName,
      firstName: userData.firstName,
      middleName: userData.middleName,
      lastName: userData.lastName,
      birthdate: userData.birthdate,
      role: userData.role || "cook",
      
      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      
      // Profile Info
      profile: {
        bio: "",
        avatar: "",
        phone: userData.phone,
        location: ""
      },
      
      // Address Info
      address: {
        street: userData.address,
        city: userData.city,
        country: userData.country
      },
      
      // Statistics
      stats: {
        totalRecipes: 0,
        sharedRecipes: 0,
        weeklyRecipes: 0,
        totalViews: 0,
        totalSaves: 0,
        totalFeedback: 0,
        avgRating: 0
      },
      
      // Preferences
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        theme: "light",
        language: "en"
      },
      
      // Account Status
      status: {
        isActive: true,
        isVerified: true,
        isPremium: false
      }
    });

    console.log(`✅ Created Firestore document for: ${userData.email}`);
    return { success: true, email: userData.email, uid: userRecord.uid };

  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`⚠️  User already exists: ${userData.email}`);
      return { success: false, email: userData.email, error: 'already-exists' };
    } else {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
      return { success: false, email: userData.email, error: error.message };
    }
  }
}

async function seedUsers() {
  console.log('🌱 Starting user seeding process...\n');
  
  const results = {
    created: [],
    existing: [],
    failed: []
  };

  for (const userData of testUsers) {
    const result = await createUser(userData);
    
    if (result.success) {
      results.created.push(result.email);
    } else if (result.error === 'already-exists') {
      results.existing.push(result.email);
    } else {
      results.failed.push({ email: result.email, error: result.error });
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Seeding Summary:');
  console.log(`✅ Created: ${results.created.length} users`);
  console.log(`⚠️  Already existed: ${results.existing.length} users`);
  console.log(`❌ Failed: ${results.failed.length} users`);

  if (results.created.length > 0) {
    console.log('\n✅ Successfully created:');
    results.created.forEach(email => console.log(`   - ${email}`));
  }

  if (results.existing.length > 0) {
    console.log('\n⚠️  Already existed:');
    results.existing.forEach(email => console.log(`   - ${email}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed:');
    results.failed.forEach(item => console.log(`   - ${item.email}: ${item.error}`));
  }

  console.log('\n✨ Seeding complete!');
  process.exit(0);
}

// Run the seeding
seedUsers().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
