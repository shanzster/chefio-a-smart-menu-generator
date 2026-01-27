import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiZap, FiArrowRight, FiPlusCircle, FiBook, FiActivity, FiSearch, FiUser } from 'react-icons/fi';
import { Hand, Lightbulb, Circle, Star } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Layout from '../../../components/layout/Layout/Layout';
import { useAuthStore } from '../../../store/authStore';
import { useMobileProfileMenu } from '../../../components/layout/Navigation/Navigation';

const featuredRecipes = [
  { id: 1, title: 'Blue Salad', description: 'A fresh and healthy salad', time: '32 mins', servings: 2, calories: 230, icon: Circle, category: 'Healthy' },
  { id: 2, title: 'Cheesecake', description: 'Creamy classic dessert', time: '50 mins', servings: 8, calories: 450, icon: Star, category: 'Dessert' },
  { id: 3, title: 'Pasta Carbonara', description: 'Italian comfort food', time: '25 mins', servings: 4, calories: 580, icon: Circle, category: 'Italian' }
];

const quickActions = [
  { icon: FiPlusCircle, label: 'Create Recipe', path: '/cook/menu-generator', color: 'bg-primary shadow-primary' },
  { icon: FiBook, label: 'My Recipes', path: '/cook/recipes', color: 'bg-secondary shadow-lg' },
  { icon: FiActivity, label: 'Nutrition', path: '/cook/nutrition', color: 'bg-success shadow-lg' },
];

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { ProfileButton, MobileMenu } = useMobileProfileMenu();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Layout>
      <div className="p-6 lg:p-12 lg:py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-10 lg:mb-16">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <Hand className="w-8 h-8 lg:w-10 lg:h-10 text-primary animate-wave" />
            </div>
            <div>
              <p className="text-sm lg:text-base text-text-secondary mb-1">{getGreeting()}</p>
              <h1 className="text-xl lg:text-3xl font-bold text-text">{user?.name || 'Student Chef'}</h1>
            </div>
          </div>
          {/* Profile Button - Desktop only (mobile has it in Layout header) */}
          <div className="hidden lg:block">
            <ProfileButton />
          </div>
        </header>

        {/* Search */}
        <div className="mb-10 lg:mb-16">
          <div className="flex items-center gap-3 lg:gap-4 glass-enhanced rounded-xl lg:rounded-2xl px-6 lg:px-8 py-4 lg:py-5 focus-within:bg-white/90 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 focus-within:scale-[1.01] transition-all duration-300 hover:shadow-lg">
            <FiSearch className="w-5 h-5 lg:w-6 lg:h-6 text-text-tertiary transition-transform hover:scale-110" />
            <input 
              type="text" 
              placeholder="Search recipes, ingredients..." 
              className="flex-1 bg-transparent border-none outline-none text-base lg:text-lg text-text placeholder:text-text-tertiary"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-10 lg:mb-16">
          <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6">
            {quickActions.map((action, index) => (
              <Link 
                key={action.label} 
                to={action.path} 
                className={`flex flex-col items-center justify-center gap-3 lg:gap-4 p-6 lg:p-8 rounded-xl lg:rounded-2xl text-white no-underline active:scale-95 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl ${action.color} animate-fade-in-up group`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <action.icon className="text-2xl lg:text-3xl transition-transform group-hover:scale-110 group-hover:rotate-3" />
                <span className="text-sm lg:text-base font-medium text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10 lg:mb-16">
          <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-2 scrollbar-hide lg:justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`flex-shrink-0 px-6 lg:px-8 py-2.5 lg:py-3 rounded-full text-sm lg:text-base font-medium border-2 transition-all duration-300 active:scale-95 hover:scale-105 ${
                  selectedCategory === category 
                    ? 'bg-primary border-primary text-white shadow-primary' 
                    : 'bg-white border-gray-200 text-text-secondary hover:border-primary hover:text-primary hover:bg-primary/5'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Recipes */}
        <section className="mb-10 lg:mb-16">
          <div className="flex items-center justify-between mb-8 lg:mb-10">
            <h2 className="text-lg lg:text-2xl font-bold text-text">Featured Recipes</h2>
            <Link to="/cook/recipes" className="flex items-center gap-2 text-sm lg:text-base font-medium text-primary hover:gap-3 transition-all duration-300 group">
              See all <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
            {featuredRecipes.map((recipe, index) => (
              <Card 
                key={recipe.id} 
                variant="glass" 
                padding="none"
                hover
                className="animate-fade-in-up interactive-card card-glow overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-[140px] lg:h-[180px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-xl flex items-center justify-center overflow-hidden group">
                  <recipe.icon className="w-16 h-16 lg:w-20 lg:h-20 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                  <Badge variant="glass" className="absolute top-3 right-3 lg:top-4 lg:right-4 transition-all hover:scale-105">{recipe.category}</Badge>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 lg:p-6">
                  <h3 className="text-md lg:text-lg font-semibold text-text mb-2">{recipe.title}</h3>
                  <p className="text-sm lg:text-base text-text-secondary mb-4 lg:mb-6">{recipe.description}</p>
                  <div className="flex gap-4 lg:gap-6">
                    <span className="flex items-center gap-1.5 text-xs lg:text-sm text-text-tertiary transition-colors hover:text-primary">
                      <FiClock /> {recipe.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs lg:text-sm text-text-tertiary transition-colors hover:text-primary">
                      <FiUsers /> {recipe.servings}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs lg:text-sm text-text-tertiary transition-colors hover:text-primary">
                      <FiZap /> {recipe.calories} kcal
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Tip Card */}
        <section>
          <Card variant="default" className="bg-gradient-to-br from-amber-50 to-amber-100 border-none animate-fade-in-up animation-delay-400 hover-lift overflow-hidden">
            <div className="flex gap-4 lg:gap-6 p-4 lg:p-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-amber-200/50 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 lg:w-8 lg:h-8 text-amber-600 animate-bounce" />
              </div>
              <div className="flex-1">
                <h3 className="text-base lg:text-lg font-semibold text-text mb-2">Chef's Tip</h3>
                <p className="text-sm lg:text-base text-text-secondary leading-relaxed">
                  Salt your pasta water until it tastes like the sea - about 1 tablespoon per liter!
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
      {/* Mobile Menu */}
      <MobileMenu />
    </Layout>
  );
};

export default Dashboard;
