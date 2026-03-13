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

### Resetting Your Password

1. Click "Forgot Password" on the login page
2. Enter your registered email address
3. Check your email for a password reset link
4. Follow the link to create a new password

---

## Feature Guides

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
- The system automatically switches between recipe sources for best results

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

1. Add ingredients you have available using the input field
2. Remove ingredients by clicking on them
3. The system automatically calculates ingredient match percentages
4. Recipes show which ingredients you have available
5. Missing ingredients are clearly indicated

### Browse Recipes

Discover recipes by category from a curated database.

**How to Use:**

1. Navigate to Browse Recipes
2. Select a category (Breakfast, Lunch, Dinner, Snacks, Desserts)
3. Browse the displayed recipes
4. Click on a recipe to view details
5. Save recipes you like to your collection
6. Click "Refresh" to load new recipes in the category

**Features:**

- Recipes are cached to improve loading speed
- Each category shows multiple recipe options
- Full recipe details include ingredients, instructions, and nutrition
- Video tutorials available for many recipes

### My Recipes

Manage your saved recipe collection.

**Viewing Your Recipes:**

1. Navigate to My Recipes
2. View all your saved recipes in a grid layout
3. Use the search bar to find specific recipes
4. Filter by category using the category buttons
5. Apply additional filters for difficulty and prep time
6. Click on a recipe to view full details

**Creating Custom Recipes:**

1. Click the "+" button in My Recipes
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

**Managing Recipes:**

1. Click on any recipe to view details
2. Delete recipes you no longer need
3. View recipe source and external links
4. Watch video tutorials if available

**Using Filters:**

1. Click the filter button to open the filter panel
2. Select difficulty level (Easy, Medium, Hard)
3. Choose prep time range (under 15 min, 15-30 min, 30-60 min, over 60 min)
4. Click "Clear All" to reset filters
5. Combine filters with category and search for precise results

### Portion Calculator

Scale recipe portions and calculate adjusted nutritional values.

**How to Use:**

1. Navigate to Portion Calculator
2. Select a recipe from your saved collection
3. View the original serving size
4. Adjust the desired serving size using the plus/minus buttons
5. View the scale factor
6. See scaled ingredient amounts
7. View adjusted nutritional values per serving
8. Download scaled recipe as PNG image
9. Generate shopping list as PNG image

**Features:**

- Automatic ingredient scaling based on serving ratio
- Real-time nutritional value calculations
- Visual comparison of original vs scaled amounts
- Export options for easy sharing and printing
- Shopping list generation with checkboxes

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
5. Copy the shareable link using the copy button
6. Download the QR code as PNG image
7. Share the QR code or link with others

**QR Code Features:**

- Branded QR codes with recipe information
- Unique feedback collection links
- Automatic scan tracking
- Feedback count monitoring
- Links automatically adapt to your hosting domain

**Important Note:**

When you host the application on a production server, QR codes generated after deployment will automatically use your production URL. QR codes created during development will need to be regenerated.

### Feedback Dashboard

Collect and manage feedback on shared recipes.

**Viewing Feedback:**

1. Navigate to Feedback Dashboard
2. View all your shared recipes
3. See feedback count and average ratings for each recipe
4. Click on a recipe to view detailed feedback
5. Read comments and ratings from users
6. Track scan statistics for each QR code

**Understanding Feedback:**

- Overall rating displayed as stars
- Category ratings (taste, presentation, creativity, portion size)
- User comments and suggestions
- Timestamp of when feedback was submitted
- Total scans for each QR code

### Support System

Get help and report issues through the support ticket system.

**Creating a Ticket:**

1. Navigate to Support
2. Click "Create New Ticket"
3. Select a category:
   - Technical Issue
   - Feature Request
   - General Inquiry
   - Bug Report
4. Choose priority level (low, medium, high)
5. Enter a descriptive subject
6. Provide detailed description of your issue or request
7. Submit the ticket

**Managing Your Tickets:**

1. View all your submitted tickets
2. Filter by status (open, in-progress, resolved, closed)
3. Click on a ticket to view details
4. Read admin responses
5. Track ticket resolution progress

---

## Administrator Guide

### Accessing Admin Panel

Admin users have access to additional management features for system administration.

**How to Access:**

1. Navigate to /admin/login
2. Enter your admin credentials
3. Access the admin dashboard

Note: Only users with admin role can access the admin panel.

### Admin Dashboard

The admin dashboard provides an overview of system statistics and quick access to management tools.

**Dashboard Information:**

- Total users in the system
- Total recipes created
- Open support tickets
- Total feedback received
- All tickets count
- System status indicators

**Quick Actions:**

- Manage Users
- View Tickets
- View Feedback
- Configure API Settings

### User Management

Manage user accounts and permissions.

**Viewing Users:**

1. Navigate to User Management from admin dashboard
2. View list of all registered users
3. Search users by name or email
4. Filter by role (user, admin)
5. Filter by status (active, suspended)

**User Actions:**

1. Click the actions menu for any user
2. Available actions:
   - Edit user information
   - Make admin (promote regular users)
   - Suspend account
   - Send password reset email
   - Delete account

**Creating New Users:**

1. Click "Create User" button
2. Enter email address
3. Set temporary password
4. Enter display name
5. Select role (user or admin)
6. Submit to create account

**Editing User Information:**

1. Click "Edit" in user actions menu
2. Update email, display name, or role
3. Save changes

### Ticket Management

Handle user support requests and inquiries.

**Viewing Tickets:**

1. Navigate to Ticket Management
2. View all support tickets
3. Filter by status (all, open, in-progress, resolved, closed)
4. Search tickets by subject or description
5. Click on a ticket to view full details

**Responding to Tickets:**

1. Open a ticket to view details
2. Read the user's issue description
3. Write a response message in the text area
4. Update ticket status:
   - Open: New ticket, not yet addressed
   - In Progress: Currently being worked on
   - Resolved: Issue fixed, awaiting confirmation
   - Closed: Ticket completed
5. Click "Send Response"

**Best Practices:**

- Respond to tickets promptly
- Provide clear and helpful solutions
- Update status appropriately
- Follow up on resolved tickets
- Keep communication professional

### Feedback Management

Monitor and moderate user feedback on recipes.

**Viewing Feedback:**

1. Navigate to Feedback Management
2. View all feedback from QR codes and recipes
3. See statistics:
   - Total feedback count
   - Feedback with profanity
   - Average rating
   - Selected items count

**Filtering Feedback:**

1. Use search bar to find specific feedback
2. Filter by rating (1-5 stars)
3. Filter by content type:
   - All Content: Show everything
   - With Profanity: Show only inappropriate feedback
   - Clean Only: Show only appropriate feedback

**Reviewing Feedback:**

1. Click on any feedback item to view details
2. See full comment text
3. View profanity warnings if detected
4. Check user information
5. See recipe name and rating
6. View submission date and source

**Deleting Inappropriate Feedback:**

1. Identify feedback with profanity (highlighted in red)
2. Click on the feedback to view details
3. Review the profane words detected
4. Click "Delete" to remove the feedback
5. Confirm deletion

**Bulk Deleting Feedback:**

1. Select multiple feedback items using checkboxes
2. Click "Delete Selected" button
3. Review the number of items to be deleted
4. Confirm bulk deletion

**Profanity Detection:**

- System automatically detects inappropriate language
- Profane words are highlighted in feedback
- Severity levels indicated (mild, moderate, severe)
- Filter to quickly find problematic feedback

### Recipe Management

Manage all recipes in the system.

**Features:**

- View all recipes from all users
- Search recipes by name
- Filter by category
- Create new system recipes
- Edit existing recipes
- Delete recipes
- Flag inappropriate recipes

### Content Moderation

Review and moderate flagged content.

**How to Use:**

1. Navigate to Content Moderation
2. View all flagged recipes
3. Review flag reasons
4. Click on flagged content to review
5. Choose action:
   - Approve: Remove flag and keep content
   - Delete: Permanently remove content
6. Confirm your decision

### Activity Logs

Monitor admin actions and system events for auditing purposes.

**Viewing Logs:**

1. Navigate to Activity Logs
2. View chronological list of admin actions
3. See action types:
   - User management actions
   - Ticket responses
   - Feedback deletions
   - Recipe moderation
   - System changes
4. Filter by action type
5. Search by admin name
6. Review timestamps and details

**Log Information:**

- Admin who performed the action
- Action type and description
- Target (user, recipe, ticket, etc.)
- Timestamp
- Additional details

---

## Common Tasks

### How to Save a Recipe

1. Find a recipe using Menu Generator, Recipe Finder, or Browse Recipes
2. Click on the recipe to view details
3. Click "Save Recipe" button
4. Recipe is added to My Recipes

### How to Share a Recipe via QR Code

1. Save the recipe to your collection first
2. Navigate to QR Share
3. Select the recipe from the list
4. Click "Generate QR Code"
5. Download the QR code image or copy the link
6. Share with others via print, email, or messaging

### How to Scale a Recipe

1. Navigate to Portion Calculator
2. Select your recipe from the list
3. Set the original serving size
4. Adjust the desired serving size
5. View scaled ingredients and nutrition
6. Download or save the scaled version

### How to Create a Custom Recipe

1. Go to My Recipes
2. Click the "+" button
3. Fill in all recipe details
4. Add ingredients one by one
5. Write step-by-step instructions
6. Upload an image if available
7. Save the recipe

### How to Check Nutritional Information

1. Navigate to Nutrition Analysis
2. Enter ingredients or food items
3. Specify quantities
4. Click "Analyze"
5. View detailed nutritional breakdown

### How to Report an Issue

1. Navigate to Support
2. Click "Create New Ticket"
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
- Apply filters to narrow down results
- Delete recipes you no longer need
- Create custom recipes for family favorites

### For Getting Help

- Use the support ticket system for issues
- Provide detailed descriptions of problems
- Check this guide for common questions
- Be patient while waiting for admin responses

---

## Administrator Tasks

### Managing Users

**Common Actions:**

- Review new user registrations
- Suspend accounts that violate terms
- Promote trusted users to admin
- Delete spam or inactive accounts
- Send password resets when requested

### Handling Support Tickets

**Best Practices:**

- Respond to tickets promptly
- Provide clear and helpful solutions
- Update ticket status appropriately
- Follow up on resolved issues
- Maintain professional communication

### Moderating Feedback

**How to Moderate:**

1. Review feedback regularly
2. Look for profanity warnings (highlighted in red)
3. Click on flagged feedback to review
4. Read the full comment
5. Delete inappropriate or offensive feedback
6. Use bulk delete for multiple violations

**What to Look For:**

- Profane or offensive language
- Spam or irrelevant comments
- Harassment or personal attacks
- Inappropriate content
- Fake or misleading feedback

**Profanity Filter:**

- System automatically detects inappropriate words
- Severity levels help prioritize moderation
- Filter by profanity status for quick review
- Detected words are listed in feedback details

### Monitoring System Activity

**Regular Checks:**

- Review activity logs weekly
- Monitor user growth trends
- Track feedback patterns
- Check for unusual activity
- Ensure system stability

---

## Need More Help?

If you cannot find the answer to your question in this guide:

1. Create a support ticket within the application
2. Select the appropriate category for your issue
3. Provide as much detail as possible
4. Include screenshots if helpful
5. Wait for an admin response

The support team will respond to your ticket as soon as possible.

---

## Conclusion

Chefio is designed to make recipe discovery, management, and sharing simple and enjoyable. Whether you're looking for new meal ideas, managing your recipe collection, or sharing your culinary creations with others, Chefio has the tools you need.

Explore the features, experiment with different recipes, and make the most of your cooking experience. Happy cooking!
