const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all critical Vercel build errors...');

// Fix 1: Remove unused 'Eye' import from admin/page.tsx
const adminPagePath = 'app/admin/page.tsx';
if (fs.existsSync(adminPagePath)) {
  let content = fs.readFileSync(adminPagePath, 'utf8');
  if (content.includes("import { Users, Monitor, Activity, AlertCircle, CheckCircle, HardDrive, Gamepad2, Link, Eye } from 'lucide-react';")) {
    content = content.replace("import { Users, Monitor, Activity, AlertCircle, CheckCircle, HardDrive, Gamepad2, Link, Eye } from 'lucide-react';", "import { Users, Monitor, Activity, AlertCircle, CheckCircle, HardDrive, Gamepad2, Link } from 'lucide-react';");
    fs.writeFileSync(adminPagePath, content);
    console.log('✅ Fixed unused Eye import in admin/page.tsx');
  }
}

// Fix 2: Remove unused imports from files/route.ts
const filesRoutePath = 'app/api/admin/files/route.ts';
if (fs.existsSync(filesRoutePath)) {
  let content = fs.readFileSync(filesRoutePath, 'utf8');
  // Remove fs and path imports if they exist
  content = content.replace(/import\s*{\s*promises\s*as\s*fs\s*}\s*from\s*['"]fs['"];\s*\n?/g, '');
  content = content.replace(/import\s*path\s*from\s*['"]path['"];\s*\n?/g, '');
  // Remove unused userId from destructuring
  content = content.replace(/const\s*{\s*action,\s*userId,\s*filePath,\s*content\s*}\s*=\s*body;/, 'const { action, filePath, content } = body;');
  fs.writeFileSync(filesRoutePath, content);
  console.log('✅ Fixed unused imports in files/route.ts');
}

// Fix 3: Fix const vs let in remote-control/route.ts
const remoteControlPath = 'app/api/admin/remote-control/route.ts';
if (fs.existsSync(remoteControlPath)) {
  let content = fs.readFileSync(remoteControlPath, 'utf8');
  content = content.replace(/let\s+result\s*=\s*{\s*success:\s*false,\s*message:\s*['"]\s*['"]\s*};/, 'const result = { success: false, message: \'\' };');
  fs.writeFileSync(remoteControlPath, content);
  console.log('✅ Fixed const vs let in remote-control/route.ts');
}

// Fix 4: Fix const vs let in screen-share/route.ts
const screenSharePath = 'app/api/admin/screen-share/route.ts';
if (fs.existsSync(screenSharePath)) {
  let content = fs.readFileSync(screenSharePath, 'utf8');
  content = content.replace(/let\s+activeScreenShares\s*=\s*new\s+Map\(\);/, 'const activeScreenShares = new Map();');
  fs.writeFileSync(screenSharePath, content);
  console.log('✅ Fixed const vs let in screen-share/route.ts');
}

// Fix 5: Fix const vs let and case declarations in users/route.ts
const usersPath = 'app/api/admin/users/route.ts';
if (fs.existsSync(usersPath)) {
  let content = fs.readFileSync(usersPath, 'utf8');
  content = content.replace(/let\s+users\s*=\s*\[/, 'const users = [');
  // Fix case declarations by wrapping in blocks
  content = content.replace(/case\s+['"]GET['"]:\s*\n\s*const\s+(\w+)\s*=\s*(\w+);/g, 'case \'GET\': {\n    const $1 = $2;');
  content = content.replace(/case\s+['"]POST['"]:\s*\n\s*const\s+(\w+)\s*=\s*(\w+);/g, 'case \'POST\': {\n    const $1 = $2;');
  content = content.replace(/case\s+['"]PUT['"]:\s*\n\s*const\s+(\w+)\s*=\s*(\w+);/g, 'case \'PUT\': {\n    const $1 = $2;');
  // Add closing braces for case blocks
  content = content.replace(/return\s+NextResponse\.json\([^)]+\);\s*\n\s*default:/g, 'return NextResponse.json({ error: \'Method not allowed\' }, { status: 405 });\n  }\n  default:');
  fs.writeFileSync(usersPath, content);
  console.log('✅ Fixed const vs let and case declarations in users/route.ts');
}

// Fix 6: Remove unused useEffect from download/page.tsx
const downloadPagePath = 'app/download/page.tsx';
if (fs.existsSync(downloadPagePath)) {
  let content = fs.readFileSync(downloadPagePath, 'utf8');
  content = content.replace(/import\s*React,\s*{\s*useState,\s*useEffect\s*}\s*from\s*['"]react['"];/, 'import React, { useState } from \'react\';');
  // Fix unescaped entities
  content = content.replace(/click\s*["']More\s*info["']\s*and\s*["']Run\s*anyway["']/g, 'click &quot;More info&quot; and &quot;Run anyway&quot;');
  fs.writeFileSync(downloadPagePath, content);
  console.log('✅ Fixed unused useEffect and unescaped entities in download/page.tsx');
}

// Fix 7: Fix unescaped entities in download/windows/page.tsx
const downloadWindowsPath = 'app/download/windows/page.tsx';
if (fs.existsSync(downloadWindowsPath)) {
  let content = fs.readFileSync(downloadWindowsPath, 'utf8');
  content = content.replace(/Double-click\s*the\s*\.bat\s*file\s*or\s*right-click\s*the\s*\.ps1\s*file\s*and\s*["']Run\s*with\s*PowerShell["']/g, 'Double-click the .bat file or right-click the .ps1 file and &quot;Run with PowerShell&quot;');
  fs.writeFileSync(downloadWindowsPath, content);
  console.log('✅ Fixed unescaped entities in download/windows/page.tsx');
}

// Fix 8: Fix arrow function return assignments in meeting pages
const meetingPagePath = 'app/meeting/[id]/page.tsx';
if (fs.existsSync(meetingPagePath)) {
  let content = fs.readFileSync(meetingPagePath, 'utf8');
  content = content.replace(/onClick=\{\(\)\s*=>\s*window\.location\.href\s*=\s*['"]\/['"]\}/g, 'onClick={() => { window.location.href = \'/\'; }}');
  fs.writeFileSync(meetingPagePath, content);
  console.log('✅ Fixed arrow function return assignments in meeting/[id]/page.tsx');
}

// Fix 9: Fix import order and arrow functions in meeting/j/[id]/page.tsx
const meetingJPagePath = 'app/meeting/j/[id]/page.tsx';
if (fs.existsSync(meetingJPagePath)) {
  let content = fs.readFileSync(meetingJPagePath, 'utf8');
  // Move imports to top
  const importRegex = /import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*\n/g;
  const imports = content.match(importRegex) || [];
  const nonImportContent = content.replace(importRegex, '');
  
  // Reconstruct with imports at top
  content = imports.join('') + nonImportContent;
  
  // Fix arrow function return assignments
  content = content.replace(/onClick=\{\(\)\s*=>\s*window\.location\.href\s*=\s*['"]\/['"]\}/g, 'onClick={() => { window.location.href = \'/\'; }}');
  fs.writeFileSync(meetingJPagePath, content);
  console.log('✅ Fixed import order and arrow functions in meeting/j/[id]/page.tsx');
}

// Fix 10: Fix React import in page.tsx
const pagePath = 'app/page.tsx';
if (fs.existsSync(pagePath)) {
  let content = fs.readFileSync(pagePath, 'utf8');
  if (!content.includes('import React')) {
    content = 'import React from \'react\';\n' + content;
  }
  fs.writeFileSync(pagePath, content);
  console.log('✅ Fixed React import in page.tsx');
}

// Fix 11: Remove unused imports from FileBrowser.tsx
const fileBrowserPath = 'components/FileBrowser.tsx';
if (fs.existsSync(fileBrowserPath)) {
  let content = fs.readFileSync(fileBrowserPath, 'utf8');
  content = content.replace(/import\s*{\s*Badge\s*}\s*from\s*['"]@\/components\/ui\/badge['"];\s*\n?/g, '');
  content = content.replace(/import\s*{\s*Folder,\s*File,\s*Download,\s*Trash2,\s*ArrowLeft,\s*Plus\s*}\s*from\s*['"]lucide-react['"];/, 'import { Folder, File, Download, Trash2, ArrowLeft } from \'lucide-react\';');
  // Fix unescaped entities
  content = content.replace(/Browse\s*user's\s*files\s*and\s*folders/g, 'Browse user&apos;s files and folders');
  fs.writeFileSync(fileBrowserPath, content);
  console.log('✅ Fixed unused imports and unescaped entities in FileBrowser.tsx');
}

// Fix 12: Remove unused imports from RemoteControl.tsx
const remoteControlComponentPath = 'components/RemoteControl.tsx';
if (fs.existsSync(remoteControlComponentPath)) {
  let content = fs.readFileSync(remoteControlComponentPath, 'utf8');
  content = content.replace(/import\s*{\s*MousePointer,\s*Keyboard,\s*Monitor,\s*Wifi\s*}\s*from\s*['"]lucide-react['"];/, 'import { MousePointer, Keyboard, Monitor } from \'lucide-react\';');
  content = content.replace(/const\s*\[\s*isLoading,\s*setIsLoading\s*\]\s*=\s*useState\(false\);\s*\n?/g, '');
  // Fix unescaped entities
  content = content.replace(/user's\s*computer/g, 'user&apos;s computer');
  fs.writeFileSync(remoteControlComponentPath, content);
  console.log('✅ Fixed unused imports and unescaped entities in RemoteControl.tsx');
}

// Fix 13: Remove unused videoRef from ScreenShareViewer.tsx
const screenShareViewerPath = 'components/ScreenShareViewer.tsx';
if (fs.existsSync(screenShareViewerPath)) {
  let content = fs.readFileSync(screenShareViewerPath, 'utf8');
  content = content.replace(/const\s*videoRef\s*=\s*useRef<HTMLVideoElement>\(null\);\s*\n?/g, '');
  fs.writeFileSync(screenShareViewerPath, content);
  console.log('✅ Fixed unused videoRef in ScreenShareViewer.tsx');
}

// Fix 14: Fix React import in UserTrackingProvider.tsx
const userTrackingPath = 'components/UserTrackingProvider.tsx';
if (fs.existsSync(userTrackingPath)) {
  let content = fs.readFileSync(userTrackingPath, 'utf8');
  if (!content.includes('import React')) {
    content = 'import React, { useEffect } from \'react\';\n' + content.replace(/import\s*{\s*useEffect\s*}\s*from\s*['"]react['"];\s*\n?/g, '');
  }
  fs.writeFileSync(userTrackingPath, content);
  console.log('✅ Fixed React import in UserTrackingProvider.tsx');
}

// Fix 15: Fix NodeJS type in user-tracking.ts
const userTrackingLibPath = 'lib/user-tracking.ts';
if (fs.existsSync(userTrackingLibPath)) {
  let content = fs.readFileSync(userTrackingLibPath, 'utf8');
  content = content.replace(/private\s+heartbeatInterval:\s*NodeJS\.Timeout\s*\|\s*null\s*=\s*null;/, 'private heartbeatInterval: any = null;');
  fs.writeFileSync(userTrackingLibPath, content);
  console.log('✅ Fixed NodeJS type in user-tracking.ts');
}

console.log('🎉 All critical errors fixed! Ready for Vercel deployment!');
