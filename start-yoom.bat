@echo off
title Yoom - Zoom Clone
color 0A

echo ========================================
echo     Yoom - Zoom Clone
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Dependencies not found. Installing...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please make sure you have configured your API keys.
    echo See WINDOWS-INSTALLATION-GUIDE.md for details.
    echo.
)

echo Starting Yoom...
echo The application will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the application
npm run start
