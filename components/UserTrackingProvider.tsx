'use client';

import React, { useEffect } from 'react';

interface UserTrackingProviderProps {
  children: React.ReactNode;
}

const UserTrackingProvider = ({ children }: UserTrackingProviderProps) => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Don't initialize user tracking on meeting pages to prevent screen sharing popup
    if (window.location.pathname.startsWith('/meeting/')) {
      console.log('Skipping user tracking on meeting page');
      return;
    }

    // Dynamically import and create user tracker only on client side
    const initializeUserTracking = async () => {
      try {
        // Wait a bit to ensure preload script has loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if Electron API is available
        if (typeof window !== 'undefined') {
          console.log('🔍 Checking for Electron API...');
          console.log('window.electronAPI:', typeof (window as any).electronAPI);
          if ((window as any).electronAPI) {
            console.log('✅ Electron API found! Available methods:', Object.keys((window as any).electronAPI));
          } else {
            console.warn('⚠️ Electron API not found - running in browser mode');
          }
        }
        
        const { createUserTracker } = await import('@/lib/user-tracking');
        // Use current origin as admin server (works for both localhost and production)
        const adminServerUrl = window.location.origin;
        console.log('🔧 Initializing user tracker for:', adminServerUrl);
        const userTracker = createUserTracker(adminServerUrl);
        if (userTracker) {
          console.log('✅ User tracking initialized for:', adminServerUrl);
          // Store reference for cleanup
          (window as any).__userTracker = userTracker;
        } else {
          console.warn('⚠️ User tracker creation returned null');
        }
      } catch (error) {
        console.error('❌ Error initializing user tracker:', error);
      }
    };

    initializeUserTracking();

    // Cleanup on unmount
    return () => {
      try {
        const userTracker = (window as any).__userTracker;
        if (userTracker && typeof userTracker.destroy === 'function') {
          userTracker.destroy();
          (window as any).__userTracker = null;
        }
      } catch (error) {
        console.warn('Error destroying user tracker:', error);
      }
    };
  }, []);

  return <>{children}</>;
};

export default UserTrackingProvider;
