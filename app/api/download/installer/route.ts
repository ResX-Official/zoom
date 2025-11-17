import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get installer URL from environment variable
  const installerUrl = process.env.INSTALLER_URL;

  // Log for debugging (will show in Vercel logs)
  console.log('INSTALLER_URL:', installerUrl ? 'Set' : 'NOT SET');
  console.log('Full URL:', installerUrl);

  if (!installerUrl) {
    console.error('INSTALLER_URL environment variable is not set!');
    return NextResponse.json(
      { error: 'Installer URL not configured. Please set INSTALLER_URL environment variable in Vercel.' },
      { status: 500 }
    );
  }

  // If it's an absolute URL (starts with http:// or https://), redirect directly
  if (installerUrl.startsWith('http://') || installerUrl.startsWith('https://')) {
    console.log('Redirecting to:', installerUrl);
    // Use 307 (Temporary Redirect) to preserve method and ensure browser follows it
    return NextResponse.redirect(installerUrl, { status: 307 });
  }

  // If it's a relative URL, construct absolute URL
  const url = new URL(installerUrl, request.url);
  console.log('Redirecting to:', url.toString());
  return NextResponse.redirect(url, { status: 307 });
}
