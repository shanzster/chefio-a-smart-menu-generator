# 🗄️ Chefio Database Schema - Entity Relationship Diagram

**Database:** Firebase Firestore (NoSQL)  
**Last Updated:** February 27, 2026

---

## 📊 Visual Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CHEFIO DATABASE SCHEMA                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                                  USERS                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  uid: string                                                               │
│     email: string                                                             │
│     name: string                                                              │
│     firstName: string                                                         │
│     middleName: string                                                        │
│     lastName: string                                                          │
│     birthdate: string                                                         │
│     role: string ("cook" | "admin")                                           │
│     isAdmin: boolean                                                          │
│     status: string ("active" | "suspended")                                   │
│     createdAt: timestamp                                                      │
│     updatedAt: timestamp                                                      │
│     lastLoginAt: timestamp                                                    │
│                                                                               │
│     profile: {                                                                │
│       bio: string                                                             │
│       avatar: string (URL)                                                    │
│       phone: string                                                           │
│       location: string                                                        │
│     }                                                                         │
│                                                                               │
│     address: {                                                                │
│       street: string                                                          │
│       city: string                                                            │
│       country: string                                                         │
│     }                                                                         │
│                                                                               │
│     stats: {                                                                  │
│       totalRecipes: number                                                    │
│       sharedRecipes: number                                                   │
│       weeklyRecipes: number                                                   │
│       totalViews: number                                                      │
│       totalSaves: number                                                      │
│       totalFeedback: number                                                   │
│       avgRating: number                                                       │
│     }                                                                         │
│                                                                               │
│     preferences: {                                                            │
│       emailNotifications: boolean                                             │
│       pushNotifications: boolean                                              │
│       theme: string ("light" | "dark")                                        │
│       language: string                                                        │
│     }                                                                         │
│                                                                               │
│     savedRecipes: {                                                           │
│       [recipeId]: {                                                           │
│         ...recipeData                                                         │
│         savedAt: timestamp                                                    │
│         isFavorite: boolean                                                   │
│       }                                                                       │
│     }                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N (creates)
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                 RECIPES                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id: string (auto-generated)                                              │
│ FK  userId: string → users.uid                                                │
│     title: string                                                             │
│     description: string                                                       │
│     category: string                                                          │
│     cuisine: string                                                           │
│     difficulty: string ("easy" | "medium" | "hard")                           │
│     prepTime: number (minutes)                                                │
│     cookTime: number (minutes)                                                │
│     totalTime: number (minutes)                                               │
│     servings: number                                                          │
│     image: string (URL)                                                       │
│     qrCode: string (URL)                                                      │
│     isFavorite: boolean                                                       │
│     flagged: boolean                                                          │
│     flaggedAt: timestamp                                                      │
│     flagReason: string                                                        │
│     moderatedBy: string (admin userId)                                        │
│     moderatedAt: timestamp                                                    │
│     views: number                                                             │
│     saves: number                                                             │
│     shares: number                                                            │
│     createdAt: timestamp                                                      │
│     updatedAt: timestamp                                                      │
│                                                                               │
│     ingredients: [                                                            │
│       {                                                                       │
│         name: string                                                          │
│         amount: string                                                        │
│         unit: string                                                          │
│       }                                                                       │
│     ]                                                                         │
│                                                                               │
│     instructions: [                                                           │
│       {                                                                       │
│         step: number                                                          │
│         description: string                                                   │
│       }                                                                       │
│     ]                                                                         │
│                                                                               │
│     nutrition: {                                                              │
│       calories: number                                                        │
│       protein: number                                                         │
│       carbs: number                                                           │
│       fat: number                                                             │
│       fiber: number                                                           │
│       sugar: number                                                           │
│       sodium: number                                                          │
│     }                                                                         │
│                                                                               │
│     tags: string[]                                                            │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N (has)
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        RECIPES/{recipeId}/FEEDBACK                            │
│                           (Subcollection)                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id: string (auto-generated)                                              │
│     recipeId: string (parent document)                                        │
│     guestName: string                                                         │
│     guestEmail: string                                                        │
│     rating: number (1-5)                                                      │
│     comment: string                                                           │
│     taste: number (1-5)                                                       │
│     presentation: number (1-5)                                                │
│     easeOfCooking: number (1-5)                                               │
│     wouldRecommend: boolean                                                   │
│     createdAt: timestamp                                                      │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                                 TICKETS                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id: string (auto-generated)                                              │
│ FK  userId: string → users.uid                                                │
│     ticketId: string (e.g., "TKT-ABC123")                                     │
│     userName: string                                                          │
│     userEmail: string                                                         │
│     subject: string                                                           │
│     category: string                                                          │
│     priority: string ("low" | "medium" | "high")                              │
│     status: string ("open" | "in-progress" | "resolved" | "closed")           │
│     description: string                                                       │
│     assignedTo: string (admin userId)                                         │
│     responseCount: number                                                     │
│     createdAt: timestamp                                                      │
│     updatedAt: timestamp                                                      │
│                                                                               │
│     responses: [                                                              │
│       {                                                                       │
│         adminId: string                                                       │
│         adminName: string                                                     │
│         message: string                                                       │
│         timestamp: timestamp                                                  │
│       }                                                                       │
│     ]                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N (has)
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                      TICKETS/{ticketId}/RESPONSES                             │
│                           (Subcollection)                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id: string (auto-generated)                                              │
│     ticketId: string (parent document)                                        │
│     adminId: string → users.uid                                               │
│     adminName: string                                                         │
│     message: string                                                           │
│     createdAt: timestamp                                                      │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                              ADMIN_LOGS                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id: string (auto-generated)                                              │
│ FK  adminId: string → users.uid                                               │
│     adminName: string                                                         │
│     action: string                                                            │
│     targetType: string ("user" | "recipe" | "ticket")                         │
│     targetId: string                                                          │
│     timestamp: timestamp                                                      │
│                                                                               │
│     details: {                                                                │
│       [key]: any (action-specific data)                                       │
│     }                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                               FEEDBACK                                        │
│                          (Global Collection)                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id: string (auto-generated)                                              │
│ FK  userId: string → users.uid (optional)                                     │
│ FK  recipeId: string → recipes.id                                             │
│     recipeName: string                                                        │
│     userName: string                                                          │
│     guestName: string                                                         │
│     guestEmail: string                                                        │
│     rating: number (1-5)                                                      │
│     comment: string                                                           │
│     taste: number (1-5)                                                       │
│     presentation: number (1-5)                                                │
│     easeOfCooking: number (1-5)                                               │
│     wouldRecommend: boolean                                                   │
│     helpful: number                                                           │
│     notHelpful: number                                                        │
│     createdAt: timestamp                                                      │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                                QR_CODES                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id: string (auto-generated)                                              │
│ FK  cookId: string → users.uid                                                │
│ FK  recipeId: string → recipes.id                                             │
│     cookName: string                                                          │
│     recipeName: string                                                        │
│     recipeImage: string (URL)                                                 │
│     qrCodeUrl: string (URL)                                                   │
│     qrCodeData: string                                                        │
│     shortUrl: string                                                          │
│     dishName: string                                                          │
│     description: string                                                       │
│     ingredients: string[]                                                     │
│     scans: number                                                             │
│     feedbackCount: number                                                     │
│     avgRating: number                                                         │
│     isActive: boolean                                                         │
│     createdAt: timestamp                                                      │
│     expiresAt: timestamp (optional)                                           │
│                                                                               │
│     nutrition: {                                                              │
│       calories: number                                                        │
│       protein: number                                                         │
│       carbs: number                                                           │
│       fat: number                                                             │
│     }                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N (has)
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                       QR_CODES/{qrId}/FEEDBACK                                │
│                           (Subcollection)                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id: string (auto-generated)                                              │
│     qrCodeId: string (parent document)                                        │
│     userId: string (optional)                                                 │
│     userName: string                                                          │
│     rating: number (1-5)                                                      │
│     comment: string                                                           │
│     createdAt: timestamp                                                      │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                              INGREDIENTS                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id: string (auto-generated)                                              │
│ FK  userId: string → users.uid                                                │
│     name: string                                                              │
│     category: string ("Protein" | "Vegetable" | "Grain" | "Dairy" | "Fruit") │
│     description: string                                                       │
│     image: string (URL)                                                       │
│     commonNames: string[]                                                     │
│     season: string                                                            │
│     storageInfo: string                                                       │
│     createdAt: timestamp                                                      │
│     updatedAt: timestamp                                                      │
│                                                                               │
│     nutrition: {                                                              │
│       calories: number (per 100g)                                             │
│       protein: number                                                         │
│       carbs: number                                                           │
│       fat: number                                                             │
│       fiber: number                                                           │
│       sugar: number                                                           │
│     }                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                                 SCANS                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id: string (auto-generated)                                              │
│ FK  userId: string → users.uid                                                │
│     ingredientName: string                                                    │
│     confidence: number (0-100)                                                │
│     category: string                                                          │
│     imageUrl: string (URL)                                                    │
│     imageData: string (base64, optional)                                      │
│     source: string ("tensorflow" | "google-vision")                           │
│     deviceInfo: string                                                        │
│     createdAt: timestamp                                                      │
│                                                                               │
│     alternatives: [                                                           │
│       {                                                                       │
│         name: string                                                          │
│         confidence: number                                                    │
│       }                                                                       │
│     ]                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Relationship Summary

### One-to-Many Relationships

```
USERS (1) ──────────────────> (N) RECIPES
  │                                  │
  │                                  └──> (N) FEEDBACK (subcollection)
  │
  ├──────────────────> (N) TICKETS
  │                          │
  │                          └──> (N) RESPONSES (subcollection)
  │
  ├──────────────────> (N) QR_CODES
  │                          │
  │                          └──> (N) FEEDBACK (subcollection)
  │
  ├──────────────────> (N) INGREDIENTS
  │
  ├──────────────────> (N) SCANS
  │
  └──────────────────> (N) ADMIN_LOGS
```

### Embedded Relationships

```
USERS
  └──> savedRecipes (map)
         └──> [recipeId]: recipe data

RECIPES
  └──> ingredients (array)
  └──> instructions (array)
  └──> nutrition (object)
  └──> tags (array)

TICKETS
  └──> responses (array)

QR_CODES
  └──> ingredients (array)
  └──> nutrition (object)

SCANS
  └──> alternatives (array)
```

---

## 📋 Collection Details

### 1. USERS Collection
**Path:** `/users/{userId}`

**Purpose:** Store user accounts and profiles

**Indexes:**
- `email` (unique)
- `role`
- `status`
- `createdAt`

**Relationships:**
- Has many `recipes`
- Has many `tickets`
- Creates many `admin_logs` (if admin)
- Has embedded `savedRecipes` map

**Access Control:**
- Users can read/write their own document
- Admins can read all documents
- Admins can update `role`, `isAdmin`, `status`

---

### 2. RECIPES Collection
**Path:** `/recipes/{recipeId}`

**Purpose:** Store user-created recipes

**Indexes:**
- `userId` + `createdAt` (composite)
- `userId` + `isFavorite` + `updatedAt` (composite)
- `flagged`
- `category`

**Relationships:**
- Belongs to one `user`
- Has many `feedback` (subcollection)
- Referenced in `users.savedRecipes`

**Subcollections:**
- `feedback` - Recipe feedback from guests

**Access Control:**
- Owner can read/write/delete
- Public can read (via QR code)
- Admins can read/update/delete all

---

### 3. RECIPES/{recipeId}/FEEDBACK Subcollection
**Path:** `/recipes/{recipeId}/feedback/{feedbackId}`

**Purpose:** Store guest feedback for specific recipes

**Indexes:**
- `createdAt`
- `rating`

**Relationships:**
- Belongs to one `recipe`

**Access Control:**
- Anyone can create (via QR code)
- Owner can read
- Admins can read/delete

---

### 4. TICKETS Collection
**Path:** `/tickets/{ticketId}`

**Purpose:** Store support tickets from users

**Indexes:**
- `userId` + `createdAt` (composite)
- `status`
- `priority`
- `assignedTo`

**Relationships:**
- Belongs to one `user`
- Has many `responses` (subcollection or embedded array)
- Referenced by `admin_logs`

**Subcollections:**
- `responses` - Admin responses to tickets

**Access Control:**
- Owner can read/create
- Admins can read/update all

---

### 5. TICKETS/{ticketId}/RESPONSES Subcollection
**Path:** `/tickets/{ticketId}/responses/{responseId}`

**Purpose:** Store admin responses to support tickets

**Indexes:**
- `createdAt`

**Relationships:**
- Belongs to one `ticket`
- Created by one `admin`

**Access Control:**
- Admins can create
- Owner can read
- Admins can read all

---

### 6. ADMIN_LOGS Collection
**Path:** `/admin_logs/{logId}`

**Purpose:** Audit trail of all admin actions

**Indexes:**
- `adminId` + `timestamp` (composite)
- `action`
- `targetType` + `targetId` (composite)
- `timestamp`

**Relationships:**
- Created by one `admin` (user)
- References `targetType` and `targetId`

**Access Control:**
- Admins can create
- Admins can read all
- Users cannot access

---

### 7. FEEDBACK Collection (Global)
**Path:** `/feedback/{feedbackId}`

**Purpose:** Alternative global feedback storage

**Indexes:**
- `recipeId` + `createdAt` (composite)
- `userId`
- `rating`

**Relationships:**
- Belongs to one `recipe`
- Optionally belongs to one `user`

**Access Control:**
- Anyone can create
- Owner can read their feedback
- Recipe owner can read feedback for their recipes
- Admins can read/delete all

---

### 8. QR_CODES Collection
**Path:** `/qrCodes/{qrId}`

**Purpose:** Store QR codes for recipe sharing

**Indexes:**
- `cookId` + `createdAt` (composite)
- `cookId` + `isActive` (composite)
- `recipeId`

**Relationships:**
- Belongs to one `user` (cook)
- References one `recipe`
- Has many `feedback` (subcollection)

**Subcollections:**
- `feedback` - Guest feedback via QR code

**Access Control:**
- Anyone can read (for QR scanning)
- Owner can create/update/delete
- Admins can read/update/delete all

---

### 9. QR_CODES/{qrId}/FEEDBACK Subcollection
**Path:** `/qrCodes/{qrId}/feedback/{feedbackId}`

**Purpose:** Store guest feedback submitted via QR code

**Indexes:**
- `createdAt`
- `rating`

**Relationships:**
- Belongs to one `qrCode`

**Access Control:**
- Anyone can create (via QR code)
- QR code owner can read
- Admins can read/delete

---

### 10. INGREDIENTS Collection
**Path:** `/ingredients/{ingredientId}`

**Purpose:** Store ingredient information and nutrition data

**Indexes:**
- `userId` + `createdAt` (composite)
- `category`
- `name`

**Relationships:**
- Created by one `user`
- Referenced in `recipes.ingredients`

**Access Control:**
- Anyone can read
- Authenticated users can create
- Owner can update/delete
- Admins can update/delete all

---

### 11. SCANS Collection
**Path:** `/scans/{scanId}`

**Purpose:** Store ingredient scanner history and AI results

**Indexes:**
- `userId` + `createdAt` (composite)
- `ingredientName`

**Relationships:**
- Belongs to one `user`
- May reference `ingredients`

**Access Control:**
- Owner can read/create
- Admins can read all

---

## 🔑 Key Fields Explanation

### Primary Keys (PK)
- `uid` - User ID (from Firebase Auth)
- `id` - Auto-generated document ID

### Foreign Keys (FK)
- `userId` - References `users.uid`
- `recipeId` - References `recipes.id`
- `adminId` - References `users.uid` (where role = "admin")
- `assignedTo` - References `users.uid` (admin)

### Timestamps
- `createdAt` - Document creation time
- `updatedAt` - Last update time
- `lastLoginAt` - User's last login
- `timestamp` - Generic timestamp field

### Status Fields
- `status` - User: "active" | "suspended"
- `status` - Ticket: "open" | "in-progress" | "resolved" | "closed"
- `priority` - Ticket: "low" | "medium" | "high"
- `role` - User: "cook" | "admin"

---

## 📊 Data Flow Diagrams

### User Registration Flow
```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Register
     ▼
┌─────────────────┐
│ Firebase Auth   │
│ Creates User    │
└────┬────────────┘
     │ 2. Get UID
     ▼
┌─────────────────┐
│ Firestore       │
│ Create User Doc │
│ /users/{uid}    │
└─────────────────┘
```

### Recipe Creation Flow
```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Create Recipe
     ▼
┌─────────────────┐
│ Firestore       │
│ Create Recipe   │
│ /recipes/{id}   │
└────┬────────────┘
     │ 2. Update Stats
     ▼
┌─────────────────┐
│ Firestore       │
│ Update User     │
│ stats.total++   │
└─────────────────┘
```

### Feedback Submission Flow
```
┌─────────┐
│  Guest  │
└────┬────┘
     │ 1. Scan QR Code
     ▼
┌─────────────────┐
│ View Recipe     │
└────┬────────────┘
     │ 2. Submit Feedback
     ▼
┌─────────────────────────────┐
│ Firestore                   │
│ Create Feedback             │
│ /recipes/{id}/feedback/{id} │
└────┬────────────────────────┘
     │ 3. Update Recipe Stats
     ▼
┌─────────────────┐
│ Firestore       │
│ Update Recipe   │
│ stats.feedback++│
└─────────────────┘
```

### Support Ticket Flow
```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Create Ticket
     ▼
┌─────────────────┐
│ Firestore       │
│ Create Ticket   │
│ /tickets/{id}   │
└────┬────────────┘
     │ 2. Notify Admin
     ▼
┌─────────┐
│  Admin  │
└────┬────┘
     │ 3. Respond
     ▼
┌──────────────────────────┐
│ Firestore                │
│ Add Response             │
│ /tickets/{id}/responses  │
└────┬─────────────────────┘
     │ 4. Log Action
     ▼
┌─────────────────┐
│ Firestore       │
│ Create Log      │
│ /admin_logs/{id}│
└─────────────────┘
```

### Admin Moderation Flow
```
┌─────────┐
│  Admin  │
└────┬────┘
     │ 1. View Flagged Content
     ▼
┌─────────────────┐
│ Firestore Query │
│ flagged = true  │
└────┬────────────┘
     │ 2. Moderate (approve/delete)
     ▼
┌─────────────────┐
│ Firestore       │
│ Update/Delete   │
│ Recipe          │
└────┬────────────┘
     │ 3. Log Action
     ▼
┌─────────────────┐
│ Firestore       │
│ Create Log      │
│ /admin_logs/{id}│
└─────────────────┘
```

---

## 🔍 Query Patterns

### Get User's Recipes
```javascript
query(
  collection(db, "recipes"),
  where("userId", "==", userId),
  orderBy("createdAt", "desc")
)
```

### Get User's Favorite Recipes
```javascript
query(
  collection(db, "recipes"),
  where("userId", "==", userId),
  where("isFavorite", "==", true),
  orderBy("updatedAt", "desc")
)
```

### Get User's Tickets
```javascript
query(
  collection(db, "tickets"),
  where("userId", "==", userId),
  orderBy("createdAt", "desc")
)
```

### Get Open Tickets (Admin)
```javascript
query(
  collection(db, "tickets"),
  where("status", "==", "open"),
  orderBy("createdAt", "desc")
)
```

### Get Flagged Recipes (Admin)
```javascript
query(
  collection(db, "recipes"),
  where("flagged", "==", true),
  orderBy("flaggedAt", "desc")
)
```

### Get Recipe Feedback
```javascript
query(
  collection(db, "recipes", recipeId, "feedback"),
  orderBy("createdAt", "desc")
)
```

### Get Admin Logs
```javascript
query(
  collection(db, "admin_logs"),
  orderBy("timestamp", "desc"),
  limit(100)
)
```

### Get User's QR Codes
```javascript
query(
  collection(db, "qrCodes"),
  where("cookId", "==", userId),
  orderBy("createdAt", "desc")
)
```

### Get Active QR Codes
```javascript
query(
  collection(db, "qrCodes"),
  where("cookId", "==", userId),
  where("isActive", "==", true),
  orderBy("createdAt", "desc")
)
```

### Get QR Code Feedback
```javascript
query(
  collection(db, "qrCodes", qrId, "feedback"),
  orderBy("createdAt", "desc")
)
```

### Get User's Scans
```javascript
query(
  collection(db, "scans"),
  where("userId", "==", userId),
  orderBy("createdAt", "desc"),
  limit(50)
)
```

### Get Ingredients by Category
```javascript
query(
  collection(db, "ingredients"),
  where("category", "==", category),
  orderBy("name", "asc")
)
```

### Get All Feedback (Admin)
```javascript
// Main feedback collection
query(
  collection(db, "feedback"),
  orderBy("createdAt", "desc")
)

// Recipe feedback subcollections
// Requires fetching all recipes first, then their feedback
```

---

## 📈 Scalability Considerations

### Current Design Strengths
✅ Denormalized data for fast reads  
✅ Subcollections for related data  
✅ Composite indexes for complex queries  
✅ Embedded data for frequently accessed fields  

### Potential Bottlenecks
⚠️ Large `savedRecipes` map in user documents  
⚠️ No pagination on some queries  
⚠️ Embedded responses array in tickets  

### Optimization Recommendations
1. **Pagination:** Add pagination to all list queries
2. **Saved Recipes:** Consider separate collection if map grows large
3. **Ticket Responses:** Use subcollection instead of embedded array
4. **Caching:** Implement client-side caching for frequently accessed data
5. **Batch Operations:** Use batch writes for related updates

---

## 🔒 Security Rules Summary

### Users Collection
```javascript
match /users/{userId} {
  // Users can read/write their own document
  allow read, write: if request.auth.uid == userId;
  
  // Admins can read all users
  allow read: if isAdmin();
  
  // Admins can update specific fields
  allow update: if isAdmin() && 
    onlyUpdating(['role', 'isAdmin', 'status']);
}
```

### Recipes Collection
```javascript
match /recipes/{recipeId} {
  // Owner can read/write/delete
  allow read, write, delete: if request.auth.uid == resource.data.userId;
  
  // Public can read (for QR codes)
  allow read: if true;
  
  // Admins can do anything
  allow read, write, delete: if isAdmin();
}
```

### Tickets Collection
```javascript
match /tickets/{ticketId} {
  // Owner can read and create
  allow read, create: if request.auth.uid == resource.data.userId;
  
  // Admins can read and update all
  allow read, update: if isAdmin();
}
```

### Admin Logs Collection
```javascript
match /admin_logs/{logId} {
  // Only admins can read
  allow read: if isAdmin();
  
  // Only admins can create
  allow create: if isAdmin();
  
  // No one can update or delete
  allow update, delete: if false;
}
```

### QR Codes Collection
```javascript
match /qrCodes/{qrId} {
  // Anyone can read (for QR scanning)
  allow read: if true;
  
  // Owner can create/update/delete
  allow create, update, delete: if request.auth.uid == resource.data.cookId;
  
  // Admins can do anything
  allow read, write, delete: if isAdmin();
  
  // QR code feedback subcollection
  match /feedback/{feedbackId} {
    allow read: if true; // Anyone can read
    allow create: if true; // Anyone can submit
    allow update, delete: if isAdmin(); // Only admins can modify
  }
}
```

### Ingredients Collection
```javascript
match /ingredients/{ingredientId} {
  // Anyone can read
  allow read: if true;
  
  // Authenticated users can create
  allow create: if request.auth != null;
  
  // Owner can update/delete
  allow update, delete: if request.auth.uid == resource.data.userId;
  
  // Admins can do anything
  allow write, delete: if isAdmin();
}
```

### Scans Collection
```javascript
match /scans/{scanId} {
  // Owner can read and create
  allow read, create: if request.auth.uid == resource.data.userId;
  
  // Admins can read all
  allow read: if isAdmin();
}
```

---

## 📊 Storage Estimates

### Per User
- User document: ~2 KB
- Average 10 recipes: ~50 KB
- Average 5 QR codes: ~10 KB
- Average 20 scans: ~5 KB
- Average 5 tickets: ~10 KB
- **Total: ~77 KB per user**

### Per Recipe
- Recipe document: ~5 KB
- Average 10 feedback: ~5 KB
- **Total: ~10 KB per recipe**

### Per QR Code
- QR code document: ~3 KB
- Average 5 feedback: ~2 KB
- **Total: ~5 KB per QR code**

### System-Wide (1000 users)
- Users: 2 MB
- Recipes (10,000): 100 MB
- QR Codes (5,000): 25 MB
- Ingredients (1,000): 5 MB
- Scans (20,000): 10 MB
- Tickets (5,000): 10 MB
- Admin Logs (10,000): 5 MB
- Feedback (100,000): 50 MB
- **Total: ~207 MB**

---

## 🎯 Summary

**Total Collections:** 11
- `users` (root)
- `recipes` (root)
- `recipes/{id}/feedback` (subcollection)
- `tickets` (root)
- `tickets/{id}/responses` (subcollection)
- `qrCodes` (root)
- `qrCodes/{id}/feedback` (subcollection)
- `ingredients` (root)
- `scans` (root)
- `admin_logs` (root)
- `feedback` (root, alternative)

**Total Relationships:** 10
- User → Recipes (1:N)
- User → Tickets (1:N)
- User → QR Codes (1:N)
- User → Ingredients (1:N)
- User → Scans (1:N)
- User → Admin Logs (1:N)
- Recipe → Feedback (1:N)
- Ticket → Responses (1:N)
- QR Code → Feedback (1:N)
- User → Saved Recipes (1:N embedded)

**Key Features:**
- ✅ Normalized where needed
- ✅ Denormalized for performance
- ✅ Subcollections for scalability
- ✅ Composite indexes for complex queries
- ✅ Audit logging for admin actions
- ✅ Flexible feedback system (main + subcollections)
- ✅ QR code sharing with feedback
- ✅ Ingredient scanning with AI
- ✅ Comprehensive nutrition tracking

---

**Last Updated:** February 27, 2026  
**Version:** 1.0.0

