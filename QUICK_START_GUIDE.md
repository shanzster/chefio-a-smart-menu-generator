# Chefio User Guide

## Welcome to Chefio

Chefio is a smart menu generator and recipe management system that helps you discover recipes, manage ingredients, generate QR codes for recipe sharing, and collect feedback. This guide will walk you through all the features and show you how to make the most of the application.

---

## Getting Started

### Creating Your Account

1. Navigate to the registration page
2. Enter your email address
3. Create a strong password (minimum 6 characters)
4. Enter your full name
5. Provide your birthdate
6. Click "Create Account"
7. Verify your email address if required

### Logging In

1. Navigate to the login page
2. Enter your registered email address
3. Enter your password
4. Click "Sign In"

### Password Recovery

1. Click "Forgot Password" on the login page
2. Enter your registered email address
3. Check your email for a password reset link
4. Follow the link to create a new password

---

## Using Chefio Features

### Menu Generator

The Menu Generator helps you discover recipes based on available ingredients and dietary preferences.

**How to Use:**

1. Navigate to Menu Generator from the main dashboard
2. Select your available ingredients from the list or add custom ingredients
3. Choose dietary preferences (vegetarian, vegan, gluten-free, etc.)
4. Set nutritional filters (calories, protein, carbs, fat)
5. Specify the number of recipes you want to generate
6. Click "Generate Menu"
7. Browse the generated recipes
8. Save recipes you like to your collection

**Tips:**

- Add more ingredients for better recipe matches
- Use nutritional filters to meet specific dietary goals
- The system uses Spoonacular API as primary source with Edamam as fallback

### Recipe Finder

Search for recipes by name and check ingredient availability.

**How to Use:**

1. Navigate to Recipe Finder
2. Enter a recipe name in the search bar (e.g., "Chicken Curry", "Pasta")
3. Click "Search" or press Enter
4. View search results with ingredient match percentages
5. Click on a recipe to view full details
6. Check which ingredients you have and which are missing
7. Save recipes to your collection

**Managing Your Ingredients:**

1. Add ingredients you have available
2. Remove ingredients by clicking on them
3. The system automatically calculates ingredient match percentages
4. Recipes show green indicators for available ingredients
5. Missing ingredients are highlighted in red

### Browse Recipes

Discover recipes by category from TheMealDB database.

**How to Use:**

1. Navigate to Browse Recipes
2. Select a category (Breakfast, Lunch, Dinner, Snacks, Desserts)
3. Browse the displayed recipes
4. Click on a recipe to view details
5. Save recipes you like to your collection

**Features:**

- Recipes are cached locally to reduce API calls
- Click "Refresh" to load new recipes
- Each category shows 3 recipes by default
- Full recipe details include ingredients, instructions, and nutrition

### My Recipes

Manage your saved recipe collection.

**How to Use:**

1. Navigate to My Recipes
2. View all your saved recipes
3. Use the search bar to find specific recipes
4. Filter by category (All, Breakfast, Lunch, Dinner, Snacks, Desserts)
5. Apply additional filters (difficulty, prep time)
6. Click on a recipe to view full details
7. Delete recipes you no longer need

**Creating Custom Recipes:**

1. Click the "+" button
2. Fill in recipe details:
   - Recipe name
   - Description
   - Category
   - Prep time and servings
   - Difficulty level
   - Ingredients list
   - Cooking instructions
   - Nutritional information
3. Upload a recipe image (optional)
4. Click "Create Recipe"

### Portion Calculator

Scale recipe portions and calculate adjusted nutritional values.

**How to Use:**

1. Navigate to Portion Calculator
2. Select a recipe from your saved collection
3. Set the original serving size
4. Adjust the desired serving size
5. View scaled ingredient amounts
6. View adjusted nutritional values per serving
7. Download scaled recipe as PNG image
8. Generate shopping list as PNG image

**Features:**

- Automatic ingredient scaling based on serving ratio
- Real-time nutritional value calculations
- Visual comparison of original vs scaled amounts
- Export options for easy sharing and printing

### Nutrition Analysis

Analyze nutritional content of ingredients and meals.

**How to Use:**

1. Navigate to Nutrition Analysis
2. Enter ingredient names or food items
3. Specify quantities
4. Click "Analyze"
5. View detailed nutritional breakdown
6. Compare multiple ingredients
7. Track daily nutritional intake

**Nutritional Information Includes:**

- Calories
- Protein
- Carbohydrates
- Fats
- Vitamins and minerals
- Serving size information

### QR Code Generator

Create QR codes for recipe sharing and feedback collection.

**How to Use:**

1. Navigate to QR Share
2. Select a recipe from your saved collection
3. Click "Generate QR Code"
4. Preview the generated QR code
5. Copy the shareable link
6. Download the QR code as PNG image
7. Share the QR code or link with others

**QR Code Features:**

- Branded QR codes with recipe information
- Unique feedback collection links
- Scan tracking
- Feedback count monitoring

### Feedback System

Collect and manage feedback on shared recipes.

**Viewing Feedback:**

1. Navigate to Feedback Dashboard
2. View all your shared recipes
3. See feedback count and average ratings
4. Click on a recipe to view detailed feedback
5. Read comments and ratings from users
6. Track scan statistics

**Leaving Feedback (as a guest):**

1. Scan a QR code or visit a feedback link
2. View the recipe details
3. Rate the recipe (1-5 stars)
4. Provide category ratings (taste, presentation, creativity, portion size)
5. Write a comment (optional)
6. Submit feedback

### Support Tickets

Get help and report issues through the support system.

**Creating a Ticket:**

1. Navigate to Support
2. Click "Create New Ticket"
3. Select a category (Technical Issue, Feature Request, General Inquiry, Bug Report)
4. Choose priority level
5. Enter a descriptive subject
6. Provide detailed description
7. Submit the ticket

**Managing Your Tickets:**

1. View all your submitted tickets
2. Filter by status (open, in-progress, resolved, closed)
3. Click on a ticket to view details
4. Read admin responses
5. Track ticket resolution progress

---

## Administrator Guide

### Admin Login

Admin users have access to additional management features.

**Accessing Admin Panel:**

1. Navigate to /admin/login
2. Enter admin credentials
3. Access the admin dashboard

### Admin Dashboard

Central hub for system management and monitoring.

**Dashboard Overview:**

- Total users count
- Total recipes count
- Open tickets count
- Total feedback count
- All tickets count
- System status indicators

**Quick Actions:**

- Manage Users
- View Tickets
- View Feedback
- API Configuration

### User Management

Manage user accounts and permissions.

**Features:**

- View all registered users
- Search users by name or email
- Filter by role (user, admin)
- Filter by status (active, suspended)
- Suspend or unsuspend user accounts
- Delete user accounts
- Promote users to admin
- Send password reset emails
- Create new user accounts
- Edit user information

**User Actions:**

1. Click on a user to view details
2. Use the actions menu for:
   - Edit user information
   - Make admin (for regular users)
   - Suspend account
   - Send password reset
   - Delete account

### Ticket Management

Handle user support requests.

**Features:**

- View all support tickets
- Filter by status (all, open, in-progress, resolved, closed)
- Search tickets by subject or description
- Respond to tickets
- Update ticket status
- Assign tickets to admins

**Responding to Tickets:**

1. Click on a ticket to view details
2. Read the user's issue description
3. Write a response message
4. Update ticket status
5. Submit response

### Feedback Management

Monitor and moderate user feedback.

**Features:**

- View all feedback from QR codes and recipes
- Search feedback by comment, recipe, or user
- Filter by rating (1-5 stars)
- Filter by profanity (all, clean, profane)
- Profanity detection and highlighting
- Delete inappropriate feedback
- Bulk delete multiple feedback items
- View feedback statistics

**Moderating Feedback:**

1. Review feedback list
2. Identify inappropriate content (highlighted in red)
3. Click on feedback to view details
4. View profanity warnings and detected words
5. Delete individual feedback items
6. Use bulk selection for multiple deletions

**Profanity Filter:**

- Automatic detection of inappropriate language
- Severity levels (mild, moderate, severe)
- Highlighted profane words in feedback
- Filter to show only profane or clean feedback

### Recipe Management

Manage system-wide recipes.

**Features:**

- View all recipes in the system
- Search recipes by name
- Filter by category
- Create new recipes
- Edit existing recipes
- Delete recipes
- Flag inappropriate recipes

### Content Moderation

Review and moderate flagged content.

**Features:**

- View flagged recipes
- Review flag reasons
- Approve or delete flagged content
- Track moderation history

### Activity Logs

Monitor admin actions and system events.

**Features:**

- View all admin actions
- Filter by action type
- Search by admin name
- Track user management actions
- Monitor ticket responses
- Review feedback deletions
- Export logs for auditing

---

## Using Chefio Features

### How to Save a Recipe

1. Find a recipe using Menu Generator, Recipe Finder, or Browse Recipes
2. Click on the recipe to view details
3. Click "Save Recipe" or bookmark icon
4. Recipe is added to My Recipes

### How to Share a Recipe via QR Code

1. Save the recipe to your collection
2. Navigate to QR Share
3. Select the recipe
4. Generate QR code
5. Download or share the link
6. Recipients can scan to view recipe and leave feedback

### How to Scale a Recipe

1. Navigate to Portion Calculator
2. Select your recipe
3. Adjust serving size
4. View scaled ingredients and nutrition
5. Download or save the scaled version

### How to Create a Custom Recipe

1. Go to My Recipes
2. Click the "+" button
3. Fill in all recipe details
4. Add ingredients and instructions
5. Upload an image
6. Save the recipe

### How to Check Nutritional Information

1. Navigate to Nutrition Analysis
2. Enter ingredients or food items
3. Specify quantities
4. View detailed nutritional breakdown
5. Compare with dietary goals

### How to Report an Issue

1. Navigate to Support
2. Create a new ticket
3. Select appropriate category
4. Describe the issue in detail
5. Submit and wait for admin response

---

## Frequently Asked Questions

### How do I reset my password?

1. Click "Forgot Password" on the login page
2. Enter your registered email address
3. Check your email for a password reset link
4. Follow the link to create a new password

### Why are recipes not loading?

- Check your internet connection
- Try refreshing the page
- Clear your browser cache
- Wait a few moments and try again

### Why can't I generate a QR code?

- Make sure the recipe is saved to your collection first
- Check your internet connection
- Try refreshing the page
- Try a different browser

### Why won't my feedback submit?

- Make sure all required fields are filled
- Ensure you have selected a rating
- Check your internet connection
- Try refreshing the page

### Why can't I upload images?

- Check that your file is under 10MB
- Make sure the file is in JPG, PNG, or GIF format
- Check your internet connection
- Try a different image

### Why isn't search working?

- Check your spelling
- Try different keywords
- Clear any active filters
- Refresh the page

### How do I access the admin panel?

- You must have an admin role assigned to your account
- Navigate to /admin/login
- Enter your admin credentials
- Contact the system administrator if you need admin access

---

## Tips and Best Practices

### For Better Recipe Results

- Keep your ingredient list updated regularly
- Add as many ingredients as you have available
- Use the dietary filters to match your preferences
- Save recipes you like for quick access later

### For Recipe Sharing

- Generate QR codes for easy sharing
- Place QR codes on printed recipe cards
- Share links via email or messaging apps
- Check feedback regularly to see what people think

### For Managing Your Collection

- Organize recipes by category
- Use the search function to find recipes quickly
- Delete recipes you no longer need
- Create custom recipes for family favorites

### For Getting Help

- Use the support ticket system for issues
- Provide detailed descriptions of problems
- Check this guide for common questions
- Be patient while waiting for admin responses

---

## Need More Help?

If you cannot find the answer to your question in this guide:

1. Create a support ticket within the application
2. Select the appropriate category for your issue
3. Provide as much detail as possible
4. Wait for an admin response

The support team will respond to your ticket as soon as possible.

---

## Conclusion

Chefio is designed to make recipe discovery, management, and sharing simple and enjoyable. Whether you're looking for new meal ideas, managing your recipe collection, or sharing your culinary creations with others, Chefio has the tools you need.

Explore the features, experiment with different recipes, and make the most of your cooking experience. Happy cooking!
