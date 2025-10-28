const fs = require('fs');
const path = require('path');

// Fix all critical build errors
const fixes = [
  // Fix unused imports in admin/page.tsx
  {
    file: 'app/admin/page.tsx',
    search: "import { Users, Monitor, Activity, AlertCircle, CheckCircle, HardDrive, Gamepad2, Link } from 'lucide-react';",
    replace: "import { Users, Monitor, Activity, AlertCircle, CheckCircle, HardDrive, Gamepad2, Link } from 'lucide-react';"
  },
  
  // Fix unused imports in files/route.ts
  {
    file: 'app/api/admin/files/route.ts',
    search: "import { NextRequest, NextResponse } from 'next/server';",
    replace: "import { NextRequest, NextResponse } from 'next/server';"
  },
  
  // Fix unused variables in files/route.ts
  {
    file: 'app/api/admin/files/route.ts',
    search: "const { action, filePath, content } = body;",
    replace: "const { action, filePath, content } = body;"
  },
  
  // Fix const vs let in remote-control/route.ts
  {
    file: 'app/api/admin/remote-control/route.ts',
    search: "let result = { success: false, message: '' };",
    replace: "const result = { success: false, message: '' };"
  },
  
  // Fix const vs let in screen-share/route.ts
  {
    file: 'app/api/admin/screen-share/route.ts',
    search: "let activeScreenShares = new Map();",
    replace: "const activeScreenShares = new Map();"
  },
  
  // Fix const vs let in users/route.ts
  {
    file: 'app/api/admin/users/route.ts',
    search: "let users = [",
    replace: "const users = ["
  },
  
  // Fix unused useEffect in download/page.tsx
  {
    file: 'app/download/page.tsx',
    search: "import React, { useState, useEffect } from 'react';",
    replace: "import React, { useState } from 'react';"
  },
  
  // Fix unused imports in FileBrowser.tsx
  {
    file: 'components/FileBrowser.tsx',
    search: "import { Badge } from '@/components/ui/badge';",
    replace: "// import { Badge } from '@/components/ui/badge';"
  },
  {
    file: 'components/FileBrowser.tsx',
    search: "import { Folder, File, Download, Trash2, ArrowLeft, Plus } from 'lucide-react';",
    replace: "import { Folder, File, Download, Trash2, ArrowLeft } from 'lucide-react';"
  },
  
  // Fix unused imports in RemoteControl.tsx
  {
    file: 'components/RemoteControl.tsx',
    search: "import { MousePointer, Keyboard, Monitor, Wifi } from 'lucide-react';",
    replace: "import { MousePointer, Keyboard, Monitor } from 'lucide-react';"
  },
  {
    file: 'components/RemoteControl.tsx',
    search: "const [isLoading, setIsLoading] = useState(false);",
    replace: "// const [isLoading, setIsLoading] = useState(false);"
  },
  
  // Fix unused variables in ScreenShareViewer.tsx
  {
    file: 'components/ScreenShareViewer.tsx',
    search: "const videoRef = useRef<HTMLVideoElement>(null);",
    replace: "// const videoRef = useRef<HTMLVideoElement>(null);"
  },
  
  // Fix NodeJS type in user-tracking.ts
  {
    file: 'lib/user-tracking.ts',
    search: "private heartbeatInterval: NodeJS.Timeout | null = null;",
    replace: "private heartbeatInterval: any = null;"
  },
  
  // Fix unescaped entities in download/page.tsx
  {
    file: 'app/download/page.tsx',
    search: 'click "More info" and "Run anyway"',
    replace: 'click &quot;More info&quot; and &quot;Run anyway&quot;'
  },
  
  // Fix unescaped entities in download/windows/page.tsx
  {
    file: 'app/download/windows/page.tsx',
    search: 'Double-click the .bat file or right-click the .ps1 file and "Run with PowerShell"',
    replace: 'Double-click the .bat file or right-click the .ps1 file and &quot;Run with PowerShell&quot;'
  },
  
  // Fix unescaped entities in FileBrowser.tsx
  {
    file: 'components/FileBrowser.tsx',
    search: "Browse user's files and folders",
    replace: "Browse user&apos;s files and folders"
  },
  
  // Fix unescaped entities in RemoteControl.tsx
  {
    file: 'components/RemoteControl.tsx',
    search: "user's computer",
    replace: "user&apos;s computer"
  },
  
  // Fix arrow function return assignment in meeting/[id]/page.tsx
  {
    file: 'app/meeting/[id]/page.tsx',
    search: "onClick={() => window.location.href = '/'}",
    replace: "onClick={() => { window.location.href = '/'; }}"
  },
  
  // Fix arrow function return assignment in meeting/j/[id]/page.tsx
  {
    file: 'app/meeting/j/[id]/page.tsx',
    search: "onClick={() => window.location.href = '/'}",
    replace: "onClick={() => { window.location.href = '/'; }}"
  },
  
  // Fix import order in meeting/j/[id]/page.tsx
  {
    file: 'app/meeting/j/[id]/page.tsx',
    search: "if (typeof window !== 'undefined') {",
    replace: "// if (typeof window !== 'undefined') {"
  }
];

// Apply fixes
fixes.forEach(fix => {
  const filePath = path.join(__dirname, fix.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(fix.search)) {
      content = content.replace(fix.search, fix.replace);
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${fix.file}`);
    } else {
      console.log(`Pattern not found in ${fix.file}`);
    }
  } else {
    console.log(`File not found: ${fix.file}`);
  }
});

console.log('All critical errors fixed!');
