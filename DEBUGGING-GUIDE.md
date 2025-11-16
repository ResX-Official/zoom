# Debugging Guide - Why Nothing is Working

## Step 1: Check if Electron APIs are Available

When you open the Electron app, **press F12** to open DevTools and check the Console tab.

You should see:
```
🔍 Checking Electron API...
electronAPI available: true
✅ Electron APIs: [list of APIs]
✅ Home directory: C:\Users\YourName
```

### If you see "electronAPI available: false"
**Problem**: Preload script didn't load
**Solution**: 
1. Check if `electron/preload.js` exists
2. Rebuild the Electron app
3. The preload script path might be wrong in the built app

## Step 2: Check User Tracking Initialization

In the console, you should see:
```
🔍 Electron API available: true
✅ Running in Electron - full features enabled
📁 Available APIs: [list]
📁 File system monitoring started
📸 Attempting to start automatic screen share...
```

### If you DON'T see these messages:
**Problem**: User tracking didn't initialize
**Solution**: Check if the page loaded correctly

## Step 3: Check Screen Capture

You should see:
```
📸 Starting Electron screen capture...
📸 Capturing screen...
✅ Screen captured, size: [number] bytes
✅ Screen data sent successfully
```

### If you see errors:
- "Error capturing screen" → IPC handler might not be working
- "Screen capture returned null" → desktopCapturer failed
- "Failed to send screen data" → Network/API issue

## Step 4: Check File System

You should see:
```
📁 Reading file system via Electron...
📁 Home directory: C:\Users\YourName
📁 Drives: ["C:", "D:"]
📁 Reading directory: C:\Users\YourName\Documents
✅ Found X items in Documents
📁 Sending file system data to admin...
✅ File system data sent successfully
```

### If you see "Electron API not available - browser mode":
**Problem**: Preload script didn't load or APIs aren't accessible
**Solution**: Rebuild the Electron app

## Step 5: Verify Preload Script Path

The preload script path in `electron/main.js` is:
```javascript
preload: path.join(__dirname, 'preload.js')
```

In the built app, `__dirname` points to the Electron app's resources folder.
Make sure `preload.js` is included in the build.

## Common Issues

### Issue 1: Preload Script Not Loading
**Symptoms**: 
- Console shows "electronAPI available: false"
- All features show "browser mode"

**Fix**:
1. Check `electron/preload.js` exists
2. Rebuild: `npm run build-electron`
3. Check the built app includes `preload.js`

### Issue 2: IPC Handlers Not Working
**Symptoms**:
- Screen capture returns null
- Mouse/keyboard control doesn't work

**Fix**:
1. Check `electron/main.js` has IPC handlers
2. Make sure `ipcMain.handle` is registered before app starts

### Issue 3: Data Not Reaching Server
**Symptoms**:
- Console shows "✅ Screen data sent successfully"
- But admin panel shows nothing

**Fix**:
1. Check network tab in DevTools
2. Verify API endpoints are accessible
3. Check CORS issues

## Quick Test

Open the Electron app and run this in the console (F12):
```javascript
// Test 1: Check if Electron API exists
console.log('Electron API:', typeof window.electronAPI);

// Test 2: Try to get home directory
if (window.electronAPI) {
  const home = window.electronAPI.getHomeDirectory();
  console.log('Home:', home);
  
  // Test 3: Try to read a directory
  const files = window.electronAPI.readDirectory(home + '\\Desktop');
  console.log('Desktop files:', files);
  
  // Test 4: Try to capture screen
  window.electronAPI.captureScreen().then(data => {
    console.log('Screen capture:', data ? 'Success' : 'Failed');
  });
}
```

If all tests pass, the APIs are working. The issue is likely in the data flow to the server.



