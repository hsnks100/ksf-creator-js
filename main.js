var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
var url = require('url');
var mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({ width: 300, height: 300 });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
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
    var dialog = require('electron').dialog;
    var file = dialog.showOpenDialog({ properties: ['openFile'] });
    file = file.length ? file[0] : '';
    console.log(file);
    var fs = require('fs');
    return fs.readFileSync(file, 'utf8');
};
//# sourceMappingURL=main.js.map