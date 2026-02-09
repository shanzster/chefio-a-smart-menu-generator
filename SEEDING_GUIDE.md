# 🌱 User Seeding Guide

## Quick Start

### Step 1: Install Dependencies
```bash
npm install firebase-admin
```

### Step 2: Get Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **chefio-22d95**
3. Settings ⚙️ → Service Accounts
4. Click "Generate New Private Key"
5. Save as `scripts/serviceAccountKey.json`

### Step 3: Run Seeding Script
```bash
node scripts/seedUsers.js
```

### Step 4: Test Login
- Go to `/login`
- Email: `test@chefio.com`
- Password: `Test123!`

---

## 📋 Test Accounts Created

### 10 Accounts Total:
- **8 Cook Accounts** - Regular users
- **1 Admin Account** - Admin privileges
- **1 Test Account** - Generic testing

### All Passwords:
- Regular accounts: `Test123!`
- Admin account: `Admin123!`

### Quick Reference:
```
john.doe@chefio.com     - Test123!
jane.smith@chefio.com   - Test123!
mike.johnson@chefio.com - Test123!
sarah.williams@chefio.com - Test123!
david.brown@chefio.com  - Test123!
emily.davis@chefio.com  - Test123!
chris.miller@chefio.com - Test123!
lisa.wilson@chefio.com  - Test123!
admin@chefio.com        - Admin123!
test@chefio.com         - Test123!
```

---

## 📁 Files Created

```
scripts/
├── seedUsers.js              ✅ Seeding script
├── serviceAccountKey.json    ⚠️  You need to download this
└── README.md                 ✅ Setup instructions

Root/
├── TEST_ACCOUNTS.md          ✅ Complete credentials list
├── SEEDING_GUIDE.md          ✅ This file
└── .gitignore                ✅ Updated to exclude keys
```

---

## 🎯 What Gets Created

For each user:

### Firebase Authentication
- Email/password account
- Display name set
- Email verified (auto)

### Firestore Document
- Complete profile data
- Address information
- Phone number
- Birthdate
- Role assignment
- Default preferences
- Empty stats (ready for testing)

---

## ⚠️ Important Notes

### Security
- **NEVER** commit `serviceAccountKey.json` to git
- Already added to `.gitignore`
- Delete test accounts before production

### Rate Limiting
- Script includes 500ms delay between users
- Prevents Firebase rate limiting
- Takes ~5 seconds to complete

### Existing Users
- Script checks if email exists
- Skips existing users
- Safe to run multiple times

---

## 🧪 Testing Scenarios

### Test 1: New User
```
Email: test@chefio.com
Password: Test123!
Purpose: First-time user experience
```

### Test 2: Multiple Users
```
Use: john.doe@chefio.com and jane.smith@chefio.com
Purpose: Recipe sharing, feedback between users
```

### Test 3: Admin Features
```
Email: admin@chefio.com
Password: Admin123!
Purpose: Admin dashboard, user management
```

### Test 4: Edge Cases
```
Email: chris.miller@chefio.com
Purpose: User without middle name
```

---

## 🔧 Troubleshooting

### Error: "Cannot find module 'firebase-admin'"
**Solution:** Run `npm install firebase-admin`

### Error: "Cannot find module './serviceAccountKey.json'"
**Solution:** Download service account key from Firebase Console

### Error: "Email already exists"
**Solution:** Users already created. Script will skip them.

### Error: "Permission denied"
**Solution:** Check service account key has correct permissions

---

## 📊 Expected Output

```bash
$ node scripts/seedUsers.js

🌱 Starting user seeding process...

✅ Created auth user: john.doe@chefio.com
✅ Created Firestore document for: john.doe@chefio.com
✅ Created auth user: jane.smith@chefio.com
✅ Created Firestore document for: jane.smith@chefio.com
✅ Created auth user: mike.johnson@chefio.com
✅ Created Firestore document for: mike.johnson@chefio.com
✅ Created auth user: sarah.williams@chefio.com
✅ Created Firestore document for: sarah.williams@chefio.com
✅ Created auth user: david.brown@chefio.com
✅ Created Firestore document for: david.brown@chefio.com
✅ Created auth user: emily.davis@chefio.com
✅ Created Firestore document for: emily.davis@chefio.com
✅ Created auth user: chris.miller@chefio.com
✅ Created Firestore document for: chris.miller@chefio.com
✅ Created auth user: lisa.wilson@chefio.com
✅ Created Firestore document for: lisa.wilson@chefio.com
✅ Created auth user: admin@chefio.com
✅ Created Firestore document for: admin@chefio.com
✅ Created auth user: test@chefio.com
✅ Created Firestore document for: test@chefio.com

📊 Seeding Summary:
✅ Created: 10 users
⚠️  Already existed: 0 users
❌ Failed: 0 users

✅ Successfully created:
   - john.doe@chefio.com
   - jane.smith@chefio.com
   - mike.johnson@chefio.com
   - sarah.williams@chefio.com
   - david.brown@chefio.com
   - emily.davis@chefio.com
   - chris.miller@chefio.com
   - lisa.wilson@chefio.com
   - admin@chefio.com
   - test@chefio.com

✨ Seeding complete!
```

---

## 🗑️ Cleanup (Before Production)

### Delete Test Accounts

#### Option 1: Firebase Console
1. Go to Authentication → Users
2. Find test user
3. Click menu (⋮) → Delete account

#### Option 2: Delete All at Once
Create a cleanup script or manually delete from console.

### Remove Files
```bash
rm scripts/serviceAccountKey.json
rm scripts/seedUsers.js
rm TEST_ACCOUNTS.md
```

---

## ✅ Checklist

Before running:
- [ ] Firebase Admin SDK installed
- [ ] Service account key downloaded
- [ ] Key saved as `scripts/serviceAccountKey.json`
- [ ] Firebase project is correct (chefio-22d95)

After running:
- [ ] All 10 users created successfully
- [ ] Can login with test@chefio.com
- [ ] Users visible in Firebase Console
- [ ] Firestore documents created

Before production:
- [ ] Delete all test accounts
- [ ] Remove seeding script
- [ ] Remove TEST_ACCOUNTS.md
- [ ] Remove service account key
- [ ] Update .gitignore

---

## 🎉 Success!

You now have 10 test accounts ready for testing all features of Chefio!

**Quick Test:**
1. Go to `http://localhost:5175/login`
2. Email: `test@chefio.com`
3. Password: `Test123!`
4. Click "Sign In"
5. Start testing! 🚀
