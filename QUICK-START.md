# ⚡ Quick Start - Host Installer

## 🎯 3 Simple Steps

### Step 1: Commit Changes
```bash
git add .gitignore .vercelignore HOST-INSTALLER.md app/api/download/installer/route.ts app/download/page.tsx
git commit -m "Configure installer for external hosting"
git push origin main
```

### Step 2: Upload to GitHub Releases

1. **Open in browser:**
   ```
   https://github.com/ResX-Official/zoom/releases/new
   ```

2. **Fill the form:**
   - **Tag**: `v1.0.0` (type it, it will create new tag)
   - **Title**: `Zoom Desktop v1.0.0`
   - **Description**: `Windows installer for Zoom Desktop Client`

3. **Upload file:**
   - Drag `dist-electron/Zoom-Setup-1.0.0.exe` into the page
   - OR click "Attach binaries" and select the file

4. **Click "Publish release"**

5. **Copy the download URL** (it will be shown after publishing):
   ```
   https://github.com/ResX-Official/zoom/releases/download/v1.0.0/Zoom-Setup-1.0.0.exe
   ```

### Step 3: Configure Vercel

1. **Go to:** https://vercel.com/dashboard
2. **Select your project**
3. **Settings → Environment Variables**
4. **Add:**
   - **Name**: `INSTALLER_URL`
   - **Value**: `https://github.com/ResX-Official/zoom/releases/download/v1.0.0/Zoom-Setup-1.0.0.exe`
   - **Environment**: Production ✅
5. **Save**
6. **Redeploy:** Click "Deployments" → "..." → "Redeploy"

## ✅ Done!

Your download page will now automatically use the GitHub Releases URL!

## 🧪 Test It

Visit: `https://your-domain.com/download` and click "Download"

---

**Need help?** See `HOST-INSTALLER.md` for detailed instructions.

