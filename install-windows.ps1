# Yoom - Zoom Clone for Windows
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
}
