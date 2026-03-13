# 🌱 Seed Admin Account - Automated Setup

**Quick way to create your admin account automatically!**

---

## 🚀 Quick Start (30 seconds)

Just run this command:

```bash
npm run seed:admin
```

That's it! The script will:
1. ✅ Create admin user in Firebase Authentication
2. ✅ Create admin document in Firestore with proper roles
3. ✅ Display your login credentials

---

## 📋 What You'll Get

**Admin Credentials:**
```
Email:    admin@chefio.app
Password: ChefioAdmin2026!
Name:     Admin User
```

**Firestore Document:**
```javascript
{
  email: "admin@chefio.app",
  displayName: "Admin User",
  role: "admin",
  isAdmin: true,
  status: "active",
  createdAt: "2026-02-27T...",
  updatedAt: "2026-02-27T..."
}
```

---

## 🎯 Step-by-Step

### 1. Run the Seed Script

```bash
npm run seed:admin
```

### 2. Wait for Success Message

You'll see:
```
🌱 Starting admin account seeding...

📝 Creating admin user in Firebase Authentication...
✅ Admin user created in Authentication
   User ID: abc123def456...

📝 Creating admin user document in Firestore...
✅ Admin user document created in Firestore

🎉 Admin account seeded successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Admin Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Email:    admin@chefio.app
   Password: ChefioAdmin2026!
   Name:     Admin User
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Next Steps:
   1. Go to: http://localhost:5174/admin/login
   2. Login with the credentials above
   3. Start managing your platform!
```

### 3. Login to Admin Portal

1. Open: `http://localhost:5174/admin/login`
2. Enter:
   - Email: `admin@chefio.app`
   - Password: `ChefioAdmin2026!`
3. Click "Admin Sign In"
4. You're in! 🎉

---

## 🔧 Troubleshooting

### Issue: "Admin account already exists"

**Message:**
```
⚠️  Admin account already exists!

📋 Use these credentials to login:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Email:    admin@chefio.app
   Password: ChefioAdmin2026!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Solution:**
- The account is already created!
- Just login with the credentials shown
- If you forgot the password:
  1. Go to Firebase Console → Authentication
  2. Delete the admin@chefio.app user
  3. Run `npm run seed:admin` again

---

### Issue: "Missing Firebase configuration variables"

**Message:**
```
❌ Missing Firebase configuration variables in .env:
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   ...
```

**Solution:**
1. Check your `.env` file exists
2. Verify it has all Firebase variables:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```
3. Copy from `.env.example` if needed
4. Run the script again

---

### Issue: "Error seeding admin account"

**Possible Causes:**
1. No internet connection
2. Firebase project not set up
3. Firebase Authentication not enabled
4. Wrong Firebase configuration

**Solutions:**
1. Check your internet connection
2. Verify Firebase project exists
3. Enable Authentication in Firebase Console:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
4. Double-check `.env` configuration

---

## 📁 Script Files

### Main Script (Uses .env)
```
scripts/seedAdminWithEnv.js
```
- Reads Firebase config from `.env`
- Creates admin user
- Sets up Firestore document
- Displays credentials

### Alternative Script (Hardcoded)
```
scripts/seedAdmin.js
```
- Has Firebase config hardcoded
- Use if `.env` has issues
- Same functionality

---

## 🔐 Security Notes

### After First Login

1. **Change the password:**
   - The default password is in this public file
   - Change it immediately after first login
   - Use a strong, unique password

2. **Store credentials securely:**
   - Use a password manager
   - Don't share the admin account
   - Create separate admin accounts for team members

3. **Monitor activity:**
   - Check activity logs regularly
   - Review admin actions
   - Watch for suspicious activity

---

## 🎨 What Gets Created

### Firebase Authentication
```
Users
└── admin@chefio.app
    ├── UID: [auto-generated]
    ├── Email: admin@chefio.app
    ├── Email Verified: false
    ├── Created: [timestamp]
    └── Last Sign In: [timestamp]
```

### Firestore Database
```
users (collection)
└── [user-uid] (document)
    ├── email: "admin@chefio.app"
    ├── displayName: "Admin User"
    ├── role: "admin"
    ├── isAdmin: true
    ├── status: "active"
    ├── createdAt: "2026-02-27T..."
    └── updatedAt: "2026-02-27T..."
```

---

## 🧪 Verification

After seeding, verify:

### 1. Firebase Authentication
- [ ] Go to Firebase Console → Authentication
- [ ] See admin@chefio.app in users list
- [ ] User is enabled (not disabled)

### 2. Firestore Database
- [ ] Go to Firebase Console → Firestore
- [ ] Open `users` collection
- [ ] Find document with email admin@chefio.app
- [ ] Verify has `role: "admin"`
- [ ] Verify has `isAdmin: true`

### 3. Admin Login
- [ ] Go to http://localhost:5174/admin/login
- [ ] Login with credentials
- [ ] See purple admin dashboard
- [ ] Can access all admin routes

---

## 🔄 Re-running the Script

### If Account Already Exists

The script will detect existing accounts:
```
⚠️  Admin account already exists!
```

**Options:**
1. Use existing credentials (shown in output)
2. Delete user in Firebase Console and re-run
3. Create a different admin account (edit script)

### To Create Multiple Admins

1. Edit `scripts/seedAdminWithEnv.js`
2. Change credentials:
   ```javascript
   const ADMIN_EMAIL = 'admin2@chefio.app';
   const ADMIN_PASSWORD = 'DifferentPassword123!';
   const ADMIN_NAME = 'Admin Two';
   ```
3. Run: `npm run seed:admin`

---

## 📊 Script Output Examples

### Success
```
🌱 Starting admin account seeding...

📦 Project: chefio-22d95

📝 Creating admin user in Firebase Authentication...
✅ Admin user created in Authentication
   User ID: xYz123AbC456DeF789

📝 Creating admin user document in Firestore...
✅ Admin user document created in Firestore

🎉 Admin account seeded successfully!
```

### Already Exists
```
🌱 Starting admin account seeding...

📦 Project: chefio-22d95

📝 Creating admin user in Firebase Authentication...

⚠️  Admin account already exists!

📋 Use these credentials to login:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Email:    admin@chefio.app
   Password: ChefioAdmin2026!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Error
```
🌱 Starting admin account seeding...

❌ Missing Firebase configuration variables in .env:
   - VITE_FIREBASE_API_KEY

💡 Make sure your .env file has all required VITE_FIREBASE_* variables
```

---

## 🚀 Quick Commands

```bash
# Seed admin account
npm run seed:admin

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 📞 Quick Reference

### Command
```bash
npm run seed:admin
```

### Credentials
```
Email:    admin@chefio.app
Password: ChefioAdmin2026!
```

### Login URL
```
http://localhost:5174/admin/login
```

### Admin Dashboard
```
http://localhost:5174/admin/dashboard
```

---

## ✅ Success Checklist

After running the script:

- [ ] Script completed without errors
- [ ] Credentials displayed in terminal
- [ ] Can login at `/admin/login`
- [ ] See purple admin dashboard
- [ ] Can access `/admin/users`
- [ ] Can access `/admin/tickets`
- [ ] Can access `/admin/moderation`
- [ ] Can access `/admin/logs`
- [ ] All admin features work

---

**That's it! Your admin account is ready to use.** 🎉

Just run `npm run seed:admin` and you're good to go!

