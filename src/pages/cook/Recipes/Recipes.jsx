import React, { useState } from 'react';
import { FiSearch, FiFilter, FiPlus, FiClock, FiUsers, FiHeart } from 'react-icons/fi';
import { Circle, Leaf, Star } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Layout from '../../../components/layout/Layout/Layout';

const categories = ['All', 'Favorites', 'Recent', 'Breakfast', 'Lunch', 'Dinner', 'Desserts'];

const recipes = [
  { id: 1, title: 'Avocado Toast', time: '10 mins', servings: 2, category: 'Breakfast', icon: Circle, isFavorite: true },
  { id: 2, title: 'Caesar Salad', time: '15 mins', servings: 3, category: 'Lunch', icon: Leaf, isFavorite: false },
  { id: 3, title: 'Beef Steak', time: '30 mins', servings: 2, category: 'Dinner', icon: Circle, isFavorite: true },
  { id: 4, title: 'Chocolate Cake', time: '45 mins', servings: 8, category: 'Desserts', icon: Star, isFavorite: false },
  { id: 5, title: 'Pancakes', time: '20 mins', servings: 4, category: 'Breakfast', icon: Circle, isFavorite: true },
  { id: 6, title: 'Sushi Roll', time: '40 mins', servings: 4, category: 'Dinner', icon: Circle, isFavorite: false }
];

const Recipes = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'All' || 
      (selectedCategory === 'Favorites' && recipe.isFavorite) ||
      recipe.category === selectedCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="p-6 lg:p-12 lg:py-16 max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 lg:mb-12">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-text mb-2">My Recipes</h1>
            <p className="text-sm lg:text-base text-text-secondary">Manage and organize your culinary creations</p>
          </div>
          <Button icon={<FiPlus />} size="medium" className="lg:scale-110">Add Recipe</Button>
        </header>

        {/* Search */}
        <div className="flex gap-3 lg:gap-4 mb-8 lg:mb-10">
          <div className="flex-1 flex items-center gap-3 glass-enhanced rounded-xl lg:rounded-2xl px-5 lg:px-6 py-3 lg:py-4 focus-within:bg-white/90 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 focus-within:scale-[1.01] transition-all duration-300 hover:shadow-lg">
            <FiSearch className="text-text-tertiary text-xl lg:text-2xl" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-base lg:text-lg text-text placeholder:text-text-tertiary"
            />
          </div>
          <button className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center glass-enhanced rounded-xl lg:rounded-2xl text-text-secondary hover:text-primary hover:scale-110 transition-all duration-300">
            <FiFilter className="text-xl lg:text-2xl" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-2 mb-6 lg:mb-8 scrollbar-hide lg:justify-center">
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

        {/* Recipe count */}
        <p className="text-sm text-text-tertiary mb-4">
          {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
        </p>

        {/* Recipe Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {filteredRecipes.map((recipe, index) => (
            <Card 
              key={recipe.id}
              variant="glass"
              padding="none"
              hover
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative h-[100px] md:h-[120px] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center rounded-t-xl">
                <recipe.icon className="w-12 h-12 md:w-14 md:h-14 text-primary" />
                <button 
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                    recipe.isFavorite 
                      ? 'bg-error/15 text-error' 
                      : 'bg-white/80 text-text-tertiary hover:scale-110'
                  }`}
                >
                  <FiHeart className={recipe.isFavorite ? 'fill-current' : ''} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-text mb-1">{recipe.title}</h3>
                <div className="flex gap-4 text-xs text-text-tertiary mb-2">
                  <span className="flex items-center gap-1"><FiClock /> {recipe.time}</span>
                  <span className="flex items-center gap-1"><FiUsers /> {recipe.servings}</span>
                </div>
                <Badge variant="default" size="small">{recipe.category}</Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <FiSearch className="w-16 h-16 mx-auto mb-4 opacity-50 text-text-tertiary" />
            <h3 className="text-lg font-semibold text-text mb-2">No recipes found</h3>
            <p className="text-base text-text-tertiary">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Recipes;
