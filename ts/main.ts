/// <reference path="KSFInfo.ts"/>



const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron')

let path = require('path')
let url = require('url') 

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow;


// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

function createWindow() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.


    const ret = globalShortcut.register('CommandOrControl+X', () => {
        console.log('CommandOrControl+X is pressed')
    })

    const {Menu, MenuItem} = require('electron')
    const menu = new Menu()

    menu.append(new MenuItem({
        label: 'Print',
        accelerator: 'CmdOrCtrl+P',
        click: () => { console.log('time to print stuff') }
    }))

    var win = new BrowserWindow();
    win.loadURL(url.format({
        pathname: path.join(__dirname + "/../", 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.maximize(); 
    win.webContents.openDevTools()
    
    ipcMain.on('create-new-instance', () => {
        createWindow();
        //win.loadURL(url.format({
            //pathname: path.join(__dirname + "/../", 'index.html'),
            //protocol: 'file:',
            //slashes: true
        //})); 
    });
}


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//app.on('activate', createWindow);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
exports.loadDataFromFile = function() { 
    const {dialog} = require('electron');
    var file = dialog.showOpenDialog({properties: ['openFile']});
    file = file.length ? file[0] : '';
    console.log(file);
    var fs = require('fs'); 
    return fs.readFileSync(file, 'utf8'); 
    return fs.readFileSync('sample.ksf', 'utf8'); 
}

exports.saveAsFile = (filename:String, data:String) => {
    var fs = require('fs'); 
    return fs.writeFileSync(filename, data, 'utf8'); 
}

//exports.createWindow = createWindow;




