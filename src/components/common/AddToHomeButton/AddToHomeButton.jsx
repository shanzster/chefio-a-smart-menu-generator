import React, { useState, useEffect } from 'react';
import { FiDownload, FiX, FiSmartphone } from 'react-icons/fi';
import { FaApple, FaAndroid, FaChrome } from 'react-icons/fa';
import Modal from '../Modal/Modal';

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
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState('unknown');

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Detect platform
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    
    if (isIOS) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else if (isChrome) {
      setPlatform('chrome');
    } else {
      setPlatform('desktop');
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('📱 [PWA] beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('✅ [PWA] App installed successfully');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowInstructions(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
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
    } else {
      // Show manual instructions
      console.log('⚠️ [PWA] No install prompt available, showing instructions');
      setShowInstructions(true);
    }
  };

  // Don't show button if already installed
  if (isInstalled) {
    return null;
  }

  const sizeClasses = {
    small: 'h-9 px-4 text-sm',
    medium: 'h-12 px-6 text-base',
    large: 'h-14 px-8 text-md'
  };

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl',
    glass: 'glass-enhanced text-text hover:bg-white/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
  };

  const buttonText = customText || 'Install App';

  return (
    <>
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
          <FiDownload className="text-xl" />
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

      {/* Installation Instructions Modal */}
      <Modal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Install Chefio App"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
            <FiSmartphone className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-text">Add to Home Screen</p>
              <p className="text-xs text-text-secondary">
                Install Chefio for a better experience
              </p>
            </div>
          </div>

          {platform === 'ios' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <FaApple className="text-2xl" />
                <h3 className="font-semibold">iOS Safari Instructions</h3>
              </div>
              <ol className="space-y-3 text-sm text-text-secondary">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    1
                  </span>
                  <span>Tap the <strong>Share button</strong> (square with arrow pointing up) at the bottom of Safari</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    2
                  </span>
                  <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    3
                  </span>
                  <span>Tap <strong>"Add"</strong> in the top right corner</span>
                </li>
              </ol>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> This feature only works in Safari browser on iOS devices.
                </p>
              </div>
            </div>
          )}

          {platform === 'android' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <FaAndroid className="text-2xl" />
                <h3 className="font-semibold">Android Instructions</h3>
              </div>
              <ol className="space-y-3 text-sm text-text-secondary">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                    1
                  </span>
                  <span>Tap the <strong>menu button</strong> (⋮) in your browser</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                    2
                  </span>
                  <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                    3
                  </span>
                  <span>Tap <strong>"Install"</strong> to confirm</span>
                </li>
              </ol>
            </div>
          )}

          {(platform === 'chrome' || platform === 'desktop') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <FaChrome className="text-2xl" />
                <h3 className="font-semibold">Desktop Instructions</h3>
              </div>
              <ol className="space-y-3 text-sm text-text-secondary">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    1
                  </span>
                  <span>Look for the <strong>install icon</strong> (⊕ or computer icon) in the address bar</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    2
                  </span>
                  <span>Or open browser menu and select <strong>"Install Chefio"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    3
                  </span>
                  <span>Click <strong>"Install"</strong> to confirm</span>
                </li>
              </ol>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Supported browsers:</strong> Chrome, Edge, Opera, Brave
                </p>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddToHomeButton;
