"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringBuffer = function () {
    this.buffer = new Array();
};
StringBuffer.prototype.append = function (str) {
    var t = str.split('');
    console.log(t);
    console.log(this.buffer);
    var startIndex = this.buffer.length;
    for (var i = startIndex; i < startIndex + t.length; i++) {
        console.log(i);
        this.buffer[i] = str[i - startIndex];
    }
};
StringBuffer.prototype.toString = function () {
    return this.buffer.join("");
};
StringBuffer.prototype.charAt = function (i, char) {
    if (arguments.length == 1) {
        return this.buffer[i];
    }
    else {
        this.buffer[i] = char;
    }
};
const main = require('electron').remote.require('./main');
class StepData {
    constructor() {
        this.unitCOP = [];
        this.unitStep = "0000000000000";
    }
    getString() {
        let output = "";
        for (let i = 0; i < this.unitCOP.length; i++) {
            output += this.unitCOP[i] + "\n";
        }
        output += this.unitStep + "\n";
        return output;
    }
    getCOP() {
        let output = "";
        for (let i = 0; i < this.unitCOP.length; i++) {
            output += this.unitCOP[i] + "\n";
        }
        return output;
    }
    setStep(step) {
        var stepBuffer = new StringBuffer();
        stepBuffer.append(this.unitStep);
        var index = this.getIndexWith(step);
        if (stepBuffer.charAt(index) == '1') {
            stepBuffer.charAt(index, "0");
        }
        else {
            stepBuffer.charAt(index, "1");
        }
        this.unitStep = stepBuffer.toString();
    }
    getIndexWith(unit) {
        var dict = {};
        dict["z"] = 0;
        dict["q"] = 1;
        dict["s"] = 2;
        dict["e"] = 3;
        dict["c"] = 4;
        dict["v"] = 5;
        dict["r"] = 6;
        dict["g"] = 7;
        dict["y"] = 8;
        dict["n"] = 9;
        return dict[unit];
    }
}
class KSFInfo {
    constructor(name) {
        this.observers = [];
        this.title = name;
        this.steps = [];
        this.steps.push(new StepData());
        this.title = "new title";
        this.player = "double";
        this.bpm1 = 120;
        this.startTime = 0;
        this.tickCount = 4;
    }
    attach(observer) {
        this.observers.push(observer);
    }
    detach(observer) {
    }
    notifyObservers() {
        for (let i = 0; i < this.observers.length; i++) {
            this.observers[i].reflectData();
        }
    }
    getCOP(cop, pattern) {
        var tick = null;
        for (let i = 0; i < cop.length; i++) {
            var matchs = cop[i].match(pattern);
            if (matchs != null) {
                tick = Number(matchs[1]);
            }
        }
        if (tick == null)
            return -1;
        else
            return tick;
    }
    getTickCount(cop) {
        return this.getCOP(cop, /\|T(.+)\|/);
    }
    getBPM(cop) {
        return this.getCOP(cop, /\|B(.+)\|/);
    }
    showData() {
    }
    loadKSF(data) {
        this.title = "temptitle";
        this.title = (data.match(/^#TITLE:(.*);/m) || [, ""])[1].trim();
        this.titleFile = (data.match(/^#TITLEFILE:(.*);/m) || [, ""])[1].trim();
        this.tickCount = Number((data.match(/^#TICKCOUNT:(.*);/m) || [, ""])[1]);
        this.bpm1 = Number((data.match(/^#BPM:(.*);/m) || [, ""])[1]);
        this.startTime = Number((data.match(/^#STARTTIME:(.*);/m) || [, ""])[1]);
        this.introFile = (data.match(/^#INTROFILE:(.*);/m) || [, ""])[1].trim();
        this.songFile = (data.match(/^#SONGFILE:(.*);/m) || [, ""])[1].trim();
        this.discFile = (data.match(/^#DISCFILE:(.*);/m) || [, ""])[1].trim();
        this.difficulty = Number((data.match(/^#DIFFICULTY:(.*);/m) || [, ""])[1]);
        var stringStep = (data.match(/#STEP:([\S\s]+)/) || [, ""])[1];
        stringStep = stringStep.trim();
        this.steps = this.getStepsFromString(stringStep);
    }
    setCOPwithIndex(i, cop) {
        this.steps[i].unitCOP = cop;
    }
    saveAsFile(filename) {
        let output = "";
        output = output + "#TITLE:" + this.title + ";\n";
        output += "#TITLEFILE:" + this.titleFile + ";\n";
        output += "#TICKCOUNT:" + this.tickCount + ";\n";
        output += "#BPM:" + this.bpm1 + ";\n";
        output += "#STARTTIME:" + this.startTime + ";\n";
        output += "#INTROFILE:" + this.introFile + ";\n";
        output += "#SONGFILE:" + this.songFile + ";\n";
        output += "#DISCFILE:" + this.discFile + ";\n";
        output += "#DIFFICULTY:" + this.difficulty + ";\n";
        output += "#STEP:\n";
        for (let i = 0; i < this.steps.length; i++) {
            output += this.steps[i].getString();
        }
        main.saveAsFile(filename, output);
    }
    setStep(i, step) {
        this.steps[i].setStep(step);
    }
    pushBack() {
        this.steps.push(new StepData());
    }
    insert(pos) {
        this.steps.splice(pos, 0, new StepData());
    }
    deleteStep(pos) {
        console.log(this.steps);
        this.steps.splice(pos, 1);
        console.log(this.steps);
    }
    getStepsFromString(steps) {
        let localSteps = [];
        var eachSteps = steps.split('\n');
        let context = 0;
        for (var i = 0; i < eachSteps.length; i++) {
            var firstChar = eachSteps[i][0];
            if (firstChar == '|') {
                if (context != 1) {
                    var stepdata = new StepData();
                    stepdata.unitStep = "";
                    stepdata.unitCOP = [];
                    localSteps.push(stepdata);
                }
                var lastIndex = localSteps.length - 1;
                localSteps[lastIndex].unitCOP.push(eachSteps[i]);
                context = 1;
            }
            else if (firstChar == '2') {
            }
            else {
                if (context != 1) {
                    var stepdata = new StepData();
                    stepdata.unitStep = eachSteps[i];
                    stepdata.unitCOP = [];
                    localSteps.push(stepdata);
                }
                else {
                    localSteps[localSteps.length - 1].unitStep = eachSteps[i];
                }
                context = 2;
            }
        }
        return localSteps;
    }
    insertSteps(pos, steps) {
        let insertIndex = pos;
        for (let i = 0; i < steps.length; i++) {
            this.steps.splice(insertIndex++, 0, steps[i]);
        }
    }
}
exports.KSFInfo = KSFInfo;
