# Firebase Integration Examples

## How to Integrate Firebase Services into Your Pages

### 1. Menu Generator - Save Generated Recipes

**File**: `src/pages/cook/MenuGenerator/MenuGenerator.jsx`

```javascript
import { createRecipe } from '../../../services/firebase/recipeService';

// Inside your component
const handleSaveRecipe = async (recipeData) => {
  try {
    const savedRecipe = await createRecipe({
      title: recipeData.title,
      description: recipeData.description,
      ingredients: ingredients, // your ingredients array
      instructions: recipeData.instructions || [],
      category: recipeData.category || "General",
      prepTime: recipeData.time,
      servings: recipeData.servings,
      difficulty: recipeData.difficulty,
      nutrition: {
        calories: recipeData.calories || 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    });
    
    console.log("Recipe saved:", savedRecipe);
    // Show success message
  } catch (error) {
    console.error("Error saving recipe:", error);
    // Show error message
  }
};
```

---

### 2. My Recipes - Load User's Recipes

**File**: `src/pages/cook/Recipes/Recipes.jsx`

```javascript
import { useState, useEffect } from 'react';
import { 
  getUserRecipes, 
  toggleFavorite, 
  deleteRecipe,
  searchRecipes 
} from '../../../services/firebase/recipeService';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load recipes on mount
  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const userRecipes = await getUserRecipes();
      setRecipes(userRecipes);
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (recipeId, currentStatus) => {
    try {
      await toggleFavorite(recipeId, currentStatus);
      // Update local state
      setRecipes(recipes.map(r => 
        r.id === recipeId ? { ...r, isFavorite: !currentStatus } : r
      ));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Delete recipe
  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    
    try {
      await deleteRecipe(recipeId);
      setRecipes(recipes.filter(r => r.id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  // Search recipes
  const handleSearch = async (searchTerm, category) => {
    try {
      setLoading(true);
      const results = await searchRecipes(searchTerm, category);
      setRecipes(results);
    } catch (error) {
      console.error("Error searching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your JSX with recipes.map()
  );
};
```

---

### 3. Feedback - Load and Submit Feedback

**File**: `src/pages/cook/Feedback/Feedback.jsx`

```javascript
import { useState, useEffect } from 'react';
import { 
  getUserRecipesFeedback,
  submitFeedback,
  markFeedbackHelpful 
} from '../../../services/firebase/feedbackService';
import { getUserRecipes } from '../../../services/firebase/recipeService';

const Feedback = () => {
  const [recipes, setRecipes] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load user's recipes
      const userRecipes = await getUserRecipes();
      
      // Load all feedback for user's recipes
      const allFeedback = await getUserRecipesFeedback();
      
      // Group feedback by recipe
      const recipesWithFeedback = userRecipes.map(recipe => ({
        ...recipe,
        feedbacks: allFeedback.filter(fb => fb.recipeId === recipe.id)
      }));
      
      setRecipes(recipesWithFeedback);
      setFeedbacks(allFeedback);
    } catch (error) {
      console.error("Error loading feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (feedbackId, isHelpful) => {
    try {
      await markFeedbackHelpful(feedbackId, isHelpful);
      // Reload data
      await loadData();
    } catch (error) {
      console.error("Error marking feedback:", error);
    }
  };

  return (
    // Your JSX
  );
};
```

---

### 4. Support - Create and Manage Tickets

**File**: `src/pages/cook/Support/Support.jsx`

```javascript
import { useState, useEffect } from 'react';
import { 
  createTicket,
  getUserTickets,
  addTicketResponse,
  getTicketStats 
} from '../../../services/firebase/supportService';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const userTickets = await getUserTickets();
      const ticketStats = await getTicketStats();
      
      setTickets(userTickets);
      setStats(ticketStats);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      const newTicket = await createTicket({
        category: ticketData.category,
        subject: ticketData.subject,
        description: ticketData.description,
        priority: ticketData.priority
      });
      
      // Add to local state
      setTickets([newTicket, ...tickets]);
      
      // Show success message
      alert("Ticket created successfully!");
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket");
    }
  };

  const handleAddResponse = async (ticketId, message) => {
    try {
      await addTicketResponse(ticketId, message, false);
      // Reload tickets to get updated responses
      await loadTickets();
    } catch (error) {
      console.error("Error adding response:", error);
    }
  };

  return (
    // Your JSX
  );
};
```

---

### 5. Dashboard - Load Stats and Recent Recipes

**File**: `src/pages/cook/Dashboard/Dashboard.jsx`

```javascript
import { useState, useEffect } from 'react';
import { getUserRecipes } from '../../../services/firebase/recipeService';
import { getCurrentUser } from '../../../services/firebase/authService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    sharedRecipes: 0,
    weeklyRecipes: 0
  });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get user data
      const user = await getCurrentUser();
      
      // Get all recipes
      const recipes = await getUserRecipes();
      
      // Calculate stats
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const weeklyRecipes = recipes.filter(r => {
        const createdAt = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
        return createdAt >= oneWeekAgo;
      });
      
      const sharedRecipes = recipes.filter(r => r.shares > 0);
      
      setStats({
        totalRecipes: recipes.length,
        sharedRecipes: sharedRecipes.length,
        weeklyRecipes: weeklyRecipes.length
      });
      
      // Get recent recipes (last 3)
      setRecentRecipes(recipes.slice(0, 3));
      
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your JSX with stats and recentRecipes
  );
};
```

---

### 6. QR Generator - Load Recipe for Sharing

**File**: `src/pages/cook/QRGenerator/QRGenerator.jsx`

```javascript
import { useState, useEffect } from 'react';
import { getUserRecipes, getRecipeById } from '../../../services/firebase/recipeService';

const QRGenerator = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const userRecipes = await getUserRecipes();
      setRecipes(userRecipes);
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  };

  const handleSelectRecipe = async (recipeId) => {
    try {
      const recipe = await getRecipeById(recipeId);
      setSelectedRecipe(recipe);
    } catch (error) {
      console.error("Error loading recipe:", error);
    }
  };

  // Generate QR code URL
  const getRecipeUrl = (recipeId) => {
    return `${window.location.origin}/recipe/${recipeId}`;
  };

  return (
    // Your JSX with QR code generation
  );
};
```

---

### 7. Recipe View (Guest) - View Shared Recipe

**File**: `src/pages/guest/RecipeView/RecipeView.jsx`

```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getRecipeById, 
  incrementViews,
  incrementSaves 
} from '../../../services/firebase/recipeService';
import { 
  submitFeedback,
  getRecipeFeedback 
} from '../../../services/firebase/feedbackService';

const RecipeView = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRecipe(id);
    }
  }, [id]);

  const loadRecipe = async (recipeId) => {
    try {
      setLoading(true);
      
      // Get recipe
      const recipeData = await getRecipeById(recipeId);
      setRecipe(recipeData);
      
      // Increment views
      await incrementViews(recipeId);
      
      // Get feedback
      const recipeFeedback = await getRecipeFeedback(recipeId);
      setFeedbacks(recipeFeedback);
      
    } catch (error) {
      console.error("Error loading recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    try {
      await incrementSaves(recipe.id);
      alert("Recipe saved!");
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const handleSubmitFeedback = async (rating, comment, userName) => {
    try {
      await submitFeedback(recipe.id, {
        rating,
        comment,
        userName
      });
      
      // Reload feedback
      const recipeFeedback = await getRecipeFeedback(recipe.id);
      setFeedbacks(recipeFeedback);
      
      alert("Feedback submitted!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    // Your JSX
  );
};
```

---

## Common Patterns

### Loading States
```javascript
const [loading, setLoading] = useState(true);

// In your async function
try {
  setLoading(true);
  // ... your Firebase calls
} catch (error) {
  console.error(error);
} finally {
  setLoading(false);
}

// In JSX
{loading ? <LoadingSpinner /> : <YourContent />}
```

### Error Handling
```javascript
const [error, setError] = useState(null);

try {
  setError(null);
  // ... your Firebase calls
} catch (error) {
  setError(error.message);
}

// In JSX
{error && <div className="error">{error}</div>}
```

### Real-time Updates (Optional)
```javascript
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

useEffect(() => {
  const q = query(
    collection(db, "recipes"),
    where("userId", "==", user.uid)
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const recipes = [];
    snapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() });
    });
    setRecipes(recipes);
  });
  
  return () => unsubscribe();
}, [user.uid]);
```

---

## Testing Checklist

- [ ] Register a new user
- [ ] Login with registered user
- [ ] Create a recipe
- [ ] View recipes list
- [ ] Toggle favorite
- [ ] Delete a recipe
- [ ] Search recipes
- [ ] Generate QR code
- [ ] View recipe via QR (guest)
- [ ] Submit feedback
- [ ] Create support ticket
- [ ] Add response to ticket
- [ ] View dashboard stats

---

## Tips

1. **Always handle errors** - Firebase operations can fail
2. **Show loading states** - Firebase calls are async
3. **Use try-catch blocks** - Wrap all Firebase calls
4. **Test with real data** - Create test recipes and feedback
5. **Check Firebase Console** - Monitor your database in real-time
6. **Use TypeScript** (optional) - For better type safety
7. **Implement pagination** - For large datasets
8. **Add offline support** - Firebase has built-in offline capabilities

---

## Need Help?

- Check `FIREBASE_SETUP.md` for setup instructions
- Review Firebase documentation
- Check browser console for errors
- Verify Firebase rules are correct
- Ensure user is authenticated before operations
