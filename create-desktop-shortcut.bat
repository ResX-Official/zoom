@echo off
echo ========================================
echo   Creating Desktop Shortcut for Yoom
echo ========================================
echo.

REM Get the current directory
set "PROJECT_DIR=%~dp0"
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

REM Get the desktop path
for /f "tokens=3*" %%a in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders" /v Desktop 2^>nul') do set "DESKTOP=%%b"

if "%DESKTOP%"=="" (
    echo ERROR: Could not find desktop path
    echo Please run this script manually
    pause
    exit /b 1
)

REM Create the shortcut
echo Creating shortcut on desktop...

REM Create VBScript to generate shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP%\Yoom.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "http://localhost:3000" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%PROJECT_DIR%" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Yoom - Zoom Clone" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"

REM Execute the VBScript
cscript //nologo "%TEMP%\CreateShortcut.vbs"

REM Clean up
del "%TEMP%\CreateShortcut.vbs"

if exist "%DESKTOP%\Yoom.lnk" (
    echo.
    echo SUCCESS: Desktop shortcut created successfully!
    echo Shortcut location: %DESKTOP%\Yoom.lnk
    echo.
    echo The shortcut will open Yoom in your default web browser.
    echo Make sure the application is running (npm run start) before using the shortcut.
) else (
    echo.
    echo ERROR: Failed to create desktop shortcut
    echo You may need to run this script as Administrator
)

echo.
echo Press any key to exit...
pause >nul
