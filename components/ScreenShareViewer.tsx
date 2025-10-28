'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Square, Maximize2, Download, Volume2, VolumeX } from 'lucide-react';

interface ScreenShareViewerProps {
  userId: string;
  isActive: boolean;
  onRequestScreenShare: () => void;
  onStopScreenShare: () => void;
}

const ScreenShareViewer = ({ 
  userId, 
  isActive, 
  onRequestScreenShare, 
  onStopScreenShare 
}: ScreenShareViewerProps) => {
  const [screenData, setScreenData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) {
      fetchScreenData();
      const interval = setInterval(fetchScreenData, 1000); // Update every second
      return () => clearInterval(interval);
    }
  }, [isActive, userId]);

  const fetchScreenData = async () => {
    try {
      const response = await fetch(`/api/admin/screen-share?userId=${userId}`);
      const data = await response.json();
      
      if (data.active && data.data) {
        setScreenData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch screen data:', error);
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    if (screenData) {
      const link = document.createElement('a');
      link.download = `screen-capture-${userId}-${Date.now()}.jpg`;
      link.href = screenData;
      link.click();
    }
  };

  const handleRequestScreenShare = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_screen_share',
          userId
        })
      });
      onRequestScreenShare();
    } catch (error) {
      console.error('Failed to request screen share:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopScreenShare = async () => {
    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stop_screen_share',
          userId
        })
      });
      onStopScreenShare();
    } catch (error) {
      console.error('Failed to stop screen share:', error);
    }
  };

  if (!isActive) {
    return (
      <div className="space-y-4">
        <div className="aspect-video bg-black rounded-lg border border-dark-3 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Monitor className="w-16 h-16 mx-auto mb-4" />
            <div className="text-lg mb-2">Screen sharing is not active</div>
            <div className="text-sm">Click below to request screen access from this user</div>
          </div>
        </div>
        <Button 
          className="w-full bg-blue-1 hover:bg-blue-600"
          onClick={handleRequestScreenShare}
          disabled={isLoading}
        >
          <Monitor className="w-4 h-4 mr-2" />
          {isLoading ? 'Requesting...' : 'Request Screen Share'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="relative aspect-video bg-black rounded-lg border border-dark-3 overflow-hidden"
      >
        {screenData ? (
          <img
            src={screenData}
            alt="User Screen"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <Monitor className="w-12 h-12 mx-auto mb-2" />
              <div>Waiting for screen data...</div>
            </div>
          </div>
        )}
        
        {/* Overlay controls */}
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleFullscreen}
            className="bg-black/50 hover:bg-black/70"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-black/50 hover:bg-black/70"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Live indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">LIVE</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={handleStopScreenShare}
          className="flex-1"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop Screen Share
        </Button>
        <Button
          variant="outline"
          onClick={handleDownload}
          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Capture
        </Button>
        <Button
          variant="outline"
          onClick={handleFullscreen}
          className="border-blue-1 text-blue-1 hover:bg-blue-1 hover:text-white"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Screen info */}
      <div className="text-xs text-gray-400 space-y-1">
        <div>User ID: {userId}</div>
        <div>Status: {screenData ? 'Streaming' : 'Connecting...'}</div>
        <div>Quality: High (1080p)</div>
      </div>
    </div>
  );
};

export default ScreenShareViewer;
