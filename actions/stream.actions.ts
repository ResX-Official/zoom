'use server';

// Temporarily disabled Clerk
// import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  // Temporarily using mock user instead of Clerk
  const user = { id: 'demo-user-123' };

  if (!user) throw new Error('User is not authenticated');
  
  // Temporarily allow operation without API keys
  if (!STREAM_API_KEY || !STREAM_API_SECRET) {
    console.warn('Stream API keys not configured');
    return 'mock-token';
  }

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  const token = streamClient.createToken(user.id, expirationTime, issuedAt);

  return token;
};
