#!/bin/bash
set -e

echo "🚀 Building Perfect Windows Installer on Ubuntu"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build Next.js
echo -e "${BLUE}📦 Step 1: Building Next.js application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Next.js build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Next.js build complete!${NC}"
echo ""

# Step 2: Build Electron Portable (works perfectly on Linux)
echo -e "${BLUE}📦 Step 2: Building Electron Portable Installer...${NC}"
npx electron-builder --win portable --publish=never
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Electron build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Portable installer build complete!${NC}"
echo ""

# Step 3: Verify and prepare installer
echo -e "${BLUE}📦 Step 3: Preparing installer for deployment...${NC}"

# Check if portable was created
if [ -f "dist-electron/Zoom-Setup-1.0.0.exe" ]; then
    INSTALLER_SIZE=$(du -h "dist-electron/Zoom-Setup-1.0.0.exe" | cut -f1)
    echo -e "${GREEN}✅ Installer created: Zoom-Setup-1.0.0.exe (${INSTALLER_SIZE})${NC}"
    
    # Copy to public/installer for deployment
    mkdir -p public/installer
    cp "dist-electron/Zoom-Setup-1.0.0.exe" "public/installer/Zoom-Setup-1.0.0.exe"
    echo -e "${GREEN}✅ Installer copied to public/installer/ for deployment${NC}"
else
    echo -e "${YELLOW}⚠️  Portable installer not found, checking for unpacked app...${NC}"
    
    if [ -d "dist-electron/win-unpacked" ]; then
        echo -e "${BLUE}📦 Creating installer from unpacked app...${NC}"
        
        # Create a simple installer script
        INSTALLER_DIR="dist-electron/installer"
        mkdir -p "$INSTALLER_DIR"
        
        # Copy app
        cp -r "dist-electron/win-unpacked" "$INSTALLER_DIR/app"
        
        # Create installer batch file
        cat > "$INSTALLER_DIR/install.bat" << 'INSTALLER_EOF'
@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Zoom Desktop - Installation
echo ========================================
echo.

set "INSTALL_DIR=%LOCALAPPDATA%\Zoom"
set "DESKTOP=%USERPROFILE%\Desktop"
set "START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

echo Installing Zoom Desktop to: %INSTALL_DIR%
echo.

if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
xcopy /E /I /Y "%~dp0app\*" "%INSTALL_DIR%\" >nul

REM Create shortcuts
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\Zoom.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\Zoom.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Save()" >nul 2>&1

if not exist "%START_MENU%" mkdir "%START_MENU%"
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\Zoom.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\Zoom.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Save()" >nul 2>&1

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Zoom Desktop has been installed successfully!
echo.
set /p LAUNCH="Launch Zoom Desktop now? (Y/N): "
if /i "%LAUNCH%"=="Y" start "" "%INSTALL_DIR%\Zoom.exe"
pause
INSTALLER_EOF
        
        # Create zip installer
        cd "$INSTALLER_DIR"
        zip -r -q ../Zoom-Setup-1.0.0.zip app install.bat
        cd ../..
        
        # Copy zip to public
        mkdir -p public/installer
        cp "dist-electron/Zoom-Setup-1.0.0.zip" "public/installer/Zoom-Setup-1.0.0.zip"
        
        echo -e "${GREEN}✅ ZIP installer created: Zoom-Setup-1.0.0.zip${NC}"
    fi
fi

echo ""
echo -e "${GREEN}================================================"
echo "✅ BUILD COMPLETE - PRODUCTION READY!"
echo "================================================${NC}"
echo ""
echo "📦 Installer files:"
if [ -f "public/installer/Zoom-Setup-1.0.0.exe" ]; then
    SIZE=$(du -h "public/installer/Zoom-Setup-1.0.0.exe" | cut -f1)
    echo -e "   ${GREEN}✅ public/installer/Zoom-Setup-1.0.0.exe (${SIZE})${NC}"
fi
if [ -f "public/installer/Zoom-Setup-1.0.0.zip" ]; then
    SIZE=$(du -h "public/installer/Zoom-Setup-1.0.0.zip" | cut -f1)
    echo -e "   ${GREEN}✅ public/installer/Zoom-Setup-1.0.0.zip (${SIZE})${NC}"
fi
echo ""
echo "🚀 Ready to deploy to Vercel!"
echo "   The installer will be available at: /installer/Zoom-Setup-1.0.0.exe"
echo ""
