import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Option 1: Use environment variable for installer URL (recommended)
  // Set INSTALLER_URL in Vercel environment variables
  const installerUrl = process.env.INSTALLER_URL || 
    // Option 2: Fallback to GitHub Releases or other CDN
    'https://github.com/your-username/zoom-clone/releases/download/v1.0.0/Zoom-Setup-1.0.0.exe' ||
    // Option 3: Try local file (only works if file exists and is under 100MB)
    '/installer/Zoom-Setup-1.0.0.exe';

  // Redirect to the installer URL
  return NextResponse.redirect(new URL(installerUrl, request.url));
}
