var StepData = (function () {
    function StepData() {
        this.unitCOP = [];
    }
    return StepData;
}());
var KSFInfo = (function () {
    function KSFInfo(name) {
        this.observers = [];
        this.title = name;
        this.steps = [];
    }
    KSFInfo.prototype.attach = function (observer) {
        this.observers.push(observer);
    };
    KSFInfo.prototype.detach = function (observer) {
    };
    KSFInfo.prototype.notifyObservers = function () {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i].reflectData();
        }
    };
    KSFInfo.prototype.getCOP = function (cop, pattern) {
        var tick = null;
        for (var i = 0; i < cop.length; i++) {
            var matchs = cop[i].match(pattern);
            if (matchs != null) {
                tick = Number(matchs[1]);
            }
        }
        if (tick == null)
            return -1;
        else
            return tick;
    };
    KSFInfo.prototype.getTickCount = function (cop) {
        return this.getCOP(cop, /\|T(.+)\|/);
    };
    KSFInfo.prototype.getBPM = function (cop) {
        return this.getCOP(cop, /\|B(.+)\|/);
    };
    KSFInfo.prototype.showData = function () {
    };
    KSFInfo.prototype.loadKSF = function (data) {
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
        console.log("first steps length = ", this.steps.length);
        var stringStep = (data.match(/#STEP:([\S\s]+)/) || [, ""])[1];
        stringStep = stringStep.trim();
        var eachSteps = stringStep.split('\n');
        var context = 0;
        for (var i = 0; i < eachSteps.length; i++) {
            var firstChar = eachSteps[i][0];
            if (firstChar == '|') {
                if (context != 1) {
                    var stepdata = new StepData();
                    stepdata.unitStep = "";
                    stepdata.unitCOP = [];
                    this.steps.push(stepdata);
                }
                var lastIndex = this.steps.length - 1;
                this.steps[lastIndex].unitCOP.push(eachSteps[i]);
                context = 1;
            }
            else if (firstChar == '2') {
            }
            else {
                if (context != 1) {
                    var stepdata = new StepData();
                    stepdata.unitStep = eachSteps[i];
                    stepdata.unitCOP = [];
                    this.steps.push(stepdata);
                }
                else {
                    this.steps[this.steps.length - 1].unitStep = eachSteps[i];
                }
                context = 2;
            }
        }
    };
    return KSFInfo;
}());
