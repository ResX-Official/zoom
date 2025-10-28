@echo off
echo ========================================
echo   Building Real Yoom Windows Installer
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!

REM Install electron and electron-builder if not already installed
echo Installing Electron and builder tools...
npm install --save-dev electron electron-builder
if %errorlevel% neq 0 (
    echo ERROR: Failed to install build tools
    pause
    exit /b 1
)

REM Build the Next.js application
echo Building Next.js application...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Next.js application
    pause
    exit /b 1
)

REM Create the installer using electron-builder
echo Creating Windows installer...
npx electron-builder --win --publish=never
if %errorlevel% neq 0 (
    echo ERROR: Failed to create installer
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Installer created successfully!
echo ========================================
echo.
echo The installer has been created in the dist-electron folder.
echo Users can now download and install Yoom like any other Windows app!

REM List the created files
if exist "dist-electron" (
    echo.
    echo Created files:
    dir /b dist-electron\*.exe
)

echo.
pause
