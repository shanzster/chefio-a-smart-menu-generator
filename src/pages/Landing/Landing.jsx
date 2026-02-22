import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBook, FiActivity, FiShare2, FiCamera, FiClock, FiUsers, FiZap, FiCheck, FiTrendingUp, FiAward, FiHeart, FiTarget, FiLayers, FiBarChart, FiMenu, FiX } from 'react-icons/fi';
import { User, Circle, Star, Square, Leaf, Lightbulb, Pizza, Salad, Beef, UtensilsCrossed, CookingPot } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import AddToHomeButton from '../../components/common/AddToHomeButton/AddToHomeButton';

const features = [
  {
    icon: FiBook,
    title: 'Smart Recipe Generator',
    description: 'AI-powered recipe generation that creates delicious meals from whatever ingredients you have. No more wondering what to cook - just input your ingredients and get personalized recipe suggestions instantly.',
    details: 'Our advanced algorithm analyzes ingredient combinations, cooking methods, and flavor profiles to suggest recipes that match your available ingredients perfectly.'
  },
  {
    icon: FiCamera,
    title: 'Ingredient Scanner',
    description: 'Point your camera at any ingredient and instantly identify it. Perfect for students learning about different foods and aspiring chefs expanding their knowledge.',
    details: 'Powered by advanced image recognition technology, our scanner can identify hundreds of ingredients, helping you build your culinary vocabulary and confidence in the kitchen.'
  },
  {
    icon: FiActivity,
    title: 'Nutrition Analysis',
    description: 'Get detailed nutritional breakdowns for any recipe or meal. Track calories, macros, vitamins, and minerals to make informed dietary choices.',
    details: 'Comprehensive nutrition tracking helps you understand what you\'re eating, making it easier to maintain a balanced diet and meet your health goals.'
  },
  {
    icon: FiShare2,
    title: 'QR Code Sharing',
    description: 'Share your culinary creations with friends, family, or classmates instantly. Generate QR codes that link directly to your recipes with full ingredient lists and instructions.',
    details: 'Perfect for group projects, sharing meal prep ideas, or showcasing your recipes. Anyone can scan and access your recipe instantly, no app required.'
  }
];

const benefits = [
  {
    icon: FiClock,
    title: 'Save Time',
    description: 'Stop wasting time searching for recipes. Get instant suggestions based on what you already have in your kitchen.',
    stat: '85% faster'
  },
  {
    icon: FiTrendingUp,
    title: 'Reduce Food Waste',
    description: 'Use ingredients you already have instead of buying new ones. Our system helps you make the most of what\'s in your pantry.',
    stat: '40% less waste'
  },
  {
    icon: FiAward,
    title: 'Learn & Grow',
    description: 'Perfect for hospitality students and aspiring chefs. Learn about ingredients, techniques, and nutrition as you cook.',
    stat: '1000+ recipes'
  },
  {
    icon: FiHeart,
    title: 'Healthy Choices',
    description: 'Make informed decisions about your meals with detailed nutrition information. Track your dietary goals effortlessly.',
    stat: 'Full nutrition data'
  }
];

const howItWorks = [
  {
    step: '01',
    title: 'Add Your Ingredients',
    description: 'Simply type in or scan the ingredients you have available. Our system recognizes hundreds of common ingredients and can suggest alternatives.',
    icon: FiLayers
  },
  {
    step: '02',
    title: 'Get Recipe Suggestions',
    description: 'Our AI analyzes your ingredients and generates personalized recipe recommendations. Each suggestion includes prep time, servings, and difficulty level.',
    icon: FiZap
  },
  {
    step: '03',
    title: 'View Nutrition Info',
    description: 'See complete nutritional breakdowns including calories, protein, carbs, fats, vitamins, and minerals for every recipe.',
    icon: FiBarChart
  },
  {
    step: '04',
    title: 'Share & Cook',
    description: 'Generate QR codes to share your recipes, or save them to your collection. Follow step-by-step instructions and create amazing meals.',
    icon: FiShare2
  }
];

const useCases = [
  {
    title: 'For Students',
    description: 'Perfect for hospitality and culinary students learning about ingredients, recipes, and nutrition. Use it for assignments, meal planning, and expanding your culinary knowledge.',
    icon: FiBook
  },
  {
    title: 'For Home Cooks',
    description: 'Transform your kitchen into a creative space. Never waste ingredients again - turn leftovers and pantry staples into delicious meals with our smart suggestions.',
    icon: FiHeart
  },
  {
    title: 'For Meal Prep',
    description: 'Plan your weekly meals efficiently. Generate recipes that use similar ingredients, helping you shop smarter and prep faster for the week ahead.',
    icon: FiTarget
  },
  {
    title: 'For Sharing',
    description: 'Share your favorite recipes with friends and family through QR codes. Great for potlucks, family gatherings, or teaching others to cook.',
    icon: FiUsers
  }
];

const faqs = [
  {
    question: 'How does the recipe generator work?',
    answer: 'Our AI-powered system analyzes the ingredients you provide and matches them with thousands of recipes in our database. It considers flavor compatibility, cooking methods, and nutritional balance to suggest the best recipes for your available ingredients.'
  },
  {
    question: 'Do I need to create an account?',
    answer: 'You can use the basic recipe generator without an account, but creating a free account gives you access to saving recipes, creating collections, tracking your cooking history, and sharing recipes via QR codes.'
  },
  {
    question: 'Is the ingredient scanner accurate?',
    answer: 'Our scanner uses advanced image recognition technology and can identify hundreds of common ingredients with high accuracy. For best results, ensure good lighting and a clear view of the ingredient.'
  },
  {
    question: 'Can I customize recipes?',
    answer: 'Yes! Once you generate a recipe, you can modify ingredients, adjust serving sizes, and save your customized versions. All changes automatically update the nutrition information.'
  },
  {
    question: 'How accurate is the nutrition information?',
    answer: 'Our nutrition data comes from comprehensive food databases and is calculated based on standard serving sizes. While we strive for accuracy, actual values may vary slightly based on specific brands and preparation methods.'
  },
  {
    question: 'Can I share recipes with people who don\'t have the app?',
    answer: 'Absolutely! When you generate a QR code, anyone can scan it with their phone camera to view the recipe in their browser. No app download required.'
  }
];

const Landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fabIconIndex, setFabIconIndex] = useState(0);
  
  // Food-related icons for FAB rotation
  const fabIcons = [
    UtensilsCrossed,
    Pizza,
    Salad,
    Beef,
    CookingPot,
    FiCamera
  ];

  // Rotate FAB icon every 2 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFabIconIndex((prev) => (prev + 1) % fabIcons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const CurrentFabIcon = isMobileMenuOpen ? FiX : fabIcons[fabIconIndex];
  
  // Floating cooking ingredients for animation
  const cookingIngredients = [
    { Icon: Pizza, color: 'text-orange-500' },
    { Icon: Beef, color: 'text-red-500' },
    { Icon: Salad, color: 'text-green-500' },
    { Icon: CookingPot, color: 'text-amber-600' },
    { Icon: UtensilsCrossed, color: 'text-purple-500' },
    { Icon: Pizza, color: 'text-yellow-600' },
    { Icon: Beef, color: 'text-amber-700' },
    { Icon: Salad, color: 'text-red-600' },
    { Icon: CookingPot, color: 'text-green-600' },
    { Icon: UtensilsCrossed, color: 'text-yellow-400' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col p-6 lg:px-24 lg:py-12 overflow-hidden">
        {/* Cooking-themed background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Warm gradient orbs */}
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-orange-200/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] -left-[20%] w-[500px] h-[500px] bg-red-200/20 rounded-full blur-[100px]" />
          <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-amber-200/25 rounded-full blur-[80px]" />
          
          {/* Floating cooking ingredients */}
          {cookingIngredients.map(({ Icon, color }, index) => (
            <div
              key={index}
              className={`absolute opacity-20 animate-float ${color}`}
              style={{
                left: `${10 + index * 8}%`,
                top: `${20 + (index % 3) * 25}%`,
                animationDelay: `${index * 0.3}s`,
                animationDuration: `${4 + (index % 3)}s`
              }}
            >
              <Icon className="w-8 h-8 lg:w-10 lg:h-10" />
            </div>
          ))}
        </div>

        {/* Floating Recipe Cards - visible in hero section only on larger screens */}
        <div className="hidden lg:block absolute right-[5%] top-[20%] z-0 pointer-events-none opacity-60">
          <div className="relative w-[320px]">
            {/* Recipe card showcase */}
            <div className="glass-enhanced rounded-2xl p-6 shadow-2xl rotate-3 animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  <Pizza className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Pasta Carbonara</h3>
                  <p className="text-sm text-text-secondary">25 mins • 4 servings</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Pasta</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Eggs</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Bacon</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute left-[5%] top-[50%] z-0 pointer-events-none opacity-60">
          <div className="relative w-[320px]">
            {/* Recipe card showcase 2 */}
            <div className="glass-enhanced rounded-2xl p-6 shadow-2xl -rotate-3 animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Salad className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Caesar Salad</h3>
                  <p className="text-sm text-text-secondary">15 mins • 2 servings</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/10 text-green-700 rounded-full text-xs font-medium">Lettuce</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-700 rounded-full text-xs font-medium">Cheese</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-700 rounded-full text-xs font-medium">Croutons</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute right-[8%] bottom-[15%] z-0 pointer-events-none opacity-60">
          <div className="relative w-[320px]">
            {/* Recipe card showcase 3 */}
            <div className="glass-enhanced rounded-2xl p-6 shadow-2xl rotate-6 animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Beef className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Chicken Stir Fry</h3>
                  <p className="text-sm text-text-secondary">30 mins • 3 servings</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full text-xs font-medium">Chicken</span>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full text-xs font-medium">Veggies</span>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full text-xs font-medium">Soy Sauce</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header - Desktop: Frosted Pill Navbar, Mobile: Hidden (FAB instead) */}
        <header className="hidden lg:flex items-center justify-center py-4 z-10">
          <nav className="flex items-center gap-2 px-6 py-3 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-full shadow-lg">
            <Link to="/menu-generator" className="text-sm font-medium text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
              Smart Menu
            </Link>
            <Link to="/scanner" className="text-sm font-medium text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
              Food Scanner
            </Link>
            <Link to="/register" className="text-sm font-medium text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
              Sign Up
            </Link>
            <Link to="/login" className="text-sm font-medium text-white bg-primary px-5 py-2 rounded-full hover:bg-primary-dark transition-all duration-300 shadow-md">
              Sign In
            </Link>
          </nav>
        </header>

        {/* Mobile FAB - Only visible on mobile */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          {/* FAB Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300"
          >
            <div className="transition-all duration-500 ease-in-out transform" key={isMobileMenuOpen ? 'close' : fabIconIndex}>
              <CurrentFabIcon className="text-2xl animate-fade-in" />
            </div>
          </button>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10 animate-fade-in"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Menu Items */}
              <div className="absolute bottom-20 right-0 flex flex-col gap-3">
                <Link 
                  to="/menu-generator" 
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl text-text font-medium hover:bg-primary hover:text-white transition-all duration-300 whitespace-nowrap animate-slide-in-right"
                  style={{ animationDelay: '0.05s' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  Smart Menu
                </Link>
                <Link 
                  to="/scanner" 
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl text-text font-medium hover:bg-primary hover:text-white transition-all duration-300 whitespace-nowrap animate-slide-in-right"
                  style={{ animationDelay: '0.1s' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiCamera className="w-5 h-5" />
                  Food Scanner
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl text-text font-medium hover:bg-primary hover:text-white transition-all duration-300 whitespace-nowrap animate-slide-in-right"
                  style={{ animationDelay: '0.15s' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUsers className="w-5 h-5" />
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  className="flex items-center gap-3 px-6 py-3 bg-primary rounded-full shadow-xl text-white font-medium hover:bg-primary-dark transition-all duration-300 whitespace-nowrap animate-slide-in-right"
                  style={{ animationDelay: '0.2s' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Hero content */}
        <div className="flex-1 flex flex-col justify-center max-w-[700px] lg:max-w-[800px] py-10 z-10">
          <div className="mb-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-5 py-2 glass-enhanced rounded-full text-sm font-medium text-text-secondary transition-all hover:scale-105">
              <User className="w-5 h-5 text-primary" />
              For Students & Aspiring Chefs
            </span>
          </div>
          
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.1] text-text tracking-tight mb-6 animate-fade-in-up animation-delay-100">
            Turn Ingredients<br />
            Into <span className="gradient-animated">Masterpieces</span>
          </h1>
          
          <p className="text-base lg:text-lg leading-relaxed text-text-secondary mb-10 animate-fade-in-up animation-delay-200">
            Your smart kitchen companion designed for students and aspiring chefs. Generate personalized recipes from your available ingredients, 
            scan and identify foods instantly, analyze complete nutrition information, and share your culinary creations with the world through QR codes. 
            Transform your cooking experience with AI-powered recipe suggestions that help you reduce waste, save time, and create amazing meals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
            <Button to="/menu-generator" size="large" icon={<FiArrowRight />} iconPosition="right" className="glow">
              Start Cooking Now
            </Button>
            <AddToHomeButton 
              variant="glass" 
              size="large" 
              className="hover-lift"
              customText="Install the App"
            />
          </div>
          
          {/* Cooking stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12 animate-fade-in-up animation-delay-400">
            <div className="text-center lg:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">10K+</div>
              <div className="text-xs text-text-secondary">Recipes Generated</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">5K+</div>
              <div className="text-xs text-text-secondary">Active Users</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-xs text-text-secondary">Meals Shared</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">1000+</div>
              <div className="text-xs text-text-secondary">Ingredients Database</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-24 lg:py-24 bg-gradient-to-b from-white to-amber-50/30 relative overflow-hidden">
        {/* Cooking utensils decoration */}
        <div className="absolute top-10 right-10 opacity-10 rotate-12">
          <UtensilsCrossed className="w-16 h-16 text-text-tertiary" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-10 -rotate-12">
          <CookingPot className="w-14 h-14 text-text-tertiary" />
        </div>
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold mb-4 leading-[1.2]">
              Your Complete <span className="text-primary">Kitchen Toolkit</span>
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto">
              Everything you need to create amazing dishes, from ingredient scanning to recipe sharing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="bg-white rounded-2xl p-8 lg:p-10 animate-fade-in-up interactive-card shadow-lg hover:shadow-xl border border-white/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110 hover:rotate-3">
                    <feature.icon className="text-primary text-2xl lg:text-3xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg lg:text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm lg:text-base text-text-secondary leading-relaxed mb-3">{feature.description}</p>
                    <p className="text-xs text-text-tertiary leading-relaxed">{feature.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Benefits Section */}
          <div className="mt-20">
            <h3 className="text-xl lg:text-2xl font-bold text-center mb-12">Why Choose Chefio?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={benefit.title}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-6 lg:p-8 animate-fade-in-up border border-white/50 hover:bg-white/80 transition-all"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="text-primary text-xl" />
                  </div>
                  <div className="text-xl font-bold text-primary mb-2">{benefit.stat}</div>
                  <h4 className="text-base font-semibold mb-2">{benefit.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-24 lg:py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold mb-4 leading-[1.2]">
              How <span className="text-primary">Chefio</span> Works
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto">
              Get started in minutes. Our simple 4-step process makes cooking easier than ever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {howItWorks.map((step, index) => (
              <div 
                key={step.step}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 lg:p-10 text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-5xl font-bold text-primary/20 mb-4">{step.step}</div>
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="text-primary text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 lg:px-24 lg:py-24 bg-gradient-to-b from-amber-50/50 to-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold mb-4 leading-[1.2]">
              Perfect For <span className="text-primary">Everyone</span>
            </h2>
            <p className="text-base text-text-secondary max-w-2xl mx-auto">
              Whether you're a student, home cook, or meal prep enthusiast, Chefio adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {useCases.map((useCase, index) => (
              <div 
                key={useCase.title}
                className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border border-white/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="text-primary text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg lg:text-xl font-bold mb-3">{useCase.title}</h3>
                    <p className="text-sm lg:text-base text-text-secondary leading-relaxed">{useCase.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 lg:px-24 lg:py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold mb-4 leading-[1.2]">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-base text-text-secondary">
              Everything you need to know about Chefio
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white border-2 border-gray-100 rounded-xl p-6 lg:p-8 hover:border-primary/30 transition-all duration-300 animate-fade-in-up shadow-sm hover:shadow-md"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-base lg:text-lg font-bold mb-3 flex items-start gap-3">
                  <FiCheck className="text-primary mt-1 flex-shrink-0" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-24 lg:py-24 bg-gradient-to-br from-primary/5 via-amber-50/50 to-orange-50/50 relative overflow-hidden">
        {/* Cooking icons floating */}
        <div className="absolute top-20 left-20 opacity-20 animate-float">
          <UtensilsCrossed className="w-14 h-14 text-primary" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <CookingPot className="w-14 h-14 text-primary" />
        </div>
        
        <div className="max-w-[600px] mx-auto text-center glass-enhanced rounded-3xl p-12 lg:p-16 shadow-2xl animate-scale-in-up relative z-10">
          <div className="mb-6 animate-bounce flex justify-center">
            <FiZap className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready to start cooking?</h2>
          <p className="text-base text-text-secondary mb-10">
            Join thousands of students and chefs discovering new recipes every day. 
            Turn your kitchen into a culinary adventure!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button to="/menu-generator" size="large" className="flex-1 glow">
              Start Cooking Free
            </Button>
            <AddToHomeButton 
              variant="outline" 
              size="large" 
              className="flex-1 hover-lift"
              customText="Install the App"
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 lg:px-24 lg:py-24 bg-gradient-to-br from-primary via-primary-dark to-secondary relative overflow-hidden">
        <div className="max-w-[800px] mx-auto text-center text-white relative z-10">
          <h2 className="text-2xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Kitchen?
          </h2>
          <p className="text-base lg:text-lg mb-10 text-white/90 leading-relaxed">
            Join thousands of students and chefs who are already creating amazing meals with Chefio. 
            Start your culinary journey today - it's free, easy, and fun!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/menu-generator" size="large" className="bg-white hover:bg-white/90 hover:scale-105">
              <span className="text-primary">Try It Free Now</span>
            </Button>
            <AddToHomeButton 
              variant="outline" 
              size="large" 
              className="border-2 border-white text-white hover:bg-white/10 hover:scale-105"
              customText="Install the App"
            />
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <FiCheck className="text-white" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-white" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-white" />
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-24 bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-text">Chefio</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Your smart kitchen companion for students and aspiring chefs. Generate recipes, scan ingredients, and share your culinary creations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link to="/menu-generator" className="hover:text-primary transition-colors">Recipe Generator</Link></li>
                <li><Link to="/scanner" className="hover:text-primary transition-colors">Ingredient Scanner</Link></li>
                <li><Link to="/cook/nutrition" className="hover:text-primary transition-colors">Nutrition Analysis</Link></li>
                <li><Link to="/cook/qr-generator" className="hover:text-primary transition-colors">QR Sharing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><a href="#" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Recipe Database</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Nutrition Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cooking Tips</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link to="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
                <li><Link to="/menu-generator" className="hover:text-primary transition-colors">Try Free</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-text-tertiary">
              © 2024 Chefio. A Smart Menu Generator for Hospitality Students & Aspiring Chefs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
