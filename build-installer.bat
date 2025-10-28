@echo off
echo ========================================
echo   Building Yoom Windows Installer
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

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo npm found!

echo.
echo ========================================
echo Installing dependencies...
echo ========================================

REM Install main dependencies
npm install

REM Install Electron dependencies
echo Installing Electron dependencies...
npm install --save-dev electron electron-builder

echo.
echo ========================================
echo Building Next.js application...
echo ========================================

REM Build the Next.js app
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Next.js application
    pause
    exit /b 1
)

echo.
echo ========================================
echo Building Windows installer...
echo ========================================

REM Build the Electron app for Windows
npx electron-builder --win --publish=never
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Windows installer
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo The Windows installer has been created in the dist-electron folder:
echo - Yoom-Setup-1.0.0.exe (Installer)
echo - Yoom-Portable-1.0.0.exe (Portable version)
echo.

REM Check if files exist
if exist "dist-electron\Yoom-Setup-1.0.0.exe" (
    echo SUCCESS: Installer created successfully!
    echo File location: %CD%\dist-electron\Yoom-Setup-1.0.0.exe
) else (
    echo WARNING: Installer file not found. Check for errors above.
)

echo.
echo Press any key to exit...
pause >nul
