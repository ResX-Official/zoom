'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Code, Zap } from 'lucide-react';
import Link from 'next/link';

const WindowsDownloadPage = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadFile = async (filename: string, content: string, mimeType: string) => {
    setDownloading(filename);
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const downloadFiles = [
    {
      name: 'install-windows.bat',
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      description: 'Easy one-click installation script',
      content: `@echo off
echo ========================================
echo     Yoom - Zoom Clone for Windows
echo ========================================
echo.
echo This script will install and set up Yoom on your Windows system.
echo.

REM Check if Node.js is installed
echo Checking for Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Make sure to check "Add to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo Node.js found!
node --version

REM Check if npm is available
echo.
echo Checking for npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    echo Please reinstall Node.js with npm included
    pause
    exit /b 1
)

echo npm found!
npm --version

echo.
echo ========================================
echo Installing dependencies...
echo ========================================

REM Install dependencies
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setting up environment variables...
echo ========================================

REM Check if .env file exists
if not exist .env (
    echo Creating .env file...
    echo NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= > .env
    echo CLERK_SECRET_KEY= >> .env
    echo. >> .env
    echo NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in >> .env
    echo NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up >> .env
    echo. >> .env
    echo NEXT_PUBLIC_STREAM_API_KEY= >> .env
    echo STREAM_SECRET_KEY= >> .env
    echo.
    echo IMPORTANT: Please edit the .env file and add your actual API keys:
    echo - Clerk keys from: https://clerk.com/
    echo - Stream keys from: https://getstream.io/
    echo.
) else (
    echo .env file already exists
)

echo.
echo ========================================
echo Building the application...
echo ========================================

npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build the application
    echo Make sure you have added your API keys to the .env file
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo To start the application, run:
echo   npm run start
echo.
echo To start in development mode, run:
echo   npm run dev
echo.
echo The application will be available at:
echo   http://localhost:3000
echo.
echo Press any key to start the application now...
pause >nul

echo.
echo Starting Yoom...
npm run start`,
      mimeType: 'text/plain'
    },
    {
      name: 'install-windows.ps1',
      icon: <Code className="w-6 h-6 text-green-500" />,
      description: 'PowerShell installation script for advanced users',
      content: `# Yoom - Zoom Clone for Windows
# PowerShell Installation Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     Yoom - Zoom Clone for Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Check if Node.js is installed
Write-Host "Checking for Node.js installation..." -ForegroundColor Yellow
if (-not (Test-Command "node")) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add to PATH' during installation" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

$nodeVersion = node --version
Write-Host "Node.js found! Version: $nodeVersion" -ForegroundColor Green

# Check if npm is available
Write-Host ""
Write-Host "Checking for npm..." -ForegroundColor Yellow
if (-not (Test-Command "npm")) {
    Write-Host "ERROR: npm is not available" -ForegroundColor Red
    Write-Host "Please reinstall Node.js with npm included" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

$npmVersion = npm --version
Write-Host "npm found! Version: $npmVersion" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing dependencies..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Install dependencies
try {
    npm install
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up environment variables..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET_KEY=
"@ | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host ""
    Write-Host "IMPORTANT: Please edit the .env file and add your actual API keys:" -ForegroundColor Yellow
    Write-Host "- Clerk keys from: https://clerk.com/" -ForegroundColor Yellow
    Write-Host "- Stream keys from: https://getstream.io/" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ".env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building the application..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Build the application
try {
    npm run build
    Write-Host "Application built successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to build the application" -ForegroundColor Red
    Write-Host "Make sure you have added your API keys to the .env file" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application, run:" -ForegroundColor Yellow
Write-Host "  npm run start" -ForegroundColor White
Write-Host ""
Write-Host "To start in development mode, run:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""

# Ask user if they want to start the application
$startApp = Read-Host "Would you like to start the application now? (y/n)"
if ($startApp -eq "y" -or $startApp -eq "Y") {
    Write-Host ""
    Write-Host "Starting Yoom..." -ForegroundColor Green
    npm run start
}`,
      mimeType: 'text/plain'
    },
    {
      name: 'WINDOWS-INSTALLATION-GUIDE.md',
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      description: 'Complete installation guide for Windows',
      content: `# Yoom - Windows Installation Guide

This guide will help you install and run the Yoom Zoom Clone application on Windows.

## 📋 Prerequisites

Before installing Yoom, make sure you have the following installed on your Windows system:

- **Node.js** (version 16.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository) - [Download here](https://git-scm.com/)

## 🚀 Quick Installation (Recommended)

### Method 1: Using Batch File (Easiest)

1. **Download the project files** to your desired location
2. **Double-click** on \`install-windows.bat\`
3. **Follow the prompts** in the command window
4. The script will automatically:
   - Check for Node.js and npm
   - Install all dependencies
   - Create environment file
   - Build the application
   - Start the application

### Method 2: Using PowerShell Script

1. **Right-click** on \`install-windows.ps1\`
2. Select **"Run with PowerShell"**
3. If prompted about execution policy, run PowerShell as Administrator and execute:
   \`\`\`powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   \`\`\`
4. **Follow the prompts** in the PowerShell window

## 🛠️ Manual Installation

If you prefer to install manually or the automated scripts don't work:

### Step 1: Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer and follow the setup wizard
4. Make sure to check **"Add to PATH"** during installation

### Step 2: Verify Installation

Open Command Prompt or PowerShell and run:
\`\`\`bash
node --version
npm --version
\`\`\`

Both commands should return version numbers.

### Step 3: Install Dependencies

Navigate to the project folder and run:
\`\`\`bash
npm install
\`\`\`

### Step 4: Set Up Environment Variables

1. Create a file named \`.env\` in the project root
2. Add the following content:

\`\`\`env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key_here
STREAM_SECRET_KEY=your_stream_secret_key_here
\`\`\`

3. **Replace the placeholder values** with your actual API keys:
   - Get Clerk keys from: [clerk.com](https://clerk.com/)
   - Get Stream keys from: [getstream.io](https://getstream.io/)

### Step 5: Build the Application

\`\`\`bash
npm run build
\`\`\`

### Step 6: Start the Application

\`\`\`bash
npm run start
\`\`\`

## 🌐 Accessing the Application

Once the application is running, open your web browser and go to:
**http://localhost:3000**

## 🎯 Available Commands

- \`npm run dev\` - Start development server with hot reload
- \`npm run build\` - Build the application for production
- \`npm run start\` - Start the production server
- \`npm run lint\` - Run ESLint to check code quality

## 🔧 Troubleshooting

### Common Issues

1. **"Node.js not found" error**
   - Make sure Node.js is installed and added to PATH
   - Restart your command prompt/PowerShell after installation

2. **"npm command not found" error**
   - Reinstall Node.js and make sure npm is included
   - Check if npm is in your system PATH

3. **Build errors**
   - Make sure you've added your API keys to the \`.env\` file
   - Delete \`node_modules\` folder and run \`npm install\` again

4. **Permission errors (PowerShell)**
   - Run PowerShell as Administrator
   - Change execution policy: \`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser\`

5. **Port 3000 already in use**
   - Close other applications using port 3000
   - Or change the port in your \`.env\` file

### Getting Help

- Check the main README.md for detailed project information
- Visit the [JavaScript Mastery YouTube channel](https://www.youtube.com/@javascriptmastery/videos) for tutorials
- Join the Discord community for support

## 📱 Creating Desktop Shortcut

To create a desktop shortcut for easy access:

1. Run the \`create-desktop-shortcut.bat\` file (if available)
2. Or manually create a shortcut pointing to: \`http://localhost:3000\`

## 🔄 Updating the Application

To update to the latest version:

1. Download the latest project files
2. Replace the old files with new ones
3. Run \`npm install\` to update dependencies
4. Run \`npm run build\` to rebuild
5. Start with \`npm run start\`

## 📝 Notes

- The application runs locally on your machine
- Make sure your firewall allows connections to port 3000
- For production deployment, consider using services like Vercel, Netlify, or your own server
- Keep your API keys secure and never share them publicly

---

**Enjoy using Yoom!** 🎉

For more information, visit the main project repository or the JavaScript Mastery YouTube channel.`,
      mimeType: 'text/markdown'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-1 to-dark-2">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Download for <span className="text-blue-1">Windows</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Get Yoom running on your Windows machine with our easy installation scripts
            </p>
          </div>

          {/* Download Cards */}
          <div className="grid md:grid-cols-1 gap-6 mb-12">
            {downloadFiles.map((file, index) => (
              <div key={index} className="bg-dark-1 border border-dark-3 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {file.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {file.name}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {file.description}
                    </p>
                    <Button
                      onClick={() => downloadFile(file.name, file.content, file.mimeType)}
                      disabled={downloading === file.name}
                      className="bg-blue-1 hover:bg-blue-600 text-white"
                    >
                      {downloading === file.name ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-dark-1 border border-dark-3 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Start Instructions</h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="bg-blue-1 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
                  1
                </div>
                <div>
                  <p className="font-semibold">Download the installation files above</p>
                  <p className="text-sm text-gray-400">Choose either the batch file (.bat) or PowerShell script (.ps1)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-1 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
                  2
                </div>
                <div>
                  <p className="font-semibold">Make sure Node.js is installed</p>
                  <p className="text-sm text-gray-400">Download from <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-1 hover:underline">nodejs.org</a></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-1 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
                  3
                </div>
                <div>
                  <p className="font-semibold">Run the installation script</p>
                  <p className="text-sm text-gray-400">Double-click the .bat file or right-click the .ps1 file and &quot;Run with PowerShell&quot;</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-1 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
                  4
                </div>
                <div>
                  <p className="font-semibold">Configure your API keys</p>
                  <p className="text-sm text-gray-400">Edit the .env file with your Clerk and Stream API keys</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-1 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
                  5
                </div>
                <div>
                  <p className="font-semibold">Enjoy Yoom!</p>
                  <p className="text-sm text-gray-400">Your application will be available at http://localhost:3000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to App */}
          <div className="text-center">
            <Link href="/">
              <Button variant="outline" className="border-blue-1 text-blue-1 hover:bg-blue-1 hover:text-white">
                ← Back to Yoom
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowsDownloadPage;
