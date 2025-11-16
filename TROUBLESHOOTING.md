# Troubleshooting Guide

## App Won't Open After Installation

### Check 1: Verify Installation
1. Check if the app was installed:
   - Windows: Look in `C:\Users\YourName\AppData\Local\Programs\zoom-desktop\` or `C:\Program Files\Zoom\`
   - Look for `Zoom.exe` file

2. Check if shortcuts were created:
   - Desktop shortcut should exist
   - Start Menu → Programs → Zoom should exist

### Check 2: Try Manual Launch
1. Navigate to installation directory
2. Double-click `Zoom.exe` directly
3. Check Windows Event Viewer for errors:
   - Press `Win + X` → Event Viewer
   - Look for errors related to "Zoom" or "Electron"

### Check 3: Installer Size
If the installer was very small (< 50MB), it's likely incomplete:
- The full Electron app should be ~200MB+
- Try rebuilding the installer on a Windows machine
- The Linux build via Wine may have failed

### Check 4: Missing Dependencies
The app requires:
- Windows 10 or later (64-bit)
- Internet connection (loads from `https://thezoomcaller.com`)

## User Tracking Not Showing in Admin Panel

### Check 1: User Registration
1. Open the app
2. Open browser DevTools (`F12`)
3. Check Console tab for:
   - "User tracking initialized"
   - "Failed to register user" errors
   - Network errors

### Check 2: API Connection
1. Verify the app can reach `https://thezoomcaller.com`
2. Check browser console for CORS errors
3. Verify `/api/admin/users` endpoint is accessible

### Check 3: Admin Panel Refresh
1. The admin panel auto-refreshes every 5 seconds
2. Users should appear within 30 seconds of app launch
3. Check browser console for fetch errors

### Check 4: User ID
- Each user gets a unique ID stored in `localStorage` as `zoom_user_id`
- This persists across app sessions
- Check DevTools → Application → Local Storage

## Testing Steps

1. **Install the app** (if not already installed)
2. **Launch the app** - should open `https://thezoomcaller.com/dashboard`
3. **Wait 30 seconds** for initial registration
4. **Open Admin Panel** at `https://thezoomcaller.com/admin`
5. **Check for users** - should see new user appear

## Common Issues

### Issue: "App won't start"
**Solution:** 
- Check Windows Defender/Security Software isn't blocking it
- Try running as Administrator
- Check Event Viewer for specific errors

### Issue: "No users in admin panel"
**Solution:**
- Verify app is actually running
- Check browser console in the app (DevTools)
- Verify network requests to `/api/admin/users` are working
- Check that user tracking initialized successfully

### Issue: "App loads but shows error page"
**Solution:**
- Verify `https://thezoomcaller.com` is accessible
- Check internet connection
- Verify the deployment is live

## Debug Mode

To enable debug logging in the Electron app:
1. Edit `electron/main.js`
2. Uncomment: `mainWindow.webContents.openDevTools();`
3. Rebuild the app
4. DevTools will open automatically showing console logs

## Manual Testing

Test user tracking manually:
1. Open app
2. Press `F12` to open DevTools
3. Go to Console tab
4. Type: `window.__userTracker`
5. Should show the tracker object
6. Check Network tab for requests to `/api/admin/users`








