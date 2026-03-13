# Firestore Collections & Document Structures

## Overview
This document outlines all Firestore collections and their document structures used in the Chefio application.

---

## Table of Contents
1. [Users Collection](#1-users-collection)
2. [Recipes Collection](#2-recipes-collection)
3. [Feedback Collection](#3-feedback-collection)
4. [QR Codes Collection](#4-qr-codes-collection)
5. [Ingredients Collection](#5-ingredients-collection)
6. [Scans Collection](#6-scans-collection)
7. [Tickets Collection](#7-tickets-collection)
8. [Admin Logs Collection](#8-admin-logs-collection)

---

## 1. Users Collection

**Collection Path:** `/users/{userId}`

### Document Structure
```javascript
{
  // Basic Info
  uid: string,                    // Firebase Auth UID
  email: string,                  // User email
  name: string,                   // Full name
  firstName: string,              // First name
  middleName: string,             // Middle name (optional)
  lastName: string,               // Last name
  birthdate: string,              // ISO date string
  role: string,                   // "cook" | "admin"
  
  // Timestamps
  createdAt: timestamp,           // Account creation date
  updatedAt: timestamp,           // Last update date
  lastLoginAt: timestamp,         // Last login timestamp
  
  // Profile Info
  profile: {
    bio: string,                  // User bio/description
    avatar: string,               // Avatar URL
    phone: string,                // Phone number
    location: string              // Location/city
  },
  
  // Address Info
  address: {
    street: string,               // Street address
    city: string,                 // City
    country: string               // Country
  },
  
  // Statistics
  stats: {
    totalRecipes: number,         // Total recipes created
    sharedRecipes: number,        // Recipes shared via QR
    weeklyRecipes: number,        // Recipes this week
    totalViews: number,           // Total recipe views
    totalSaves: number,           // Total recipe saves
    totalFeedback: number,        // Total feedback received
    avgRating: number             // Average rating (0-5)
  },
  
  // Preferences
  preferences: {
    emailNotifications: boolean,  // Email notifications enabled
    pushNotifications: boolean,   // Push notifications enabled
    theme: string,                // "light" | "dark"
    language: string              // "en" | "es" | etc.
  },
  
  // Account Status
  status: {
    isActive: boolean,            // Account active
    isVerified: boolean,          // Email verified
    isPremium: boolean,           // Premium subscription
    isSuspended: boolean          // Account suspended (admin)
  },
  
  // Saved Recipes (Map)
  savedRecipes: {
    [recipeId]: {
      id: string,                 // Recipe ID
      name: string,               // Recipe name
      image: string,              // Recipe image URL
      savedAt: timestamp,         // When saved
      source: string              // "spoonacular" | "user"
    }
  }
}
```

### Example Document
```javascript
{
  uid: "abc123xyz",
  email: "chef@example.com",
  name: "John Doe",
  firstName: "John",
  middleName: "",
  lastName: "Doe",
  birthdate: "1995-05-15",
  role: "cook",
  createdAt: Timestamp(2024-01-15 10:30:00),
  updatedAt: Timestamp(2024-03-10 14:20:00),
  lastLoginAt: Timestamp(2024-03-10 14:20:00),
  profile: {
    bio: "Passionate home cook",
    avatar: "https://example.com/avatar.jpg",
    phone: "+1234567890",
    location: "New York, USA"
  },
  address: {
    street: "123 Main St",
    city: "New York",
    country: "USA"
  },
  stats: {
    totalRecipes: 25,
    sharedRecipes: 10,
    weeklyRecipes: 3,
    totalViews: 150,
    totalSaves: 45,
    totalFeedback: 12,
    avgRating: 4.5
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    theme: "light",
    language: "en"
  },
  status: {
    isActive: true,
    isVerified: true,
    isPremium: false,
    isSuspended: false
  },
  savedRecipes: {
    "recipe123": {
      id: "recipe123",
      name: "Spaghetti Carbonara",
      image: "https://example.com/carbonara.jpg",
      savedAt: Timestamp(2024-03-01 12:00:00),
      source: "spoonacular"
    }
  }
}
```

---

## 2. Recipes Collection

**Collection Path:** `/recipes/{recipeId}`

### Document Structure
```javascript
{
  // Basic Info
  id: string,                     // Auto-generated ID
  userId: string,                 // Creator's user ID
  title: string,                  // Recipe title
  name: string,                   // Recipe name (alias)
  description: string,            // Recipe description
  
  // Recipe Details
  category: string,               // "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "Desserts"
  difficulty: string,             // "Easy" | "Medium" | "Hard"
  prepTime: number,               // Preparation time (minutes)
  cookTime: number,               // Cooking time (minutes)
  totalTime: number,              // Total time (minutes)
  servings: number,               // Number of servings
  
  // Content
  ingredients: [                  // Array of ingredients
    {
      name: string,               // Ingredient name
      amount: number,             // Quantity
      unit: string,               // "cup" | "tbsp" | "g" | etc.
      original: string            // Original string format
    }
  ],
  
  instructions: [                 // Array of steps
    string                        // Step description
  ],
  
  // Media
  image: string,                  // Recipe image URL
  videoUrl: string,               // YouTube video URL (optional)
  
  // Nutrition (per serving)
  nutrition: {
    calories: number,             // Calories (kcal)
    protein: number,              // Protein (g)
    carbs: number,                // Carbohydrates (g)
    fat: number,                  // Fat (g)
    fiber: number,                // Fiber (g)
    sugar: number                 // Sugar (g)
  },
  
  // Metadata
  source: string,                 // "user" | "spoonacular" | "api"
  sourceUrl: string,              // Original source URL
  tags: [string],                 // Recipe tags
  cuisine: string,                // Cuisine type
  
  // Engagement
  views: number,                  // Total views
  saves: number,                  // Total saves
  avgRating: number,              // Average rating (0-5)
  totalFeedback: number,          // Total feedback count
  isFavorite: boolean,            // User's favorite
  
  // Status
  isPublic: boolean,              // Public visibility
  isFlagged: boolean,             // Flagged for review
  isApproved: boolean,            // Admin approved
  
  // Timestamps
  createdAt: timestamp,           // Creation date
  updatedAt: timestamp            // Last update date
}
```

### Subcollection: Feedback
**Path:** `/recipes/{recipeId}/feedback/{feedbackId}`

```javascript
{
  id: string,                     // Auto-generated ID
  userId: string,                 // Reviewer's user ID
  userName: string,               // Reviewer's name
  rating: number,                 // Rating (1-5)
  comment: string,                // Feedback comment
  helpful: number,                // Helpful count
  notHelpful: number,             // Not helpful count
  createdAt: timestamp            // Feedback date
}
```

### Example Document
```javascript
{
  id: "recipe123",
  userId: "abc123xyz",
  title: "Classic Spaghetti Carbonara",
  name: "Spaghetti Carbonara",
  description: "Authentic Italian pasta dish with eggs, cheese, and pancetta",
  category: "Dinner",
  difficulty: "Medium",
  prepTime: 10,
  cookTime: 20,
  totalTime: 30,
  servings: 4,
  ingredients: [
    {
      name: "Spaghetti",
      amount: 400,
      unit: "g",
      original: "400g spaghetti"
    },
    {
      name: "Eggs",
      amount: 4,
      unit: "whole",
      original: "4 large eggs"
    }
  ],
  instructions: [
    "Boil water and cook spaghetti according to package directions",
    "Fry pancetta until crispy",
    "Mix eggs and cheese in a bowl",
    "Combine hot pasta with egg mixture",
    "Serve immediately with black pepper"
  ],
  image: "https://example.com/carbonara.jpg",
  videoUrl: "https://youtube.com/watch?v=xyz",
  nutrition: {
    calories: 450,
    protein: 18,
    carbs: 55,
    fat: 16,
    fiber: 3,
    sugar: 2
  },
  source: "user",
  sourceUrl: "",
  tags: ["pasta", "italian", "quick"],
  cuisine: "Italian",
  views: 150,
  saves: 45,
  avgRating: 4.5,
  totalFeedback: 12,
  isFavorite: false,
  isPublic: true,
  isFlagged: false,
  isApproved: true,
  createdAt: Timestamp(2024-03-01 10:00:00),
  updatedAt: Timestamp(2024-03-05 15:30:00)
}
```

---

## 3. Feedback Collection

**Collection Path:** `/feedback/{feedbackId}`

### Document Structure
```javascript
{
  // Basic Info
  id: string,                     // Auto-generated ID
  recipeId: string,               // Associated recipe ID
  recipeName: string,             // Recipe name
  userId: string,                 // Reviewer's user ID
  userName: string,               // Reviewer's name
  
  // Feedback Content
  rating: number,                 // Rating (1-5)
  comment: string,                // Feedback comment
  
  // Engagement
  helpful: number,                // Helpful votes
  notHelpful: number,             // Not helpful votes
  
  // Timestamps
  createdAt: timestamp            // Feedback date
}
```

### Example Document
```javascript
{
  id: "feedback123",
  recipeId: "recipe123",
  recipeName: "Spaghetti Carbonara",
  userId: "user456",
  userName: "Jane Smith",
  rating: 5,
  comment: "Amazing recipe! Easy to follow and delicious results.",
  helpful: 8,
  notHelpful: 1,
  createdAt: Timestamp(2024-03-05 18:30:00)
}
```

---

## 4. QR Codes Collection

**Collection Path:** `/qrCodes/{qrId}`

### Document Structure
```javascript
{
  // Basic Info
  id: string,                     // Auto-generated ID
  cookId: string,                 // Creator's user ID
  cookName: string,               // Creator's name
  
  // Recipe Info
  recipeId: string,               // Associated recipe ID
  recipeName: string,             // Recipe name
  recipeImage: string,            // Recipe image URL
  
  // QR Code Data
  qrCodeUrl: string,              // QR code image URL
  qrCodeData: string,             // Encoded data
  shortUrl: string,               // Short URL for sharing
  
  // Dish Details
  dishName: string,               // Dish name
  description: string,            // Dish description
  ingredients: [string],          // Ingredient list
  
  // Nutrition Info
  nutrition: {
    calories: number,             // Calories (kcal)
    protein: number,              // Protein (g)
    carbs: number,                // Carbohydrates (g)
    fat: number                   // Fat (g)
  },
  
  // Engagement
  scans: number,                  // Total scans
  feedbackCount: number,          // Total feedback
  avgRating: number,              // Average rating (0-5)
  
  // Status
  isActive: boolean,              // QR code active
  
  // Timestamps
  createdAt: timestamp,           // Creation date
  expiresAt: timestamp            // Expiration date (optional)
}
```

### Subcollection: Feedback
**Path:** `/qrCodes/{qrId}/feedback/{feedbackId}`

```javascript
{
  id: string,                     // Auto-generated ID
  userId: string,                 // Reviewer's user ID (optional)
  userName: string,               // Reviewer's name
  rating: number,                 // Rating (1-5)
  comment: string,                // Feedback comment
  createdAt: timestamp            // Feedback date
}
```

### Example Document
```javascript
{
  id: "qr123",
  cookId: "abc123xyz",
  cookName: "John Doe",
  recipeId: "recipe123",
  recipeName: "Spaghetti Carbonara",
  recipeImage: "https://example.com/carbonara.jpg",
  qrCodeUrl: "https://storage.googleapis.com/qr123.png",
  qrCodeData: "https://chefio.app/dish/qr123",
  shortUrl: "https://chefio.app/d/qr123",
  dishName: "Carbonara Special",
  description: "My signature carbonara recipe",
  ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan"],
  nutrition: {
    calories: 450,
    protein: 18,
    carbs: 55,
    fat: 16
  },
  scans: 45,
  feedbackCount: 8,
  avgRating: 4.7,
  isActive: true,
  createdAt: Timestamp(2024-03-01 12:00:00),
  expiresAt: null
}
```

---

## 5. Ingredients Collection

**Collection Path:** `/ingredients/{ingredientId}`

### Document Structure
```javascript
{
  // Basic Info
  id: string,                     // Auto-generated ID
  userId: string,                 // User who added it
  name: string,                   // Ingredient name
  category: string,               // "Protein" | "Vegetable" | "Grain" | "Dairy" | "Fruit"
  
  // Details
  description: string,            // Ingredient description
  image: string,                  // Ingredient image URL
  
  // Nutrition (per 100g)
  nutrition: {
    calories: number,             // Calories (kcal)
    protein: number,              // Protein (g)
    carbs: number,                // Carbohydrates (g)
    fat: number,                  // Fat (g)
    fiber: number,                // Fiber (g)
    sugar: number                 // Sugar (g)
  },
  
  // Metadata
  commonNames: [string],          // Alternative names
  season: string,                 // Best season
  storageInfo: string,            // Storage instructions
  
  // Timestamps
  createdAt: timestamp,           // Creation date
  updatedAt: timestamp            // Last update date
}
```

### Example Document
```javascript
{
  id: "ing123",
  userId: "abc123xyz",
  name: "Tomato",
  category: "Vegetable",
  description: "Red, juicy fruit commonly used in cooking",
  image: "https://example.com/tomato.jpg",
  nutrition: {
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    sugar: 2.6
  },
  commonNames: ["Tomatoes", "Cherry Tomato", "Roma Tomato"],
  season: "Summer",
  storageInfo: "Store at room temperature, refrigerate when ripe",
  createdAt: Timestamp(2024-02-15 09:00:00),
  updatedAt: Timestamp(2024-02-15 09:00:00)
}
```

---

## 6. Scans Collection

**Collection Path:** `/scans/{scanId}`

### Document Structure
```javascript
{
  // Basic Info
  id: string,                     // Auto-generated ID
  userId: string,                 // User who scanned
  
  // Scan Details
  ingredientName: string,         // Identified ingredient
  confidence: number,             // AI confidence (0-100)
  category: string,               // Ingredient category
  
  // Image Data
  imageUrl: string,               // Scanned image URL
  imageData: string,              // Base64 image data (optional)
  
  // AI Results
  alternatives: [                 // Alternative identifications
    {
      name: string,               // Alternative name
      confidence: number          // Confidence level
    }
  ],
  
  // Metadata
  source: string,                 // "tensorflow" | "google-vision"
  deviceInfo: string,             // Device information
  
  // Timestamps
  createdAt: timestamp            // Scan date
}
```

### Example Document
```javascript
{
  id: "scan123",
  userId: "abc123xyz",
  ingredientName: "Tomato",
  confidence: 95,
  category: "Vegetable",
  imageUrl: "https://storage.googleapis.com/scan123.jpg",
  imageData: null,
  alternatives: [
    { name: "Cherry Tomato", confidence: 88 },
    { name: "Red Pepper", confidence: 75 }
  ],
  source: "tensorflow",
  deviceInfo: "iPhone 13, iOS 16.5",
  createdAt: Timestamp(2024-03-10 14:30:00)
}
```

---

## 7. Tickets Collection

**Collection Path:** `/tickets/{ticketId}`

### Document Structure
```javascript
{
  // Basic Info
  id: string,                     // Auto-generated ID
  ticketNumber: string,           // Human-readable ticket number
  userId: string,                 // User who created ticket
  userName: string,               // User's name
  userEmail: string,              // User's email
  
  // Ticket Details
  subject: string,                // Ticket subject
  description: string,            // Detailed description
  category: string,               // "Bug" | "Feature" | "Support" | "Other"
  priority: string,               // "Low" | "Medium" | "High" | "Urgent"
  status: string,                 // "open" | "in_progress" | "resolved" | "closed"
  
  // Assignment
  assignedTo: string,             // Admin user ID (optional)
  assignedToName: string,         // Admin name (optional)
  
  // Attachments
  attachments: [                  // File attachments
    {
      name: string,               // File name
      url: string,                // File URL
      type: string,               // MIME type
      size: number                // File size (bytes)
    }
  ],
  
  // Metadata
  tags: [string],                 // Ticket tags
  relatedTickets: [string],       // Related ticket IDs
  
  // Timestamps
  createdAt: timestamp,           // Creation date
  updatedAt: timestamp,           // Last update date
  resolvedAt: timestamp,          // Resolution date (optional)
  closedAt: timestamp             // Closed date (optional)
}
```

### Subcollection: Responses
**Path:** `/tickets/{ticketId}/responses/{responseId}`

```javascript
{
  id: string,                     // Auto-generated ID
  ticketId: string,               // Parent ticket ID
  userId: string,                 // Responder's user ID
  userName: string,               // Responder's name
  userRole: string,               // "user" | "admin"
  message: string,                // Response message
  isInternal: boolean,            // Internal note (admin only)
  attachments: [                  // File attachments
    {
      name: string,
      url: string,
      type: string,
      size: number
    }
  ],
  createdAt: timestamp            // Response date
}
```

### Example Document
```javascript
{
  id: "ticket123",
  ticketNumber: "TICK-2024-001",
  userId: "abc123xyz",
  userName: "John Doe",
  userEmail: "john@example.com",
  subject: "Unable to save recipe",
  description: "When I try to save a recipe, I get an error message",
  category: "Bug",
  priority: "High",
  status: "in_progress",
  assignedTo: "admin456",
  assignedToName: "Admin User",
  attachments: [
    {
      name: "screenshot.png",
      url: "https://storage.googleapis.com/screenshot.png",
      type: "image/png",
      size: 245678
    }
  ],
  tags: ["recipe", "save", "error"],
  relatedTickets: [],
  createdAt: Timestamp(2024-03-08 10:00:00),
  updatedAt: Timestamp(2024-03-09 14:30:00),
  resolvedAt: null,
  closedAt: null
}
```

---

## 8. Admin Logs Collection

**Collection Path:** `/admin_logs/{logId}`

### Document Structure
```javascript
{
  // Basic Info
  id: string,                     // Auto-generated ID
  adminId: string,                // Admin user ID
  adminName: string,              // Admin name
  adminEmail: string,             // Admin email
  
  // Action Details
  action: string,                 // Action type
  targetType: string,             // "user" | "recipe" | "ticket" | "feedback"
  targetId: string,               // Target document ID
  
  // Action Data
  details: object,                // Action-specific details
  changes: {                      // Before/after changes
    before: object,
    after: object
  },
  
  // Metadata
  ipAddress: string,              // Admin IP address
  userAgent: string,              // Browser user agent
  
  // Timestamps
  createdAt: timestamp            // Action date
}
```

### Example Document
```javascript
{
  id: "log123",
  adminId: "admin456",
  adminName: "Admin User",
  adminEmail: "admin@chefio.com",
  action: "user_suspended",
  targetType: "user",
  targetId: "abc123xyz",
  details: {
    reason: "Violation of terms of service",
    duration: "30 days"
  },
  changes: {
    before: { status: { isSuspended: false } },
    after: { status: { isSuspended: true } }
  },
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  createdAt: Timestamp(2024-03-10 16:00:00)
}
```

---

## Collection Relationships

```
users (1) ──────────── (many) recipes
  │                        │
  │                        └── (many) feedback (subcollection)
  │
  ├─────────────── (many) qrCodes
  │                        │
  │                        └── (many) feedback (subcollection)
  │
  ├─────────────── (many) ingredients
  │
  ├─────────────── (many) scans
  │
  └─────────────── (many) tickets
                           │
                           └── (many) responses (subcollection)

feedback (main collection) ──> references recipes

admin_logs ──> references users, recipes, tickets, etc.
```

---

## Security Rules Summary

### Users Collection
- Users can read/write their own documents
- Admins can read/write all user documents

### Recipes Collection
- Anyone can read public recipes
- Users can create/update/delete their own recipes
- Admins can moderate all recipes

### Feedback Collection
- Anyone can read feedback
- Authenticated users can create feedback
- Admins can delete feedback

### QR Codes Collection
- Anyone can read QR codes
- Users can create/manage their own QR codes
- Admins can manage all QR codes

### Tickets Collection
- Users can read/write their own tickets
- Admins can read/write all tickets

### Admin Logs Collection
- Only admins can read/write logs

---

## Indexing Recommendations

### Composite Indexes

1. **Recipes by User and Date**
   ```
   Collection: recipes
   Fields: userId (Ascending), createdAt (Descending)
   ```

2. **Feedback by Recipe and Date**
   ```
   Collection: feedback
   Fields: recipeId (Ascending), createdAt (Descending)
   ```

3. **Tickets by Status and Priority**
   ```
   Collection: tickets
   Fields: status (Ascending), priority (Descending)
   ```

4. **QR Codes by User and Active Status**
   ```
   Collection: qrCodes
   Fields: cookId (Ascending), isActive (Ascending)
   ```

---

## Data Migration Notes

### Version 1.0 → 1.1
- Added `savedRecipes` map to users collection
- Added `nutrition` object to recipes
- Added `feedbackCount` to qrCodes

### Future Considerations
- Add `tags` array to recipes for better search
- Add `favorites` subcollection to users
- Add `notifications` collection for push notifications
- Add `analytics` collection for usage tracking

---

## Backup Strategy

1. **Daily Backups**: Automated daily backups of all collections
2. **Retention**: Keep backups for 30 days
3. **Critical Collections**: Users, Recipes, Tickets (hourly backups)
4. **Export Format**: JSON and Firestore native format

---

## Performance Optimization

1. **Denormalization**: Store frequently accessed data (e.g., userName, recipeName) in multiple places
2. **Pagination**: Use cursor-based pagination for large collections
3. **Caching**: Cache frequently accessed documents client-side
4. **Batch Operations**: Use batch writes for multiple updates
5. **Subcollections**: Use for one-to-many relationships (feedback, responses)

---

## Document Size Limits

- Maximum document size: 1 MB
- Maximum subcollection depth: 100 levels
- Maximum field name length: 1,500 bytes
- Maximum array elements: 20,000

---

## Best Practices

1. **Use Timestamps**: Always use server timestamps for consistency
2. **Validate Data**: Validate all data before writing to Firestore
3. **Handle Errors**: Implement proper error handling for all operations
4. **Security Rules**: Keep security rules up to date
5. **Monitor Usage**: Track read/write operations to optimize costs
6. **Clean Up**: Regularly clean up old/unused documents
7. **Test Rules**: Test security rules thoroughly before deployment

---

*Last Updated: March 10, 2024*
*Version: 1.0*
