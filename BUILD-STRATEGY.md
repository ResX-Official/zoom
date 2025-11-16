# Build Strategy for Production

## The Problem

If you build the Electron installer on Linux:
- The installer might be incomplete (Wine issues)
- Users downloading from `/download` page get broken installer
- Installation fails for end users

## Solution Options

### Option 1: Build on Windows (Recommended for Production)

**Steps:**
1. On a Windows machine, run:
   ```bash
   npm install
   npm run build-electron
   ```

2. Copy the installer:
   ```bash
   copy dist-electron\Zoom-Setup-1.0.0.exe public\installer\
   ```

3. Commit and deploy:
   ```bash
   git add public/installer/Zoom-Setup-1.0.0.exe
   git commit -m "Add Windows installer"
   vercel --prod
   ```

**Result:** Users get a complete, working installer ✅

### Option 2: Use Portable Version (Alternative)

If you can't build on Windows, serve a portable version:

1. Build on Linux:
   ```bash
   npm run build-electron
   ```

2. Create zip of unpacked app:
   ```bash
   cd dist-electron
   zip -r Zoom-Portable-1.0.0.zip win-unpacked/
   cp Zoom-Portable-1.0.0.zip ../public/installer/
   ```

3. Update download page to serve zip instead of installer

**Result:** Users download zip, extract, and run `Zoom.exe` directly

### Option 3: Test Linux-Built Installer First

1. Build on Linux:
   ```bash
   npm run build-electron
   ```

2. Test installer on Windows:
   - Copy `dist-electron/Zoom-Setup-1.0.0.exe` to Windows
   - Try installing it
   - If it works → use it
   - If broken → use Option 1 or 2

## Recommended Workflow

### For Testing/Development:
- Build on Linux
- Use unpacked app (`dist-electron/win-unpacked/Zoom.exe`)
- Test all functionality
- Confirm everything works

### For Production:
- Build on Windows for proper installer
- Copy to `public/installer/`
- Deploy to Vercel
- Users get working installer

## Current Setup

The download page (`/download`) serves:
- File: `/installer/Zoom-Setup-1.0.0.exe`
- Location: `public/installer/Zoom-Setup-1.0.0.exe`
- Served as static file by Next.js/Vercel

## Quick Commands

**Build on Windows:**
```bash
npm run build-electron
copy dist-electron\Zoom-Setup-1.0.0.exe public\installer\
```

**Build on Linux (for testing):**
```bash
npm run build-electron
# Test with: dist-electron/win-unpacked/Zoom.exe
```

**Deploy:**
```bash
git add public/installer/Zoom-Setup-1.0.0.exe
git commit -m "Update installer"
vercel --prod
```


