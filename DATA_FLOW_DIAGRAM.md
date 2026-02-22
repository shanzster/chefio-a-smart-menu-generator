# 📊 Chefio - Complete Data Flow Diagram (DFD)

## 📌 Table of Contents
1. [Context Diagram (Level 0)](#context-diagram-level-0)
2. [Level 1 DFD - Main Processes](#level-1-dfd---main-processes)
3. [Level 2 DFD - Detailed Sub-Processes](#level-2-dfd---detailed-sub-processes)
4. [Data Stores](#data-stores)
5. [External Entities](#external-entities)
6. [Data Flow Details](#data-flow-details)

---

## 🎯 Context Diagram (Level 0) - The Complete System View

### External Entities
- **👤 Cook User** - Registered user who creates and manages recipes
- **👥 Guest User** - Unregistered user who views shared recipes
- **👨‍💼 Admin User** - System administrator who manages users, tickets, and content
- **🔐 Firebase Auth** - Authentication service
- **🗄️ Firestore Database** - Cloud database
- **🍽️ TheMealDB API** - External recipe database
- **🥗 Spoonacular API** - Recipe intelligence API
- **📊 USDA API** - Nutrition data service
- **🖼️ TensorFlow.js** - Image recognition service

### Context Diagram (The Big Picture)

```
     👤 Cook User              👨‍💼 Admin User                👥 Guest User
         │                         │                             │
         │                         │                             │
    [Login, Recipe,          [Ticket Response,              [QR Scan,
     Food Image,              User Management,               Feedback]
     Menu Request]            Content Moderation]                │
         │                         │                             │
         ↓                         ↓                             ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                          ┃
┃                       CHEFIO SMART MENU SYSTEM                           ┃
┃                            (Level 0)                                     ┃
┃                                                                          ┃
┃  • Manages user authentication and profiles                             ┃
┃  • Creates, stores, and retrieves recipes                               ┃
┃  • Generates smart menu plans                                           ┃
┃  • Scans food images and suggests recipes                               ┃
┃  • Provides nutrition analysis                                          ┃
┃  • Generates QR codes for recipe sharing                                ┃
┃  • Collects and manages user feedback                                   ┃
┃  • Admin moderation and support management                              ┃
┃                                                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
         │                         │                             │
         ↓                         ↓                             ↓
    [Auth Token,            [Ticket Updates,                [Recipe View,
     Recipes,                User Reports,                   Feedback Confirm]
     Menu Plans,             Analytics]                           │
     QR Codes]                   │                               │
         │                       │                               │
         │                       │                               │
         └───────────────────────┴───────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    │  🗄️ External Services   │
                    │                         │
                    │  • Firebase Auth        │
                    │  • Firestore DB         │
                    │  • TheMealDB API        │
                    │  • Spoonacular API      │
                    │  • USDA API             │
                    │  • TensorFlow.js        │
                    │                         │
                    └─────────────────────────┘
```

### Complete Data Flow Summary (Context Level)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INPUTS TO SYSTEM                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FROM COOK USER:                                                            │
│    • Login Credentials (Email, Password)                                    │
│    • Recipe Data (Title, Ingredients, Instructions, Images)                 │
│    • Food Images (Camera/Upload)                                            │
│    • Dietary Preferences (Vegan, Keto, Calorie Budget)                     │
│    • Ingredient Lists (For recipe finding)                                  │
│    • Support Tickets (Bug reports, Questions)                               │
│    • Recipe IDs (For QR generation)                                         │
│    • Ingredient Names (For nutrition lookup)                                │
│                                                                             │
│  FROM GUEST USER:                                                           │
│    • QR Code Scans                                                          │
│    • Recipe Feedback (Rating, Comments)                                     │
│                                                                             │
│  FROM ADMIN USER:                                                           │
│    • Login Credentials (Admin authentication)                               │
│    • Ticket Responses (Support replies)                                     │
│    • User Management Actions (Suspend, Delete, Update)                      │
│    • Content Moderation Requests (Flag/Remove recipes)                      │
│    • System Configuration (API keys, settings)                              │
│    • Analytics Queries (Usage reports)                                      │
│                                                                             │
│  FROM EXTERNAL SERVICES:                                                    │
│    • Firebase Auth → User Authentication Tokens                             │
│    • Firestore DB → Stored Recipes, User Profiles, Feedback                │
│    • TheMealDB API → Public Recipe Database                                 │
│    • Spoonacular API → Ingredient-based Recipe Matching                     │
│    • USDA API → Comprehensive Nutrition Data                                │
│    • TensorFlow.js → Food Image Classification                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         OUTPUTS FROM SYSTEM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TO COOK USER:                                                              │
│    • Authentication Tokens (Session access)                                 │
│    • User Profile Data                                                      │
│    • Stored Recipes (Personal collection)                                   │
│    • 7-Day Menu Plans (Customized by preferences)                          │
│    • Recipe Suggestions (Based on scanned food)                             │
│    • QR Code Images (For sharing)                                          │
│    • Nutrition Facts (Calories, Macros, Vitamins)                          │
│    • Support Ticket Status                                                  │
│                                                                             │
│  TO GUEST USER:                                                             │
│    • Recipe Details (Full recipe from QR scan)                              │
│    • Nutrition Information                                                  │
│    • Feedback Confirmation                                                  │
│                                                                             │
│  TO ADMIN USER:                                                             │
│    • Admin Dashboard (Analytics, Reports)                                   │
│    • User List (All registered users)                                       │
│    • Ticket Queue (Open support tickets)                                    │
│    • Flagged Content (Reported recipes)                                     │
│    • System Logs (Activity monitoring)                                      │
│    • API Usage Stats (Rate limits, quotas)                                  │
│                                                                             │
│  TO EXTERNAL SERVICES:                                                      │
│    • Firestore DB → Recipe documents, User data, Feedback                  │
│    • Firebase Auth → Registration requests, Login attempts                  │
│    • External APIs → Search queries, Data requests                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Level 0 Expanded - Inside the Context Diagram

### What's Inside the Chefio System Box?

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                     CHEFIO SMART MENU SYSTEM (LEVEL 0)                  ┃
┃                                                                         ┃
┃    ┌────────────────────────────────────────────────────────────┐      ┃
┃    │                                                            │      ┃
┃    │         [1.0] Authentication & User Management             │      ┃
┃    │         • Login/Register/Password Reset                    │      ┃
┃    │         • Profile Management                               │      ┃
┃    │                                                            │      ┃
┃    └──────────────┬────────────────────────────┬────────────────┘      ┃
┃                   │                            │                       ┃
┃    ┌──────────────┴────────────┐  ┌────────────┴─────────────┐        ┃
┃    │                           │  │                          │        ┃
┃    │  [2.0] Recipe Management  │  │  [3.0] Menu Generation   │        ┃
┃    │  • Create/Edit/Delete     │  │  • Weekly Plans          │        ┃
┃    │  • View/List Recipes      │  │  • Dietary Filters       │        ┃
┃    │                           │  │                          │        ┃
┃    └──────────┬────────────────┘  └───────────┬──────────────┘        ┃
┃               │                               │                       ┃
┃    ┌──────────┴────────────┐  ┌───────────────┴──────────────┐        ┃
┃    │                       │  │                              │        ┃
┃    │  [4.0] Food Scanning  │  │  [5.0] Nutrition Analysis    │        ┃
┃    │  • Image Recognition  │  │  • Macro/Micro Nutrients     │        ┃
┃    │  • Recipe Suggestions │  │  • Calorie Calculation       │        ┃
┃    │                       │  │                              │        ┃
┃    └───────────────────────┘  └──────────────────────────────┘        ┃
┃                                                                        ┃
┃    ┌─────────────────────────────────────────────────────────┐        ┃
┃    │                                                         │        ┃
┃    │      [6.0] QR Code Generation & Sharing                 │        ┃
┃    │      • Generate QR Codes                                │        ┃
┃    │      • Public Recipe Sharing                            │        ┃
┃    │                                                         │        ┃
┃    └──────────────┬──────────────────────────────────────────┘        ┃
┃                   │                                                   ┃
┃    ┌──────────────┴────────────┐  ┌──────────────────────────┐        ┃
┃    │                           │  │                          │        ┃
┃    │  [7.0] Feedback System    │  │  [8.0] Recipe Discovery  │        ┃
┃    │  • User Feedback          │  │  • Search Recipes        │        ┃
┃    │  • Support Tickets        │  │  • Browse Categories     │        ┃
┃    │                           │  │  • Random Suggestions    │        ┃
┃    └───────────────────────────┘  └──────────────────────────┘        ┃
┃                                                                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Data Stores at Level 0

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA STORES (LEVEL 0)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  D1  ═══  Firebase Authentication                                  │
│           └─> User credentials, tokens                             │
│                                                                     │
│  D2  ═══  Firestore/users                                          │
│           └─> User profiles, preferences                           │
│                                                                     │
│  D3  ═══  Firestore/recipes                                        │
│           └─> Recipe documents                                     │
│                                                                     │
│  D4  ═══  Firestore/feedback                                       │
│           └─> Recipe ratings and comments                          │
│                                                                     │
│  D5  ═══  Firestore/tickets                                        │
│           └─> Support tickets                                      │
│                                                                     │
│  D6  ═══  Firestore/admin_logs                                     │
│           └─> Admin activity logs                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### External Systems at Level 0

```
┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SYSTEMS (LEVEL 0)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  E1  ⟷  TheMealDB API                                             │
│         └─> Free recipe database                                   │
│                                                                     │
│  E2  ⟷  Spoonacular API                                            │
│         └─> Ingredient matching                                    │
│                                                                     │
│  E3  ⟷  TensorFlow.js                                              │
│         └─> Image classification (client-side)                     │
│                                                                     │
│  E4  ⟷  USDA FoodData Central API                                  │
│         └─> Nutrition database                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Level 1 DFD - Main Processes (Inside Context Diagram)

### Complete Level 1 Diagram with Data Flows

```
                            👤 Cook User
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
             [Email,Password]  [Recipe]  [Food Image]
                    │            │            │
                    ↓            ↓            ↓
        ┌────────────────────────────────────────────────────┐
        │                                                    │
        │         ┌──────────────────────────┐              │
        │         │                          │              │
        │         │  1.0                     │              │
        │         │  Authenticate            │──────────┐   │
        │         │  & Manage Users          │          │   │
        │         │                          │          │   │
        │         └─────┬────────────────────┘          │   │
        │               │                               │   │
        │        [User Profile]                   [Auth │   │
        │               │                          Token]   │
        │               ↓                               │   │
        │          D2: users ═══                        │   │
        │               ↑                               ↓   │
        │               │                          D1: Firebase Auth
        │               │                                   │
        │    ┌──────────┴──────────┐                       │
        │    │                     │                       │
        │    ↓                     ↓                       │
        │ ┌─────────────┐   ┌──────────────┐              │
        │ │             │   │              │              │
        │ │  2.0        │   │   3.0        │              │
        │ │  Recipe     │   │   Menu       │              │
        │ │  Management │   │   Generation │              │
        │ │             │   │              │              │
        │ └──────┬──────┘   └──────┬───────┘              │
        │        │                 │                      │
        │   [Recipe Data]     [Menu Request]              │
        │        │                 │                      │
        │        ↓                 ↓                      │
        │   D3: recipes ═══   E1: TheMealDB API ⟷        │
        │        ↑                 ↑                      │
        │        │                 │                      │
        │   ┌────┴────┐       ┌────┴────┐                │
        │   │         │       │         │                │
        │   │  4.0    │       │  5.0    │                │
        │   │  Food   │       │  Nutr.  │                │
        │   │  Scanner│───────│  Analysis│                │
        │   │         │       │         │                │
        │   └────┬────┘       └────┬────┘                │
        │        │                 │                      │
        │   [Image Data]      [Nutrition Query]          │
        │        │                 │                      │
        │        ↓                 ↓                      │
        │   E3: TensorFlow.js  E4: USDA API ⟷            │
        │        │                                        │
        │        │                                        │
        │   ┌────┴──────────────────────┐                │
        │   │                           │                │
        │   │  6.0                      │                │
        │   │  QR Code Generation       │                │
        │   │  & Sharing                │                │
        │   │                           │                │
        │   └────┬──────────────────────┘                │
        │        │                                        │
        │   [QR Request]                                 │
        │        │                                        │
        │        ↓                                        │
        │   D3: recipes ═══ (read-only for guests)       │
        │        ↑                                        │
        │        │                                        │
        │   ┌────┴─────┐        ┌───────────┐            │
        │   │          │        │           │            │
        │   │  7.0     │        │   8.0     │            │
        │   │ Feedback │        │  Recipe   │            │
        │   │ & Support│        │  Discovery│            │
        │   │          │        │           │            │
        │   └────┬─────┘        └─────┬─────┘            │
        │        │                    │                  │
        │   [Feedback]           [Search Query]          │
        │        │                    │                  │
        │        ↓                    ↓                  │
        │   D4: feedback ═══    E2: Spoonacular API ⟷   │
        │   D5: tickets ═══                              │
        │                                                │
        └────────────────────────────────────────────────┘
                        │            │
                   [Recipe]     [Feedback Form]
                        │            │
                        ↓            ↓
                   👤 Cook User  👥 Guest User
```

### Process Overview Table

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CHEFIO SYSTEM PROCESSES                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [1.0] Authentication & User Management                                  │
│        • Handles user login, registration, password reset               │
│        • Manages user profiles and preferences                          │
│        • Interfaces with: D1 (Firebase Auth), D2 (users)                │
│                                                                          │
│  [2.0] Recipe Management                                                 │
│        • CRUD operations for recipes                                    │
│        • Recipe viewing and listing                                     │
│        • Interfaces with: D3 (recipes), D4 (feedback)                   │
│                                                                          │
│  [3.0] Menu Generation                                                   │
│        • Creates weekly meal plans                                      │
│        • Applies dietary filters                                        │
│        • Interfaces with: E1 (TheMealDB), E2 (Spoonacular)             │
│                                                                          │
│  [4.0] Food Scanning & Recognition                                       │
│        • Processes food images                                          │
│        • Identifies ingredients                                         │
│        • Interfaces with: E3 (TensorFlow.js), E2 (Spoonacular)         │
│                                                                          │
│  [5.0] Nutrition Analysis                                                │
│        • Fetches nutrition data                                         │
│        • Calculates recipe nutrition                                    │
│        • Interfaces with: E4 (USDA API)                                │
│                                                                          │
│  [6.0] QR Code Generation & Sharing                                      │
│        • Generates QR codes for recipes                                 │
│        • Provides public recipe access                                  │
│        • Interfaces with: D3 (recipes - read)                           │
│                                                                          │
│  [7.0] Feedback & Support System                                         │
│        • Collects recipe feedback                                       │
│        • Manages support tickets                                        │
│        • Interfaces with: D4 (feedback), D5 (tickets)                   │
│                                                                          │
│  [8.0] Recipe Discovery & Browse                                         │
│        • Searches recipes                                               │
│        • Browses by category                                            │
│        • Interfaces with: E1 (TheMealDB), E2 (Spoonacular), D3          │
│                                                                          │
│  [9.0] Admin Management & Moderation                                     │
│        • Manages user accounts (suspend, delete, verify)                │
│        • Responds to support tickets                                    │
│        • Moderates content (approve, flag, remove recipes)              │
│        • Views system analytics and reports                             │
│        • Interfaces with: D2 (users), D3 (recipes), D4 (feedback),      │
│          D5 (tickets), D6 (admin_logs)                                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Level 2 DFD - Detailed Sub-Processes (Inside Each Main Process)

This section shows what happens INSIDE each of the 8 main processes from Level 1.

---

### 🔐 Level 2.1: Authentication & User Management (Process 1.0 Exploded)

```
Cook User
    │
    ├─[Email, Password]─────────────────────────────────────┐
    │                                                        │
    ↓                                                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   PROCESS 1.0 - EXPLODED VIEW                       │
│                                                                     │
│    [1.1]                [1.2]              [1.3]         [1.4]     │
│  Register User       Login User      Reset Password  Update Profile│
│      │                   │                 │              │        │
│      │                   │                 │              │        │
│      ├─> Validate        ├─> Verify        ├─> Send      ├─> Update│
│      │   Email           │   Credentials   │   Reset     │   Fields│
│      │                   │                 │   Email     │         │
│      ↓                   ↓                 ↓             ↓         │
│  D1: Firebase Auth   D1: Firebase     D1: Firebase  D2: users ═══ │
│      │                   │                 │              │        │
│      ├─> Create          ├─> Fetch         └─> Update    └─> Save │
│      │   Auth User       │   User Doc          Password     Changes│
│      │                   │                                          │
│      ↓                   ↓                                          │
│  D2: users ═══       D2: users ═══                                 │
│      │                   │                                          │
│      └─> Store           └─> Return                                │
│          Profile             Profile                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
    │                   │                 │              │
    ↓                   ↓                 ↓              ↓
[Success +        [Auth Token +      [Reset         [Updated
 User Profile]     User Data]         Confirmation]   Profile]
    │                   │                 │              │
    ↓                   ↓                 ↓              ↓
Cook User           Cook User         Cook User      Cook User
```

**Sub-Process Details:**

```
[1.1] Register User
    Input:  Email, Password, Display Name
    Steps:  
        1.1.1 → Validate email format
        1.1.2 → Check password strength (min 6 chars)
        1.1.3 → Create Firebase Auth account
        1.1.4 → Generate user document
        1.1.5 → Store in Firestore/users
    Output: User profile + Auth token
    
[1.2] Login User
    Input:  Email, Password
    Steps:  
        1.2.1 → Verify credentials with Firebase Auth
        1.2.2 → Generate session token
        1.2.3 → Fetch user profile from Firestore
        1.2.4 → Return user data
    Output: Auth token + User data
    
[1.3] Reset Password
    Input:  Email address
    Steps:  
        1.3.1 → Verify email exists in Firebase Auth
        1.3.2 → Send password reset email
        1.3.3 → Wait for user confirmation
        1.3.4 → Update password in Firebase
    Output: Reset confirmation
    
[1.4] Update Profile
    Input:  User ID, Updated fields
    Steps:  
        1.4.1 → Validate user session
        1.4.2 → Verify user ownership
        1.4.3 → Update Firestore/users document
        1.4.4 → Return updated profile
    Output: Updated profile data
```

---

### 📖 Level 2.2: Recipe Management (Process 2.0 Exploded)

```
Cook User
    │
    ├─[Recipe Data]────[Recipe ID]────[Updates]────[Delete Request]─┐
    │                                                                │
    ↓                                                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   PROCESS 2.0 - EXPLODED VIEW                       │
│                                                                     │
│  [2.1]        [2.2]        [2.3]        [2.4]         [2.5]        │
│ Create       View        Update       Delete      Get User         │
│ Recipe      Recipe       Recipe       Recipe      Recipes          │
│   │           │            │            │            │             │
│   ├─> Add     ├─> Fetch    ├─> Verify  ├─> Verify   ├─> Query     │
│   │   UserID  │   by ID    │   Owner   │   Owner    │   by UserID │
│   │           │            │           │            │             │
│   ↓           ↓            ↓           ↓            ↓             │
│ D3: recipes  D3: recipes  D3: recipes D3: recipes  D3: recipes ══ │
│   │           │            │           │            │             │
│   └─> Store   ├─> Get      └─> Update  └─> Delete   └─> Filter    │
│       Doc     │   Feedback     Fields      Doc          & Sort    │
│               │                                                    │
│               ↓                                                    │
│           D4: feedback ═══                                         │
│               │                                                    │
│               └─> Calculate                                        │
│                   Avg Rating                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
    │           │            │           │            │
    ↓           ↓            ↓           ↓            ↓
[Recipe ID] [Full Recipe] [Updated]  [Success]  [Recipe List]
    │           │            │           │            │
    ↓           ↓            ↓           ↓            ↓
Cook User   Cook/Guest   Cook User   Cook User   Cook User
```

**Sub-Process Details:**

```
[2.1] Create Recipe
    Input:  Title, Ingredients[], Instructions[], Image, Category
    Steps:  
        2.1.1 → Validate required fields
        2.1.2 → Add userId (from auth token)
        2.1.3 → Add timestamps (createdAt, updatedAt)
        2.1.4 → Generate unique recipe ID
        2.1.5 → Store in Firestore/recipes
    Output: Recipe ID + Recipe data
    
[2.2] View Recipe
    Input:  Recipe ID
    Steps:  
        2.2.1 → Fetch recipe document from Firestore
        2.2.2 → Query feedback collection
        2.2.3 → Calculate average rating
        2.2.4 → Merge recipe + feedback stats
    Output: Complete recipe with ratings
    
[2.3] Update Recipe
    Input:  Recipe ID, Updated fields
    Steps:  
        2.3.1 → Fetch recipe by ID
        2.3.2 → Verify user ownership
        2.3.3 → Validate updated fields
        2.3.4 → Update document in Firestore
        2.3.5 → Update timestamp
    Output: Updated recipe
    
[2.4] Delete Recipe
    Input:  Recipe ID
    Steps:  
        2.4.1 → Verify user ownership
        2.4.2 → Delete recipe document
        2.4.3 → Delete associated feedback (cascade)
    Output: Success confirmation
    
[2.5] Get User Recipes
    Input:  User ID, Optional filters
    Steps:  
        2.5.1 → Query Firestore where userId = current user
        2.5.2 → Apply category filter (if provided)
        2.5.3 → Sort by createdAt (desc)
        2.5.4 → Return recipe array
    Output: Array of user's recipes
```

---

### 🍽️ Level 2.3: Menu Generation (Process 3.0 Exploded)

```
Cook User
    │
    ├─[Diet Preferences]────[Calorie Budget]────[Meal Type]─────┐
    │                                                            │
    ↓                                                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   PROCESS 3.0 - EXPLODED VIEW                       │
│                                                                     │
│           [3.1]                          [3.2]                      │
│     Generate Weekly Menu            Smart Suggestions               │
│              │                             │                        │
│              ├─> Parse Preferences         ├─> Parse Ingredients    │
│              │   (Vegan, Keto, etc)        │                        │
│              │                             │                        │
│              ↓                             ↓                        │
│      E1: TheMealDB API ⟷           E2: Spoonacular API ⟷           │
│              │                             │                        │
│              ├─> Filter by Category        ├─> Find by Ingredients  │
│              │                             │   (Ranked)             │
│              ↓                             │                        │
│          [3.1.1]                           ↓                        │
│      Filter by Diet                    [3.2.1]                      │
│              │                      Apply Diet Filters              │
│              ↓                             │                        │
│          [3.1.2]                           ↓                        │
│    Calculate Nutrition                 [3.2.2]                      │
│              │                      Fetch Nutrition                 │
│              ↓                             │                        │
│          [3.1.3]                           │                        │
│    Organize by Meals                       │                        │
│    (Breakfast/Lunch/Dinner)                │                        │
│              │                             │                        │
└──────────────┼─────────────────────────────┼─────────────────────────┘
               │                             │
               ↓                             ↓
        [7-Day Menu Plan]           [Recipe Matches]
               │                             │
               ↓                             ↓
           Cook User                     Cook User
```

**Sub-Process Details:**

```
[3.1] Generate Weekly Menu
    Input:  Dietary preferences, Calorie budget, Meal types
    Steps:  
        3.1.1 → Query TheMealDB by category
        3.1.2 → Filter recipes by diet (vegan, keto, etc)
        3.1.3 → Calculate total calories per recipe
        3.1.4 → Select recipes within calorie budget
        3.1.5 → Organize into 7 days × 3 meals
    Output: 7-day menu plan (21 recipes)
    
[3.2] Smart Recipe Suggestions
    Input:  Available ingredients list
    Steps:  
        3.2.1 → Parse ingredient array
        3.2.2 → Query Spoonacular "findByIngredients"
        3.2.3 → Rank by ingredient match score
        3.2.4 → Apply dietary filters
        3.2.5 → Fetch detailed recipe + nutrition
    Output: Top matching recipes
```

---

### 📸 Level 2.4: Food Scanning & Recognition (Process 4.0 Exploded)

```
Cook User
    │
    ├─[Food Image (Camera/Upload)]────────────────────────────┐
    │                                                          │
    ↓                                                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   PROCESS 4.0 - EXPLODED VIEW                       │
│                                                                     │
│                      [4.1] Scan and Identify Food                   │
│                              │                                      │
│                              ├─> [4.1.1] Preprocess Image           │
│                              │   (Resize to 224x224)                │
│                              │                                      │
│                              ↓                                      │
│                      E3: TensorFlow.js ⟷                           │
│                         (MobileNet)                                 │
│                              │                                      │
│                              ├─> [4.1.2] Run Classification         │
│                              │                                      │
│                              ↓                                      │
│                      [Predicted Labels]                             │
│                    ["pizza", "cheese", "tomato"]                    │
│                              │                                      │
│                              ├─> [4.1.3] Map to Ingredients         │
│                              │                                      │
│                              ↓                                      │
│                      E2: Spoonacular API ⟷                         │
│                              │                                      │
│                              ├─> [4.1.4] Find Recipes by            │
│                              │          Ingredients                 │
│                              │                                      │
│                              ↓                                      │
│                      [4.1.5] Fetch Recipe Details                   │
│                              │                                      │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               ↓
                    [Detected Ingredients +
                     Recipe Suggestions]
                               │
                               ↓
                           Cook User
```

**Sub-Process Details:**

```
[4.1] Scan and Identify Food
    Input:  Image file/blob from camera or upload
    Steps:  
        4.1.1 → Preprocess image (resize, normalize pixels)
        4.1.2 → Load TensorFlow.js MobileNet model
        4.1.3 → Run image classification
        4.1.4 → Extract top 3 predictions with confidence
        4.1.5 → Map labels to ingredient names
        4.1.6 → Query Spoonacular with detected ingredients
        4.1.7 → Rank recipes by ingredient match
        4.1.8 → Return recipes + detected ingredients
    Output: Ingredient list + Recipe suggestions
```

---

### 📊 Level 2.5: Nutrition Analysis (Process 5.0 Exploded)

```
Cook User
    │
    ├─[Ingredient Name]──────[Recipe ID]────────────────────┐
    │                                                        │
    ↓                                                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   PROCESS 5.0 - EXPLODED VIEW                       │
│                                                                     │
│    [5.1]                              [5.2]                         │
│  Get Nutrition Data           Calculate Recipe Nutrition            │
│      │                                 │                            │
│      ├─> [5.1.1] Search USDA           ├─> [5.2.1] Fetch Recipe    │
│      │                                 │                            │
│      ↓                                 ↓                            │
│  E4: USDA API ⟷               D3: recipes ═══                       │
│      │                                 │                            │
│      ├─> [5.1.2] Parse                 ├─> [5.2.2] Loop Each       │
│      │   Response                      │   Ingredient              │
│      │                                 │                            │
│      ↓                                 ↓                            │
│  [5.1.3] Extract                   E4: USDA API ⟷                  │
│  Macros + Micros                       │                            │
│      │                                 ├─> [5.2.3] Sum All         │
│      │                                 │   Nutrients               │
│      │                                 │                            │
│      │                                 ↓                            │
│      │                             [5.2.4] Divide                   │
│      │                             by Servings                      │
│      │                                 │                            │
└──────┼─────────────────────────────────┼─────────────────────────────┘
       │                                 │
       ↓                                 ↓
  [Nutrition Facts]          [Total Nutrition per Serving]
       │                                 │
       ↓                                 ↓
   Cook User                         Cook User
```

**Sub-Process Details:**

```
[5.1] Get Nutrition Data
    Input:  Ingredient/food name
    Steps:  
        5.1.1 → Search USDA FoodData Central API
        5.1.2 → Parse JSON response
        5.1.3 → Extract macronutrients (calories, protein, carbs, fat)
        5.1.4 → Extract micronutrients (vitamins, minerals)
        5.1.5 → Format for display
    Output: Complete nutrition facts
    
[5.2] Calculate Recipe Nutrition
    Input:  Recipe ID
    Steps:  
        5.2.1 → Fetch recipe from Firestore
        5.2.2 → Extract ingredients array
        5.2.3 → Loop through each ingredient
        5.2.4 → Query USDA API for each
        5.2.5 → Sum all nutritional values
        5.2.6 → Divide by number of servings
        5.2.7 → Return totals per serving
    Output: Total nutrition per serving
```

---

### 🔗 Level 2.6: QR Code Generation & Sharing (Process 6.0 Exploded)

```
Cook User                          Guest User
    │                                  │
    ├─[Recipe ID]─────────────────┐    │
    │                             │    ├─[QR Code Scan]──────────┐
    ↓                             ↓    ↓                         │
┌─────────────────────────────────────────────────────────────────────┐
│                   PROCESS 6.0 - EXPLODED VIEW                       │
│                                                                     │
│    [6.1]                              [6.2]                         │
│  Generate QR Code              View Shared Recipe                   │
│      │                                 │                            │
│      ├─> [6.1.1] Create URL            ├─> [6.2.1] Extract         │
│      │   chefio.app/r/{id}             │   Recipe ID from URL      │
│      │                                 │                            │
│      ├─> [6.1.2] Generate QR           ↓                            │
│      │   (SVG/PNG)                D3: recipes ═══                   │
│      │                                 │                            │
│      ├─> [6.1.3] Encode URL            ├─> [6.2.2] Fetch Recipe    │
│      │   in QR Pattern                 │                            │
│      │                                 ↓                            │
│      ├─> [6.1.4] Create                ├─> [6.2.3] Fetch           │
│      │   Shareable Link                │   Nutrition Data          │
│      │                                 │                            │
│      ↓                                 ↓                            │
│  [QR Image Data]                   [6.2.4] Render                   │
│      │                             Public View                      │
│      │                                 │                            │
│      │                                 ↓                            │
│      │                             [6.2.5] Allow                    │
│      │                             Feedback Submit                  │
│      │                                 │                            │
└──────┼─────────────────────────────────┼─────────────────────────────┘
       │                                 │
       ↓                                 ↓
  [QR Code Image                  [Recipe Details +
   + Shareable Link]               Feedback Form]
       │                                 │
       ↓                                 ↓
   Cook User                         Guest User
```

**Sub-Process Details:**

```
[6.1] Generate QR Code
    Input:  Recipe ID
    Steps:  
        6.1.1 → Create public recipe URL
        6.1.2 → Generate QR code (using qrcode.react)
        6.1.3 → Encode URL in QR pattern
        6.1.4 → Provide download/share options
    Output: QR code image + shareable link
    
[6.2] View Shared Recipe
    Input:  QR code scan (extracts URL)
    Steps:  
        6.2.1 → Parse recipe ID from URL
        6.2.2 → Fetch recipe from Firestore
        6.2.3 → Fetch nutrition information
        6.2.4 → Render public recipe view
        6.2.5 → Display feedback form
    Output: Public recipe page
```

---

### 💬 Level 2.7: Feedback & Support System (Process 7.0 Exploded)

```
Cook User                          Guest User
    │                                  │
    ├─[Support Ticket]────┐            ├─[Recipe Feedback]──────┐
    │                     │            │                        │
    ↓                     ↓            ↓                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   PROCESS 7.0 - EXPLODED VIEW                       │
│                                                                     │
│    [7.1]              [7.2]             [7.3]         [7.4]         │
│  Submit Ticket    Submit Feedback   View Tickets  Mark Helpful      │
│      │                 │                │             │             │
│      ├─> Validate      ├─> Validate     ├─> Query    ├─> Fetch     │
│      │   Ticket        │   Rating       │   by User  │   Feedback  │
│      │                 │   (1-5)        │            │             │
│      ↓                 ↓                ↓            ↓             │
│  D5: tickets ═══   D4: feedback ═══ D5: tickets  D4: feedback ═══  │
│      │                 │                │             │             │
│      └─> Store         ├─> Store        └─> Return   ├─> Increment │
│          Ticket        │   Feedback         Tickets  │   Counter   │
│                        │                              │             │
│                        ↓                              │             │
│                    D3: recipes ═══                    │             │
│                        │                              │             │
│                        └─> Update Avg Rating          │             │
│                                                       │             │
└───────────────────────────────────────────────────────┼─────────────┘
       │                 │                │             │
       ↓                 ↓                ↓             ↓
  [Ticket ID]     [Feedback ID]    [Ticket List] [Updated Count]
       │                 │                │             │
       ↓                 ↓                ↓             ↓
   Cook User       Cook/Guest        Cook User     User
```

**Sub-Process Details:**

```
[7.1] Submit Support Ticket
    Input:  Subject, Message, Category, Priority
    Steps:  
        7.1.1 → Validate required fields
        7.1.2 → Add user ID and timestamp
        7.1.3 → Set status to "open"
        7.1.4 → Store in Firestore/tickets
    Output: Ticket ID + confirmation
    
[7.2] Submit Recipe Feedback
    Input:  Recipe ID, Rating (1-5), Comment
    Steps:  
        7.2.1 → Validate rating value
        7.2.2 → Add user info (or "anonymous")
        7.2.3 → Store in Firestore/feedback
        7.2.4 → Calculate new average rating
        7.2.5 → Update recipe document
        7.2.6 → Increment feedback count
    Output: Feedback ID + confirmation
    
[7.3] View User Tickets
    Input:  User ID
    Steps:  
        7.3.1 → Query tickets where userId = current user
        7.3.2 → Sort by date (newest first)
        7.3.3 → Include status and replies
    Output: Array of user's tickets
    
[7.4] Mark Feedback Helpful
    Input:  Feedback ID, isHelpful (boolean)
    Steps:  
        7.4.1 → Fetch feedback document
        7.4.2 → Increment helpful or notHelpful counter
        7.4.3 → Update document
    Output: Updated helpful count
```

---

### 🔍 Level 2.8: Recipe Discovery & Browse (Process 8.0 Exploded)

```
Cook User
    │
    ├─[Search Query]──[Category Filter]──[Random Request]─────┐
    │                                                          │
    ↓                                                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   PROCESS 8.0 - EXPLODED VIEW                       │
│                                                                     │
│    [8.1]              [8.2]                [8.3]                    │
│  Search Recipes   Browse by Category   Get Random Recipes           │
│      │                 │                    │                       │
│      ├─> Parse         ├─> Receive          ├─> Call Random         │
│      │   Query         │   Category         │   Endpoint (10x)     │
│      │                 │                    │                       │
│      ↓                 ↓                    ↓                       │
│  E1: TheMealDB ⟷  E1: TheMealDB ⟷     E1: TheMealDB ⟷             │
│      │                 │                    │                       │
│      ├─> Search        ├─> Filter           ├─> Transform Each     │
│      │   by Name       │   by Category      │   Recipe             │
│      │                 │                    │                       │
│      ↓                 ↓                    ↓                       │
│  D3: recipes ═══       │                    │                       │
│      │                 │                    │                       │
│      ├─> Query         ├─> Transform        ├─> Add Nutrition      │
│      │   User          │   Format           │   Estimates          │
│      │   Recipes       │                    │                       │
│      │                 ↓                    │                       │
│      ├─> Merge         └─> Add Estimated    │                       │
│      │   Results           Nutrition        │                       │
│      │                                      │                       │
│      ↓                                      │                       │
│  [8.1.4] Sort                               │                       │
│  by Relevance                               │                       │
│      │                                      │                       │
└──────┼──────────────────────────────────────┼───────────────────────┘
       │                 │                    │
       ↓                 ↓                    ↓
  [Search Results] [Category Recipes]  [Random Recipes]
       │                 │                    │
       ↓                 ↓                    ↓
   Cook User         Cook User            Cook User
```

**Sub-Process Details:**

```
[8.1] Search Recipes
    Input:  Search query string
    Steps:  
        8.1.1 → Parse search query
        8.1.2 → Query TheMealDB API (search by name)
        8.1.3 → Query Firestore/recipes (user's recipes)
        8.1.4 → Merge external + user recipes
        8.1.5 → Sort by relevance score
    Output: Array of matching recipes
    
[8.2] Browse by Category
    Input:  Category (Breakfast, Lunch, Dinner, Dessert, etc)
    Steps:  
        8.2.1 → Map category to TheMealDB category
        8.2.2 → Query TheMealDB API by category
        8.2.3 → Transform to app format
        8.2.4 → Add estimated nutrition data
        8.2.5 → Return filtered recipes
    Output: Category-filtered recipes
    
[8.3] Get Random Recipes
    Input:  Number of recipes (default 10)
    Steps:  
        8.3.1 → Call TheMealDB random endpoint multiple times
        8.3.2 → Transform each recipe to app format
        8.3.3 → Add nutrition estimates
        8.3.4 → Return random recipe array
    Output: Random recipe suggestions
```

---

## 📋 Process 1.0: Authentication & User Management

### Input Flows
```
Cook User ──[Email + Password]──> [1.1 User Registration]
Cook User ──[Login Credentials]──> [1.2 User Login]
Cook User ──[Password Reset Email]──> [1.3 Password Recovery]
Cook User ──[Profile Updates]──> [1.4 Profile Management]
```

### Process Steps
```
[1.1 Register User]
  ├─> Validate Email & Password
  ├─> Create Firebase Auth Account
  ├─> Generate User Document
  └─> Store in Firestore DB

[1.2 Login User]
  ├─> Verify Credentials (Firebase Auth)
  ├─> Fetch User Profile (Firestore)
  ├─> Generate Session Token
  └─> Return User Data + Token

[1.3 Reset Password]
  ├─> Verify Email Exists
  ├─> Send Reset Link (Firebase Auth)
  └─> Update Password in Firebase

[1.4 Update Profile]
  ├─> Validate User Session
  ├─> Update User Document (Firestore)
  └─> Return Updated Profile
```

### Output Flows
```
[1.1 Register] ──[User Profile + Token]──> Cook User
[1.2 Login] ──[Auth Token + User Data]──> Cook User
[1.3 Reset] ──[Reset Confirmation]──> Cook User
[1.4 Update] ──[Updated Profile]──> Cook User
```

### Data Stores Used
- **D1: Firebase Authentication** (Credentials)
- **D2: Firestore/users** (User profiles)

---

## 📋 Process 2.0: Recipe Management

### Input Flows
```
Cook User ──[Recipe Form Data]──> [2.1 Create Recipe]
Cook User ──[Recipe ID]──> [2.2 View Recipe]
Cook User ──[Recipe Updates]──> [2.3 Update Recipe]
Cook User ──[Recipe ID]──> [2.4 Delete Recipe]
Cook User ──[User ID]──> [2.5 Get User Recipes]
```

### Process Steps
```
[2.1 Create Recipe]
  ├─> Validate Recipe Data (Title, Ingredients, Steps)
  ├─> Add User ID & Timestamp
  ├─> Upload to Firestore/recipes
  ├─> Return Recipe ID
  └─> Store Recipe Document

[2.2 View Recipe]
  ├─> Fetch Recipe by ID (Firestore)
  ├─> Retrieve Feedback Stats
  ├─> Calculate Average Rating
  └─> Return Complete Recipe Data

[2.3 Update Recipe]
  ├─> Verify User Ownership
  ├─> Validate Updated Fields
  ├─> Update Recipe Document (Firestore)
  └─> Return Updated Recipe

[2.4 Delete Recipe]
  ├─> Verify User Ownership
  ├─> Delete from Firestore/recipes
  ├─> Delete Associated Feedback
  └─> Return Success Status

[2.5 Get User Recipes]
  ├─> Query Firestore by User ID
  ├─> Filter by Category (Optional)
  ├─> Sort by Created Date
  └─> Return Recipe List
```

### Output Flows
```
[2.1 Create] ──[Recipe ID + Data]──> Cook User
[2.2 View] ──[Full Recipe Details]──> Cook User / Guest User
[2.3 Update] ──[Updated Recipe]──> Cook User
[2.4 Delete] ──[Success Message]──> Cook User
[2.5 List] ──[Recipe Array]──> Cook User
```

### Data Stores Used
- **D3: Firestore/recipes** (Recipe documents)
- **D4: Firestore/feedback** (Recipe ratings)

---

## 📋 Process 3.0: Menu Generation

### Input Flows
```
Cook User ──[Dietary Preferences]──> [3.1 Generate Menu]
Cook User ──[Meal Type Filter]──> [3.1 Generate Menu]
Cook User ──[Calorie Budget]──> [3.1 Generate Menu]
Cook User ──[Available Ingredients]──> [3.2 Smart Suggestions]
```

### Process Steps
```
[3.1 Generate Weekly Menu]
  ├─> Parse User Preferences (Vegan, Keto, etc.)
  ├─> Query TheMealDB API by Category
  ├─> Filter by Dietary Restrictions
  ├─> Calculate Nutritional Totals
  ├─> Organize by Meal Times (Breakfast, Lunch, Dinner)
  └─> Return 7-Day Menu Plan

[3.2 Smart Recipe Suggestions]
  ├─> Parse Available Ingredients
  ├─> Query Spoonacular API (Find by Ingredients)
  ├─> Rank by Ingredient Match
  ├─> Apply Dietary Filters
  ├─> Fetch Nutrition Data
  └─> Return Top Recipe Matches
```

### Output Flows
```
[3.1 Menu] ──[7-Day Menu Plan]──> Cook User
[3.2 Suggestions] ──[Recipe Matches]──> Cook User
```

### External APIs Used
- **E1: TheMealDB API** (Recipe database)
- **E2: Spoonacular API** (Ingredient matching)

---

## 📋 Process 4.0: Food Scanning & Recognition

### Input Flows
```
Cook User ──[Food Image (File/Camera)]──> [4.1 Scan Food]
```

### Process Steps
```
[4.1 Scan and Identify Food]
  ├─> Receive Image Upload
  ├─> Preprocess Image (Resize, Normalize)
  ├─> Load TensorFlow.js Model (MobileNet)
  ├─> Run Image Classification
  ├─> Extract Top Predictions
  ├─> Map Labels to Ingredients
  ├─> Query Spoonacular API (Recipe by Ingredients)
  ├─> Fetch Recipe Details
  └─> Return Recipes + Detected Ingredients
```

### Output Flows
```
[4.1 Scan] ──[Detected Ingredients]──> Cook User
[4.1 Scan] ──[Recipe Suggestions]──> Cook User
```

### Services Used
- **E3: TensorFlow.js** (Image recognition)
- **E2: Spoonacular API** (Recipe matching)

---

## 📋 Process 5.0: Nutrition Analysis

### Input Flows
```
Cook User ──[Food/Ingredient Name]──> [5.1 Get Nutrition]
Cook User ──[Recipe ID]──> [5.2 Calculate Recipe Nutrition]
```

### Process Steps
```
[5.1 Fetch Nutrition Data]
  ├─> Receive Ingredient Query
  ├─> Search USDA FoodData Central API
  ├─> Parse Nutrition Response
  ├─> Extract Macros (Calories, Protein, Carbs, Fat)
  ├─> Extract Micronutrients (Vitamins, Minerals)
  └─> Return Nutrition Facts

[5.2 Calculate Recipe Nutrition]
  ├─> Fetch Recipe Ingredients (Firestore)
  ├─> Loop Through Each Ingredient
  ├─> Query USDA API for Each
  ├─> Sum All Nutritional Values
  ├─> Divide by Servings
  └─> Return Total Nutrition per Serving
```

### Output Flows
```
[5.1 Nutrition] ──[Nutrition Facts]──> Cook User
[5.2 Recipe Nutrition] ──[Total Macros + Micros]──> Cook User
```

### External APIs Used
- **E4: USDA FoodData Central API** (Nutrition database)

---

## 📋 Process 6.0: QR Code Generation & Sharing

### Input Flows
```
Cook User ──[Recipe ID]──> [6.1 Generate QR Code]
Guest User ──[QR Code Scan]──> [6.2 View Shared Recipe]
```

### Process Steps
```
[6.1 Generate QR Code]
  ├─> Receive Recipe ID
  ├─> Create Public Recipe URL
  ├─> Generate QR Code (SVG/PNG)
  ├─> Encode Recipe Link
  ├─> Return QR Code Image
  └─> Provide Shareable Link

[6.2 View Shared Recipe]
  ├─> Scan QR Code
  ├─> Extract Recipe ID from URL
  ├─> Fetch Recipe from Firestore
  ├─> Fetch Nutrition Data
  ├─> Render Public Recipe View
  └─> Allow Guest Feedback Submission
```

### Output Flows
```
[6.1 QR] ──[QR Code Image + Link]──> Cook User
[6.2 View] ──[Recipe Details Page]──> Guest User
```

### Data Stores Used
- **D3: Firestore/recipes** (Public recipe access)

---

## 📋 Process 7.0: Feedback & Support System

### Input Flows
```
Cook User ──[Support Request]──> [7.1 Submit Ticket]
Guest User ──[Recipe Feedback]──> [7.2 Submit Feedback]
Cook User ──[Ticket ID]──> [7.3 View Tickets]
Cook User ──[Feedback ID]──> [7.4 Mark Helpful]
```

### Process Steps
```
[7.1 Submit Support Ticket]
  ├─> Validate Ticket Data
  ├─> Add User ID & Timestamp
  ├─> Store in Firestore/tickets
  ├─> Set Status: "open"
  └─> Return Ticket ID

[7.2 Submit Recipe Feedback]
  ├─> Validate Rating (1-5) & Comment
  ├─> Add User Info (or Anonymous)
  ├─> Store in Firestore/feedback
  ├─> Update Recipe Average Rating
  ├─> Increment Feedback Count
  └─> Return Feedback ID

[7.3 Get User Tickets]
  ├─> Query Firestore by User ID
  ├─> Sort by Date (Newest First)
  ├─> Return Ticket List
  └─> Include Status & Replies

[7.4 Mark Feedback Helpful]
  ├─> Fetch Feedback Document
  ├─> Increment helpful/notHelpful Counter
  ├─> Update Firestore
  └─> Return Updated Count
```

### Output Flows
```
[7.1 Ticket] ──[Ticket ID + Status]──> Cook User
[7.2 Feedback] ──[Feedback Confirmation]──> Guest/Cook User
[7.3 Tickets] ──[Ticket List]──> Cook User
[7.4 Helpful] ──[Updated Count]──> User
```

### Data Stores Used
- **D5: Firestore/tickets** (Support tickets)
- **D4: Firestore/feedback** (Recipe feedback)
- **D3: Firestore/recipes** (Rating updates)

---

## 📋 Process 8.0: Recipe Discovery & Browse

### Input Flows
```
Cook User ──[Search Query]──> [8.1 Search Recipes]
Cook User ──[Category Filter]──> [8.2 Browse by Category]
Cook User ──[null]──> [8.3 Get Random Recipes]
```

### Process Steps
```
[8.1 Search Recipes]
  ├─> Parse Search Query
  ├─> Query TheMealDB API (Search by Name)
  ├─> Query Firestore/recipes (User Recipes)
  ├─> Merge Results
  ├─> Sort by Relevance
  └─> Return Recipe List

[8.2 Browse by Category]
  ├─> Receive Category (Breakfast, Lunch, Dinner, etc.)
  ├─> Query TheMealDB API by Category
  ├─> Transform to App Format
  ├─> Add Estimated Nutrition
  └─> Return Filtered Recipes

[8.3 Get Random Recipes]
  ├─> Call TheMealDB Random Endpoint (10x)
  ├─> Transform Each Recipe
  ├─> Add Nutrition Estimates
  └─> Return Random Recipe Array
```

### Output Flows
```
[8.1 Search] ──[Search Results]──> Cook User
[8.2 Browse] ──[Category Recipes]──> Cook User
[8.3 Random] ──[Random Recipe List]──> Cook User
```

### External APIs Used
- **E1: TheMealDB API** (Recipe search/browse)

---

## 🗄️ Data Stores

### D1: Firebase Authentication
**Type:** External Service  
**Stores:**
- User email addresses
- Encrypted passwords
- User IDs (UIDs)
- Authentication tokens

**Access:**
- Write: User registration, password reset
- Read: Login verification, session validation

---

### D2: Firestore/users
**Type:** NoSQL Document Collection  
**Schema:**
```javascript
{
  uid: string,                    // Firebase UID
  email: string,                  // User email
  displayName: string,            // Full name
  createdAt: timestamp,           // Registration date
  updatedAt: timestamp,           // Last profile update
  preferences: {
    dietaryRestrictions: array,   // ["vegan", "gluten-free"]
    favoriteCuisines: array,      // ["italian", "mexican"]
  }
}
```

**Access:**
- Write: [1.1, 1.4] User registration/update
- Read: [1.2] User login, profile fetch

---

### D3: Firestore/recipes
**Type:** NoSQL Document Collection  
**Schema:**
```javascript
{
  id: string,                     // Auto-generated
  userId: string,                 // Recipe creator UID
  name: string,                   // Recipe title
  description: string,            // Short description
  image: string,                  // Image URL
  prepTime: number,               // Minutes
  servings: number,               // Number of servings
  difficulty: string,             // Easy/Medium/Hard
  category: string,               // Meal type
  ingredients: array,             // [{name, amount, unit}]
  instructions: array,            // Step-by-step strings
  nutrition: object,              // {calories, protein, carbs, fat}
  avgRating: number,              // Average rating (0-5)
  totalFeedback: number,          // Feedback count
  createdAt: timestamp,           // Creation date
  updatedAt: timestamp            // Last edit
}
```

**Access:**
- Write: [2.1, 2.3, 2.4] Recipe CRUD operations
- Read: [2.2, 2.5, 6.2, 8.1] Recipe viewing, sharing

---

### D4: Firestore/feedback
**Type:** NoSQL Document Collection  
**Schema:**
```javascript
{
  id: string,                     // Auto-generated
  recipeId: string,               // Recipe reference
  userId: string,                 // Feedback author (or "anonymous")
  userName: string,               // Display name
  rating: number,                 // 1-5 stars
  comment: string,                // Feedback text
  helpful: number,                // Helpful count
  notHelpful: number,             // Not helpful count
  createdAt: timestamp            // Submission date
}
```

**Access:**
- Write: [7.2, 7.4] Submit feedback, mark helpful
- Read: [2.2] Fetch recipe feedback, calculate ratings

---

### D5: Firestore/tickets
**Type:** NoSQL Document Collection  
**Schema:**
```javascript
{
  id: string,                     // Auto-generated
  userId: string,                 // Ticket creator
  subject: string,                // Ticket title
  message: string,                // Description
  category: string,               // "bug", "feature", "question"
  status: string,                 // "open", "in-progress", "resolved"
  priority: string,               // "low", "medium", "high"
  assignedTo: string,             // Admin user ID
  responses: array,               // [{adminId, message, timestamp}]
  createdAt: timestamp,           // Creation date
  updatedAt: timestamp            // Last update
}
```

**Access:**
- Write: [7.1] Submit support ticket, [9.2] Admin respond to ticket
- Read: [7.3] View user tickets, [9.1] Admin view all tickets

---

### D6: Firestore/admin_logs
**Type:** NoSQL Document Collection  
**Schema:**
```javascript
{
  id: string,                     // Auto-generated
  adminId: string,                // Admin user ID
  adminName: string,              // Admin display name
  action: string,                 // "user_suspend", "ticket_resolved", "recipe_deleted"
  targetType: string,             // "user", "recipe", "ticket"
  targetId: string,               // ID of affected entity
  details: object,                // Additional context
  timestamp: timestamp            // Action date/time
}
```

**Access:**
- Write: [9.0] All admin actions
- Read: [9.5] View admin activity logs

---

## 🌐 External Entities

### E1: TheMealDB API
**Purpose:** Free recipe database  
**Endpoints Used:**
- `/random.php` - Get random meals
- `/filter.php?c={category}` - Filter by category
- `/lookup.php?i={id}` - Get meal details
- `/search.php?s={query}` - Search by name

**Data Flows:**
- IN: Category, search query, meal ID
- OUT: Recipe data (JSON)

---

### E2: Spoonacular API
**Purpose:** Recipe intelligence and ingredient matching  
**Endpoints Used:**
- `/recipes/findByIngredients` - Find recipes by ingredients
- `/recipes/{id}/information` - Get detailed recipe info

**Data Flows:**
- IN: Ingredient list, dietary filters, recipe ID
- OUT: Recipe matches with nutrition data

---

### E3: TensorFlow.js (MobileNet)
**Purpose:** Client-side food image recognition  
**Model:** MobileNet v2 (pre-trained)  
**Process:**
- Loads model in browser
- Classifies food images
- Returns top predictions with confidence scores

**Data Flows:**
- IN: Image file/blob
- OUT: Array of predictions `[{className, probability}]`

---

### E4: USDA FoodData Central API
**Purpose:** Comprehensive nutrition database  
**Endpoints Used:**
- `/v1/foods/search` - Search foods by name
- `/v1/food/{fdcId}` - Get detailed nutrition data

**Data Flows:**
- IN: Food name, FDC ID
- OUT: Nutrition facts (calories, macros, micronutrients)

---

## 📊 Complete Data Flow Summary

### User Journey 1: Registration & Login
```
Cook User
  ├─[Email + Password]─> [1.1 Register]
  │                         ├─> Firebase Auth (Create Account)
  │                         └─> Firestore/users (Store Profile)
  ├─[Success]─< [1.1]
  │
  ├─[Login Credentials]─> [1.2 Login]
  │                         ├─> Firebase Auth (Verify)
  │                         └─> Firestore/users (Fetch Profile)
  └─[Auth Token + Profile]─< [1.2]
```

### User Journey 2: Create & Share Recipe
```
Cook User
  ├─[Recipe Data]─> [2.1 Create Recipe]
  │                   └─> Firestore/recipes (Store)
  ├─[Recipe ID]─< [2.1]
  │
  ├─[Recipe ID]─> [6.1 Generate QR]
  │                 └─> Generate QR Code SVG
  ├─[QR Image]─< [6.1]
  │
Guest User
  ├─[QR Scan]─> [6.2 View Recipe]
  │               ├─> Firestore/recipes (Fetch)
  │               └─> Render Public View
  ├─[Recipe Details]─< [6.2]
  │
  ├─[Rating + Comment]─> [7.2 Submit Feedback]
  │                        ├─> Firestore/feedback (Store)
  │                        └─> Update Recipe Rating
  └─[Confirmation]─< [7.2]
```

### User Journey 3: Food Scan to Recipe
```
Cook User
  ├─[Food Image]─> [4.1 Scan Food]
  │                  ├─> TensorFlow.js (Classify)
  │                  ├─[Ingredients]─> Spoonacular API
  │                  └─[Recipes]─< Spoonacular API
  ├─[Recipe Suggestions]─< [4.1]
  │
  ├─[Select Recipe]─> [2.2 View Recipe]
  │                     └─> Firestore/recipes (Fetch)
  └─[Full Recipe]─< [2.2]
```

### User Journey 4: Menu Generation
```
Cook User
  ├─[Preferences: Vegan, 1500 cal]─> [3.1 Generate Menu]
  │                                    ├─> TheMealDB API (Search Vegan)
  │                                    ├─> Filter by Calories
  │                                    └─> Create 7-Day Plan
  ├─[Weekly Menu]─< [3.1]
  │
  ├─[Recipe from Menu]─> [5.2 Get Nutrition]
  │                        ├─> Fetch Recipe Ingredients
  │                        ├─> USDA API (Each Ingredient)
  │                        └─> Calculate Totals
  └─[Nutrition Facts]─< [5.2]
```

### User Journey 5: Nutrition Lookup
```
Cook User
  ├─[Ingredient: "Chicken Breast"]─> [5.1 Get Nutrition]
  │                                     ├─> USDA API (Search)
  │                                     └─> Parse Response
  └─[Nutrition Data]─< [5.1]
     {
       calories: 165,
       protein: 31g,
       carbs: 0g,
       fat: 3.6g,
       vitamins: {...}
     }
```

### User Journey 6: Admin Support & Moderation
```
Cook User
  ├─[Support Ticket: "Bug Report"]─> [7.1 Submit Ticket]
  │                                     └─> Firestore/tickets (Store)
  ├─[Ticket ID: #T123]─< [7.1]
  │
Admin User
  ├─[View Tickets]─> [9.1 Get Ticket Queue]
  │                    └─> Firestore/tickets (Query open tickets)
  ├─[Ticket List]─< [9.1]
  │
  ├─[Ticket #T123 + Response]─> [9.2 Respond to Ticket]
  │                               ├─> Firestore/tickets (Add response)
  │                               ├─> Firestore/admin_logs (Log action)
  │                               └─> Update ticket status
  ├─[Ticket Updated]─< [9.2]
  │
Cook User
  ├─[View My Tickets]─> [7.3 Get User Tickets]
  │                       └─> Firestore/tickets (Fetch)
  └─[Ticket #T123 with Admin Response]─< [7.3]
```

### User Journey 7: Admin Content Moderation
```
Guest User
  ├─[Report Recipe: Inappropriate Content]─> [9.3 Flag Content]
  │                                             └─> Firestore/recipes (Add flag)
  │
Admin User
  ├─[View Flagged Content]─> [9.4 Get Flagged Recipes]
  │                            └─> Firestore/recipes (Query flagged)
  ├─[Flagged Recipe List]─< [9.4]
  │
  ├─[Recipe ID + Delete Action]─> [9.3 Moderate Content]
  │                                 ├─> Verify flagged recipe
  │                                 ├─> Firestore/recipes (Delete)
  │                                 ├─> Firestore/admin_logs (Log deletion)
  │                                 └─> Notify recipe owner
  └─[Moderation Complete]─< [9.3]
```

---

## 📋 Process 9.0: Admin Management & Moderation

### Input Flows
```
Admin User ──[Admin Login]──> [9.1 Admin Authentication]
Admin User ──[Ticket Query]──> [9.2 View Ticket Queue]
Admin User ──[Ticket Response]──> [9.3 Respond to Ticket]
Admin User ──[User Query]──> [9.4 Manage Users]
Admin User ──[Recipe Flag]──> [9.5 Moderate Content]
Admin User ──[Analytics Request]──> [9.6 View Analytics]
```

### Process Steps
```
[9.1] Admin Authentication
  ├─> Verify admin role (Firebase Auth custom claims)
  ├─> Check admin permissions level
  ├─> Create admin session
  └─> Return admin dashboard access

[9.2] View Ticket Queue
  ├─> Query Firestore/tickets (all tickets)
  ├─> Filter by status (open, in-progress, resolved)
  ├─> Sort by priority and date
  └─> Return ticket list with user details

[9.3] Respond to Ticket
  ├─> Fetch ticket by ID
  ├─> Add admin response
  ├─> Update ticket status
  ├─> Log admin action (D6: admin_logs)
  ├─> Notify user (email/in-app)
  └─> Return updated ticket

[9.4] Manage Users
  ├─> Query all users (D2: users)
  ├─> View user activity and recipes
  ├─> Suspend/Unsuspend user account
  ├─> Delete user account
  ├─> Update user permissions
  ├─> Log admin action
  └─> Return user list/status

[9.5] Moderate Content
  ├─> Query flagged recipes (D3: recipes where flagged = true)
  ├─> Review recipe content
  ├─> Approve or Delete recipe
  ├─> Log moderation action
  ├─> Notify recipe owner
  └─> Return moderation status

[9.6] View Analytics
  ├─> Query aggregate data (users, recipes, tickets)
  ├─> Calculate statistics (active users, popular recipes)
  ├─> Generate reports (API usage, system health)
  ├─> Return dashboard data
  └─> Display charts and metrics
```

### Output Flows
```
[9.1 Auth] ──[Admin Token + Dashboard]──> Admin User
[9.2 Queue] ──[Ticket List]──> Admin User
[9.3 Respond] ──[Updated Ticket]──> Admin User + Cook User (notification)
[9.4 Users] ──[User List + Actions]──> Admin User
[9.5 Moderate] ──[Moderation Status]──> Admin User + Recipe Owner
[9.6 Analytics] ──[Reports + Charts]──> Admin User
```

### Data Stores Used
- **D2: Firestore/users** (User management)
- **D3: Firestore/recipes** (Content moderation)
- **D4: Firestore/feedback** (Review analytics)
- **D5: Firestore/tickets** (Support management)
- **D6: Firestore/admin_logs** (Audit trail)

---

### 🔐 Level 2.9: Admin Management & Moderation (Process 9.0 Exploded)

```
Admin User
    │
    ├─[Admin Login]──[Ticket Query]──[User Management]──[Content Flags]─┐
    │                                                                    │
    ↓                                                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                   PROCESS 9.0 - EXPLODED VIEW                           │
│                                                                         │
│  [9.1]        [9.2]         [9.3]         [9.4]         [9.5]          │
│  Admin      Ticket      Respond to     Manage       Moderate           │
│  Auth       Queue       Ticket         Users        Content            │
│    │          │            │             │            │                │
│    ├─> Verify ├─> Query    ├─> Add      ├─> Query   ├─> Query         │
│    │   Role   │   All      │   Response │   Users   │   Flagged       │
│    │          │   Tickets  │            │           │   Recipes       │
│    ↓          ↓            ↓            ↓           ↓                  │
│  D1: Auth  D5: tickets  D5: tickets  D2: users  D3: recipes ═══       │
│    │          │            │            │           │                  │
│    ├─> Check  ├─> Filter   ├─> Update  ├─> Update ├─> Review          │
│    │   Claims │   Status   │   Status  │   Status │   Content         │
│    │          │            │           │          │                   │
│    │          │            ↓           ↓          ↓                   │
│    │          │        D6: admin_logs D6: logs  D6: logs ═══          │
│    │          │            │           │          │                   │
│    │          │            └─> Log     └─> Log   └─> Log              │
│    │          │                Action      Action    Action           │
│    │          │                                                        │
│    │          │         [9.6] View Analytics                          │
│    │          │                │                                      │
│    │          │                ├─> Aggregate Data                     │
│    │          │                │   (All Collections)                  │
│    │          │                │                                      │
│    │          │                ↓                                      │
│    │          │            Generate Reports                           │
│    │          │                                                        │
└────┼──────────┼────────────────┼────────────────────────────────────────┘
     │          │                │              │           │
     ↓          ↓                ↓              ↓           ↓
[Dashboard] [Tickets]    [Ticket Updated] [User Status] [Moderation]
     │          │                │              │           │
     ↓          ↓                ↓              ↓           ↓
Admin User  Admin User      Admin + Cook    Admin User  Admin User
```

**Sub-Process Details:**

```
[9.1] Admin Authentication
    Input:  Admin email, Password
    Steps:  
        9.1.1 → Verify credentials with Firebase Auth
        9.1.2 → Check custom claims (role: "admin")
        9.1.3 → Verify admin permission level
        9.1.4 → Create admin session token
        9.1.5 → Return admin dashboard access
    Output: Admin token + Dashboard view
    
[9.2] View Ticket Queue
    Input:  Filter options (status, priority, date range)
    Steps:  
        9.2.1 → Query all tickets from Firestore
        9.2.2 → Filter by status (open, in-progress, resolved)
        9.2.3 → Sort by priority and creation date
        9.2.4 → Join with user data for ticket creator info
        9.2.5 → Return paginated ticket list
    Output: Ticket queue with user details
    
[9.3] Respond to Ticket
    Input:  Ticket ID, Response message, New status
    Steps:  
        9.3.1 → Fetch ticket from Firestore
        9.3.2 → Add admin response to responses array
        9.3.3 → Update ticket status and assignedTo
        9.3.4 → Update timestamp
        9.3.5 → Log action to admin_logs
        9.3.6 → Send notification to ticket creator
    Output: Updated ticket + notification sent
    
[9.4] Manage Users
    Input:  User ID, Action (suspend/delete/update)
    Steps:  
        9.4.1 → Query user from Firestore/users
        9.4.2 → Perform action:
                - Suspend: Set status to "suspended"
                - Delete: Remove user + recipes + feedback
                - Update: Modify user fields
        9.4.3 → Update Firebase Auth account
        9.4.4 → Log action to admin_logs
        9.4.5 → Send notification to user
    Output: User status updated
    
[9.5] Moderate Content
    Input:  Recipe ID, Moderation action (approve/delete)
    Steps:  
        9.5.1 → Fetch flagged recipe from Firestore
        9.5.2 → Review recipe content
        9.5.3 → Perform action:
                - Approve: Remove flag
                - Delete: Remove recipe from Firestore
        9.5.4 → Log moderation action
        9.5.5 → Notify recipe owner
    Output: Moderation status
    
[9.6] View Analytics
    Input:  Date range, Report type
    Steps:  
        9.6.1 → Query aggregate data from all collections
        9.6.2 → Calculate metrics:
                - Total users, active users
                - Total recipes, popular recipes
                - Support ticket resolution time
                - API usage statistics
        9.6.3 → Generate charts and reports
        9.6.4 → Return dashboard data
    Output: Analytics dashboard
```

---

## 🎨 DFD Legend

### Symbols Used
- `[ ]` = Process/Transformation
- `──>` = Data Flow (Direction)
- `<──` = Data Return
- `{ }` = Data/Document
- `D#:` = Data Store
- `E#:` = External Entity
- `├─>` = Branching Flow
- `└─>` = Final Branch

### Process Numbering
- **1.0** = Major process
- **1.1** = Sub-process
- **1.1.1** = Detailed step

---

## 📝 Notes

### Security Considerations
1. **Authentication:** All user operations require valid Firebase token
2. **Authorization:** Recipe modifications verify user ownership
3. **Data Privacy:** User emails are hashed, sensitive data encrypted
4. **API Keys:** External API keys stored in environment variables
5. **Rate Limiting:** Implemented for external API calls

### Performance Optimizations
1. **Caching:** Recipe data cached in browser storage
2. **Lazy Loading:** Images loaded on demand
3. **Batch Queries:** Multiple recipes fetched in single Firestore query
4. **Debouncing:** Search queries debounced (300ms)
5. **Client-Side AI:** TensorFlow.js runs in browser (no server calls)

### Error Handling
- All processes include try/catch blocks
- Failed API calls fallback to cached data
- User-friendly error messages displayed
- Errors logged to console for debugging

---

## 🚀 Future Enhancements

1. **Real-time Updates:** Use Firestore listeners for live recipe updates
2. **Collaborative Cooking:** Share recipes with multiple users
3. **Shopping List Generation:** Auto-create grocery lists from menu plans
4. **Meal Prep Scheduling:** Calendar integration for meal planning
5. **Advanced Analytics:** Track nutrition trends over time

---

**Document Version:** 1.0  
**Last Updated:** February 19, 2026  
**Created By:** Chefio Development Team

