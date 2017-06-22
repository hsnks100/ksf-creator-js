/*
 *
 *
 * 전체의 큰 구조는 KSFInfo
 */
var StepData = (function () {
    function StepData() {
        this.unitCOP = [];
    }
    return StepData;
}());
var KSFInfo = (function () {
    function KSFInfo(name) {
        this.title = name;
        this.steps = [];
    }
    KSFInfo.prototype.getFromRegExp = function (data, regex) {
        var res = regex.exec(data);
        if (res) {
            return res[1];
        }
        return null;
    };
    KSFInfo.prototype.showData = function () {
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
            // expression = TEXT("^#STEP:([.\\n]+)");
            var stringStep = _this.getFromRegExp(data, /#STEP:([\S\s]+)/);
            var eachSteps = stringStep.split('\n');
            for (var i = 0; i < eachSteps.length; i++) {
                console.log(eachSteps[i]);
                var firstChar = eachSteps[i][0];
                if (firstChar == '|') {
                    var lastIndex = _this.steps.length - 1;
                    console.log("lastIndex = ", lastIndex);
                    _this.steps[lastIndex].unitCOP.push(eachSteps[i]);
                }
                else if (firstChar == '2') {
                }
                else {
                    var stepdata = new StepData();
                    stepdata.unitStep = eachSteps[i];
                    stepdata.unitCOP = [];
                    _this.steps.push(stepdata);
                }
            }
            finish();
        });
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
exports.loadKSF = function () {
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
};
