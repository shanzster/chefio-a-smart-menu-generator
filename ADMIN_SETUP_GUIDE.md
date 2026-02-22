# 🛡️ Admin System Setup Guide

## Overview

The Chefio admin system has been successfully created with a complete dashboard, user management, ticket support, content moderation, and activity logging.

---

## 📁 File Structure

```
src/
├── services/
│   └── firebase/
│       └── adminService.js          # All admin backend functions
│
├── components/
│   └── common/
│       └── ProtectedRoute/
│           └── AdminRoute.jsx       # Admin route protection
│
└── pages/
    └── admin/
        ├── Login/
        │   └── AdminLogin.jsx       # Admin login page (purple theme)
        ├── Dashboard/
        │   └── AdminDashboard.jsx   # Main admin dashboard
        ├── Users/
        │   └── UserManagement.jsx   # User management page
        ├── Tickets/
        │   └── TicketManagement.jsx # Support ticket handling
        ├── Moderation/
        │   └── ContentModeration.jsx # Flagged content review
        └── Logs/
            └── ActivityLogs.jsx     # Admin activity logs
```

---

## 🔐 Admin Features

### 1. **Admin Login** (`/admin/login`)
- Secure admin-only login with purple dark theme
- Verifies admin role before granting access
- Custom authentication flow
- Auto-redirects non-admins to user login

### 2. **Admin Dashboard** (`/admin/dashboard`)
- System overview with key metrics:
  - Total Users
  - Total Recipes
  - Open Tickets
  - Flagged Content
  - Total Feedback
  - All Tickets
- Quick action buttons
- System status monitoring
- Real-time analytics

### 3. **User Management** (`/admin/users`)
- View all registered users
- Search users by name or email
- User actions:
  - Make Admin (promote user)
  - Suspend/Unsuspend account
  - Delete user (with cascade delete)
- User status badges (Active/Suspended)
- Role badges (Admin/User)

### 4. **Ticket Management** (`/admin/tickets`)
- View all support tickets
- Filter by status (Open, In Progress, Resolved)
- Respond to tickets
- Update ticket status
- View ticket history
- Assign tickets to admins
- Priority and category labels

### 5. **Content Moderation** (`/admin/moderation`)
- Review flagged recipes
- Preview recipe content
- Actions:
  - Approve (remove flag)
  - Delete recipe
- View flag reasons
- Grid layout with recipe cards

### 6. **Activity Logs** (`/admin/logs`)
- View all admin actions
- Filter by action type:
  - User actions
  - Recipe actions
  - Ticket actions
- Timeline view with details
- Action metadata and timestamps
- Audit trail for accountability

---

## 🗄️ Database Collections

### Firestore Collections Used:

1. **users**
   - Added fields: `role`, `isAdmin`, `status`
   - Used for: User management, admin verification

2. **tickets**
   - Added fields: `assignedTo`, `responses[]`
   - Used for: Support ticket system

3. **recipes**
   - Added fields: `flagged`, `flaggedAt`, `flagReason`
   - Used for: Content moderation

4. **admin_logs** (NEW)
   - Schema:
     ```javascript
     {
       adminId: string,
       adminName: string,
       action: string,
       targetType: string,
       targetId: string,
       details: object,
       timestamp: timestamp
     }
     ```

5. **feedback**
   - Used for: Analytics and reporting

---

## 🚀 How to Set Up Admin Access

### Step 1: Create an Admin User

You need to manually set a user as admin in Firestore:

1. Register a normal user account
2. Go to Firebase Console → Firestore Database
3. Find the user in the `users` collection
4. Add/update these fields:
   ```javascript
   {
     role: "admin",
     isAdmin: true
   }
   ```

### Step 2: Test Admin Login

1. Navigate to: `http://localhost:5173/admin/login`
2. Login with your admin credentials
3. You should be redirected to the admin dashboard

### Alternative: Use the Make Admin Function

Once you have at least one admin, you can promote other users:

```javascript
// In User Management page
// Click "More Actions" → "Make Admin"
```

---

## 🔒 Security Features

### Admin Route Protection
- `AdminRoute.jsx` component checks:
  1. User is authenticated
  2. User has admin role (`role === "admin"` OR `isAdmin === true`)
  3. Redirects non-admins to login

### Admin Service Functions
- All admin functions check `isAdmin()` before execution
- Returns error if user lacks admin privileges
- All actions are logged to `admin_logs`

### Audit Trail
- Every admin action is automatically logged
- Includes: admin ID, action type, target, timestamp
- Cannot be deleted by admins
- Provides accountability

---

## 📊 Admin API Functions

### Available in `adminService.js`:

```javascript
// User Management
isAdmin(userId)                    // Check if user is admin
getAllUsers()                      // Get all users
toggleUserSuspension(userId, suspend)  // Suspend/unsuspend user
deleteUserAccount(userId)          // Delete user + cascade
makeUserAdmin(userId)              // Promote to admin

// Support Tickets
getAllTickets(filterStatus)        // Get tickets (filtered)
respondToTicket(ticketId, response) // Respond to ticket

// Content Moderation
getFlaggedRecipes()                // Get flagged recipes
moderateRecipe(recipeId, action)   // Approve or delete

// Analytics
getSystemAnalytics()               // Get system stats

// Logs
getAdminLogs(limitCount)           // Get admin activity logs
```

---

## 🎨 Admin UI Theme

- **Color Scheme**: Purple/Indigo dark theme
- **Login Page**: Dark gradient background with glassmorphism
- **Dashboard**: Clean white layout with colored stat cards
- **Icons**: Lucide React + React Icons
- **Consistent**: Uses existing Button, Card, Input, Modal components

---

## 🔗 Admin Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/login` | AdminLogin | Admin login page |
| `/admin/dashboard` | AdminDashboard | Main dashboard |
| `/admin/users` | UserManagement | Manage users |
| `/admin/tickets` | TicketManagement | Support tickets |
| `/admin/moderation` | ContentModeration | Flagged content |
| `/admin/logs` | ActivityLogs | Admin actions log |
| `/admin` | Redirect | → `/admin/dashboard` |

---

## 🧪 Testing the Admin System

### Test Scenario 1: Admin Login
```
1. Create a user account
2. Set role to "admin" in Firestore
3. Go to /admin/login
4. Login with credentials
5. Verify redirect to dashboard
```

### Test Scenario 2: User Management
```
1. Login as admin
2. Go to /admin/users
3. Try suspending a user
4. Check activity logs
5. Verify user status changed
```

### Test Scenario 3: Ticket Response
```
1. Create a support ticket as cook user
2. Login as admin
3. Go to /admin/tickets
4. Respond to ticket
5. Verify user receives response
```

### Test Scenario 4: Content Moderation
```
1. Flag a recipe (manually in Firestore)
2. Login as admin
3. Go to /admin/moderation
4. Review and approve/delete
5. Check logs for action record
```

---

## 📝 Next Steps

### Recommended Enhancements:

1. **Email Notifications**
   - Send emails when tickets are responded to
   - Notify users when suspended/deleted

2. **Advanced Analytics**
   - Charts and graphs
   - Usage trends over time
   - Popular recipes dashboard

3. **Bulk Actions**
   - Bulk user suspension
   - Bulk content approval

4. **Role Levels**
   - Super Admin
   - Moderator
   - Support Agent

5. **API Key Management**
   - View API usage
   - Rotate API keys
   - Monitor rate limits

---

## ⚠️ Important Notes

1. **First Admin Setup**
   - Must be done manually in Firestore
   - No self-registration for security

2. **Cascade Deletes**
   - Deleting a user deletes all their:
     - Recipes
     - Feedback
     - Support tickets

3. **Audit Logging**
   - All admin actions are logged
   - Logs cannot be deleted
   - Use for compliance/accountability

4. **Security**
   - Admin routes are protected
   - Backend functions verify admin role
   - All actions are authenticated

---

## 🐛 Troubleshooting

### Issue: Can't login as admin
**Solution**: Verify user has `role: "admin"` or `isAdmin: true` in Firestore

### Issue: Admin routes redirect to login
**Solution**: Check browser console for auth errors, verify Firebase connection

### Issue: Actions not logging
**Solution**: Check `admin_logs` collection exists, verify write permissions

### Issue: Users not loading
**Solution**: Check Firestore rules allow admin read access to `users` collection

---

## 📚 Related Documentation

- [Data Flow Diagram (DFD)](./DATA_FLOW_DIAGRAM.md) - See Process 9.0 for admin flows
- [Firebase Setup](./FIREBASE_SETUP.md) - Firebase configuration
- [User Data Structure](./USER_DATA_STRUCTURE.md) - User schema

---

**Admin System Version**: 1.0  
**Created**: February 19, 2026  
**Status**: ✅ Ready for Testing
