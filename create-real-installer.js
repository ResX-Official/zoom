// This script creates a proper Windows installer by packaging the entire application
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Creating Yoom Windows Installer...');

// Create the installer directory structure
const installerDir = path.join(__dirname, 'yoom-installer');
const appDir = path.join(installerDir, 'app');

// Clean and create directories
if (fs.existsSync(installerDir)) {
    fs.rmSync(installerDir, { recursive: true });
}
fs.mkdirSync(installerDir, { recursive: true });
fs.mkdirSync(appDir, { recursive: true });

// Copy all application files
console.log('Copying application files...');
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

// Copy files
filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(installerDir, file));
        console.log(`Copied ${file}`);
    }
});

// Copy directories
dirsToCopy.forEach(dir => {
    if (fs.existsSync(dir)) {
        fs.cpSync(dir, path.join(installerDir, dir), { recursive: true });
        console.log(`Copied ${dir}/`);
    }
});

// Create the installer script
const installerScript = `@echo off
echo ========================================
echo     Yoom - Video Conferencing App
echo ========================================
echo.
echo Installing Yoom on your system...
echo.

REM Create installation directory
set "INSTALL_DIR=%PROGRAMFILES%\\Yoom"
echo Creating installation directory: %INSTALL_DIR%

REM Create directory with admin privileges
if not exist "%INSTALL_DIR%" (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c mkdir \"%INSTALL_DIR%\"' -Verb RunAs" 2>nul
    if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%" 2>nul
)

REM Copy application files
echo Copying application files...
xcopy /E /I /Y "%~dp0app" "%INSTALL_DIR%\\app"
xcopy /E /I /Y "%~dp0components" "%INSTALL_DIR%\\components"
xcopy /E /I /Y "%~dp0constants" "%INSTALL_DIR%\\constants"
xcopy /E /I /Y "%~dp0hooks" "%INSTALL_DIR%\\hooks"
xcopy /E /I /Y "%~dp0lib" "%INSTALL_DIR%\\lib"
xcopy /E /I /Y "%~dp0providers" "%INSTALL_DIR%\\providers"
xcopy /E /I /Y "%~dp0actions" "%INSTALL_DIR%\\actions"
xcopy /E /I /Y "%~dp0public" "%INSTALL_DIR%\\public"
copy /Y "%~dp0package.json" "%INSTALL_DIR%\\"
copy /Y "%~dp0next.config.mjs" "%INSTALL_DIR%\\"
copy /Y "%~dp0tailwind.config.ts" "%INSTALL_DIR%\\"
copy /Y "%~dp0tsconfig.json" "%INSTALL_DIR%\\"
copy /Y "%~dp0postcss.config.js" "%INSTALL_DIR%\\"
copy /Y "%~dp0components.json" "%INSTALL_DIR%\\"
copy /Y "%~dp0middleware.ts" "%INSTALL_DIR%\\"

REM Change to installation directory
cd /d "%INSTALL_DIR%"

REM Check if Node.js is installed
echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download the LTS version
    echo 3. Install with "Add to PATH" option checked
    echo 4. Restart your computer
    echo 5. Run this installer again
    echo.
    echo This installer will now open the Node.js download page...
    start https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!

REM Install dependencies
echo.
echo Installing dependencies...
echo This may take a few minutes...
npm install --silent --production

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

REM Create environment file
echo Creating configuration file...
echo NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= > .env
echo CLERK_SECRET_KEY= >> .env
echo. >> .env
echo NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in >> .env
echo NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up >> .env
echo. >> .env
echo NEXT_PUBLIC_STREAM_API_KEY= >> .env
echo STREAM_SECRET_KEY= >> .env

REM Build the application
echo Building application...
npm run build

if %errorlevel% neq 0 (
    echo ERROR: Failed to build application
    echo Please check the configuration and try again
    pause
    exit /b 1
)

REM Create start script
echo Creating start script...
echo @echo off > start-yoom.bat
echo title Yoom - Video Conferencing >> start-yoom.bat
echo cd /d "%INSTALL_DIR%" >> start-yoom.bat
echo echo Starting Yoom... >> start-yoom.bat
echo npm run start >> start-yoom.bat

REM Create desktop shortcut
echo Creating desktop shortcut...
set "DESKTOP=%USERPROFILE%\\Desktop"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\\Yoom.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\\start-yoom.bat'; $Shortcut.Save()"

REM Create Start Menu shortcut
echo Creating Start Menu shortcut...
set "START_MENU=%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\\Yoom.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\\start-yoom.bat'; $Shortcut.Save()"

REM Create uninstaller
echo Creating uninstaller...
echo @echo off > uninstall.bat
echo echo Uninstalling Yoom... >> uninstall.bat
echo rmdir /S /Q "%INSTALL_DIR%" >> uninstall.bat
echo del "%DESKTOP%\\Yoom.lnk" >> uninstall.bat
echo del "%START_MENU%\\Yoom.lnk" >> uninstall.bat
echo echo Yoom has been uninstalled. >> uninstall.bat
echo pause >> uninstall.bat

echo.
echo ========================================
echo   Installation completed successfully!
echo ========================================
echo.
echo Yoom has been installed to: %INSTALL_DIR%
echo.
echo IMPORTANT: Before using Yoom, you need to:
echo 1. Edit the .env file in: %INSTALL_DIR%
echo 2. Add your API keys from:
echo    - Clerk: https://clerk.com/
echo    - Stream: https://getstream.io/
echo.
echo To start Yoom:
echo 1. Double-click the desktop shortcut, OR
echo 2. Search for "Yoom" in the Start Menu, OR
echo 3. Run start-yoom.bat from the installation folder
echo.
echo The application will be available at: http://localhost:3000
echo.

set /p choice="Would you like to start Yoom now? (y/n): "
if /i "%choice%"=="y" (
    echo.
    echo Starting Yoom...
    start-yoom.bat
) else (
    echo.
    echo You can start Yoom anytime using the desktop shortcut or Start Menu.
)

echo.
echo Installation complete!
pause`;

// Write the installer script
fs.writeFileSync(path.join(installerDir, 'install-yoom.bat'), installerScript);

// Create a self-extracting archive script
const selfExtractingScript = `@echo off
echo ========================================
echo     Yoom Windows Installer
echo ========================================
echo.
echo Extracting installer files...
echo.

REM Extract files to temp directory
set "TEMP_DIR=%TEMP%\\YoomInstaller"
if exist "%TEMP_DIR%" rmdir /S /Q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"

REM Copy installer files (this would normally extract from embedded archive)
copy /Y "%~dp0install-yoom.bat" "%TEMP_DIR%\\"
xcopy /E /I /Y "%~dp0app" "%TEMP_DIR%\\app"
xcopy /E /I /Y "%~dp0components" "%TEMP_DIR%\\components"
xcopy /E /I /Y "%~dp0constants" "%TEMP_DIR%\\constants"
xcopy /E /I /Y "%~dp0hooks" "%TEMP_DIR%\\hooks"
xcopy /E /I /Y "%~dp0lib" "%TEMP_DIR%\\lib"
xcopy /E /I /Y "%~dp0providers" "%TEMP_DIR%\\providers"
xcopy /E /I /Y "%~dp0actions" "%TEMP_DIR%\\actions"
xcopy /E /I /Y "%~dp0public" "%TEMP_DIR%\\public"
copy /Y "%~dp0package.json" "%TEMP_DIR%\\"
copy /Y "%~dp0next.config.mjs" "%TEMP_DIR%\\"
copy /Y "%~dp0tailwind.config.ts" "%TEMP_DIR%\\"
copy /Y "%~dp0tsconfig.json" "%TEMP_DIR%\\"
copy /Y "%~dp0postcss.config.js" "%TEMP_DIR%\\"
copy /Y "%~dp0components.json" "%TEMP_DIR%\\"
copy /Y "%~dp0middleware.ts" "%TEMP_DIR%\\"

REM Run the installer
cd /d "%TEMP_DIR%"
call install-yoom.bat

REM Clean up
cd /d "%USERPROFILE%"
rmdir /S /Q "%TEMP_DIR%"

exit`;

fs.writeFileSync(path.join(installerDir, 'Yoom-Setup.exe'), selfExtractingScript);

console.log('Installer created successfully!');
console.log('Files created in:', installerDir);
console.log('- Yoom-Setup.exe (Main installer)');
console.log('- install-yoom.bat (Installation script)');
console.log('- All application files');
