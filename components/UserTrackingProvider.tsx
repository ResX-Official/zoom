'use client';

import React, { useEffect } from 'react';
import userTracker from '@/lib/user-tracking';

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

    // Initialize user tracking when the app loads
    console.log('User tracking initialized');

    // Cleanup on unmount
    return () => {
      try {
        if (userTracker) {
          userTracker.destroy();
        }
      } catch (error) {
        console.warn('Error destroying user tracker:', error);
      }
    };
  }, []);

  return <>{children}</>;
};

export default UserTrackingProvider;
