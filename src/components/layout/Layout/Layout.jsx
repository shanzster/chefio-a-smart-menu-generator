import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../Navigation/Navigation';
import AuthenticatedNav from '../AuthenticatedNav/AuthenticatedNav';
import { useAuthStore } from '../../../store/authStore';

const Layout = ({ 
  children, 
  showNavigation = true,
  className = '',
}) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;

  return (
    <div className={`min-h-screen min-h-[100dvh] bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-red-50/30 relative overflow-hidden ${className}`}>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[50%] right-[30%] w-[400px] h-[400px] bg-amber-300/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Navigation Component - Use AuthenticatedNav if logged in */}
      {showNavigation && (isAuthenticated ? <AuthenticatedNav /> : <Navigation />)}
      
      <main className={`${showNavigation ? (isAuthenticated ? 'lg:pl-28 pt-6 lg:pt-6 pb-6' : 'pt-20 lg:pt-24 pb-6') : ''} relative z-10`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  showNavigation: PropTypes.bool,
  className: PropTypes.string,
};

export default Layout;
