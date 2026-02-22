# 🛡️ Chefio Admin System

## 📚 Documentation Index

Welcome to the Chefio Admin System! Here's your complete documentation:

### 📖 Read These In Order:

1. **[ADMIN_QUICK_START.md](./ADMIN_QUICK_START.md)** ⚡
   - **START HERE!** 3-minute setup guide
   - Visual interface previews
   - Common actions walkthrough
   - Test scenarios

2. **[ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md)** 🔧
   - Complete setup instructions
   - File structure breakdown
   - Database schema details
   - API reference
   - Troubleshooting guide

3. **[ADMIN_SYSTEM_SUMMARY.md](./ADMIN_SYSTEM_SUMMARY.md)** 📊
   - Full feature list
   - Security features
   - Design highlights
   - Enhancement ideas

4. **[DATA_FLOW_DIAGRAM.md](./DATA_FLOW_DIAGRAM.md)** 📈
   - Complete system DFD
   - See **Process 9.0** for admin flows
   - Level 0, 1, and 2 diagrams
   - User journeys with admin

---

## 🎯 Quick Access

### Admin URLs (Development)
- 🔐 Login: http://localhost:5177/admin/login
- 📊 Dashboard: http://localhost:5177/admin/dashboard
- 👥 Users: http://localhost:5177/admin/users
- 💬 Tickets: http://localhost:5177/admin/tickets
- 🚩 Moderation: http://localhost:5177/admin/moderation
- 📜 Logs: http://localhost:5177/admin/logs

### Key Files
- **Backend**: `src/services/firebase/adminService.js`
- **Protection**: `src/components/common/ProtectedRoute/AdminRoute.jsx`
- **Routes**: `src/App.jsx` (lines 160-200)
- **Pages**: `src/pages/admin/*`

---

## ✅ What's Included

### Pages (6)
- ✅ Admin Login - Purple themed, role verification
- ✅ Dashboard - Stats, quick actions, system status
- ✅ User Management - View, suspend, delete, promote
- ✅ Ticket Management - Respond, filter, track
- ✅ Content Moderation - Flag review, approve/delete
- ✅ Activity Logs - Audit trail, filter by type

### Backend Functions (11)
- ✅ `isAdmin()` - Role verification
- ✅ `getAllUsers()` - User list
- ✅ `getAllTickets()` - Ticket list
- ✅ `respondToTicket()` - Ticket responses
- ✅ `toggleUserSuspension()` - Suspend/unsuspend
- ✅ `deleteUserAccount()` - Delete with cascade
- ✅ `getFlaggedRecipes()` - Flagged content
- ✅ `moderateRecipe()` - Approve/delete
- ✅ `getSystemAnalytics()` - Stats
- ✅ `getAdminLogs()` - Activity logs
- ✅ `makeUserAdmin()` - Promote user

### Database Updates (4 collections)
- ✅ `admin_logs` - NEW: Audit trail
- ✅ `users` - Added: role, isAdmin, status
- ✅ `tickets` - Added: assignedTo, responses[]
- ✅ `recipes` - Added: flagged, flaggedAt, flagReason

---

## 🚀 Getting Started (30 seconds)

```bash
# 1. Create your first admin
   → Go to Firebase Console → Firestore
   → Find your user in 'users' collection
   → Add fields: role: "admin", isAdmin: true

# 2. Login as admin
   → http://localhost:5177/admin/login

# 3. Explore!
   → Dashboard shows system overview
   → Try managing users, responding to tickets
```

---

## 🎨 Design Philosophy

- **Purple Theme**: Distinct from cook (orange) and guest views
- **Glassmorphism**: Modern, clean aesthetic
- **Responsive**: Mobile and desktop friendly
- **Consistent**: Uses existing Button, Card, Input components
- **Secure**: Role verification on frontend AND backend

---

## 🔐 Security Features

1. **Role-Based Access Control (RBAC)**
   - Admin routes protected by `AdminRoute` component
   - Backend functions verify `isAdmin()` before execution
   - Non-admins redirected automatically

2. **Audit Logging**
   - ALL admin actions logged to `admin_logs`
   - Includes: admin ID, action type, target, timestamp
   - Immutable - cannot be deleted by admins

3. **Cascade Delete Protection**
   - Deleting user removes all associated data
   - Prevents orphaned records
   - Action is logged for accountability

---

## 📊 System Capabilities

### User Management
- View all registered users
- Search by name or email
- Suspend/unsuspend accounts
- Delete accounts (with warning)
- Promote users to admin role
- View user status and role badges

### Support System
- View all support tickets
- Filter by status (Open/In Progress/Resolved)
- Respond to tickets with messages
- Update ticket status
- View response history
- Auto-assign tickets to responding admin

### Content Moderation
- View all flagged recipes
- Preview full recipe details
- Approve flagged content (remove flag)
- Delete inappropriate content
- View flag reasons and timestamps

### Activity Monitoring
- View all admin actions in timeline
- Filter by action type (User/Recipe/Ticket)
- See detailed action metadata
- Track who did what and when

---

## 📁 Project Structure

```
chefio/
├── src/
│   ├── services/firebase/
│   │   └── adminService.js          # Admin backend
│   │
│   ├── components/common/ProtectedRoute/
│   │   └── AdminRoute.jsx            # Route protection
│   │
│   ├── pages/admin/                  # Admin pages
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Users/
│   │   ├── Tickets/
│   │   ├── Moderation/
│   │   ├── Logs/
│   │   └── index.js
│   │
│   └── App.jsx                       # Routes configured
│
├── ADMIN_QUICK_START.md              # START HERE
├── ADMIN_SETUP_GUIDE.md              # Complete guide
├── ADMIN_SYSTEM_SUMMARY.md           # Full summary
├── DATA_FLOW_DIAGRAM.md              # System DFD
└── ADMIN_README.md                   # This file
```

---

## 🧪 Testing Checklist

- [ ] Create first admin in Firestore
- [ ] Login at `/admin/login`
- [ ] View dashboard metrics
- [ ] Search and view users
- [ ] Suspend a test user
- [ ] Promote user to admin
- [ ] Create a support ticket (as cook)
- [ ] Respond to ticket (as admin)
- [ ] Flag a recipe (manually in Firestore)
- [ ] Review and moderate flagged content
- [ ] Check activity logs for all actions
- [ ] Try accessing admin pages as regular user (should fail)
- [ ] Test logout functionality

---

## 🎯 Common Tasks

### Task: Make Someone Admin
1. Go to `/admin/users`
2. Find the user
3. Click ⋮ → "Make Admin"
4. ✅ Done!

### Task: Respond to Support Ticket
1. Go to `/admin/tickets`
2. Click "Respond" on ticket
3. Type response
4. Update status
5. Click "Send Response"
6. ✅ User notified!

### Task: Delete Inappropriate Recipe
1. Go to `/admin/moderation`
2. Find flagged recipe
3. Click "View" to preview
4. Click "Delete"
5. Confirm deletion
6. ✅ Recipe removed!

---

## 🐛 Troubleshooting

**Can't see admin pages?**
→ Make sure you're logged in and have `role: "admin"` in Firestore

**Redirected to login?**
→ Check browser console, verify admin status in database

**Functions not working?**
→ Verify Firebase connection, check console for errors

**No data showing?**
→ Create test data (users, tickets) to populate pages

---

## 🔗 Related Documentation

- [Firebase Setup](./FIREBASE_SETUP.md)
- [User Data Structure](./USER_DATA_STRUCTURE.md)
- [System Modules](./SYSTEM_MODULES.md)
- [Data Flow Diagram](./DATA_FLOW_DIAGRAM.md) - See Process 9.0

---

## 💡 Pro Tips

1. **First Admin**: Must be created manually in Firestore
2. **Security**: Always use AdminRoute for protected pages
3. **Logging**: All actions auto-log, review regularly
4. **Testing**: Use incognito for testing different roles
5. **Backup**: Export admin_logs periodically for compliance

---

## 🚀 Future Enhancements

### Suggested Improvements:
- [ ] Email notifications for ticket responses
- [ ] Charts and analytics dashboards
- [ ] Bulk user actions (suspend multiple)
- [ ] Permission levels (Super Admin, Moderator, Support)
- [ ] Export data to CSV
- [ ] Advanced search and filters
- [ ] Real-time notifications
- [ ] API key management interface

---

## 📞 Support

**Need help?**
- Read: [ADMIN_QUICK_START.md](./ADMIN_QUICK_START.md)
- Check: [ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md)
- Review: Browser console for errors
- Verify: Firestore rules and user roles

---

## ✨ Summary

You now have a **complete, production-ready admin system** with:
- 🎨 Beautiful purple-themed UI
- 🔒 Secure role-based access control
- 📊 Comprehensive dashboard and analytics
- 👥 Full user management capabilities
- 💬 Support ticket system
- 🚩 Content moderation tools
- 📜 Complete audit logging

**Status**: ✅ Ready to use!  
**Version**: 1.0  
**Created**: February 19, 2026

---

**Happy Administering! 🛡️**
