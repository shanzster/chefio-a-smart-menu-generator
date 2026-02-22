import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCamera, FiX, FiUsers, FiHome } from 'react-icons/fi';
import { User, Pizza, Salad, Beef, UtensilsCrossed, CookingPot } from 'lucide-react';

const Navigation = () => {
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

  return (
    <>
      {/* Header - Desktop: Frosted Pill Navbar, Mobile: Hidden (FAB instead) */}
      <header className="hidden lg:flex items-center justify-center py-4 z-50 absolute top-0 left-0 right-0">
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
                to="/" 
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl text-text font-medium hover:bg-primary hover:text-white transition-all duration-300 whitespace-nowrap animate-slide-in-right"
                style={{ animationDelay: '0.05s' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiHome className="w-5 h-5" />
                Home
              </Link>
              <Link 
                to="/menu-generator" 
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl text-text font-medium hover:bg-primary hover:text-white transition-all duration-300 whitespace-nowrap animate-slide-in-right"
                style={{ animationDelay: '0.1s' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UtensilsCrossed className="w-5 h-5" />
                Smart Menu
              </Link>
              <Link 
                to="/scanner" 
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl text-text font-medium hover:bg-primary hover:text-white transition-all duration-300 whitespace-nowrap animate-slide-in-right"
                style={{ animationDelay: '0.15s' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiCamera className="w-5 h-5" />
                Food Scanner
              </Link>
              <Link 
                to="/register" 
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl text-text font-medium hover:bg-primary hover:text-white transition-all duration-300 whitespace-nowrap animate-slide-in-right"
                style={{ animationDelay: '0.2s' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiUsers className="w-5 h-5" />
                Sign Up
              </Link>
              <Link 
                to="/login" 
                className="flex items-center gap-3 px-6 py-3 bg-primary rounded-full shadow-xl text-white font-medium hover:bg-primary-dark transition-all duration-300 whitespace-nowrap animate-slide-in-right"
                style={{ animationDelay: '0.25s' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Navigation;
