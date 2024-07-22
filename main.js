const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },

  });

  win.loadURL('http://localhost:3000');
  win.setMenu(null); // Hide the menubar


  win.webContents.on('did-create-window', (window) => {
    window.setWindowResourceObject('csp', {
      policy: "default-src 'elf'; script-src 'elf'; style-src 'elf'; img-src 'elf';",
    });
  });


}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
