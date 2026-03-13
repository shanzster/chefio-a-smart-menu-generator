# 🔐 Admin Account Setup Guide

**Created:** February 27, 2026  
**Purpose:** Create your first admin account for Chefio

---

## 📋 Recommended Admin Credentials

Use these credentials when creating your admin account:

```
Email: admin@chefio.app
Password: ChefioAdmin2026!
Display Name: Admin User
```

**⚠️ IMPORTANT:** Change the password after first login for security!

---

## 🚀 Method 1: Quick Setup (Recommended)

### Step 1: Register the Account (2 minutes)

1. **Open your app:**
   ```
   http://localhost:5174/register
   ```

2. **Fill in the registration form:**
   - **Full Name:** `Admin User`
   - **Email:** `admin@chefio.app`
   - **Password:** `ChefioAdmin2026!`
   - **Confirm Password:** `ChefioAdmin2026!`

3. **Click "Create Account"**
   - You'll be logged in as a regular user
   - Don't worry, we'll upgrade to admin next

### Step 2: Upgrade to Admin in Firebase Console (3 minutes)

1. **Open Firebase Console:**
   ```
   https://console.firebase.google.com
   ```

2. **Select your project:**
   - Project name: `chefio-22d95`
   - Or whatever your project is called

3. **Navigate to Firestore Database:**
   - Click "Firestore Database" in the left sidebar
   - Click "Data" tab

4. **Find your user:**
   - Click on the `users` collection
   - Look for the document with email `admin@chefio.app`
   - Click on that document

5. **Add admin fields:**
   
   **Add Field #1:**
   - Click "+ Add field" button
   - Field name: `role`
   - Field type: `string`
   - Value: `admin`
   - Click "Add"

   **Add Field #2:**
   - Click "+ Add field" button again
   - Field name: `isAdmin`
   - Field type: `boolean`
   - Value: `true` (toggle the switch)
   - Click "Add"

6. **Save changes:**
   - Your user document should now have:
     ```
     {
       email: "admin@chefio.app",
       displayName: "Admin User",
       role: "admin",
       isAdmin: true,
       createdAt: [timestamp],
       ...other fields
     }
     ```

### Step 3: Login to Admin Portal (30 seconds)

1. **Logout from the regular user portal:**
   - Click your profile
   - Click "Logout"

2. **Navigate to admin login:**
   ```
   http://localhost:5174/admin/login
   ```

3. **Login with admin credentials:**
   - Email: `admin@chefio.app`
   - Password: `ChefioAdmin2026!`

4. **You're in!** 🎉
   - You should see the purple-themed admin dashboard
   - All 6 admin modules are now accessible

---

## 🔧 Method 2: Using Firebase Console Only

If you prefer to create the account directly in Firebase:

### Step 1: Create User in Firebase Authentication

1. **Open Firebase Console:**
   ```
   https://console.firebase.google.com
   ```

2. **Go to Authentication:**
   - Click "Authentication" in left sidebar
   - Click "Users" tab
   - Click "Add user" button

3. **Enter user details:**
   - Email: `admin@chefio.app`
   - Password: `ChefioAdmin2026!`
   - Click "Add user"

4. **Copy the User UID:**
   - After creating, you'll see the user in the list
   - Copy the UID (long string like `abc123def456...`)

### Step 2: Create User Document in Firestore

1. **Go to Firestore Database:**
   - Click "Firestore Database" in left sidebar
   - Click "Data" tab

2. **Create user document:**
   - Click on `users` collection
   - Click "+ Add document"
   - Document ID: Paste the UID you copied
   - Add fields:

   ```
   Field: email
   Type: string
   Value: admin@chefio.app

   Field: displayName
   Type: string
   Value: Admin User

   Field: role
   Type: string
   Value: admin

   Field: isAdmin
   Type: boolean
   Value: true

   Field: createdAt
   Type: timestamp
   Value: [current timestamp]

   Field: status
   Type: string
   Value: active
   ```

3. **Click "Save"**

### Step 3: Login

1. Navigate to: `http://localhost:5174/admin/login`
2. Login with: `admin@chefio.app` / `ChefioAdmin2026!`

---

## 📱 Admin Portal Access

### Admin Routes

Once logged in, you can access:

| Route | Purpose |
|-------|---------|
| `/admin/dashboard` | Main dashboard with analytics |
| `/admin/users` | Manage all users |
| `/admin/tickets` | Handle support tickets |
| `/admin/moderation` | Review flagged content |
| `/admin/logs` | View activity audit logs |

### Admin Capabilities

**User Management:**
- ✅ View all users
- ✅ Search users
- ✅ Make users admin
- ✅ Suspend users
- ✅ Delete users
- ✅ View user activity

**Support Tickets:**
- ✅ View all tickets
- ✅ Filter by status
- ✅ Respond to tickets
- ✅ Close tickets
- ✅ Track resolution time

**Content Moderation:**
- ✅ View flagged recipes
- ✅ Review content
- ✅ Approve/remove recipes
- ✅ Warn users
- ✅ Suspend violators

**Activity Logs:**
- ✅ View all admin actions
- ✅ Filter by admin
- ✅ Filter by action type
- ✅ Search logs
- ✅ Export logs

---

## 🔒 Security Best Practices

### After First Login

1. **Change your password:**
   - Go to profile settings
   - Update to a strong, unique password
   - Use a password manager

2. **Enable 2FA (if available):**
   - Check Firebase Authentication settings
   - Enable two-factor authentication

3. **Create additional admin accounts:**
   - Don't share the main admin account
   - Create separate accounts for each admin
   - Use unique passwords for each

### Password Requirements

Your admin password should:
- ✅ Be at least 12 characters long
- ✅ Include uppercase and lowercase letters
- ✅ Include numbers
- ✅ Include special characters
- ✅ Not be used anywhere else
- ✅ Be stored in a password manager

### Recommended Passwords

Instead of `ChefioAdmin2026!`, consider:
```
ChefioAdmin$2026#Secure!
Admin@Chefio2026$Strong
Chefio#Admin2026!Safe$
```

---

## 🧪 Verification Checklist

After creating your admin account, verify:

### Authentication
- [ ] Can login at `/admin/login`
- [ ] Cannot access admin routes without login
- [ ] Regular users cannot access admin portal
- [ ] Logout works correctly

### Dashboard
- [ ] Dashboard loads with analytics
- [ ] User count displays
- [ ] Recipe count displays
- [ ] Ticket count displays
- [ ] System status shows

### User Management
- [ ] Can view all users
- [ ] Search works
- [ ] Can make users admin
- [ ] Can suspend users
- [ ] Can delete users (with confirmation)

### Support Tickets
- [ ] Can view tickets
- [ ] Can filter by status
- [ ] Can respond to tickets
- [ ] Can close tickets

### Content Moderation
- [ ] Can view flagged content
- [ ] Can approve content
- [ ] Can remove content
- [ ] Can warn users

### Activity Logs
- [ ] All actions are logged
- [ ] Can filter logs
- [ ] Can search logs
- [ ] Timestamps are correct

---

## 🚨 Troubleshooting

### Issue: Can't login to admin portal

**Solutions:**
1. Verify user has `role: "admin"` in Firestore
2. Verify user has `isAdmin: true` in Firestore
3. Check email and password are correct
4. Clear browser cache and cookies
5. Try incognito/private browsing mode

### Issue: Redirected to regular login

**Solutions:**
1. Check you're at `/admin/login` not `/login`
2. Verify admin fields in Firestore
3. Check browser console for errors
4. Restart dev server

### Issue: Admin routes show "Access Denied"

**Solutions:**
1. Verify both `role` and `isAdmin` fields exist
2. Logout and login again
3. Check AdminRoute component is working
4. Verify Firebase rules allow admin access

### Issue: Can't see other users

**Solutions:**
1. Check Firestore rules allow admin reads
2. Verify adminService.js functions work
3. Check browser console for errors
4. Verify Firebase connection

---

## 📊 Admin Account Details

### Account Information

```yaml
Email: admin@chefio.app
Password: ChefioAdmin2026!
Display Name: Admin User
Role: admin
Is Admin: true
Status: active
Created: [Your creation date]
```

### Firestore Document Structure

```javascript
{
  "email": "admin@chefio.app",
  "displayName": "Admin User",
  "role": "admin",
  "isAdmin": true,
  "status": "active",
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Required Fields for Admin Access

```javascript
{
  "role": "admin",        // Must be exactly "admin"
  "isAdmin": true         // Must be boolean true
}
```

---

## 🎯 Next Steps After Setup

### 1. Create Additional Admins
- Register more users
- Promote them to admin
- Assign specific responsibilities

### 2. Configure Support Categories
- Define ticket categories
- Set priority levels
- Create response templates

### 3. Set Moderation Rules
- Define content guidelines
- Set flagging criteria
- Create warning templates

### 4. Review Activity Logs
- Check all actions are logged
- Verify timestamps
- Test filtering and search

### 5. Test All Features
- User management
- Ticket responses
- Content moderation
- Log viewing

---

## 📚 Related Documentation

- `ADMIN_MODULES.md` - Complete module definitions
- `ADMIN_IMPLEMENTATION_COMPLETE.md` - Implementation details
- `PROJECT_STATUS.md` - Overall project status
- `ADMIN_SETUP_GUIDE.md` - Detailed setup guide

---

## 🔐 Security Reminders

⚠️ **IMPORTANT:**
- Never share admin credentials
- Change default password immediately
- Use strong, unique passwords
- Enable 2FA if available
- Monitor activity logs regularly
- Review user permissions periodically
- Keep Firebase rules updated
- Backup admin accounts

---

## ✅ Quick Reference

### Login URL
```
http://localhost:5174/admin/login
```

### Credentials
```
Email: admin@chefio.app
Password: ChefioAdmin2026!
```

### Firebase Console
```
https://console.firebase.google.com
Project: chefio-22d95
```

### Required Firestore Fields
```javascript
role: "admin"
isAdmin: true
```

---

**Admin Account Ready!** 🎉

Follow the steps above to create your admin account and start managing your Chefio platform.

For support, check the troubleshooting section or review the related documentation.

