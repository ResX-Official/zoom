'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MousePointer, 
  Keyboard, 
  Monitor, 
  Power, 
  Volume2, 
  // Wifi, 
  AlertTriangle,
  Play,
  Pause,
  Square,
  Maximize,
  Minimize,
  RotateCcw,
  Settings
} from 'lucide-react';

interface RemoteControlProps {
  userId: string;
  isActive: boolean;
  onStartControl: () => void;
  onStopControl: () => void;
}

interface ControlState {
  isConnected: boolean;
  mouseControl: boolean;
  keyboardControl: boolean;
  audioControl: boolean;
  systemControl: boolean;
  lastActivity: string;
}

const RemoteControl: React.FC<RemoteControlProps> = ({
  userId,
  isActive,
  onStartControl,
  onStopControl,
}) => {
  const [controlState, setControlState] = useState<ControlState>({
    isConnected: false,
    mouseControl: false,
    keyboardControl: false,
    audioControl: false,
    systemControl: false,
    lastActivity: 'Never'
  });
  const [error, setError] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const sendRemoteCommand = async (command: string, data?: any) => {
    try {
      setCurrentAction(command);
      const response = await fetch('/api/admin/remote-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: command,
          data,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send remote command');
      }

      const result = await response.json();
      setControlState(prev => ({
        ...prev,
        lastActivity: new Date().toLocaleString()
      }));
      return result;
    } catch (err) {
      console.error('Remote control error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setCurrentAction('');
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round((event.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.round((event.clientY - rect.top) * (canvas.height / rect.height));
    
    setMousePosition({ x, y });
    sendRemoteCommand('mouse_move', { x, y });
  };

  const handleMouseClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const button = event.button === 0 ? 'left' : event.button === 2 ? 'right' : 'middle';
    sendRemoteCommand('mouse_click', { 
      button, 
      x: mousePosition.x, 
      y: mousePosition.y 
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      event.preventDefault();
      sendRemoteCommand('key_press', {
        key: event.key,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey
      });
    }
  };

  const systemCommands = [
    { name: 'Lock Screen', command: 'lock_screen', icon: Square },
    { name: 'Shutdown', command: 'shutdown', icon: Power },
    { name: 'Restart', command: 'restart', icon: RotateCcw },
    { name: 'Sleep', command: 'sleep', icon: Pause },
  ];

  const audioCommands = [
    { name: 'Mute', command: 'audio_mute', icon: Volume2 },
    { name: 'Volume Up', command: 'audio_volume_up', icon: Volume2 },
    { name: 'Volume Down', command: 'audio_volume_down', icon: Volume2 },
  ];

  const windowCommands = [
    { name: 'Maximize', command: 'window_maximize', icon: Maximize },
    { name: 'Minimize', command: 'window_minimize', icon: Minimize },
    { name: 'Close', command: 'window_close', icon: Square },
  ];

  useEffect(() => {
    if (isActive) {
      // Simulate connection status
      setTimeout(() => {
        setControlState(prev => ({
          ...prev,
          isConnected: true,
          mouseControl: true,
          keyboardControl: true,
          audioControl: true,
          systemControl: true
        }));
      }, 1000);
    } else {
      setControlState({
        isConnected: false,
        mouseControl: false,
        keyboardControl: false,
        audioControl: false,
        systemControl: false,
        lastActivity: 'Never'
      });
    }
  }, [isActive]);

  if (!isActive) {
    return (
      <div className="space-y-4">
        <Card className="bg-dark-1 border-dark-3">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <p className="text-xl text-gray-400 mb-4">Remote Control Not Available</p>
            <p className="text-gray-500 mb-6">
              Start screen sharing first to enable remote control capabilities.
            </p>
            <Button 
              onClick={onStartControl}
              className="bg-blue-1 hover:bg-blue-1/80"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Remote Control
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-dark-1 border-dark-3">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Remote Control Status
          </CardTitle>
          <CardDescription className="text-gray-400">
            Real-time control of user&apos;s computer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${controlState.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-300">Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${controlState.mouseControl ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-300">Mouse</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${controlState.keyboardControl ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-300">Keyboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${controlState.systemControl ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-300">System</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Last Activity: {controlState.lastActivity}
          </div>
        </CardContent>
      </Card>

      {/* Mouse & Keyboard Control */}
      <Card className="bg-dark-1 border-dark-3">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MousePointer className="w-5 h-5" />
            Mouse & Keyboard Control
          </CardTitle>
          <CardDescription className="text-gray-400">
            Click and type to control the user&apos;s computer remotely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mouse Control Canvas */}
            <div className="border-2 border-gray-600 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="w-full max-w-full h-auto bg-gray-900 rounded cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseClick}
                onContextMenu={(e) => e.preventDefault()}
                tabIndex={0}
                onKeyDown={handleKeyPress}
              />
              <div className="mt-2 text-sm text-gray-400">
                Mouse Position: {mousePosition.x}, {mousePosition.y}
                {currentAction && (
                  <span className="ml-4 text-blue-400">
                    Executing: {currentAction}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Mouse Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendRemoteCommand('mouse_click', { button: 'left', x: mousePosition.x, y: mousePosition.y })}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Left Click
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendRemoteCommand('mouse_click', { button: 'right', x: mousePosition.x, y: mousePosition.y })}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Right Click
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendRemoteCommand('mouse_scroll', { direction: 'up', x: mousePosition.x, y: mousePosition.y })}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Scroll Up
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendRemoteCommand('mouse_scroll', { direction: 'down', x: mousePosition.x, y: mousePosition.y })}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Scroll Down
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Controls */}
      <Card className="bg-dark-1 border-dark-3">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            System Control
          </CardTitle>
          <CardDescription className="text-gray-400">
            Control system functions and applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* System Commands */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-2">System Commands</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {systemCommands.map((cmd) => (
                  <Button
                    key={cmd.command}
                    variant="outline"
                    size="sm"
                    onClick={() => sendRemoteCommand(cmd.command)}
                    className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600"
                  >
                    <cmd.icon className="w-4 h-4 mr-2" />
                    {cmd.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Audio Controls */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-2">Audio Control</h4>
              <div className="grid grid-cols-3 gap-2">
                {audioCommands.map((cmd) => (
                  <Button
                    key={cmd.command}
                    variant="outline"
                    size="sm"
                    onClick={() => sendRemoteCommand(cmd.command)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <cmd.icon className="w-4 h-4 mr-2" />
                    {cmd.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Window Controls */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-2">Window Control</h4>
              <div className="grid grid-cols-3 gap-2">
                {windowCommands.map((cmd) => (
                  <Button
                    key={cmd.command}
                    variant="outline"
                    size="sm"
                    onClick={() => sendRemoteCommand(cmd.command)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <cmd.icon className="w-4 h-4 mr-2" />
                    {cmd.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card className="bg-dark-1 border-dark-3">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </CardTitle>
          <CardDescription className="text-gray-400">
            Send common keyboard shortcuts to the user&apos;s computer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendRemoteCommand('key_combination', { keys: ['ctrl', 'c'] })}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Ctrl+C (Copy)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendRemoteCommand('key_combination', { keys: ['ctrl', 'v'] })}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Ctrl+V (Paste)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendRemoteCommand('key_combination', { keys: ['ctrl', 'z'] })}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Ctrl+Z (Undo)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendRemoteCommand('key_combination', { keys: ['alt', 'tab'] })}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Alt+Tab (Switch)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendRemoteCommand('key_combination', { keys: ['ctrl', 'alt', 'delete'] })}
              className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600"
            >
              Ctrl+Alt+Del
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendRemoteCommand('key_combination', { keys: ['win', 'r'] })}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Win+R (Run)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendRemoteCommand('key_combination', { keys: ['ctrl', 'shift', 'esc'] })}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Task Manager
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendRemoteCommand('key_combination', { keys: ['win', 'l'] })}
              className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600"
            >
              Win+L (Lock)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-500">
          <CardContent className="py-4">
            <p className="text-red-400">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setError(null)}
              className="mt-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stop Control */}
      <div className="flex justify-end">
        <Button
          onClick={onStopControl}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop Remote Control
        </Button>
      </div>
    </div>
  );
};

export default RemoteControl;

