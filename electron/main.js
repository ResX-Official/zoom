const { app, BrowserWindow, Menu, shell, ipcMain, desktopCapturer } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let nextProcess;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false, // Disabled to allow preload script with remote URLs
      // Allow insecure content for development (remove in production if using HTTPS)
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js'),
      // Enable remote debugging
      devTools: true
    },
    titleBarStyle: 'default',
    show: false
  });

  // Load hosted app directly in Electron (no local Next.js server)
  // Open dashboard directly when app launches
  const url = 'https://thezoomcaller.com/dashboard';
  console.log('Loading URL:', url);
  
  mainWindow.loadURL(url).catch((error) => {
    console.error('Failed to load URL:', error);
    // Show error dialog
    const { dialog } = require('electron');
    dialog.showErrorBox('Failed to Load', `Could not load the application:\n${error.message}\n\nPlease check your internet connection.`);
  });

  // Handle page load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Page load failed:', errorCode, errorDescription, validatedURL);
    const { dialog } = require('electron');
    dialog.showErrorBox('Load Error', `Failed to load the page:\n${errorDescription}\n\nURL: ${validatedURL}`);
  });

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Enable DevTools for debugging
  // Keep enabled for now to help debug issues
  mainWindow.webContents.openDevTools();
  
  // Log when page finishes loading
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Page finished loading successfully');
    // Inject a test to verify preload script loaded
    mainWindow.webContents.executeJavaScript(`
      console.log('🔍 Checking Electron API...');
      console.log('electronAPI available:', typeof window.electronAPI !== 'undefined');
      if (window.electronAPI) {
        console.log('✅ Electron APIs:', Object.keys(window.electronAPI));
        // Test home directory
        try {
          const homeDir = window.electronAPI.getHomeDirectory();
          console.log('✅ Home directory:', homeDir);
        } catch (e) {
          console.error('❌ Error getting home directory:', e);
        }
      } else {
        console.error('❌ Electron API not available! Preload script may not have loaded.');
      }
    `).catch(err => console.error('Error executing test script:', err));
  });

  // Create menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Meeting',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-meeting');
          }
        },
        {
          label: 'Join Meeting',
          accelerator: 'CmdOrCtrl+J',
          click: () => {
            mainWindow.webContents.send('join-meeting');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Yoom',
          click: () => {
            // Show about dialog
            shell.openExternal('https://github.com/your-repo/zoom-clone');
          }
        },
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://github.com/your-repo/zoom-clone#readme');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// No local Next.js server; we point to hosted domain instead
function startNextServer() {
  return Promise.resolve();
}

// IPC handlers for preload script
ipcMain.handle('capture-screen', async () => {
  try {
    const sources = await desktopCapturer.getSources({ 
      types: ['screen', 'window'],
      thumbnailSize: { width: 1920, height: 1080 }
    });
    return sources;
  } catch (error) {
    console.error('Error in capture-screen handler:', error);
    return [];
  }
});

ipcMain.handle('simulate-mouse-click', async (event, { x, y, button }) => {
  if (process.platform === 'win32') {
    const { exec } = require('child_process');
    const buttonCode = button === 'right' ? '2' : button === 'middle' ? '4' : '1';
    exec(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y})"`, () => {});
    if (button !== 'move') {
      // Simulate click
      exec(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MouseButtons]::${button === 'right' ? 'Right' : 'Left'}"`, () => {});
    }
  }
});

ipcMain.handle('simulate-key-press', async (event, { key }) => {
  if (process.platform === 'win32') {
    const { exec } = require('child_process');
    // Escape special characters for PowerShell
    const escapedKey = key.replace(/'/g, "''");
    exec(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${escapedKey}')"`, () => {});
  }
});

// App event handlers
app.whenReady().then(async () => {
  try {
    console.log('App ready, starting...');
    await startNextServer();
    // Ensure the app starts on login (Windows)
    try {
      app.setLoginItemSettings({ openAtLogin: true });
      console.log('Auto-start on login enabled');
    } catch (error) {
      console.warn('Failed to set login item settings:', error);
    }
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    const { dialog } = require('electron');
    dialog.showErrorBox('Startup Error', `Failed to start the application:\n${error.message}`);
    app.quit();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  const { dialog } = require('electron');
  dialog.showErrorBox('Application Error', `An unexpected error occurred:\n${error.message}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
