import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLCGQ3av7CtOEhYVQXLXxWZJqxqJYqxqY",
  authDomain: "chefio-22d95.firebaseapp.com",
  projectId: "chefio-22d95",
  storageBucket: "chefio-22d95.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

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
