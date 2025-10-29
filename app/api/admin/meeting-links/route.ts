import { NextResponse } from 'next/server';

interface MeetingLink {
  id: string;
  title: string;
  description: string;
  link: string;
  createdAt: string;
  expiresAt?: string;
  maxParticipants?: number;
  isActive: boolean;
  clickCount: number;
  lastClicked?: string;
}

// In-memory storage for demo purposes
// In production, this would be stored in a database
const meetingLinks: Record<string, MeetingLink> = {
  'meeting_1': {
    id: 'meeting_1',
    title: 'Team Meeting - Q4 Planning',
    description: 'Quarterly planning session for all departments',
    link: 'https://thezoomcaller.com/meeting/j/123456789',
    createdAt: '2024-07-20T10:00:00Z',
    expiresAt: '2025-12-31T23:59:59Z',
    maxParticipants: 50,
    isActive: true,
    clickCount: 23,
    lastClicked: '2024-07-20T14:30:00Z'
  },
  'meeting_2': {
    id: 'meeting_2',
    title: 'Client Presentation',
    description: 'Product demo for potential client',
    link: 'https://thezoomcaller.com/meeting/j/987654321',
    createdAt: '2024-07-19T15:00:00Z',
    maxParticipants: 10,
    isActive: true,
    clickCount: 8,
    lastClicked: '2024-07-20T09:15:00Z'
  },
  'meeting_3': {
    id: 'meeting_3',
    title: 'All Hands Meeting',
    description: 'Monthly company-wide meeting',
    link: 'https://thezoomcaller.com/meeting/j/456789123',
    createdAt: '2024-07-18T09:00:00Z',
    expiresAt: '2025-12-31T23:59:59Z',
    maxParticipants: 200,
    isActive: false,
    clickCount: 156,
    lastClicked: '2024-07-18T11:45:00Z'
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const linkId = searchParams.get('id');

  if (linkId) {
    // Get specific meeting link
    const link = meetingLinks[linkId];
    if (link) {
      return NextResponse.json(link);
    } else {
      return NextResponse.json({ message: 'Meeting link not found' }, { status: 404 });
    }
  } else {
    // Get all meeting links
    return NextResponse.json(Object.values(meetingLinks));
  }
}

export async function POST(request: Request) {
  const { action, ...data } = await request.json();

  if (action === 'create') {
    const { title, description, maxParticipants, expiresIn } = data;

    if (!title) {
      return NextResponse.json({ message: 'Meeting title is required' }, { status: 400 });
    }

    // Generate unique meeting ID
    const meetingId = Math.random().toString(36).substring(2, 15);
    const linkId = `meeting_${Date.now()}_${meetingId}`;
    
    // Create meeting link
    const newLink: MeetingLink = {
      id: linkId,
      title,
      description: description || '',
      link: `https://thezoomcaller.com/meeting/j/${meetingId}`,
      createdAt: new Date().toISOString(),
      expiresAt: expiresIn > 0 
        ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      maxParticipants: maxParticipants || 50,
      isActive: true,
      clickCount: 0
    };

    meetingLinks[linkId] = newLink;
    
    return NextResponse.json({
      success: true,
      meetingLink: newLink
    });
  }

  if (action === 'update') {
    const { id, ...updateData } = data;
    
    if (!id || !meetingLinks[id]) {
      return NextResponse.json({ message: 'Meeting link not found' }, { status: 404 });
    }

    meetingLinks[id] = { ...meetingLinks[id], ...updateData };
    
    return NextResponse.json({
      success: true,
      meetingLink: meetingLinks[id]
    });
  }

  if (action === 'delete') {
    const { id } = data;
    
    if (!id || !meetingLinks[id]) {
      return NextResponse.json({ message: 'Meeting link not found' }, { status: 404 });
    }

    delete meetingLinks[id];
    
    return NextResponse.json({
      success: true,
      message: 'Meeting link deleted'
    });
  }

  if (action === 'track_click') {
    const { linkId } = data;
    
    if (!linkId || !meetingLinks[linkId]) {
      return NextResponse.json({ message: 'Meeting link not found' }, { status: 404 });
    }

    // Update click count and last clicked time
    meetingLinks[linkId].clickCount += 1;
    meetingLinks[linkId].lastClicked = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      clickCount: meetingLinks[linkId].clickCount
    });
  }

  return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Meeting link ID is required' }, { status: 400 });
  }

  if (!meetingLinks[id]) {
    return NextResponse.json({ message: 'Meeting link not found' }, { status: 404 });
  }

  delete meetingLinks[id];
  
  return NextResponse.json({
    success: true,
    message: 'Meeting link deleted'
  });
}
