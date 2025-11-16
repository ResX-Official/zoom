# Building the Installer on Windows

## Why Build on Windows?

The installer built on Linux via Wine is incomplete (only 157KB). Building natively on Windows will create a proper installer (~200-300MB) that includes all Electron binaries.

## Prerequisites

1. **Node.js** (v18 or later)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

## Steps to Build

### Option 1: Using the Batch Script (Easiest)

1. **Open Command Prompt as Administrator**
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Command Prompt (Admin)"

2. **Navigate to project directory**
   ```cmd
   cd C:\path\to\zoom-clone-main
   ```

3. **Run the build script**
   ```cmd
   build-installer.bat
   ```

The script will:
- Install dependencies
- Build the Next.js app
- Build the Electron installer
- Show you where the installer is located

### Option 2: Manual Build

1. **Install dependencies**
   ```cmd
   npm install
   ```

2. **Build Next.js app**
   ```cmd
   npm run build
   ```

3. **Build Electron installer**
   ```cmd
   npx electron-builder --win --publish=never
   ```

4. **Find the installer**
   - Location: `dist-electron\Zoom-Setup-1.0.0.exe`
   - Size should be: ~200-300MB (not 157KB!)

## Verify the Build

After building, check:

1. **Installer size** should be 200-300MB:
   ```cmd
   dir dist-electron\Zoom-Setup-1.0.0.exe
   ```

2. **Unpacked app** should be ~700MB:
   ```cmd
   dir dist-electron\win-unpacked
   ```

## Deploying the Installer

Once you have a properly built installer:

1. **Copy to public folder**
   ```cmd
   mkdir public\installer
   copy dist-electron\Zoom-Setup-1.0.0.exe public\installer\
   ```

2. **Deploy to Vercel**
   ```cmd
   vercel --prod
   ```

## Troubleshooting

### Error: "electron-builder not found"
```cmd
npm install --save-dev electron electron-builder
```

### Error: "Missing build dependencies"
```cmd
npm install
```

### Installer is still too small
- Make sure you're on Windows
- Check that `dist-electron\win-unpacked` is ~700MB
- Try: `npx electron-builder --win --publish=never --config.win.target=nsis`

### Build takes too long
- This is normal - the first build downloads Electron binaries (~200MB)
- Subsequent builds are faster

## Alternative: Use Portable Version

If you want a portable version (no installer needed):

```cmd
npx electron-builder --win portable --publish=never
```

This creates: `dist-electron\Zoom-Portable-1.0.0.exe`

Users can just run this file directly without installation.







