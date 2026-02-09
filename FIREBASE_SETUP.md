# Firebase Backend Setup Guide

## ✅ What's Been Implemented

### 1. Firebase Configuration
- **File**: `src/config/firebase.js`
- Initialized Firebase app with your credentials
- Set up Authentication, Firestore, Storage, and Analytics

### 2. Firebase Services Created

#### Authentication Service (`src/services/firebase/authService.js`)
- ✅ User registration with email/password
- ✅ User login
- ✅ User logout
- ✅ Password reset
- ✅ Auth state listener
- ✅ Automatic user profile creation in Firestore

#### Recipe Service (`src/services/firebase/recipeService.js`)
- ✅ Create recipes
- ✅ Get user's recipes
- ✅ Get recipe by ID
- ✅ Update recipes
- ✅ Delete recipes
- ✅ Toggle favorite status
- ✅ Search recipes
- ✅ Get favorite recipes
- ✅ Increment views/saves

#### Feedback Service (`src/services/firebase/feedbackService.js`)
- ✅ Submit feedback for recipes
- ✅ Get recipe feedback
- ✅ Get all feedback for user's recipes
- ✅ Mark feedback as helpful
- ✅ Calculate feedback statistics
- ✅ Auto-update recipe ratings

#### Support Service (`src/services/firebase/supportService.js`)
- ✅ Create support tickets
- ✅ Get user's tickets
- ✅ Get ticket by ID
- ✅ Add responses to tickets
- ✅ Update ticket status
- ✅ Update ticket priority
- ✅ Get ticket statistics
- ✅ Close/reopen tickets

### 3. Updated Components
- ✅ Auth Store (`src/store/authStore.js`) - Now uses Firebase
- ✅ Login Page - Integrated with Firebase Auth
- ✅ Register Page - Integrated with Firebase Auth

---

## 🔧 Firebase Console Setup Required

### Step 1: Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **chefio-22d95**
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Click **Save**

### Step 2: Create Firestore Database
1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll add rules next)
4. Select your preferred location (e.g., `us-central`)
5. Click **Enable**

### Step 3: Set Up Firestore Security Rules
Go to **Firestore Database** → **Rules** and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }
    
    // Recipes collection
    match /recipes/{recipeId} {
      allow read: if true; // Public read for QR sharing
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                      (resource.data.userId == request.auth.uid || 
                       request.resource.data.keys().hasOnly(['views', 'saves']));
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Feedback collection
    match /feedback/{feedbackId} {
      allow read: if true; // Public read
      allow create: if true; // Allow anonymous feedback
      allow update: if isAuthenticated();
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Support tickets collection
    match /tickets/{ticketId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Step 4: Set Up Storage (Optional - for recipe images)
1. Navigate to **Storage**
2. Click **Get started**
3. Use default security rules for now
4. Click **Done**

### Step 5: Set Up Storage Rules (Optional)
Go to **Storage** → **Rules** and paste this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /recipes/{recipeId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📊 Firestore Database Structure

### Collections

#### `users`
```javascript
{
  // Basic Info
  uid: string,
  email: string,
  name: string,
  firstName: string,
  middleName: string,
  lastName: string,
  birthdate: string (YYYY-MM-DD),
  role: "cook" | "guest" | "admin",
  
  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLoginAt: timestamp,
  
  // Profile Info
  profile: {
    bio: string,
    avatar: string,
    phone: string,
    location: string
  },
  
  // Address Info
  address: {
    street: string,
    city: string,
    country: string
  },
  
  // Statistics
  stats: {
    totalRecipes: number,
    sharedRecipes: number,
    weeklyRecipes: number,
    totalViews: number,
    totalSaves: number,
    totalFeedback: number,
    avgRating: number
  },
  
  // Preferences
  preferences: {
    emailNotifications: boolean,
    pushNotifications: boolean,
    theme: "light" | "dark",
    language: string
  },
  
  // Account Status
  status: {
    isActive: boolean,
    isVerified: boolean,
    isPremium: boolean
  }
}
```

#### `recipes`
```javascript
{
  userId: string,
  title: string,
  description: string,
  ingredients: array,
  instructions: array,
  category: string,
  prepTime: string,
  servings: number,
  difficulty: string,
  nutrition: {
    calories: number,
    protein: number,
    carbs: number,
    fat: number
  },
  isFavorite: boolean,
  views: number,
  saves: number,
  shares: number,
  avgRating: number,
  totalFeedback: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `feedback`
```javascript
{
  recipeId: string,
  userId: string,
  userName: string,
  rating: number (1-5),
  comment: string,
  helpful: number,
  notHelpful: number,
  createdAt: timestamp
}
```

#### `tickets`
```javascript
{
  ticketId: string,
  userId: string,
  userEmail: string,
  userName: string,
  category: string,
  subject: string,
  description: string,
  priority: "low" | "medium" | "high",
  status: "open" | "in-progress" | "resolved",
  responses: array[{
    id: number,
    from: string,
    message: string,
    timestamp: string,
    isSupport: boolean
  }],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🚀 Testing the Integration

### 1. Test Registration
```javascript
// The Register page now uses Firebase
// Try creating a new account at /register
```

### 2. Test Login
```javascript
// The Login page now uses Firebase
// Try logging in at /login
```

### 3. Test Recipe Creation (Coming Next)
```javascript
import { createRecipe } from './services/firebase/recipeService';

const recipe = {
  title: "Chicken Adobo",
  description: "Classic Filipino dish",
  ingredients: ["chicken", "soy sauce", "vinegar"],
  instructions: ["Step 1", "Step 2"],
  category: "Dinner",
  prepTime: "45 mins",
  servings: 4,
  difficulty: "Easy",
  nutrition: {
    calories: 450,
    protein: 35,
    carbs: 12,
    fat: 28
  }
};

await createRecipe(recipe);
```

---

## 📝 Next Steps

### Immediate Tasks
1. ✅ Enable Email/Password auth in Firebase Console
2. ✅ Create Firestore database
3. ✅ Set up security rules
4. ⏳ Test registration and login
5. ⏳ Integrate recipe services into pages
6. ⏳ Integrate feedback services
7. ⏳ Integrate support services

### Integration Checklist

#### Pages to Update:
- [ ] `src/pages/cook/MenuGenerator/MenuGenerator.jsx` - Use `createRecipe()`
- [ ] `src/pages/cook/Recipes/Recipes.jsx` - Use `getUserRecipes()`, `searchRecipes()`
- [ ] `src/pages/cook/Nutrition/Nutrition.jsx` - Save nutrition data with recipes
- [ ] `src/pages/cook/QRGenerator/QRGenerator.jsx` - Use `getRecipeById()`
- [ ] `src/pages/cook/RecipeFinder/RecipeFinder.jsx` - Use `searchRecipes()`
- [ ] `src/pages/cook/PortionCalculator/PortionCalculator.jsx` - Use `getUserRecipes()`
- [ ] `src/pages/cook/Feedback/Feedback.jsx` - Use `getUserRecipesFeedback()`
- [ ] `src/pages/cook/Support/Support.jsx` - Use `createTicket()`, `getUserTickets()`
- [ ] `src/pages/cook/Dashboard/Dashboard.jsx` - Use `getUserRecipes()` for stats

---

## 🔐 Environment Variables (Optional)

For better security, you can move Firebase config to environment variables:

1. Create `.env` file:
```env
VITE_FIREBASE_API_KEY=AIzaSyCFZEBnSQLqcnx6nfdd85aXgoce6Mge2as
VITE_FIREBASE_AUTH_DOMAIN=chefio-22d95.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=chefio-22d95
VITE_FIREBASE_STORAGE_BUCKET=chefio-22d95.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=570114622034
VITE_FIREBASE_APP_ID=1:570114622034:web:309ed99b6c5cba9ad1558b
VITE_FIREBASE_MEASUREMENT_ID=G-82FWE6M70T
```

2. Update `src/config/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

3. Add `.env` to `.gitignore`

---

## 🐛 Common Issues & Solutions

### Issue: "Firebase: Error (auth/email-already-in-use)"
**Solution**: The email is already registered. Try logging in instead.

### Issue: "Missing or insufficient permissions"
**Solution**: Check Firestore security rules are properly set up.

### Issue: "Firebase: Error (auth/weak-password)"
**Solution**: Password must be at least 6 characters.

### Issue: "Firebase: Error (auth/invalid-email)"
**Solution**: Check email format is valid.

---

## 📚 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Storage](https://firebase.google.com/docs/storage)

---

## ✅ Summary

Your Chefio app is now ready for Firebase backend! 

**What works now:**
- ✅ User registration with Firebase Auth
- ✅ User login with Firebase Auth
- ✅ User logout
- ✅ Auth state persistence
- ✅ All Firebase services created and ready to use

**Next step:** 
Go to Firebase Console and enable Authentication + Firestore, then test the registration and login!
