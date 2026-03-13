/**
 * Service Worker Registration Utility
 * Registers the service worker for PWA functionality
 */

export const registerServiceWorker = () => {
  // Skip service worker registration in development
  if (import.meta.env.DEV) {
    console.log('⚠️ [SW] Service Worker disabled in development mode');
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ [SW] Service Worker registered successfully:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('🔄 [SW] New service worker found, installing...');

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('✨ [SW] New content available, please refresh!');
                
                // Optionally show a notification to the user
                if (window.confirm('New version available! Reload to update?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ [SW] Service Worker registration failed:', error);
        });

      // Handle controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 [SW] Controller changed, reloading page...');
        window.location.reload();
      });
    });
  } else {
    console.warn('⚠️ [SW] Service Workers are not supported in this browser');
  }
};

export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('🗑️ [SW] Service Worker unregistered');
      })
      .catch((error) => {
        console.error('❌ [SW] Error unregistering service worker:', error);
      });
  }
};
