const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Creating Yoom Windows Installer...');

// Create installer directory
const installerDir = path.join(__dirname, 'yoom-installer');
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

// Create the main installer script
const installerContent = `@echo off
title Yoom Installer
color 0A

echo ========================================
echo     Yoom - Video Conferencing App
echo ========================================
echo.
echo Installing Yoom on your Windows system...
echo.

REM Create installation directory
set "INSTALL_DIR=%PROGRAMFILES%\\Yoom"
echo Creating installation directory...

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

REM Install dependencies
echo Installing dependencies...
npm install --production --silent

REM Create .env file
echo Creating configuration...
echo NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= > .env
echo CLERK_SECRET_KEY= >> .env
echo NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in >> .env
echo NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up >> .env
echo NEXT_PUBLIC_STREAM_API_KEY= >> .env
echo STREAM_SECRET_KEY= >> .env

REM Build application
echo Building application...
npm run build

REM Create shortcuts
echo Creating shortcuts...
set "DESKTOP=%USERPROFILE%\\Desktop"

REM Desktop shortcut
echo @echo off > "%INSTALL_DIR%\\start-yoom.bat"
echo title Yoom >> "%INSTALL_DIR%\\start-yoom.bat"
echo cd /d "%INSTALL_DIR%" >> "%INSTALL_DIR%\\start-yoom.bat"
echo npm run start >> "%INSTALL_DIR%\\start-yoom.bat"

powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\\Yoom.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\\start-yoom.bat'; $Shortcut.Save()"

REM Start Menu shortcut
set "START_MENU=%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\\Yoom.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\\start-yoom.bat'; $Shortcut.Save()"

echo.
echo ========================================
echo   Installation completed successfully!
echo ========================================
echo.
echo Yoom has been installed to: %INSTALL_DIR%
echo.
echo IMPORTANT: Configure your API keys in the .env file
echo Then start Yoom using the desktop shortcut or Start Menu
echo.

set /p choice="Start Yoom now? (y/n): "
if /i "%choice%"=="y" (
    start-yoom.bat
)

pause`;

// Create exclude file for xcopy
const excludeContent = `installer
*.log
node_modules
.git
dist
.next`;

fs.writeFileSync(path.join(installerDir, 'install.bat'), installerContent);
fs.writeFileSync(path.join(installerDir, 'exclude.txt'), excludeContent);

console.log('Installer created in:', installerDir);
console.log('Run install.bat to install Yoom');
