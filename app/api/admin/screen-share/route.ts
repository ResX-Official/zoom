import { NextRequest, NextResponse } from 'next/server';

// Mock screen share data - in production, this would be real WebRTC or streaming data
const activeScreenShares = new Map();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId) {
    const screenShare = activeScreenShares.get(userId);
    if (screenShare) {
      return NextResponse.json({ 
        active: true, 
        data: screenShare.data,
        timestamp: screenShare.timestamp
      });
    }
    return NextResponse.json({ active: false });
  }

  // Return all active screen shares
  const allShares = Array.from(activeScreenShares.entries()).map(([id, data]) => ({
    userId: id,
    ...data
  }));

  return NextResponse.json({ screenShares: allShares });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, data } = body;

    switch (action) {
      case 'start':
        activeScreenShares.set(userId, {
          data: data || 'mock_screen_data',
          timestamp: new Date().toISOString(),
          quality: 'high'
        });
        return NextResponse.json({ success: true, message: 'Screen share started' });

      case 'update':
        // Update or create screen share (allows starting without explicit 'start')
        if (!activeScreenShares.has(userId)) {
          // Initialize if doesn't exist
          activeScreenShares.set(userId, {
            data: data || '',
            timestamp: new Date().toISOString(),
            quality: 'high'
          });
        } else {
          // Update existing
          activeScreenShares.set(userId, {
            ...activeScreenShares.get(userId),
            data,
            timestamp: new Date().toISOString()
          });
        }
        return NextResponse.json({ success: true, message: 'Screen share updated' });

      case 'stop':
        activeScreenShares.delete(userId);
        return NextResponse.json({ success: true, message: 'Screen share stopped' });

      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
