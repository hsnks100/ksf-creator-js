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
    KSFInfo.prototype.loadKSF = function (data) {
        this.title = "temptitle";
        this.title = this.getFromRegExp(data, /^#TITLE:(.*);/m);
        this.titleFile = this.getFromRegExp(data, /^#TITLEFILE:(.*);/m);
        this.tickCount = this.getFromRegExp(data, /^#TICKCOUNT:(.*);/m);
        this.startTime = this.getFromRegExp(data, /^#STARTTIME:(.*);/m);
        this.introFile = this.getFromRegExp(data, /^#INTROFILE:(.*);/m);
        this.songFile = this.getFromRegExp(data, /^#SONGFILE:(.*);/m);
        this.discFile = this.getFromRegExp(data, /^#DISCFILE:(.*);/m);
        this.difficulty = this.getFromRegExp(data, /^#DIFFICULTY:(.*);/m);
        console.log("first steps length = ", this.steps.length);
        var stringStep = this.getFromRegExp(data, /#STEP:([\S\s]+)/);
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
                    this.steps.push(stepdata);
                }
                var lastIndex = this.steps.length - 1;
                console.log("lastIndex = ", lastIndex);
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
//# sourceMappingURL=KSFInfo.js.map