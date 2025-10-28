const { app, BrowserWindow, Menu, shell } = require('electron');
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
      webSecurity: true
    },
    icon: path.join(__dirname, '../public/icons/logo.ico'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the Next.js application
  mainWindow.loadURL('http://localhost:3000');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
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

function startNextServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting Next.js server...');
    
    // Check if we're in development or production
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      nextProcess = spawn('npm', ['run', 'dev'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
    } else {
      // For production, we need to build first
      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
      
      buildProcess.on('close', (code) => {
        if (code === 0) {
          nextProcess = spawn('npm', ['run', 'start'], {
            cwd: path.join(__dirname, '..'),
            stdio: 'pipe'
          });
          resolve();
        } else {
          reject(new Error('Build failed'));
        }
      });
      
      return;
    }

    nextProcess.stdout.on('data', (data) => {
      console.log(`Next.js: ${data}`);
      if (data.includes('ready') || data.includes('localhost:3000')) {
        resolve();
      }
    });

    nextProcess.stderr.on('data', (data) => {
      console.error(`Next.js Error: ${data}`);
    });

    nextProcess.on('close', (code) => {
      console.log(`Next.js process exited with code ${code}`);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      reject(new Error('Next.js server startup timeout'));
    }, 30000);
  });
}

// App event handlers
app.whenReady().then(async () => {
  try {
    await startNextServer();
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
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

app.on('before-quit', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
