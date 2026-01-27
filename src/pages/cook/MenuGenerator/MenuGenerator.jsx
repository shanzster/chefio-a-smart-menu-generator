import React, { useState } from 'react';
import { FiPlus, FiX, FiZap, FiClock, FiUsers } from 'react-icons/fi';
import { Circle, Star } from 'lucide-react';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Input from '../../../components/common/Input/Input';
import Layout from '../../../components/layout/Layout/Layout';

const suggestedIngredients = ['Chicken', 'Rice', 'Eggs', 'Pasta', 'Tomatoes', 'Onions', 'Garlic', 'Cheese', 'Milk', 'Butter'];

const generatedRecipes = [
  { id: 1, title: 'Creamy Chicken Pasta', description: 'Rich and creamy pasta with tender chicken pieces', time: '35 mins', servings: 4, difficulty: 'Easy', matchScore: 95, icon: Circle },
  { id: 2, title: 'Chicken Fried Rice', description: 'Classic Asian comfort food', time: '25 mins', servings: 3, difficulty: 'Easy', matchScore: 88, icon: Circle },
  { id: 3, title: 'Chicken Omelette', description: 'Protein-packed breakfast option', time: '15 mins', servings: 2, difficulty: 'Easy', matchScore: 82, icon: Circle }
];

const MenuGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const addIngredient = (ingredient) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
    setInputValue('');
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleGenerate = () => {
    if (ingredients.length === 0) return;
    setIsGenerating(true);
    setTimeout(() => {
      setRecipes(generatedRecipes);
      setIsGenerating(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue.trim());
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-12 lg:py-16 max-w-[900px] mx-auto">
        {/* Header */}
        <header className="text-center mb-10 lg:mb-16 animate-fade-in-down">
          <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <Star className="w-12 h-12 lg:w-16 lg:h-16 text-primary" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-text mb-3">Menu Generator</h1>
          <p className="text-base lg:text-lg text-text-secondary leading-relaxed max-w-[400px] lg:max-w-[500px] mx-auto">
            Add your ingredients and let AI create delicious recipes for you
          </p>
        </header>

        {/* Ingredients Section */}
        <section className="mb-10 lg:mb-16">
          <h2 className="text-lg lg:text-xl font-semibold text-text mb-6 lg:mb-8">Your Ingredients</h2>
          
          {/* Input */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Type an ingredient..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="glass"
              />
            </div>
            <Button icon={<FiPlus />} onClick={() => addIngredient(inputValue.trim())} disabled={!inputValue.trim()}>
              Add
            </Button>
          </div>

          {/* Selected Ingredients */}
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {ingredients.map((ingredient) => (
                <span key={ingredient} className="inline-flex items-center gap-1 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium animate-scale-in">
                  {ingredient}
                  <button onClick={() => removeIngredient(ingredient)} className="w-[18px] h-[18px] flex items-center justify-center bg-primary/20 rounded-full hover:bg-primary hover:text-white transition-colors">
                    <FiX className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Suggestions */}
          <div className="mb-8">
            <p className="text-sm text-text-tertiary mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedIngredients.filter(s => !ingredients.includes(s)).slice(0, 6).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => addIngredient(suggestion)}
                  className="px-4 py-1 bg-white border border-gray-200 rounded-full text-sm text-text-secondary hover:border-primary hover:text-primary active:scale-95 transition-all"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button fullWidth size="large" onClick={handleGenerate} loading={isGenerating} disabled={ingredients.length === 0} icon={<FiZap />} className="lg:py-6">
            {isGenerating ? 'Generating Recipes...' : 'Generate Recipes'}
          </Button>
        </section>

        {/* Results */}
        {recipes.length > 0 && (
          <section className="mb-10 lg:mb-16">
            <h2 className="text-lg lg:text-xl font-semibold text-text mb-6 lg:mb-8 flex items-center gap-2">
              Generated Recipes
              <Badge variant="primary" size="small">{recipes.length} found</Badge>
            </h2>

            <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
              {recipes.map((recipe, index) => (
                <Card key={recipe.id} variant="glass" padding="none" hover className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative h-[100px] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center rounded-t-xl">
                    <recipe.icon className="w-16 h-16 text-primary" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-success">
                      {recipe.matchScore}% match
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-md font-semibold text-text mb-1">{recipe.title}</h3>
                    <p className="text-sm text-text-secondary mb-4">{recipe.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-text-tertiary">
                      <span className="flex items-center gap-1"><FiClock /> {recipe.time}</span>
                      <span className="flex items-center gap-1"><FiUsers /> {recipe.servings} servings</span>
                      <Badge variant="success" size="small">{recipe.difficulty}</Badge>
                    </div>
                    <Button variant="outline" fullWidth>View Recipe</Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {recipes.length === 0 && !isGenerating && (
          <div className="text-center py-16 animate-fade-in">
            <Circle className="w-16 h-16 mx-auto mb-4 opacity-50 text-text-tertiary" />
            <p className="text-base text-text-tertiary">
              Add ingredients above and generate personalized recipes!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MenuGenerator;
