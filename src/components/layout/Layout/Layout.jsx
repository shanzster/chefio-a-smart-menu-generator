import React from 'react';
import PropTypes from 'prop-types';
import Navigation, { useMobileProfileMenu } from '../Navigation/Navigation';

const Layout = ({ 
  children, 
  showNavigation = true,
  className = '',
}) => {
  const { ProfileButton, MobileMenu } = useMobileProfileMenu();

  return (
    <div className={`min-h-screen min-h-[100dvh] bg-background relative overflow-hidden ${className}`}>
      {/* Background decoration for web */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>
      
      {/* Mobile Header with Profile */}
      {showNavigation && (
        <header className="lg:hidden sticky top-0 left-0 right-0 z-40 bg-white/72 backdrop-blur-lg border-b border-black/5">
          <div className="flex items-center justify-end h-14 px-4">
            <ProfileButton />
          </div>
        </header>
      )}
      
      {showNavigation && <Navigation />}
      <main className={showNavigation ? 'pb-24 lg:pb-12 lg:pl-32 lg:pr-12 relative z-10' : 'relative z-10'}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile Menu */}
      {showNavigation && <MobileMenu />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  showNavigation: PropTypes.bool,
  className: PropTypes.string,
};

export default Layout;
