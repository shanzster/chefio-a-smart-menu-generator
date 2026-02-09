# User Seeding Script

## Setup Instructions

### 1. Install Firebase Admin SDK
```bash
npm install firebase-admin
```

### 2. Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **chefio-22d95**
3. Click the gear icon ⚙️ → Project Settings
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the downloaded JSON file as `scripts/serviceAccountKey.json`

**⚠️ Important:** Never commit `serviceAccountKey.json` to git!

### 3. Run the Seeding Script
```bash
node scripts/seedUsers.js
```

## What It Does

Creates 10 test user accounts:
- 8 regular cook accounts
- 1 admin account  
- 1 generic test account

Each account includes:
- Firebase Authentication user
- Complete Firestore user document
- Profile data (name, phone, address)
- Default preferences and stats

## Expected Output

```
🌱 Starting user seeding process...

✅ Created auth user: john.doe@chefio.com
✅ Created Firestore document for: john.doe@chefio.com
...

📊 Seeding Summary:
✅ Created: 10 users
⚠️  Already existed: 0 users
❌ Failed: 0 users

✨ Seeding complete!
```

## Test Accounts

See `TEST_ACCOUNTS.md` for complete list of credentials.

Quick test login:
- Email: `test@chefio.com`
- Password: `Test123!`

## Troubleshooting

### "Cannot find module 'firebase-admin'"
Run: `npm install firebase-admin`

### "Cannot find module './serviceAccountKey.json'"
Download the service account key from Firebase Console and save it in the `scripts/` folder.

### "Email already exists"
The accounts were already created. The script will skip existing users.

## Security

⚠️ **DO NOT commit serviceAccountKey.json to git!**

The `.gitignore` should include:
```
scripts/serviceAccountKey.json
```
