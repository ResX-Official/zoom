# Hosting the Windows Installer

The installer file (146MB) exceeds Vercel's 100MB file size limit, so it needs to be hosted separately.

## Option 1: GitHub Releases (Recommended)

1. Create a GitHub release:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. Go to GitHub → Releases → Draft a new release
3. Upload `dist-electron/Zoom-Setup-1.0.0.exe`
4. Update download page to point to GitHub release URL

## Option 2: AWS S3 / Cloud Storage

1. Upload to S3 bucket:
   ```bash
   aws s3 cp dist-electron/Zoom-Setup-1.0.0.exe s3://your-bucket/installer/
   ```

2. Make it publicly accessible
3. Update download page to point to S3 URL

## Option 3: Use a CDN

Upload to any CDN service (Cloudflare, etc.) and update the download link.

## Current Installer Location

- **Built installer**: `dist-electron/Zoom-Setup-1.0.0.exe` (146MB)
- **For deployment**: Excluded from Vercel (see `.vercelignore`)

## Quick Fix: Update Download Page

Update `app/download/page.tsx` to point to your hosted installer URL instead of `/installer/Zoom-Setup-1.0.0.exe`.

