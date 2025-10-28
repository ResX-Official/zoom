const fs = require('fs');
const path = require('path');

console.log('Creating Yoom Demo Installer...');

// Create installer directory
const installerDir = path.join(__dirname, 'yoom-demo-installer');
if (fs.existsSync(installerDir)) {
    fs.rmSync(installerDir, { recursive: true });
}
fs.mkdirSync(installerDir, { recursive: true });

// Copy all necessary files
const filesToCopy = [
    'package.json',
    'next.config.mjs', 
    'tailwind.config.ts',
    'tsconfig.json',
    'postcss.config.js',
    'components.json',
    'middleware.ts'
];

const dirsToCopy = [
    'app',
    'components', 
    'constants',
    'hooks',
    'lib',
    'providers',
    'actions',
    'public'
];

console.log('Copying application files...');
filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(installerDir, file));
    }
});

dirsToCopy.forEach(dir => {
    if (fs.existsSync(dir)) {
        fs.cpSync(dir, path.join(installerDir, dir), { recursive: true });
    }
});

// Create the installer script that works out of the box
const installerContent = `@echo off
title Yoom - Video Conferencing Demo
color 0A

echo ========================================
echo     Yoom - Video Conferencing Demo
echo ========================================
echo.
echo Installing Yoom demo version...
echo This version works out of the box - no setup required!
echo.

REM Create installation directory
set "INSTALL_DIR=%PROGRAMFILES%\\Yoom"
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

REM Copy all files
echo Copying application files...
xcopy /E /I /Y "%~dp0*" "%INSTALL_DIR%\\" /EXCLUDE:%~dp0exclude.txt

REM Change to installation directory
cd /d "%INSTALL_DIR%"

REM Check Node.js
echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    start https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!

REM Install dependencies
echo Installing dependencies...
npm install --production --silent

REM Create .env file with demo keys (optional)
echo Creating configuration...
echo NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=demo > .env
echo CLERK_SECRET_KEY=demo >> .env
echo NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in >> .env
echo NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up >> .env
echo NEXT_PUBLIC_STREAM_API_KEY=demo >> .env
echo STREAM_SECRET_KEY=demo >> .env

REM Build application
echo Building application...
npm run build

REM Create start script
echo Creating start script...
echo @echo off > "%INSTALL_DIR%\\start-yoom.bat"
echo title Yoom - Video Conferencing Demo >> "%INSTALL_DIR%\\start-yoom.bat"
echo cd /d "%INSTALL_DIR%" >> "%INSTALL_DIR%\\start-yoom.bat"
echo echo Starting Yoom Demo... >> "%INSTALL_DIR%\\start-yoom.bat"
echo echo This is a demo version that works without API keys! >> "%INSTALL_DIR%\\start-yoom.bat"
echo npm run start >> "%INSTALL_DIR%\\start-yoom.bat"

REM Create desktop shortcut
echo Creating desktop shortcut...
set "DESKTOP=%USERPROFILE%\\Desktop"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\\Yoom Demo.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\\start-yoom.bat'; $Shortcut.Save()"

REM Create Start Menu shortcut
set "START_MENU=%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\\Yoom Demo.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\\start-yoom.bat'; $Shortcut.Save()"

echo.
echo ========================================
echo   Installation completed successfully!
echo ========================================
echo.
echo Yoom Demo has been installed to: %INSTALL_DIR%
echo.
echo This is a demo version that works out of the box!
echo No API keys or configuration required.
echo.
echo Features available:
echo - Browse the interface
echo - See the UI/UX design
echo - Test basic functionality
echo.
echo To start Yoom Demo:
echo - Double-click the desktop shortcut, OR
echo - Search for "Yoom Demo" in Start Menu
echo.

set /p choice="Start Yoom Demo now? (y/n): "
if /i "%choice%"=="y" (
    echo.
    echo Starting Yoom Demo...
    start-yoom.bat
) else (
    echo.
    echo You can start Yoom Demo anytime using the desktop shortcut.
)

echo.
echo Installation complete!
pause`;

// Create exclude file
const excludeContent = `installer
*.log
node_modules
.git
dist
.next
yoom-demo-installer`;

fs.writeFileSync(path.join(installerDir, 'install-yoom-demo.bat'), installerContent);
fs.writeFileSync(path.join(installerDir, 'exclude.txt'), excludeContent);

console.log('Demo installer created in:', installerDir);
console.log('Files ready for distribution!');
