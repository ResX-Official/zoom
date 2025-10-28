import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production, use a real database
const users = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    ip: '192.168.1.100',
    location: 'New York, NY',
    installDate: '2024-01-15',
    lastSeen: new Date().toISOString(),
    status: 'online',
    version: '1.0.0',
    os: 'Windows 11',
    screenShareActive: false,
    screenShareToken: null as string | null
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    ip: '192.168.1.101',
    location: 'Los Angeles, CA',
    installDate: '2024-01-18',
    lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    status: 'idle',
    version: '1.0.0',
    os: 'Windows 10',
    screenShareActive: false,
    screenShareToken: null as string | null
  }
];

export async function GET() {
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, ...data } = body;

    switch (action) {
      case 'request_screen_share': {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          users[userIndex].screenShareActive = true;
          users[userIndex].screenShareToken = Math.random().toString(36).substring(7);
          
          // In production, this would send a WebSocket message or push notification
          // to the user's Windows app to start screen sharing
          
          return NextResponse.json({ 
            success: true, 
            token: users[userIndex].screenShareToken,
            message: 'Screen share request sent to user'
          });
        }
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      case 'stop_screen_share': {
        const userIndex2 = users.findIndex(u => u.id === userId);
        if (userIndex2 !== -1) {
          users[userIndex2].screenShareActive = false;
          users[userIndex2].screenShareToken = null;
          return NextResponse.json({ success: true, message: 'Screen share stopped' });
        }
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      case 'update_user_status': {
        const userIndex3 = users.findIndex(u => u.id === userId);
        if (userIndex3 !== -1) {
          users[userIndex3] = { ...users[userIndex3], ...data, lastSeen: new Date().toISOString() };
          return NextResponse.json({ success: true, user: users[userIndex3] });
        }
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
