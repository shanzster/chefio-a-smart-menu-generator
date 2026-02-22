import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiActivity, FiShare2, FiUser, FiLogOut, FiSettings, FiX, FiSearch, FiUsers, FiMessageSquare, FiHelpCircle, FiCamera, FiCompass } from 'react-icons/fi';
import { ChefHat, UtensilsCrossed, Pizza, Salad, Beef, CookingPot, Scan } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const AuthenticatedNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fabIconIndex, setFabIconIndex] = useState(0);
  
  // Food-related icons for FAB rotation
  const fabIcons = [
    UtensilsCrossed,
    Pizza,
    Salad,
    Beef,
    CookingPot,
    ChefHat
  ];

  // Rotate FAB icon every 2 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFabIconIndex((prev) => (prev + 1) % fabIcons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const CurrentFabIcon = isMobileMenuOpen ? FiX : fabIcons[fabIconIndex];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/cook/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/scanner', icon: Scan, label: 'Food Scanner' },
    { path: '/cook/menu-generator', icon: UtensilsCrossed, label: 'Generate Menu' },
    { path: '/cook/browse-recipes', icon: FiCompass, label: 'Browse Recipes' },
    { path: '/cook/recipes', icon: FiBook, label: 'My Recipes' },
    { path: '/cook/nutrition', icon: FiActivity, label: 'Nutrition' },
    { path: '/cook/recipe-finder', icon: FiSearch, label: 'Recipe Finder' },
    { path: '/cook/portion-calculator', icon: FiUsers, label: 'Portion Calculator' },
    { path: '/cook/qr-generator', icon: FiShare2, label: 'Share QR' },
    { path: '/cook/feedback', icon: FiMessageSquare, label: 'Feedback' },
    { path: '/cook/support', icon: FiHelpCircle, label: 'Support' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar - Pill Navigation */}
      <aside className="hidden lg:flex fixed left-6 top-6 bottom-6 z-50">
        <div className="flex flex-col gap-4 p-4 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl">
          {/* Logo */}
          <Link 
            to="/cook/dashboard" 
            className="flex items-center justify-center w-14 h-14 rounded-2xl hover:scale-110 transition-transform duration-300"
          >
            <img 
              src="/sidebar_logo.png" 
              alt="Chefio" 
              className="w-14 h-14 object-contain"
            />
          </Link>

          {/* Divider */}
          <div className="w-full h-px bg-gray-200" />

          {/* Navigation Items */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                    : 'text-text-secondary hover:bg-primary/10 hover:text-primary'
                }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {/* Tooltip */}
                <span className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                  {item.label}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Divider */}
          <div className="w-full h-px bg-gray-200" />

          {/* Profile & Settings */}
          <div className="flex flex-col gap-2">
            <Link
              to="/cook/profile"
              className="group relative flex items-center justify-center w-14 h-14 rounded-2xl text-text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-300"
              title="Profile"
            >
              <FiUser className="w-5 h-5 flex-shrink-0" />
              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                Profile
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></span>
              </span>
            </Link>

            <Link
              to="/cook/settings"
              className="group relative flex items-center justify-center w-14 h-14 rounded-2xl text-text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-300"
              title="Settings"
            >
              <FiSettings className="w-5 h-5 flex-shrink-0" />
              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                Settings
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></span>
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="group relative flex items-center justify-center w-14 h-14 rounded-2xl text-text-secondary hover:bg-error/10 hover:text-error transition-all duration-300"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5 flex-shrink-0" />
              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                Logout
                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></span>
              </span>
            </button>
          </div>

          {/* User Avatar */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </aside>

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
            
            {/* Menu Items - 2 Column Grid */}
            <div className="absolute bottom-20 right-0 w-[340px] p-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 animate-slide-in-right">
              <div className="grid grid-cols-2 gap-3">
                {navItems.map((item, index) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg'
                        : 'bg-gray-50 text-text hover:bg-primary/10 hover:text-primary'
                    }`}
                    style={{ animationDelay: `${index * 0.03}s` }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-xs text-center leading-tight">{item.label}</span>
                  </Link>
                ))}
              </div>
              
              {/* Divider */}
              <div className="w-full h-px bg-gray-200 my-3" />
              
              {/* Bottom Actions - 2 Column Grid */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/cook/profile');
                  }}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl text-text font-medium hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <FiUser className="w-6 h-6" />
                  <span className="text-xs">Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex flex-col items-center gap-2 p-4 bg-error/10 rounded-2xl text-error font-medium hover:bg-error/20 transition-all duration-300"
                >
                  <FiLogOut className="w-6 h-6" />
                  <span className="text-xs">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AuthenticatedNav;
