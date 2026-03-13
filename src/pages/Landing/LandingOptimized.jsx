import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBook, FiActivity, FiShare2, FiCamera, FiClock, FiUsers, FiZap, FiCheck, FiTrendingUp, FiAward, FiHeart, FiTarget, FiLayers, FiBarChart, FiX } from 'react-icons/fi';
import { User, Pizza, Salad, Beef, UtensilsCrossed, CookingPot } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import AddToHomeButton from '../../components/common/AddToHomeButton/AddToHomeButton';
import AuthDebug from '../../components/debug/AuthDebug';

// Memoized static data
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

// Memoized FAB icons array
const FAB_ICONS = [UtensilsCrossed, Pizza, Salad, Beef, CookingPot, FiCamera];

// Reduced floating ingredients (from 10 to 4)
const FLOATING_INGREDIENTS = [
  { Icon: Pizza, color: 'text-orange-500', left: '15%', top: '25%' },
  { Icon: Salad, color: 'text-green-500', left: '85%', top: '35%' },
  { Icon: CookingPot, color: 'text-amber-600', left: '20%', top: '70%' },
  { Icon: UtensilsCrossed, color: 'text-purple-500', left: '80%', top: '75%' }
];

const Landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fabIconIndex, setFabIconIndex] = useState(0);

  // Memoize FAB icon rotation - increased interval to reduce re-renders
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFabIconIndex((prev) => (prev + 1) % FAB_ICONS.length);
    }, 3000); // Changed from 2s to 3s
    return () => clearInterval(interval);
  }, []);

  const CurrentFabIcon = isMobileMenuOpen ? FiX : FAB_ICONS[fabIconIndex];

  // Memoize toggle handler
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Memoized sections
  const heroSection = useMemo(() => (
    <section className="relative min-h-screen flex flex-col p-6 lg:px-24 lg:py-12 overflow-hidden">
      {/* Simplified background decoration - removed heavy blur effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Simplified gradient orbs - removed blur */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-orange-200/20 rounded-full" />
        <div className="absolute bottom-[10%] -left-[20%] w-[500px] h-[500px] bg-red-200/15 rounded-full" />
        
        {/* Reduced floating ingredients (4 instead of 10) */}
        {FLOATING_INGREDIENTS.map(({ Icon, color, left, top }, index) => (
          <div
            key={index}
            className={`absolute opacity-15 ${color}`}
            style={{
              left,
              top,
              animation: `float ${4 + (index % 2)}s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`,
              willChange: 'transform'
            }}
          >
            <Icon className="w-8 h-8 lg:w-10 lg:h-10" />
          </div>
        ))}
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-center py-4 z-10">
        <nav className="flex items-center gap-2 px-6 py-3 bg-white/80 border border-gray-200 rounded-full shadow-md">
          <Link to="/menu-generator" className="text-sm font-medium text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors duration-200">
            Smart Menu
          </Link>
          <Link to="/scanner" className="text-sm font-medium text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors duration-200">
            Food Scanner
          </Link>
          <Link to="/register" className="text-sm font-medium text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors duration-200">
            Sign Up
          </Link>
          <Link to="/login" className="text-sm font-medium text-white bg-primary px-5 py-2 rounded-full hover:bg-primary-dark transition-colors duration-200 shadow-md">
            Sign In
          </Link>
        </nav>
      </header>

      {/* Mobile FAB */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleMobileMenu}
          className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          <CurrentFabIcon className="text-2xl" />
        </button>

        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/40 -z-10"
              onClick={closeMobileMenu}
            />
            
            <div className="absolute bottom-20 right-0 flex flex-col gap-3">
              <Link 
                to="/menu-generator" 
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl text-text font-medium hover:bg-primary hover:text-white transition-colors duration-200 whitespace-nowrap"
                onClick={closeMobileMenu}
              >
                <UtensilsCrossed className="w-5 h-5" />
                Smart Menu
              </Link>
              <Link 
                to="/scanner" 
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl text-text font-medium hover:bg-primary hover:text-white transition-colors duration-200 whitespace-nowrap"
                onClick={closeMobileMenu}
              >
                <FiCamera className="w-5 h-5" />
                Food Scanner
              </Link>
              <Link 
                to="/register" 
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl text-text font-medium hover:bg-primary hover:text-white transition-colors duration-200 whitespace-nowrap"
                onClick={closeMobileMenu}
              >
                <FiUsers className="w-5 h-5" />
                Sign Up
              </Link>
              <Link 
                to="/login" 
                className="flex items-center gap-3 px-6 py-3 bg-primary rounded-full shadow-xl text-white font-medium hover:bg-primary-dark transition-colors duration-200 whitespace-nowrap"
                onClick={closeMobileMenu}
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
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/70 border border-gray-200 rounded-full text-sm font-medium text-text-secondary">
            <User className="w-5 h-5 text-primary" />
            For Students & Aspiring Chefs
          </span>
        </div>
        
        <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.1] text-text tracking-tight mb-6">
          Turn Ingredients<br />
          Into <span className="text-primary">Masterpieces</span>
        </h1>
        
        <p className="text-base lg:text-lg leading-relaxed text-text-secondary mb-10">
          Your smart kitchen companion designed for students and aspiring chefs. Generate personalized recipes from your available ingredients, 
          scan and identify foods instantly, analyze complete nutrition information, and share your culinary creations with the world through QR codes. 
          Transform your cooking experience with AI-powered recipe suggestions that help you reduce waste, save time, and create amazing meals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button to="/menu-generator" size="large" icon={<FiArrowRight />} iconPosition="right">
            Start Cooking Now
          </Button>
          <AddToHomeButton 
            variant="glass" 
            size="large"
            customText="Install the App"
          />
        </div>
        
        {/* Cooking stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
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
  ), [CurrentFabIcon, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-x-hidden">
      {/* Debug component - only visible in development */}
      <AuthDebug />
      
      {heroSection}

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-24 lg:py-24 bg-gradient-to-b from-white to-amber-50/30 relative overflow-hidden">
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
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/50"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
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
              {benefits.map((benefit) => (
                <div 
                  key={benefit.title}
                  className="bg-white/60 rounded-xl p-6 lg:p-8 border border-white/50 hover:bg-white/80 transition-colors duration-300"
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
                className="relative"
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
            {useCases.map((useCase) => (
              <div 
                key={useCase.title}
                className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/50"
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
                className="bg-white border-2 border-gray-100 rounded-xl p-6 lg:p-8 hover:border-primary/30 transition-colors duration-300 shadow-sm hover:shadow-md"
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
        <div className="absolute top-20 left-20 opacity-20">
          <UtensilsCrossed className="w-14 h-14 text-primary" style={{ animation: 'float 4s ease-in-out infinite' }} />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20">
          <CookingPot className="w-14 h-14 text-primary" style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-[600px] mx-auto text-center bg-white/70 border border-gray-200 rounded-3xl p-12 relative z-10">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold mb-6 leading-[1.2]">
            Ready to Transform Your <span className="text-primary">Cooking?</span>
          </h2>
          <p className="text-base text-text-secondary mb-8">
            Join thousands of students and home cooks who are already creating amazing meals with Chefio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/menu-generator" size="large" icon={<FiArrowRight />} iconPosition="right">
              Start Cooking Free
            </Button>
            <AddToHomeButton 
              variant="outline" 
              size="large"
              customText="Install the App"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-sm text-text-secondary">
            © 2024 Chefio. Made with <span className="text-primary">❤</span> for students and aspiring chefs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
