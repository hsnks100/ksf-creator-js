"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mainWindow2;
const electron = require("electron");
let BrowserWindow = electron.BrowserWindow;
function createWindow2() {
    mainWindow2 = new electron.BrowserWindow({ width: 300, height: 300 });
    console.log("createWindow2");
    mainWindow2.on('closed', function () {
        mainWindow2 = null;
    });
}
exports.createCOPEditor = function () {
    createWindow2();
};
