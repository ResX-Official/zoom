# Yoom Windows Installer Creator
# This script creates a proper Windows .exe installer

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Creating Yoom Windows Installer" -ForegroundColor Cyan
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

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "ERROR: Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "ERROR: npm is not available" -ForegroundColor Red
    exit 1
}

Write-Host "Prerequisites check passed!" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if (-not $?) {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Install Electron and electron-builder
Write-Host "Installing Electron..." -ForegroundColor Yellow
npm install --save-dev electron electron-builder

# Build the Next.js application
Write-Host ""
Write-Host "Building Next.js application..." -ForegroundColor Yellow
npm run build

if (-not $?) {
    Write-Host "ERROR: Failed to build Next.js application" -ForegroundColor Red
    exit 1
}

# Create the installer
Write-Host ""
Write-Host "Creating Windows installer..." -ForegroundColor Yellow

# Copy package-electron.json to package.json for building
Copy-Item "package.json" "package-backup.json" -Force
Copy-Item "package-electron.json" "package.json" -Force

try {
    # Build the Electron app
    npx electron-builder --win --publish=never
    
    if ($?) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "   Installer created successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        
        # List created files
        if (Test-Path "dist-electron") {
            Write-Host "Created files:" -ForegroundColor Yellow
            Get-ChildItem "dist-electron" | ForEach-Object {
                Write-Host "  - $($_.Name)" -ForegroundColor White
            }
        }
        
        Write-Host ""
        Write-Host "The installer is ready in the dist-electron folder!" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to create installer" -ForegroundColor Red
    }
} finally {
    # Restore original package.json
    Copy-Item "package-backup.json" "package.json" -Force
    Remove-Item "package-backup.json" -Force
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
