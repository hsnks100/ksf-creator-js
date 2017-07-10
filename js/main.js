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
    exports.loadDataFromFile = function () {
        console.log("!!!???");
        const { dialog } = require('electron');
        var file = dialog.showOpenDialog(win, { properties: ['openFile'] });
        console.log("fileName !!! => ", file);
        if (typeof file == 'undefined') {
            return null;
        }
        var fileName = file.length ? file[0] : '';
        var fs = require('fs');
        return { data: fs.readFileSync(fileName, 'utf8'), path: fileName };
    };
    exports.saveDialog = function (_defaultPath) {
        const { dialog } = require('electron');
        var file = dialog.showSaveDialog(win, { defaultPath: _defaultPath });
        if (typeof file == "undefined") {
            return "";
        }
        else {
            return file;
        }
    };
}
app.on('ready', createWindow);
exports.saveAsFile = (filename, data) => {
    var fs = require('fs');
    console.log("parameters", filename, data);
    return fs.writeFileSync(filename, data, 'utf8');
};
