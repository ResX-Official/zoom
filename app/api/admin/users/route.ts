import { NextRequest, NextResponse } from 'next/server';

// In-memory database - in production, use a real database
// This stores actual users from the tracking system
const users: Record<string, {
  id: string;
  name: string;
  email?: string;
  ip: string;
  location: string;
  installDate: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'idle';
  version: string;
  os: string;
  screenShareActive: boolean;
  screenShareToken: string | null;
}> = {};

export async function GET() {
  // Return all registered users as an array
  const usersArray = Object.values(users).map(user => ({
    ...user,
    lastSeen: new Date(user.lastSeen).toISOString()
  }));
  
  // Sort by last seen (most recent first)
  usersArray.sort((a, b) => 
    new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
  );
  
  return NextResponse.json({ users: usersArray });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, ...data } = body;

    switch (action) {
      case 'request_screen_share': {
        if (users[userId]) {
          users[userId].screenShareActive = true;
          users[userId].screenShareToken = Math.random().toString(36).substring(7);
          
          // In production, this would send a WebSocket message or push notification
          // to the user's Windows app to start screen sharing
          
          return NextResponse.json({ 
            success: true, 
            token: users[userId].screenShareToken,
            message: 'Screen share request sent to user'
          });
        }
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      case 'stop_screen_share': {
        if (users[userId]) {
          users[userId].screenShareActive = false;
          users[userId].screenShareToken = null;
          return NextResponse.json({ success: true, message: 'Screen share stopped' });
        }
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      case 'update_user_status': {
        // Create or update user
        if (!users[userId]) {
          // Create new user
          users[userId] = {
            id: userId,
            name: data.name || 'Anonymous User',
            email: data.email,
            ip: data.ip || 'Unknown',
            location: data.location || 'Unknown',
            installDate: data.installDate || new Date().toISOString(),
            lastSeen: new Date().toISOString(),
            status: data.status || 'online',
            version: data.version || '1.0.0',
            os: data.os || 'Unknown',
            screenShareActive: false,
            screenShareToken: null
          };
        } else {
          // Update existing user
          users[userId] = {
            ...users[userId],
            ...data,
            lastSeen: new Date().toISOString()
          };
        }
        
        return NextResponse.json({ success: true, user: users[userId] });
      }

      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
