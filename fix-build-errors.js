const fs = require('fs');
const path = require('path');

// Fix all critical build errors
const fixes = [
  {
    file: 'app/admin/page.tsx',
    search: "import { Users, Monitor, Activity, AlertCircle, CheckCircle, HardDrive, Gamepad2, Link } from 'lucide-react';",
    replace: "import { Users, Monitor, Activity, AlertCircle, CheckCircle, HardDrive, Gamepad2, Link } from 'lucide-react';"
  },
  {
    file: 'app/api/admin/files/route.ts',
    search: "import { promises as fs } from 'fs';\nimport path from 'path';",
    replace: "// import { promises as fs } from 'fs';\n// import path from 'path';"
  },
  {
    file: 'app/api/admin/files/route.ts',
    search: "const { action, userId, filePath, content } = body;",
    replace: "const { action, filePath, content } = body;"
  },
  {
    file: 'app/api/admin/remote-control/route.ts',
    search: "let result = { success: false, message: '' };",
    replace: "const result = { success: false, message: '' };"
  },
  {
    file: 'app/api/admin/screen-share/route.ts',
    search: "let activeScreenShares = new Map();",
    replace: "const activeScreenShares = new Map();"
  },
  {
    file: 'app/api/admin/users/route.ts',
    search: "let users = [",
    replace: "const users = ["
  },
  {
    file: 'app/download/page.tsx',
    search: "import { useState, useEffect } from 'react';",
    replace: "import { useState } from 'react';"
  },
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
  {
    file: 'components/ScreenShareViewer.tsx',
    search: "const videoRef = useRef<HTMLVideoElement>(null);",
    replace: "// const videoRef = useRef<HTMLVideoElement>(null);"
  },
  {
    file: 'lib/user-tracking.ts',
    search: "private heartbeatInterval: NodeJS.Timeout | null = null;",
    replace: "private heartbeatInterval: any = null;"
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

console.log('Build error fixes completed!');
