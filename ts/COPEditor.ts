// let electron = require('electron')
// let app = electron.app

// let BrowserWindow = electron.BrowserWindow
// let path = require('path')
// let url = require('url')


let mainWindow2; 

import * as electron from 'electron';
let BrowserWindow = electron.BrowserWindow;



// declare var BrowserWindow;


function createWindow2 () {
    mainWindow2 = new electron.BrowserWindow({width: 300, height: 300})
    console.log("createWindow2");

    // mainWindow.loadURL(url.format({
        // pathname: path.join(__dirname + "/../", 'index.html'),
        // protocol: 'file:',
        // slashes: true
    // }))
    // mainWindow.maximize();

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow2.on('closed', function () {
        mainWindow2 = null
    }) ;

    // exports.mainWindow2 = mainWindow2;
}


exports.createCOPEditor = function() { 
    createWindow2(); 
}
// export function createCOPEditor() {
    // createWindow2(); 
// }
// exports.createCOPEditor = function() { 
// }




