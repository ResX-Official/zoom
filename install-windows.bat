@echo off
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
npm run start
