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
        fs.readFile(path, 'utf8', function (err, data) {
            if (err)
                return console.log(err);
            _this.title = _this.getFromRegExp(data, /^#TITLE:(.*);/m);
            _this.titleFile = _this.getFromRegExp(data, /^#TITLEFILE:(.*);/m);
            _this.tickCount = _this.getFromRegExp(data, /^#TICKCOUNT:(.*);/m);
            _this.startTime = _this.getFromRegExp(data, /^#STARTTIME:(.*);/m);
            _this.introFile = _this.getFromRegExp(data, /^#INTROFILE:(.*);/m);
            _this.songFile = _this.getFromRegExp(data, /^#SONGFILE:(.*);/m);
            _this.discFile = _this.getFromRegExp(data, /^#DISCFILE:(.*);/m);
            _this.difficulty = _this.getFromRegExp(data, /^#DIFFICULTY:(.*);/m);
            console.log("first steps length = ", _this.steps.length);
            var stringStep = _this.getFromRegExp(data, /#STEP:([\S\s]+)/);
            stringStep = stringStep.trim();
            var eachSteps = stringStep.split('\n');
            var context = 0;
            for (var i = 0; i < eachSteps.length; i++) {
                console.log(eachSteps[i]);
                var firstChar = eachSteps[i][0];
                if (firstChar == '|') {
                    if (context != 1) {
                        var stepdata = new StepData();
                        stepdata.unitStep = "";
                        stepdata.unitCOP = [];
                        _this.steps.push(stepdata);
                    }
                    var lastIndex = _this.steps.length - 1;
                    console.log("lastIndex = ", lastIndex);
                    _this.steps[lastIndex].unitCOP.push(eachSteps[i]);
                    context = 1;
                }
                else if (firstChar == '2') {
                }
                else {
                    if (context != 1) {
                        var stepdata = new StepData();
                        stepdata.unitStep = eachSteps[i];
                        stepdata.unitCOP = [];
                        _this.steps.push(stepdata);
                    }
                    else {
                        _this.steps[_this.steps.length - 1].unitStep = eachSteps[i];
                    }
                    context = 2;
                }
            }
            finish();
        });
    };
    return KSFInfo;
}());
