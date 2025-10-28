; Yoom - Windows Installer Script (NSIS)
; This script creates a proper Windows installer for the Yoom Zoom Clone application

!define APPNAME "Yoom"
!define COMPANYNAME "Yoom Team"
!define DESCRIPTION "A modern video conferencing application"
!define VERSIONMAJOR 1
!define VERSIONMINOR 0
!define VERSIONBUILD 0
!define HELPURL "https://github.com/your-repo/zoom-clone"
!define UPDATEURL "https://github.com/your-repo/zoom-clone"
!define ABOUTURL "https://github.com/your-repo/zoom-clone"
!define INSTALLSIZE 50000

RequestExecutionLevel admin
InstallDir "$PROGRAMFILES64\${APPNAME}"
Name "${APPNAME}"
Icon "public\icons\logo.ico"
outFile "Yoom-Setup.exe"

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
    
    ; Create the application files
    file /r "dist\*.*"
    file "package.json"
    file "next.config.mjs"
    file "tailwind.config.ts"
    file "tsconfig.json"
    file "postcss.config.js"
    file "components.json"
    
    ; Copy public assets
    file /r "public"
    
    ; Create environment file
    fileOpen $0 "$INSTDIR\.env" w
    fileWrite $0 "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$\r$\n"
    fileWrite $0 "CLERK_SECRET_KEY=$\r$\n"
    fileWrite $0 "$\r$\n"
    fileWrite $0 "NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in$\r$\n"
    fileWrite $0 "NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up$\r$\n"
    fileWrite $0 "$\r$\n"
    fileWrite $0 "NEXT_PUBLIC_STREAM_API_KEY=$\r$\n"
    fileWrite $0 "STREAM_SECRET_KEY=$\r$\n"
    fileClose $0
    
    ; Create start script
    fileOpen $0 "$INSTDIR\start-yoom.bat" w
    fileWrite $0 "@echo off$\r$\n"
    fileWrite $0 "title ${APPNAME}$\r$\n"
    fileWrite $0 "cd /d $\"$INSTDIR$\"$\r$\n"
    fileWrite $0 "$\r$\n"
    fileWrite $0 "REM Check if Node.js is installed$\r$\n"
    fileWrite $0 "node --version >nul 2>&1$\r$\n"
    fileWrite $0 "if %errorlevel% neq 0 ($\r$\n"
    fileWrite $0 "    echo ERROR: Node.js is not installed$\r$\n"
    fileWrite $0 "    echo Please install Node.js from: https://nodejs.org/$\r$\n"
    fileWrite $0 "    pause$\r$\n"
    fileWrite $0 "    exit /b 1$\r$\n"
    fileWrite $0 ")$\r$\n"
    fileWrite $0 "$\r$\n"
    fileWrite $0 "REM Install dependencies if needed$\r$\n"
    fileWrite $0 "if not exist $\"node_modules$\" ($\r$\n"
    fileWrite $0 "    echo Installing dependencies...$\r$\n"
    fileWrite $0 "    npm install$\r$\n"
    fileWrite $0 ")$\r$\n"
    fileWrite $0 "$\r$\n"
    fileWrite $0 "echo Starting ${APPNAME}...$\r$\n"
    fileWrite $0 "npm run start$\r$\n"
    fileClose $0
    
    ; Create uninstaller
    writeUninstaller "$INSTDIR\uninstall.exe"
    
    ; Create shortcuts
    createDirectory "$SMPROGRAMS\${APPNAME}"
    createShortCut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\start-yoom.bat" "" "$INSTDIR\public\icons\logo.ico"
    createShortCut "$SMPROGRAMS\${APPNAME}\Uninstall ${APPNAME}.lnk" "$INSTDIR\uninstall.exe"
    createShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\start-yoom.bat" "" "$INSTDIR\public\icons\logo.ico"
    
    ; Registry entries
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "InstallLocation" "$\"$INSTDIR$\""
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayIcon" "$\"$INSTDIR\public\icons\logo.ico$\""
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "Publisher" "${COMPANYNAME}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "HelpLink" "${HELPURL}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLUpdateInfo" "${UPDATEURL}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "URLInfoAbout" "${ABOUTURL}"
    writeRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayVersion" "${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}"
    writeRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "VersionMajor" ${VERSIONMAJOR}
    writeRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "VersionMinor" ${VERSIONMINOR}
    writeRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoModify" 1
    writeRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "NoRepair" 1
    writeRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "EstimatedSize" ${INSTALLSIZE}
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
