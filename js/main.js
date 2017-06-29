const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({ width: 300, height: 300 });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname + "/../", 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.maximize();
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
exports.loadDataFromFile = function () {
    var fs = require('fs');
    return fs.readFileSync('sample.ksf', 'utf8');
};
