import React, { useState } from 'react';
import { FiSearch, FiX, FiLoader } from 'react-icons/fi';
import { Salad, ChevronRight } from 'lucide-react';
import Card from '../../../components/common/Card/Card';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import Layout from '../../../components/layout/Layout/Layout';
import NutritionCard from '../../../components/nutrition/NutritionCard';
import NutritionDetails from '../../../components/nutrition/NutritionDetails';
import { searchFoods } from '../../../services/nutrition/usdaService';
import { toast } from '../../../store/toastStore';

const Nutrition = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a food name to search');
      return;
    }

    setIsSearching(true);
    setSelectedFood(null);

    try {
      console.log('🔍 Searching USDA for:', searchQuery);
      const results = await searchFoods(searchQuery, 10);
      
      if (results.length === 0) {
        toast.info(`No results found for "${searchQuery}"`);
      } else {
        toast.success(`Found ${results.length} results!`);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setQuantity(100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedFood(null);
  };

  const quickSearches = [
    'Chicken breast',
    'Brown rice',
    'Broccoli',
    'Salmon',
    'Sweet potato',
    'Eggs',
    'Almonds',
    'Greek yogurt'
  ];

  return (
    <Layout>
      <div className="p-6 lg:p-12 lg:py-16 max-w-[1000px] mx-auto">
        {/* Header */}
        <header className="mb-8 lg:mb-12">
          {selectedFood ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-primary hover:text-primary-dark mb-4 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span className="font-medium">Back to search</span>
            </button>
          ) : (
            <>
              <h1 className="text-2xl lg:text-4xl font-bold text-text mb-3">
                Nutrition Analysis
              </h1>
              <p className="text-base lg:text-lg text-text-secondary">
                Search for foods and analyze their nutritional values using USDA database
              </p>
            </>
          )}
        </header>

        {/* Selected Food Details */}
        {selectedFood ? (
          <div className="space-y-6">
            {/* Quantity Adjuster */}
            <Card variant="glass">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Serving Size</p>
                  <p className="text-lg font-semibold text-text">Adjust quantity</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(10, quantity - 10))}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-text font-bold transition-colors"
                  >
                    -
                  </button>
                  <div className="text-center min-w-[80px]">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-2xl font-bold text-primary text-center bg-transparent border-none outline-none"
                    />
                    <p className="text-xs text-text-tertiary">grams</p>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 10)}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-text font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </Card>

            {/* Detailed Nutrition */}
            <NutritionDetails food={selectedFood} quantity={quantity} />
          </div>
        ) : (
          <>
            {/* Search Section */}
            <section className="mb-8 lg:mb-12">
              <Card variant="glass" className="p-6">
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search for any food (e.g., chicken breast, apple, brown rice)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      variant="glass"
                      icon={<FiSearch />}
                      disabled={isSearching}
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    icon={isSearching ? <FiLoader className="animate-spin" /> : <FiSearch />}
                    size="large"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {/* Quick Searches */}
                <div>
                  <p className="text-sm text-text-tertiary mb-3">Quick searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSearchQuery(item);
                          setTimeout(() => handleSearch(), 100);
                        }}
                        disabled={isSearching}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-text-secondary hover:border-primary hover:text-primary active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </section>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-text mb-4">
                  Search Results ({searchResults.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((food, index) => (
                    <div
                      key={food.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <NutritionCard
                        food={food}
                        onSelect={handleSelectFood}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {searchResults.length === 0 && !isSearching && (
              <Card variant="glass" className="text-center py-16">
                <Salad className="w-16 h-16 mx-auto mb-4 opacity-50 text-text-tertiary" />
                <h3 className="text-lg font-semibold text-text mb-2">
                  Search for nutritional information
                </h3>
                <p className="text-base text-text-secondary max-w-md mx-auto">
                  Enter any food name above to get detailed nutritional data from the USDA database
                </p>
                <div className="mt-6">
                  <p className="text-sm text-text-tertiary mb-2">Powered by:</p>
                  <p className="text-sm font-medium text-primary">
                    USDA FoodData Central
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    300,000+ foods • FDA-compliant data
                  </p>
                </div>
              </Card>
            )}

            {/* Loading State */}
            {isSearching && (
              <Card variant="glass" className="text-center py-16">
                <FiLoader className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                <h3 className="text-lg font-semibold text-text mb-2">
                  Searching USDA database...
                </h3>
                <p className="text-base text-text-secondary">
                  Finding nutritional information for "{searchQuery}"
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Nutrition;
