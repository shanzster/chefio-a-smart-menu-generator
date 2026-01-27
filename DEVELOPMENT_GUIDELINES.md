# Chefio Development Guidelines

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Semantic HTML & Accessibility](#semantic-html--accessibility)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [User Roles & Authentication](#user-roles--authentication)
8. [Module Implementation Guidelines](#module-implementation-guidelines)
9. [API Integration](#api-integration)
10. [PWA Requirements](#pwa-requirements)
11. [Styling Guidelines](#styling-guidelines)
12. [Code Standards](#code-standards)

---

## Project Overview

**Chefio** is a Progressive Web Application (PWA) designed to streamline menu planning and presentation workflow for HRM students. The application combines AI-powered menu generation, nutritional analysis, and QR code-based recipe sharing.

### Core Principles
- **Mobile-First Design**: Optimized for smartphone use in kitchen/classroom environments
- **Educational Focus**: Designed specifically for HRM students and culinary education
- **Efficiency**: Automate manual calculations and planning tasks
- **Accessibility**: Ensure all users can access and use the application
- **Performance**: Fast loading and responsive interactions

---

## Technology Stack

### Frontend Framework
- **React 18+** (using Vite as build tool)
- **React Router** for navigation and routing
- **React Query / TanStack Query** for server state management and API calls

### State Management
- **Zustand** or **Context API + useReducer** for global state
- **React Hook Form** for form management
- **Local Storage** for offline recipe caching

### UI/UX Libraries
- **CSS Modules** or **Styled Components** for component styling
- **React Icons** for iconography
- **Framer Motion** or **React Spring** for animations (optional)

### PWA & Offline Support
- **Workbox** for service worker management
- **PWA Plugin** for Vite
- **IndexedDB** (via **idb** library) for offline data storage

### QR Code & Utilities
- **qrcode.react** or **react-qr-code** for QR code generation
- **html2canvas** or **jsPDF** for QR code download/printing
- **zod** for schema validation

### API Integration
- **Axios** or **Fetch API** for HTTP requests
- **OpenAI API** or **Anthropic Claude API** for AI menu generation
- **Edamam API** or **USDA FoodData Central API** for nutritional data

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** (recommended) for type safety

---

## Project Structure

```
chefio/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── service-worker.js      # Service worker for offline support
│   ├── icons/                 # PWA icons (various sizes)
│   └── robots.txt
├── src/
│   ├── assets/                # Static assets (images, fonts)
│   ├── components/            # Reusable UI components
│   │   ├── common/           # Button, Input, Card, Modal, etc.
│   │   ├── layout/           # Header, Footer, Sidebar, Navigation
│   │   ├── forms/            # Form components
│   │   └── qr/               # QR code components
│   ├── features/             # Feature-based modules
│   │   ├── auth/            # Authentication module
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── menu-generation/  # Meal generation module
│   │   ├── nutrition/        # Nutritional analysis module
│   │   ├── recipes/         # Recipe management module
│   │   ├── qr-sharing/      # QR code generation module
│   │   ├── substitutions/   # Ingredient substitution module
│   │   ├── guest-view/      # Public viewing interface
│   │   ├── feedback/        # Feedback/rating module
│   │   └── admin/           # Admin dashboard modules
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services and external integrations
│   │   ├── api/             # API client setup
│   │   ├── ai/              # AI service integration
│   │   ├── nutrition/       # Nutrition API integration
│   │   └── storage/         # Local storage/IndexedDB services
│   ├── store/               # Global state management
│   │   ├── authStore.js
│   │   ├── recipeStore.js
│   │   └── uiStore.js
│   ├── utils/               # Utility functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── types/               # TypeScript types (if using TS)
│   ├── styles/              # Global styles
│   │   ├── variables.css
│   │   ├── reset.css
│   │   └── utilities.css
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── routes.jsx           # Route configuration
├── .env.example             # Environment variables template
├── vite.config.js
├── package.json
└── README.md
```

---

## Semantic HTML & Accessibility

### HTML Semantics
- Use semantic HTML5 elements:
  - `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
  - `<form>`, `<fieldset>`, `<legend>` for forms
  - `<button>` for interactive elements (not `<div>` with onClick)
  - `<a>` for navigation links
  - Proper heading hierarchy (`<h1>` → `<h2>` → `<h3>`)

### ARIA Attributes
- Use ARIA labels for screen readers:
  ```jsx
  <button aria-label="Generate menu from ingredients">
    <Icon /> Generate
  </button>
  ```
- Use `aria-live` regions for dynamic content updates
- Use `role` attributes when semantic HTML isn't sufficient
- Ensure all form inputs have associated `<label>` elements

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Use proper focus management for modals and dynamic content
- Implement skip navigation links

### Example Component Structure
```jsx
<main role="main">
  <section aria-labelledby="menu-generation-heading">
    <h2 id="menu-generation-heading">Generate Menu</h2>
    <form aria-label="Menu generation form">
      <fieldset>
        <legend>Available Ingredients</legend>
        {/* Form fields */}
      </fieldset>
    </form>
  </section>
</main>
```

---

## Component Architecture

### Component Organization
- **Feature-based modules**: Group related components, hooks, and services together
- **Atomic Design principles**: Build from small, reusable components
- **Single Responsibility**: Each component should have one clear purpose

### Component Structure Template
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './ComponentName.module.css';

/**
 * ComponentName - Brief description
 * 
 * @param {Object} props
 * @param {string} props.title - Component title
 */
const ComponentName = ({ title, ...props }) => {
  // Hooks
  // State
  // Effects
  // Handlers
  
  return (
    <section className={styles.container} aria-labelledby="component-title">
      <h2 id="component-title">{title}</h2>
      {/* Component JSX */}
    </section>
  );
};

ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ComponentName;
```

### Component Naming
- Use PascalCase for component files: `MenuGenerator.jsx`
- Use descriptive, action-oriented names: `GenerateMenuButton`, not `Button`
- Prefix with feature name when needed: `RecipeCard`, `RecipeList`, `RecipeDetail`

---

## State Management

### Global State (Zustand/Context)
Use for:
- User authentication state
- Current user role/permissions
- Active recipe being viewed/edited
- UI theme/preferences

### Server State (React Query)
Use for:
- API data fetching
- Caching and synchronization
- Background updates
- Optimistic updates

### Local State (useState/useReducer)
Use for:
- Form inputs
- UI toggles (modals, dropdowns)
- Component-specific calculations

### Example Store Structure
```javascript
// store/authStore.js
import create from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  role: null, // 'cook', 'guest', 'admin'
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, role: null }),
}));
```

---

## User Roles & Authentication

### User Roles
1. **Cook** (Default authenticated user)
   - Access: All cook modules
   - Permissions: Create, read, update own recipes

2. **Guest** (Unauthenticated)
   - Access: QR code scanning, public recipe view, feedback
   - Permissions: Read-only public recipes

3. **Admin**
   - Access: All modules + admin dashboard
   - Permissions: User management, AI configuration, analytics

### Authentication Flow
```jsx
// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

### Route Structure
```
/                          → Landing page (public)
/login                     → Authentication (public)
/register                  → Registration (public)
/cook/dashboard            → Cook dashboard (protected: cook)
/cook/menu-generator       → Menu generation (protected: cook)
/cook/recipes              → Recipe portfolio (protected: cook)
/cook/nutrition            → Nutrition analysis (protected: cook)
/recipe/:id                → Public recipe view (public, via QR)
/guest/feedback/:recipeId  → Feedback form (public)
/admin/dashboard           → Admin dashboard (protected: admin)
/admin/users               → User management (protected: admin)
/admin/ai-config           → AI configuration (protected: admin)
```

---

## Module Implementation Guidelines

### 1. Authentication Module

**Components:**
- `LoginForm.jsx` - Login form with email/password
- `RegisterForm.jsx` - Registration form
- `AuthGuard.jsx` - Route protection wrapper

**Features:**
- JWT token-based authentication
- Role-based access control
- Session persistence (localStorage)
- Password strength validation

**Semantics:**
```jsx
<form aria-label="Login form" onSubmit={handleSubmit}>
  <fieldset>
    <legend>Account Login</legend>
    <div className={styles.formGroup}>
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        type="email"
        aria-required="true"
        aria-describedby="email-error"
      />
      <span id="email-error" role="alert" aria-live="polite">
        {errors.email}
      </span>
    </div>
  </fieldset>
</form>
```

---

### 2. Meal Generation Module

**Components:**
- `IngredientInput.jsx` - Multi-select ingredient input
- `ConstraintSelector.jsx` - Dietary constraints and time limits
- `MenuResults.jsx` - Generated menu suggestions
- `RecipeCard.jsx` - Individual recipe display

**Features:**
- Multi-select ingredient input with autocomplete
- Dietary constraint filters (vegetarian, vegan, gluten-free, etc.)
- Preparation time constraints
- AI-powered recipe generation
- Recipe ranking/scoring based on available ingredients

**AI Integration:**
```javascript
// services/ai/menuGenerator.js
export const generateMenu = async (ingredients, constraints) => {
  const prompt = `Generate 5 recipes using these ingredients: ${ingredients.join(', ')}. 
  Constraints: ${JSON.stringify(constraints)}. 
  Format as JSON with: name, ingredients, steps, prepTime, cookTime.`;
  
  // Call AI API
  // Parse and validate response
  // Return structured recipe data
};
```

**Semantics:**
```jsx
<section aria-labelledby="menu-generation">
  <h2 id="menu-generation">Generate Menu from Ingredients</h2>
  <form aria-label="Menu generation form">
    <fieldset>
      <legend>Available Ingredients</legend>
      {/* Ingredient inputs */}
    </fieldset>
    <fieldset>
      <legend>Dietary Constraints</legend>
      {/* Constraint checkboxes */}
    </fieldset>
  </form>
</section>
```

---

### 3. Nutritional Analysis Module

**Components:**
- `NutritionCalculator.jsx` - Main calculation interface
- `NutritionDisplay.jsx` - Visual nutrition breakdown
- `MacroChart.jsx` - Macronutrient visualization

**Features:**
- Real-time calculation as ingredients are added
- Display: calories, protein, fats, carbohydrates
- Per-serving and total recipe calculations
- Visual charts/graphs for macronutrients

**API Integration:**
```javascript
// services/nutrition/nutritionAPI.js
export const calculateNutrition = async (ingredients) => {
  // For each ingredient, fetch nutritional data
  // Aggregate totals
  // Return structured nutrition object
};
```

**Semantics:**
```jsx
<section aria-labelledby="nutrition-analysis">
  <h2 id="nutrition-analysis">Nutritional Analysis</h2>
  <div role="region" aria-label="Nutrition facts">
    <dl>
      <dt>Calories</dt>
      <dd>{nutrition.calories} kcal</dd>
      <dt>Protein</dt>
      <dd>{nutrition.protein} g</dd>
      {/* More nutrients */}
    </dl>
  </div>
</section>
```

---

### 4. Recipe Recommendation Module

**Components:**
- `RecipeSearch.jsx` - Search interface
- `SubstitutionSuggestions.jsx` - Alternative ingredient recommendations
- `RecipeDetail.jsx` - Full recipe view

**Features:**
- Search recipes by name or ingredient
- Check ingredient availability against user inventory
- AI-powered substitution suggestions
- Notes on recipe modifications when ingredients are missing

**Semantics:**
```jsx
<article aria-labelledby="recipe-title">
  <header>
    <h3 id="recipe-title">{recipe.name}</h3>
  </header>
  <section aria-labelledby="ingredients-heading">
    <h4 id="ingredients-heading">Ingredients</h4>
    <ul>
      {recipe.ingredients.map((ing, idx) => (
        <li key={idx}>
          {ing.name}
          {ing.substitution && (
            <span className={styles.substitution} aria-label="Substitution available">
              (Can substitute: {ing.substitution})
            </span>
          )}
        </li>
      ))}
    </ul>
  </section>
</article>
```

---

### 5. QR Code Generation Module

**Components:**
- `QRCodeGenerator.jsx` - QR code creation interface
- `QRCodeDisplay.jsx` - QR code visualization
- `QRCodeDownload.jsx` - Download/print functionality

**Features:**
- Generate QR code from recipe data
- Encode recipe ID and metadata
- Download as PNG/SVG
- Print-friendly format
- Shareable link generation

**Implementation:**
```jsx
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ recipeId }) => {
  const recipeUrl = `${window.location.origin}/recipe/${recipeId}`;
  
  return (
    <section aria-labelledby="qr-generation">
      <h2 id="qr-generation">Generate QR Code</h2>
      <div role="img" aria-label="QR code for recipe">
        <QRCode value={recipeUrl} size={256} />
      </div>
      <button onClick={handleDownload}>Download QR Code</button>
    </section>
  );
};
```

---

### 6. Guest View Module (Public Interface)

**Components:**
- `PublicRecipeView.jsx` - Recipe display page
- `NutritionDisplay.jsx` - Shared nutrition component
- `FeedbackForm.jsx` - Rating and comment form

**Features:**
- No authentication required
- Mobile-optimized layout
- Fast loading (critical for QR scanning)
- Print-friendly view
- Feedback submission

**Semantics:**
```jsx
<main role="main">
  <article itemScope itemType="https://schema.org/Recipe">
    <header>
      <h1 itemProp="name">{recipe.name}</h1>
    </header>
    <section itemProp="nutrition" itemScope itemType="https://schema.org/NutritionInformation">
      {/* Nutrition data with schema.org markup */}
    </section>
    <section itemProp="recipeInstructions">
      <h2>Instructions</h2>
      <ol>
        {recipe.steps.map((step, idx) => (
          <li key={idx} itemProp="recipeInstructions">{step}</li>
        ))}
      </ol>
    </section>
  </article>
</main>
```

---

### 7. Admin Modules

**Components:**
- `AdminDashboard.jsx` - Analytics overview
- `UserManagement.jsx` - User list and actions
- `AIConfigPanel.jsx` - AI model configuration

**Features:**
- User CRUD operations
- Account suspension/deletion
- Platform analytics (recipes generated, active users)
- AI model parameters configuration
- Content moderation settings

---

## API Integration

### API Client Setup
```javascript
// services/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### API Service Structure
```javascript
// services/api/recipes.js
import apiClient from './client';

export const recipeService = {
  create: (recipeData) => apiClient.post('/recipes', recipeData),
  getById: (id) => apiClient.get(`/recipes/${id}`),
  update: (id, recipeData) => apiClient.put(`/recipes/${id}`, recipeData),
  delete: (id) => apiClient.delete(`/recipes/${id}`),
  getAll: (userId) => apiClient.get(`/recipes?userId=${userId}`),
};
```

### React Query Usage
```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/api/recipes';

const RecipeList = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes', user.id],
    queryFn: () => recipeService.getAll(user.id),
  });
  
  const createMutation = useMutation({
    mutationFn: recipeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes', user.id]);
    },
  });
  
  // Component JSX
};
```

---

## PWA Requirements

### Manifest Configuration
```json
// public/manifest.json
{
  "name": "Chefio - Smart Menu Generator",
  "short_name": "Chefio",
  "description": "A smart menu generator with QR-based nutritional & recipe sharing",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#d32f2f",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Service Worker Strategy
- **Cache First**: Static assets (CSS, JS, images)
- **Network First**: API calls, dynamic content
- **Cache with Network Fallback**: Recipe data, nutritional info

### Offline Support
- Cache recipe data in IndexedDB
- Show offline indicator when connection is lost
- Queue actions when offline, sync when online

---

## Styling Guidelines

### CSS Architecture
- **CSS Modules** for component-scoped styles
- **CSS Variables** for theming and consistency
- **Mobile-first** responsive design
- **BEM naming** (optional) for class names

### Color Palette
```css
/* styles/variables.css */
:root {
  /* Primary colors */
  --color-primary: #d32f2f;
  --color-primary-dark: #b71c1c;
  --color-primary-light: #ef5350;
  
  /* Neutral colors */
  --color-background: #ffffff;
  --color-surface: #f5f5f5;
  --color-text: #212121;
  --color-text-secondary: #757575;
  
  /* Status colors */
  --color-success: #4caf50;
  --color-warning: #ff9800;
  --color-error: #f44336;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;
}
```

### Responsive Breakpoints
```css
/* Mobile first approach */
.container {
  padding: var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Component Styling Example
```css
/* components/MenuGenerator/MenuGenerator.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.form {
  display: grid;
  gap: var(--spacing-md);
}

.button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: var(--color-primary-dark);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## Code Standards

### JavaScript/JSX Standards
- Use **functional components** with hooks
- Prefer **const** over let, avoid var
- Use **arrow functions** for component definitions
- Destructure props in function parameters
- Use **optional chaining** (`?.`) and **nullish coalescing** (`??`)

### Naming Conventions
- **Components**: PascalCase (`MenuGenerator.jsx`)
- **Hooks**: camelCase starting with "use" (`useMenuGeneration.js`)
- **Utilities**: camelCase (`calculateNutrition.js`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_INGREDIENTS`)
- **CSS Classes**: kebab-case or BEM (`menu-generator` or `menu-generator__button`)

### File Organization
- One component per file
- Co-locate related files (component + styles + tests)
- Use index.js for clean imports

### Error Handling
```jsx
// Use Error Boundaries for component errors
class ErrorBoundary extends React.Component {
  // Implementation
}

// Use try-catch for async operations
const handleSubmit = async (data) => {
  try {
    setLoading(true);
    await recipeService.create(data);
    toast.success('Recipe created successfully');
  } catch (error) {
    toast.error(error.message || 'Failed to create recipe');
  } finally {
    setLoading(false);
  }
};
```

### Performance Optimization
- Use `React.memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for stable function references
- Lazy load routes with `React.lazy()`
- Code splitting for large features

### Testing (Recommended)
- Unit tests for utilities and hooks
- Component tests with React Testing Library
- Integration tests for critical user flows
- E2E tests for authentication and recipe creation

---

## Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AI_API_KEY=your_ai_api_key
VITE_AI_API_URL=https://api.openai.com/v1
VITE_NUTRITION_API_KEY=your_nutrition_api_key
VITE_NUTRITION_API_URL=https://api.edamam.com/api
VITE_APP_NAME=Chefio
```

---

## Development Workflow

1. **Feature Development**
   - Create feature branch: `feature/menu-generation`
   - Implement following module guidelines
   - Ensure semantic HTML and accessibility
   - Test on mobile devices

2. **Code Review Checklist**
   - [ ] Semantic HTML used
   - [ ] Accessibility requirements met
   - [ ] Mobile-responsive design
   - [ ] Error handling implemented
   - [ ] Loading states included
   - [ ] Code follows naming conventions
   - [ ] No console.logs in production code

3. **Testing**
   - Test all user roles (Cook, Guest, Admin)
   - Test QR code generation and scanning
   - Test offline functionality
   - Test on multiple devices/browsers

---

## Additional Resources

- [React Documentation](https://react.dev)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Semantic HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

---

## Notes

- Always prioritize **user experience** and **accessibility**
- Keep **mobile-first** approach in mind
- Ensure **fast loading times** for QR code views
- Maintain **consistent design language** across all modules
- Document complex logic and AI integrations
- Consider **internationalization** if needed in the future






