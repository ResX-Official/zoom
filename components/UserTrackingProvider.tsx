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
        const { createUserTracker } = await import('@/lib/user-tracking');
        const userTracker = createUserTracker();
        if (userTracker) {
          console.log('User tracking initialized');
          // Store reference for cleanup
          (window as any).__userTracker = userTracker;
        }
      } catch (error) {
        console.warn('Error initializing user tracker:', error);
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
