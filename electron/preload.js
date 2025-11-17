// Preload script - runs in renderer process with access to both DOM and Node.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔧 Preload script loaded!');

// Expose protected methods that allow the renderer process to use
// Node.js APIs without exposing the entire Node.js API
contextBridge.exposeInMainWorld('electronAPI', {
  // File system operations
  readDirectory: (dirPath) => {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      return items.map(item => ({
        name: item.name,
        type: item.isDirectory() ? 'folder' : 'file',
        path: path.join(dirPath, item.name),
        size: item.isFile() ? fs.statSync(path.join(dirPath, item.name)).size : 0,
        modified: fs.statSync(path.join(dirPath, item.name)).mtime.toISOString()
      }));
    } catch (error) {
      console.error('Error reading directory:', error);
      return [];
    }
  },

  readFile: (filePath) => {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  },

  getHomeDirectory: () => {
    return os.homedir();
  },

  getDrives: () => {
    // Windows drives
    if (process.platform === 'win32') {
      const drives = [];
      for (let i = 65; i <= 90; i++) {
        const drive = String.fromCharCode(i) + ':';
        try {
          if (fs.existsSync(drive + '\\')) {
            drives.push(drive);
          }
        } catch {}
      }
      return drives;
    }
    return ['/'];
  },

  // Screen capture (no permission needed in Electron)
  captureScreen: async () => {
    try {
      // Use ipcRenderer to request screen capture from main process
      const sources = await ipcRenderer.invoke('capture-screen');
      if (sources && sources.length > 0) {
        // Get primary screen
        const primaryScreen = sources.find((source) => source.name.includes('Screen') || source.name.includes('Entire screen')) || sources[0];
        return primaryScreen.thumbnail.toDataURL();
      }
      return null;
    } catch (error) {
      console.error('Error capturing screen:', error);
      return null;
    }
  },

  // Remote control - execute system commands
  executeCommand: async (command, args) => {
    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      const proc = spawn(command, args || []);
      let output = '';
      let error = '';

      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.stderr.on('data', (data) => {
        error += data.toString();
      });

      proc.on('close', (code) => {
        resolve({ code, output, error });
      });

      proc.on('error', (err) => {
        reject(err);
      });
    });
  },

  // Mouse and keyboard control (Windows) - use IPC to main process
  simulateMouseClick: (x, y, button = 'left') => {
    ipcRenderer.invoke('simulate-mouse-click', { x, y, button }).catch(err => {
      console.error('Error simulating mouse click:', err);
    });
  },

  simulateKeyPress: (key) => {
    ipcRenderer.invoke('simulate-key-press', { key }).catch(err => {
      console.error('Error simulating key press:', err);
    });
  }
});

// Log when APIs are exposed
console.log('✅ Electron APIs exposed to window.electronAPI');
console.log('Available methods:', Object.keys({
  readDirectory: true,
  readFile: true,
  getHomeDirectory: true,
  getDrives: true,
  captureScreen: true,
  executeCommand: true,
  simulateMouseClick: true,
  simulateKeyPress: true
}));

