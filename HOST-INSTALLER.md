# 🚀 Host Installer on GitHub Releases

## ✅ Quick Steps

### Step 1: Remove Installer from Git (Already Done)
The installer is now excluded from Git. It's still in `dist-electron/` for you to upload.

### Step 2: Commit Changes
```bash
git add .gitignore .vercelignore
git commit -m "Exclude installer from Git, configure for external hosting"
git push origin main
```

### Step 3: Create GitHub Release (Web UI - Easiest!)

1. **Go to your repository:**
   ```
   https://github.com/ResX-Official/zoom
   ```

2. **Click "Releases"** (on the right side)

3. **Click "Draft a new release"**

4. **Fill in the form:**
   - **Tag version**: `v1.0.0` (create new tag)
   - **Release title**: `Zoom Desktop v1.0.0`
   - **Description**: 
     ```
     Windows Installer for Zoom Desktop Client
     
     Features:
     - Screen sharing
     - File browser
     - Remote control
     - Auto-start on login
     ```

5. **Upload the installer:**
   - Drag and drop `dist-electron/Zoom-Setup-1.0.0.exe` into the "Attach binaries" area
   - OR click "Attach binaries" and select the file

6. **Click "Publish release"**

### Step 4: Get Download URL

After publishing, you'll see a download link like:
```
https://github.com/ResX-Official/zoom/releases/download/v1.0.0/Zoom-Setup-1.0.0.exe
```

**Copy this URL!**

### Step 5: Configure Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard

2. **Select your project**

3. **Go to Settings → Environment Variables**

4. **Add new variable:**
   - **Name**: `INSTALLER_URL`
   - **Value**: `https://github.com/ResX-Official/zoom/releases/download/v1.0.0/Zoom-Setup-1.0.0.exe`
   - **Environment**: Production (and Preview if you want)

5. **Click "Save"**

6. **Redeploy:**
   ```bash
   vercel --prod
   ```
   OR click "Redeploy" in Vercel dashboard

### Step 6: Test

1. Go to your download page: `https://your-domain.com/download`
2. Click "Download"
3. Should redirect to GitHub Releases download

## 🎯 Alternative: Use Git LFS (If you want installer in repo)

If you want to keep the installer in the repository:

```bash
# Install Git LFS
git lfs install

# Track .exe files
git lfs track "*.exe"
git add .gitattributes
git add dist-electron/Zoom-Setup-1.0.0.exe
git commit -m "Add installer with Git LFS"
git push origin main
```

But **GitHub Releases is easier and recommended!**

## 📋 Current Status

- ✅ Installer built: `dist-electron/Zoom-Setup-1.0.0.exe` (146MB)
- ✅ Excluded from Git (`.gitignore`)
- ✅ Excluded from Vercel (`.vercelignore`)
- ✅ API route configured for external URL
- ⏳ **Next**: Upload to GitHub Releases and set `INSTALLER_URL`

## 🚀 Ready to Go!

Just follow Steps 3-6 above and you're done!

