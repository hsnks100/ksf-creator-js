const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
let path = require('path');
let url = require('url');
let mainWindow;
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
function createWindow() {
    const ret = globalShortcut.register('CommandOrControl+X', () => {
        console.log('CommandOrControl+X is pressed');
    });
    const { Menu, MenuItem } = require('electron');
    const menu = new Menu();
    menu.append(new MenuItem({
        label: 'Print',
        accelerator: 'CmdOrCtrl+P',
        click: () => { console.log('time to print stuff'); }
    }));
    var win = new BrowserWindow();
    win.loadURL(url.format({
        pathname: path.join(__dirname + "/../", 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.maximize();
    win.webContents.openDevTools();
    ipcMain.on('create-new-instance', () => {
        createWindow();
    });
}
app.on('ready', createWindow);
exports.loadDataFromFile = function () {
    const { dialog } = require('electron');
    var file = dialog.showOpenDialog({ properties: ['openFile'] });
    file = file.length ? file[0] : '';
    console.log(file);
    var fs = require('fs');
    return fs.readFileSync(file, 'utf8');
    return fs.readFileSync('sample.ksf', 'utf8');
};
exports.saveAsFile = (filename, data) => {
    var fs = require('fs');
    return fs.writeFileSync(filename, data, 'utf8');
};
