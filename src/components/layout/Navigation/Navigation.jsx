import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiBook, 
  FiPlusCircle, 
  FiActivity,
  FiMaximize2,
  FiCamera,
  FiUser,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { 
  GiCookingPot,
  GiFruitBowl,
  GiKnifeFork,
  GiSlicedBread,
  GiCakeSlice,
  GiMeat,
  GiCarrot,
  GiChefToque
} from 'react-icons/gi';
import { useAuthStore } from '../../../store/authStore';

// Main navigation items (without Create button for desktop)
const mainNavItems = [
  { path: '/cook/dashboard', icon: FiHome, label: 'Home' },
  { path: '/cook/recipes', icon: FiBook, label: 'Recipes' },
  { path: '/cook/nutrition', icon: FiActivity, label: 'Nutrition' },
  { path: '/cook/qr-generator', icon: FiMaximize2, label: 'Share' },
];

// Create button item (for mobile homebar)
const createItem = { path: '/cook/menu-generator', icon: FiPlusCircle, label: 'Create', isMain: true };

// Tools section
const toolsItems = [
  { path: '/scanner', icon: FiCamera, label: 'Scanner' },
];

// Account section
const accountItems = [
  { path: '/cook/profile', icon: FiUser, label: 'Profile' },
  { path: '/cook/settings', icon: FiSettings, label: 'Settings' },
];

// Cooking-related icons for the Create button animation
const cookingIcons = [
  GiCookingPot,
  GiFruitBowl,
  GiKnifeFork,
  GiSlicedBread,
  GiCakeSlice,
  GiMeat,
  GiCarrot,
  GiChefToque,
];

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [currentCookingIconIndex, setCurrentCookingIconIndex] = useState(0);
  const [iconOpacity, setIconOpacity] = useState(1);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Cycle through cooking icons every 1.5 seconds with subtle fade transition
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIconOpacity(0);
      
      // After fade out, change icon and fade in
      setTimeout(() => {
        setCurrentCookingIconIndex((prev) => (prev + 1) % cookingIcons.length);
        setIconOpacity(1);
      }, 200); // Half of transition duration
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const renderNavItem = (item, isActive) => {
    const Icon = item.icon;
    
    // Special styling for main action button with animated cooking icons
    if (item.isMain) {
      const CurrentCookingIcon = cookingIcons[currentCookingIconIndex];
      
      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={`
            flex items-center justify-center
            w-14 h-14 rounded-2xl
            transition-all duration-300
            relative group/item
            bg-gradient-to-br from-primary to-primary-dark
            text-white shadow-primary
            hover:scale-110 hover:shadow-primary-lg hover:rotate-3
            ${isActive ? 'ring-2 ring-primary/30 scale-105' : ''}
          `}
          title={item.label}
        >
          <CurrentCookingIcon className="text-xl transition-all duration-500 ease-in-out" />
          
          {/* Tooltip */}
          <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-text text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 shadow-lg">
            {item.label}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-text rotate-45" />
          </span>
        </NavLink>
      );
    }
    
    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={`
          flex items-center justify-center
          w-12 h-12 rounded-xl
          transition-all duration-300
          relative group/item
          ${isActive 
            ? 'bg-primary text-white shadow-primary' 
            : 'text-text-tertiary hover:bg-white/60 hover:text-text'
          }
        `}
        title={item.label}
      >
        <Icon className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover/item:scale-110'}`} />
        
        {/* Active indicator dot */}
        {isActive && !item.isMain && (
          <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
        )}
        
        {/* Tooltip */}
        <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-text text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 shadow-lg">
          {item.label}
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-text rotate-45" />
        </span>
      </NavLink>
    );
  };

  // Get current cooking icon for floating button
  const CurrentCookingIcon = cookingIcons[currentCookingIconIndex];
  const isCreateActive = location.pathname === createItem.path;

  return (
    <>
      <nav className="dock">
      {/* Mobile: Enhanced horizontal layout with Create in middle */}
      <div className="flex items-center justify-center gap-1 lg:hidden">
        {/* First half of nav items */}
        {mainNavItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center gap-1 p-2.5 min-w-[60px] max-w-[72px]
                no-underline transition-all duration-300 active:scale-[0.92]
                rounded-2xl relative
                ${isActive ? 'text-primary' : 'text-text-tertiary'}
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
              )}
              
              <span className={`
                relative w-7 h-7 flex items-center justify-center
                ${isActive ? 'bg-primary/10 rounded-xl' : ''}
                transition-all duration-300
              `}>
                <Icon className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 text-primary' : ''}`} />
              </span>
              <span className={`
                text-[10px] font-medium text-center transition-all duration-300
                ${isActive ? 'font-semibold text-primary' : 'font-medium'}
              `}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
        
        {/* Create button in the middle */}
        {(() => {
          const isActive = location.pathname === createItem.path;
          const CurrentCookingIcon = cookingIcons[currentCookingIconIndex];
          
          return (
            <NavLink
              to={createItem.path}
              className={`
                flex flex-col items-center justify-center gap-1 p-2.5 min-w-[60px] max-w-[72px]
                no-underline transition-all duration-300 active:scale-[0.92]
                rounded-2xl relative
              `}
            >
              <span className={`
                w-12 h-12 rounded-2xl flex items-center justify-center relative
                bg-gradient-to-br from-primary to-primary-dark
                shadow-primary text-white text-xl
                transition-all duration-300 hover:scale-110 hover:rotate-3
                ${isActive ? 'scale-[1.05] shadow-primary-lg ring-2 ring-primary/30' : ''}
              `}>
                <CurrentCookingIcon 
                  className="text-xl transition-opacity duration-400 ease-in-out" 
                  style={{ opacity: iconOpacity }}
                />
              </span>
              <span className={`
                text-[10px] font-medium text-center transition-all duration-300
                ${isActive ? 'font-semibold text-primary' : 'font-medium text-text-tertiary'}
              `}>
                {createItem.label}
              </span>
            </NavLink>
          );
        })()}
        
        {/* Second half of nav items */}
        {mainNavItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center gap-1 p-2.5 min-w-[60px] max-w-[72px]
                no-underline transition-all duration-300 active:scale-[0.92]
                rounded-2xl relative
                ${isActive ? 'text-primary' : 'text-text-tertiary'}
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
              )}
              
              <span className={`
                relative w-7 h-7 flex items-center justify-center
                ${isActive ? 'bg-primary/10 rounded-xl' : ''}
                transition-all duration-300
              `}>
                <Icon className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 text-primary' : ''}`} />
              </span>
              <span className={`
                text-[10px] font-medium text-center transition-all duration-300
                ${isActive ? 'font-semibold text-primary' : 'font-medium'}
              `}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
      
      {/* Desktop: Clean icon-based sidebar with sections */}
      <div className="hidden lg:flex flex-col h-full justify-between py-4">
        {/* Main Navigation Section - Top */}
        <div className="flex flex-col items-center gap-4">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return renderNavItem(item, isActive);
          })}
        </div>

        {/* Divider */}
        <div className="w-10 h-px bg-black/10 mx-auto" />

        {/* Tools Section - Middle */}
        <div className="flex flex-col items-center gap-4">
          {toolsItems.map((item) => {
            const isActive = location.pathname === item.path;
            return renderNavItem(item, isActive);
          })}
        </div>

        {/* Divider */}
        <div className="w-10 h-px bg-black/10 mx-auto" />

        {/* Account Section - Bottom */}
        <div className="flex flex-col items-center gap-4">
          {accountItems.map((item) => {
            const isActive = location.pathname === item.path;
            return renderNavItem(item, isActive);
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-12 h-12 rounded-xl text-text-tertiary hover:bg-red-50 hover:text-error transition-all duration-300 relative group/item"
            title="Logout"
          >
            <FiLogOut className="text-xl transition-transform duration-300 group-hover/item:scale-110" />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-text text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 shadow-lg">
              Logout
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-text rotate-45" />
            </span>
          </button>
        </div>
      </div>
    </nav>
    
    {/* Desktop: Floating Create Button */}
    <NavLink
      to={createItem.path}
      className="hidden lg:flex fixed right-8 bottom-8 z-40 items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-primary hover:scale-110 hover:shadow-primary-lg hover:rotate-3 transition-all duration-300 group/item"
      title={createItem.label}
    >
      <CurrentCookingIcon 
        className="text-2xl transition-opacity duration-400 ease-in-out" 
        style={{ opacity: iconOpacity }}
      />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-2.5 py-1.5 bg-text text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 shadow-lg">
        {createItem.label}
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-text rotate-45" />
      </span>
      
      {/* Active indicator ring */}
      {isCreateActive && (
        <span className="absolute inset-0 rounded-full ring-2 ring-primary/30 animate-pulse-glow" />
      )}
    </NavLink>
    </>
  );
};

// Export profile button and menu state for Layout
export const useMobileProfileMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const ProfileButton = () => (
    <button
      onClick={toggleMobileMenu}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center
        bg-gradient-to-br from-secondary/20 to-secondary/10
        border-2 ${isMobileMenuOpen ? 'border-primary' : 'border-secondary/30'}
        transition-all duration-300 active:scale-95
        ${isMobileMenuOpen ? 'ring-2 ring-primary/30' : ''}
      `}
    >
      {user?.name ? (
        <span className="text-sm font-semibold text-text">
          {user.name.charAt(0).toUpperCase()}
        </span>
      ) : (
        <FiUser className="text-lg text-text-tertiary" />
      )}
    </button>
  );

  const MobileMenu = () => (
    <>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
          
          {/* Menu */}
          <div className={`
            fixed bottom-20 left-1/2 -translate-x-1/2 z-50 lg:hidden
            glass-enhanced rounded-2xl p-4 shadow-xl
            min-w-[280px] max-w-[90%]
            transition-all duration-300
            ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}>
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-black/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/30">
                {user?.name ? (
                  <span className="text-lg font-semibold text-text">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <FiUser className="text-xl text-text-tertiary" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-text-tertiary">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            
            {/* Tools Section */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2 px-2">
                Tools
              </p>
              {toolsItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl
                      no-underline transition-all duration-200
                      ${isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-text hover:bg-white/60'
                      }
                    `}
                  >
                    <Icon className="text-xl" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            
            {/* Account Section */}
            <div>
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2 px-2">
                Account
              </p>
              {accountItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl
                      no-underline transition-all duration-200
                      ${isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-text hover:bg-white/60'
                      }
                    `}
                  >
                    <Icon className="text-xl" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-red-50 transition-all duration-200"
              >
                <FiLogOut className="text-xl" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );

  return { ProfileButton, MobileMenu };
};

export default Navigation;
