# 👤 Complete User Data Structure

## Overview
When a user registers in Chefio, their data is stored in **two places**:
1. **Firebase Authentication** - For login credentials
2. **Firestore Database** - For complete user profile

---

## 🔐 Firebase Authentication Data

### Location: Firebase Auth → Users
```javascript
{
  uid: "xK9mP2nQ4rS5tU6vW7xY8zA",           // Auto-generated unique ID
  email: "john.doe@example.com",             // User's email
  displayName: "John Doe",                   // User's full name
  photoURL: null,                            // Profile picture URL (op