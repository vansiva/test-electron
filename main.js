const electron = require('electron');
const log = require('electron-log');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');
const app = electron.app;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
log.transports.file.resolvePath = () => path.join('F:/electronjs/electron-project', '/logs/m.log');

log.info("Application version" + app.getVersion())
log.info('Hello, log');
log.warn('loading...');
const url = require('url')

// Keep a global reference of the windows object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let secondWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
       width: 1000,
       height: 800,      
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
      } });
      
    
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'admin.html'),
        protocol: 'file:',
        slashes: true
    }))

    
    
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // 0when you should delete the corresponding element.
        mainWindow = null;
        secondWindow = null;
    })
    
}
// function adminwindow() {
  ipcMain.on('getwindow',(event,data)=>{
  secondWindow = new BrowserWindow({
     width: 1000,
     height: 800,      
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true
    }
   });


  // and load the second window.
  secondWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'admin.html'),
      protocol: 'file:',
      slashes: true
  }))
  ipcMain.on('request-update-label-in-second-window', (event, arg) => {
    // Request to update the label in the renderer process of the second window
    secondWindow.webContents.send('action-update-label', arg);
});
  })

// }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
app.whenReady().then(() => {
  createWindow()
  // updateInterval = setInterval(() => autoUpdater.checkForUpdates());
  autoUpdater.checkForUpdatesAndNotify();
  // app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow()
  // })
})
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

autoUpdater.on('update-available',() => {
  log.info('update-available')
})
autoUpdater.on('checking-for-update',() => {
  log.info('checking-for-update')
})
 
autoUpdater.on('download-progress',(progressTrack) => {
  log.info('download-progress')
  log.info(progressTrack)
})
autoUpdater.on('update-downloaded',() => {
  log.info('update-downloaded')
})