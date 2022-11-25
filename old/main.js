const { ipcMain, app, BrowserWindow } = require('electron')
const path = require('path')
let wins;
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
      }
  })

  win.loadFile('index.html')
}

ipcMain.on('getwindow',(event,data)=>{
  const wins = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
      },
      
  });

  wins.loadFile('admin.html')
})
ipcMain.on('request-update-label-in-second-window', (event, arg) => {
  // Request to update the label in the renderer process of the second window
  // We'll send the same data that was sent to the main process
  // Note: you can obviously send the 
  wins.webContents.send('action-update-label', arg);
});
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
