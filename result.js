var StepData = (function () {
    function StepData() {
    }
    return StepData;
}());
var KSFInfo = (function () {
    function KSFInfo(name) {
        this.title = name;
    }
    KSFInfo.prototype.getFromRegExp = function (data, regex) {
        var res = regex.exec(data);
        if (res) {
            return res[1];
        }
        return null;
    };
    KSFInfo.prototype.showData = function () {
        console.log(this.title);
        console.log(this);
    };
    KSFInfo.prototype.loadKSF = function (path, finish) {
        var _this = this;
        this.title = "temptitle";
        var fs = require('fs');
        // var self = this;
        fs.readFile(path, 'utf8', function (err, data) {
            if (err)
                return console.log(err);
            // console.log(data);
            _this.title = _this.getFromRegExp(data, /^#TITLE:(.*);/m);
            _this.titleFile = _this.getFromRegExp(data, /^#TITLEFILE:(.*);/m);
            _this.tickCount = _this.getFromRegExp(data, /^#TICKCOUNT:(.*);/m);
            _this.startTime = _this.getFromRegExp(data, /^#STARTTIME:(.*);/m);
            _this.introFile = _this.getFromRegExp(data, /^#INTROFILE:(.*);/m);
            _this.songFile = _this.getFromRegExp(data, /^#SONGFILE:(.*);/m);
            _this.discFile = _this.getFromRegExp(data, /^#DISCFILE:(.*);/m);
            _this.difficulty = _this.getFromRegExp(data, /^#DIFFICULTY:(.*);/m);
            finish();
            // let regexResult = /^#STEP:((.|\n)+)/m.exec(data);
            // console.log(regexResult);
            // let strSteps = regexResult[1]; 
        });
        // let temp : Array<string>;
        // this.steps.unitStep.push("qwewe");
        // this.steps.unitStep.push("qwewe2"); 
    };
    return KSFInfo;
}());
var electron = require('electron');
// Module to control application life.
var app = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
var url = require('url');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({ width: 300, height: 300 });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    var dialog = require('electron').dialog;
    var file = dialog.showOpenDialog({ properties: ['openFile'] });
    file = file.length ? file[0] : '';
    console.log(file);
    // console.log(fs);
    //
    var ksfinfo = new KSFInfo("mytitle");
    ksfinfo.showData();
    if (file !== '') {
        ksfinfo.loadKSF(file, function () {
            ksfinfo.showData();
        });
        // console.log(ksfinfo);
        // console.log(ksfinfo.title);
    }
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
