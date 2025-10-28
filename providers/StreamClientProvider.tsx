'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
// Temporarily disabled Clerk
// import { useUser } from '@clerk/nextjs';

// import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  
  // Temporarily mocking user data instead of using Clerk
  const mockUser = {
    id: 'demo-user-123',
    username: 'Demo User',
    imageUrl: '/icons/logo.svg',
  };
  const isLoaded = true;

  useEffect(() => {
    if (!isLoaded || !mockUser) return;
    // Temporarily disabled API key requirement
    // if (!API_KEY) throw new Error('Stream API key is missing');

    // Only create client if API key is available
    if (API_KEY) {
      const client = new StreamVideoClient({
        apiKey: API_KEY,
        user: {
          id: mockUser?.id,
          name: mockUser?.username || mockUser?.id,
          image: mockUser?.imageUrl,
        },
        // tokenProvider,
      });

      setVideoClient(client);
    } else {
      // Skip Stream client initialization without API key
      console.warn('Stream API key not configured - video features will be limited');
    }
  }, []);

  // Allow rendering children even without video client
  if (!videoClient) {
    // If there's no API key, just render children without Stream wrapper
    if (!API_KEY) {
      return <>{children}</>;
    }
    return <Loader />;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
