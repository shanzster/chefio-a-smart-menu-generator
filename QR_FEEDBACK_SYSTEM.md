# 🎯 QR Code Feedback System - Cook-Off Ready

## 📋 Overview

A complete QR code system for cook-offs and food presentations that allows:
1. Generate QR codes for recipes/dishes
2. Scan QR to open feedback form
3. Rate and review the food
4. View feedback results

Perfect for cooking competitions, food festivals, and culinary presentations!

## 🎨 System Components

### 1. QR Generator Page
**Location:** `/cook/qr-generator`

**Features:**
- Select from saved recipes
- Generate unique QR code
- Download QR as PNG
- Share QR code
- Print-ready format

### 2. Feedback Page
**Location:** `/feedback/:dishId`

**Features:**
- Beautiful presentation card
- Star rating (1-5 stars)
- Category ratings:
  - Taste
  - Presentation
  - Creativity
  - Portion Size
- Text feedback
- Submit anonymously or with name
- Thank you confirmation

### 3. Results Dashboard
**Location:** `/cook/feedback-results`

**Features:**
- View all feedback
- Average ratings
- Individual reviews
- Export as PDF
- Filter by dish

## 🎯 Use Cases

### Cook-Off Competition
```
1. Chef prepares dish
2. Generate QR code for dish
3. Print QR code on presentation card
4. Place next to dish
5. Judges scan QR
6. Submit ratings and feedback
7. Chef views results
```

### Food Festival
```
1. Vendor creates QR for each dish
2. Display QR at booth
3. Customers scan and rate
4. Collect feedback
5. Improve based on reviews
```

### Culinary School
```
1. Student presents dish
2. QR code on presentation board
3. Instructors and peers scan
4. Rate and provide feedback
5. Student reviews feedback
```

## 📱 QR Code Design

### Standard QR (Recipe Share)
```
┌─────────────────────────┐
│  ▓▓▓▓▓▓▓  ▓  ▓▓▓▓▓▓▓  │
│  ▓     ▓  ▓  ▓     ▓  │
│  ▓ ▓▓▓ ▓  ▓  ▓ ▓▓▓ ▓  │
│  ▓ ▓▓▓ ▓  ▓  ▓ ▓▓▓ ▓  │
│  ▓ ▓▓▓ ▓  ▓  ▓ ▓▓▓ ▓  │
│  ▓     ▓  ▓  ▓     ▓  │
│  ▓▓▓▓▓▓▓  ▓  ▓▓▓▓▓▓▓  │
│                         │
│     [Dish Icon]         │
│                         │
│  ▓▓▓▓▓▓▓  ▓  ▓▓▓▓▓▓▓  │
│  ▓     ▓  ▓  ▓     ▓  │
│  ▓ ▓▓▓ ▓  ▓  ▓ ▓▓▓ ▓  │
│  ▓ ▓▓▓ ▓  ▓  ▓ ▓▓▓ ▓  │
│  ▓ ▓▓▓ ▓  ▓  ▓ ▓▓▓ ▓  │
│  ▓     ▓  ▓  ▓     ▓  │
│  ▓▓▓▓▓▓▓  ▓  ▓▓▓▓▓▓▓  │
└─────────────────────────┘

    Chicken Adobo
    Scan to Rate & Review
```

### Cook-Off Presentation Card
```
┌─────────────────────────────────┐
│                                 │
│  🍳 COOK-OFF ENTRY #12         │
│                                 │
│  ┌─────────────────────┐       │
│  │                     │       │
│  │    [QR CODE]        │       │
│  │                     │       │
│  └─────────────────────┘       │
│                                 │
│  Chicken Adobo                  │
│  by Chef Maria Santos           │
│                                 │
│  Scan to Rate This Dish         │
│  ⭐⭐⭐⭐⭐                      │
│                                 │
└─────────────────────────────────┘
```

## 🎨 Feedback Form Design

### Mobile View
```
┌─────────────────────────┐
│  ← Back                 │
├─────────────────────────┤
│                         │
│  [Dish Image]           │
│                         │
│  Chicken Adobo          │
│  by Chef Maria Santos   │
│                         │
├─────────────────────────┤
│  Rate This Dish         │
│  ⭐⭐⭐⭐⭐            │
│                         │
│  Taste                  │
│  ⭐⭐⭐⭐⭐            │
│                         │
│  Presentation           │
│  ⭐⭐⭐⭐⭐            │
│                         │
│  Creativity             │
│  ⭐⭐⭐⭐⭐            │
│                         │
│  Portion Size           │
│  ⭐⭐⭐⭐⭐            │
│                         │
├─────────────────────────┤
│  Your Feedback          │
│  ┌───────────────────┐ │
│  │                   │ │
│  │ [Text area]       │ │
│  │                   │ │
│  └───────────────────┘ │
│                         │
│  Your Name (Optional)   │
│  ┌───────────────────┐ │
│  │                   │ │
│  └───────────────────┘ │
│                         │
│  [Submit Feedback]      │
│                         │
└─────────────────────────┘
```

## 📊 Rating System

### Overall Rating
- 5 stars = Excellent
- 4 stars = Very Good
- 3 stars = Good
- 2 stars = Fair
- 1 star = Needs Improvement

### Category Ratings
1. **Taste** (Flavor, seasoning, balance)
2. **Presentation** (Visual appeal, plating)
3. **Creativity** (Originality, innovation)
4. **Portion Size** (Appropriate amount)

### Feedback Text
- Optional detailed comments
- Max 500 characters
- Constructive criticism encouraged

## 🔗 URL Structure

### QR Code URLs
```
Production:
https://chefio.app/feedback/dish-abc123

Development:
http://localhost:5174/feedback/dish-abc123

Parameters:
- dishId: Unique dish identifier
- Optional: judgeId, eventId
```

### Example URLs
```
Cook-Off Entry:
https://chefio.app/feedback/cookoff-2024-entry-12

Food Festival Booth:
https://chefio.app/feedback/festival-vendor-5-dish-3

Student Presentation:
https://chefio.app/feedback/culinary-school-student-25
```

## 🎯 Implementation Steps

### Step 1: Generate QR Code
```javascript
1. Go to QR Generator page
2. Select recipe/dish
3. Add dish details:
   - Name
   - Chef name
   - Description
   - Image (optional)
4. Click "Generate QR Code"
5. Download as PNG
```

### Step 2: Print Presentation Card
```
1. Download QR code PNG
2. Create presentation card:
   - Add QR code
   - Add dish name
   - Add chef name
   - Add "Scan to Rate" text
3. Print on cardstock
4. Place next to dish
```

### Step 3: Collect Feedback
```
1. Judges/customers scan QR
2. Opens feedback form
3. Rate dish (stars)
4. Rate categories
5. Add comments
6. Submit feedback
```

### Step 4: View Results
```
1. Go to Feedback Results page
2. Select dish
3. View:
   - Average rating
   - Category breakdowns
   - Individual reviews
   - Comments
4. Export as PDF
```

## 📱 Mobile Experience

### Scanning Process
```
1. Open camera app
2. Point at QR code
3. Tap notification
4. Opens feedback form
5. Rate and review
6. Submit
7. See thank you message
```

### Offline Support
- Form saves locally if offline
- Submits when connection restored
- Shows pending status

## 🎨 Design Specifications

### QR Code PNG
- **Size**: 512x512px (high resolution)
- **Format**: PNG with transparency
- **Colors**: Black QR on white background
- **Logo**: Chefio icon in center (optional)
- **Border**: 40px padding

### Presentation Card
- **Size**: 5x7 inches (standard card)
- **Orientation**: Portrait
- **QR Size**: 3x3 inches
- **Font**: Bold for dish name, regular for details
- **Colors**: Match event branding

### Feedback Form
- **Mobile-first**: Optimized for phones
- **Touch-friendly**: Large tap targets
- **Accessible**: High contrast, readable fonts
- **Fast**: Loads in <2 seconds

## 📊 Data Structure

### Dish Object
```javascript
{
  id: "dish-abc123",
  name: "Chicken Adobo",
  chefName: "Chef Maria Santos",
  description: "Filipino braised chicken...",
  image: "https://...",
  category: "Main Course",
  event: "Cook-Off 2024",
  createdAt: "2024-02-22T10:00:00Z"
}
```

### Feedback Object
```javascript
{
  id: "feedback-xyz789",
  dishId: "dish-abc123",
  ratings: {
    overall: 5,
    taste: 5,
    presentation: 4,
    creativity: 5,
    portionSize: 4
  },
  comment: "Absolutely delicious!",
  reviewerName: "John Doe" // optional
  submittedAt: "2024-02-22T11:30:00Z",
  isAnonymous: false
}
```

## 🎯 Features Checklist

### QR Generator
- [ ] Load saved recipes
- [ ] Add custom dish details
- [ ] Generate unique QR code
- [ ] Download as PNG
- [ ] Print-ready format
- [ ] Share via link
- [ ] Batch generate (multiple dishes)

### Feedback Form
- [ ] Display dish details
- [ ] Star rating input
- [ ] Category ratings
- [ ] Text feedback
- [ ] Optional name field
- [ ] Submit button
- [ ] Thank you confirmation
- [ ] Validation

### Results Dashboard
- [ ] List all dishes
- [ ] Average ratings
- [ ] Individual reviews
- [ ] Filter by dish
- [ ] Export as PDF
- [ ] Charts/graphs
- [ ] Print summary

## 🎉 Cook-Off Workflow

### Before Event
1. Create dishes in system
2. Generate QR codes
3. Print presentation cards
4. Set up display

### During Event
1. Place cards next to dishes
2. Judges scan and rate
3. Real-time feedback collection
4. Monitor submissions

### After Event
1. View all feedback
2. Calculate winners
3. Export results
4. Share with participants

## 📈 Analytics

### Metrics Tracked
- Total scans
- Submission rate
- Average ratings
- Category breakdowns
- Popular dishes
- Peak rating times

### Reports Available
- Overall summary
- Per-dish breakdown
- Judge/reviewer stats
- Time-based analysis
- Comparison charts

## 🎨 Customization Options

### Branding
- Custom colors
- Event logo
- Custom text
- Themed designs

### Rating Categories
- Add custom categories
- Remove categories
- Reorder categories
- Custom labels

### Form Fields
- Required/optional fields
- Custom questions
- Multiple choice
- Checkboxes

## 🚀 Next Steps

1. **Implement QR Generator** with real recipes
2. **Create Feedback Page** with rating system
3. **Build Results Dashboard** for viewing feedback
4. **Add Print Templates** for presentation cards
5. **Test End-to-End** workflow

---

**Ready for cook-offs, food festivals, and culinary presentations!**
