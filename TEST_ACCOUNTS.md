# Test User Accounts

## Quick Reference

All test accounts use password: **Test123!** (Admin uses: **Admin123!**)

| Email | Password | Name | Role |
|-------|----------|------|------|
| john.doe@chefio.com | Test123! | John Michael Doe | Cook |
| jane.smith@chefio.com | Test123! | Jane Elizabeth Smith | Cook |
| mike.johnson@chefio.com | Test123! | Mike Johnson | Cook |
| sarah.williams@chefio.com | Test123! | Sarah Anne Williams | Cook |
| david.brown@chefio.com | Test123! | David James Brown | Cook |
| emily.davis@chefio.com | Test123! | Emily Rose Davis | Cook |
| chris.miller@chefio.com | Test123! | Chris Miller | Cook |
| lisa.wilson@chefio.com | Test123! | Lisa Marie Wilson | Cook |
| admin@chefio.com | Admin123! | Admin User | Admin |
| test@chefio.com | Test123! | Test User | Cook |

## How to Seed

1. Install Firebase Admin: `npm install firebase-admin`
2. Download service account key from Firebase Console
3. Save as `scripts/serviceAccountKey.json`
4. Run: `node scripts/seedUsers.js`

## Quick Login

Go to `/login` and use any email above with password `Test123!`
