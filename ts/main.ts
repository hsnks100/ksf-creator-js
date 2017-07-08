/// <reference path="KSFInfo.ts"/>



let electron = require('electron')
let app = electron.app
let BrowserWindow = electron.BrowserWindow
let path = require('path')
let url = require('url') 

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
exports.mainWindow = null;

let mainWindow;



function createWindow () {
    mainWindow = new BrowserWindow({width: 300, height: 300})

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname + "/../", 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.maximize();

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    }) ;

    exports.mainWindow = mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
        createWindow();

    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

exports.loadDataFromFile = function() { 
    // const {dialog} = require('electron');
    // var file = dialog.showOpenDialog({properties: ['openFile']});
    // file = file.length ? file[0] : '';
    // console.log(file);
    var fs = require('fs'); 
    return fs.readFileSync('sample.ksf', 'utf8'); 
}




