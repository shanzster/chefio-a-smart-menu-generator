import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { FaApple, FaAndroid } from 'react-icons/fa';

const AddToHomeButton = ({ 
  variant = 'primary', 
  size = 'medium', 
  className = '',
  customText = null,
  subtitle = null
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasAutoPrompted, setHasAutoPrompted] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if we've already auto-prompted in this session
    const hasPrompted = sessionStorage.getItem('pwa-auto-prompted');
    if (hasPrompted) {
      setHasAutoPrompted(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('📱 [PWA] beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      // Auto-prompt on first visit (after a short delay)
      if (!hasPrompted) {
        setTimeout(() => {
          console.log('🚀 [PWA] Auto-showing install prompt');
          e.prompt();
          sessionStorage.setItem('pwa-auto-prompted', 'true');
          setHasAutoPrompted(true);

          e.userChoice.then((choiceResult) => {
            console.log(`👤 [PWA] User response: ${choiceResult.outcome}`);
            if (choiceResult.outcome === 'accepted') {
              console.log('✅ [PWA] User accepted the install prompt');
            } else {
              console.log('❌ [PWA] User dismissed the install prompt');
            }
          });
        }, 2000); // Wait 2 seconds after page load
      }
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('✅ [PWA] App installed successfully');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('⚠️ [PWA] No install prompt available yet');
      // Show a helpful message to the user
      alert('To install this app:\n\n' +
            'Desktop (Chrome/Edge):\n' +
            '• Look for the install icon in the address bar\n' +
            '• Or check browser menu > "Install Chefio"\n\n' +
            'Mobile (Android):\n' +
            '• Tap browser menu > "Install app" or "Add to Home screen"\n\n' +
            'Mobile (iOS Safari):\n' +
            '• Tap Share button > "Add to Home Screen"');
      return;
    }

    console.log('🚀 [PWA] Showing install prompt');
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`👤 [PWA] User response: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('✅ [PWA] User accepted the install prompt');
    } else {
      console.log('❌ [PWA] User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Don't show button if already installed
  if (isInstalled) {
    return null;
  }

  // If not installable yet, show button but it won't do anything (visual only)
  // This ensures the button is always visible for consistent UI

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl',
    glass: 'glass-enhanced text-text hover:bg-white/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
  };

  const buttonText = customText || 'Add to Home Screen';

  return (
    <button
      onClick={handleInstallClick}
      className={`
        inline-flex flex-col items-center justify-center gap-2 rounded-2xl font-medium
        transition-all duration-300 hover:scale-105 active:scale-95
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold">{buttonText}</span>
      </div>
      
      {/* Platform logos */}
      <div className="flex items-center gap-3 text-sm opacity-90">
        <div className="flex items-center gap-1.5">
          <FaApple className="text-lg" />
          <span className="text-xs font-medium">iOS</span>
        </div>
        <div className="w-px h-4 bg-current opacity-30"></div>
        <div className="flex items-center gap-1.5">
          <FaAndroid className="text-lg" />
          <span className="text-xs font-medium">Android</span>
        </div>
      </div>
      
      {subtitle && (
        <span className="text-xs opacity-75 mt-1">
          {subtitle}
        </span>
      )}
    </button>
  );
};

export default AddToHomeButton;
