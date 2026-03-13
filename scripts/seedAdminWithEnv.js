import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration from .env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Validate configuration
const missingVars = [];
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) missingVars.push(key);
});

if (missingVars.length > 0) {
  console.error('❌ Missing Firebase configuration variables in .env:');
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error('\n💡 Make sure your .env file has all required VITE_FIREBASE_* variables\n');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin credentials
const ADMIN_EMAIL = 'admin@chefio.app';
const ADMIN_PASSWORD = 'ChefioAdmin2026!';
const ADMIN_NAME = 'Admin User';

async function seedAdmin() {
  console.log('🌱 Starting admin account seeding...\n');
  console.log(`📦 Project: ${firebaseConfig.projectId}\n`);

  try {
    // Step 1: Create admin user in Firebase Authentication
    console.log('📝 Creating admin user in Firebase Authentication...');
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );
    const user = userCredential.user;
    console.log('✅ Admin user created in Authentication');
    console.log(`   User ID: ${user.uid}`);

    // Step 2: Create admin user document in Firestore
    console.log('\n📝 Creating admin user document in Firestore...');
    await setDoc(doc(db, 'users', user.uid), {
      email: ADMIN_EMAIL,
      displayName: ADMIN_NAME,
      role: 'admin',
      isAdmin: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Admin user document created in Firestore');

    // Success message
    console.log('\n🎉 Admin account seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Name:     ${ADMIN_NAME}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🚀 Next Steps:');
    console.log('   1. Go to: http://localhost:5174/admin/login');
    console.log('   2. Login with the credentials above');
    console.log('   3. Start managing your platform!\n');

    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n⚠️  Admin account already exists!');
      console.log('\n📋 Use these credentials to login:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('🔧 If you forgot the password, you can:');
      console.log('   1. Delete the user in Firebase Console');
      console.log('   2. Run this script again\n');
      process.exit(0);
    } else {
      console.error('\n❌ Error seeding admin account:');
      console.error(`   ${error.message}\n`);
      console.error('🔍 Troubleshooting:');
      console.error('   1. Check your Firebase configuration in .env');
      console.error('   2. Verify Firebase project is set up correctly');
      console.error('   3. Check your internet connection');
      console.error('   4. Verify Firebase Authentication is enabled\n');
      process.exit(1);
    }
  }
}

// Run the seed function
seedAdmin();
