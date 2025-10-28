import { NextResponse } from 'next/server';

// Store user activity data for admin monitoring
const userActivity: Record<string, Array<{
  type: string;
  data: any;
  timestamp: string;
}>> = {};

export async function POST(request: Request) {
  const { userId, type, data, timestamp } = await request.json();

  if (!userId || !type || !timestamp) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  // Initialize user activity array if it doesn't exist
  if (!userActivity[userId]) {
    userActivity[userId] = [];
  }

  // Add new activity (keep only last 100 activities to prevent memory issues)
  userActivity[userId].push({ type, data, timestamp });
  if (userActivity[userId].length > 100) {
    userActivity[userId] = userActivity[userId].slice(-100);
  }

  return NextResponse.json({ message: 'Activity recorded' });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit') || '50');

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  const activities = userActivity[userId] || [];
  const recentActivities = activities.slice(-limit);

  return NextResponse.json({
    userId,
    activities: recentActivities,
    totalCount: activities.length
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  if (userActivity[userId]) {
    delete userActivity[userId];
    return NextResponse.json({ message: 'User activity data cleared' });
  } else {
    return NextResponse.json({ message: 'No activity data found' }, { status: 404 });
  }
}

