/*
 *
 *
 * 전체의 큰 구조는 KSFInfo 
 */


class StepData {
    unitStep : string;
    unitCOP : Array<string>; 
    constructor(){
        this.unitCOP = [];
    }
}
class KSFInfo {
    public title : string;
    public player : string;
    public bpm1 : string;
    public startTime : number;
    public tickCount : number; // 1,2,3,4,5,6,7,8 

    introFile : string;
    songFile : string;
    discFile : string;
    titleFile : string;
    difficulty : number;
    bpm2 : string;
    bpm3 : string;
    bunki1 : number;
    bunki2 : number;
    startTime2 : number;
    startTime3 : number; 

    steps : Array<StepData>;

    constructor(name: string) { this.title = name; 
        this.steps = []; 
    }

    private getFromRegExp(data, regex) {
        var res = regex.exec(data);
        if (res) {
            return res[1];
        }
        return null;
    }

    public showData() {
        console.log(this);
    }

    public loadKSF(path:string, finish:() => void){
        this.title = "temptitle";
        var fs = require('fs');
        // var self = this;

        fs.readFile(path, 'utf8', (err, data) => { // function (err, data) {
            if (err) return console.log(err);

            // console.log(data);

            this.title = this.getFromRegExp(data, /^#TITLE:(.*);/m);
            this.titleFile = this.getFromRegExp(data, /^#TITLEFILE:(.*);/m);
            this.tickCount = this.getFromRegExp(data, /^#TICKCOUNT:(.*);/m);
            this.startTime = this.getFromRegExp(data, /^#STARTTIME:(.*);/m);
            this.introFile = this.getFromRegExp(data, /^#INTROFILE:(.*);/m);
            this.songFile = this.getFromRegExp(data, /^#SONGFILE:(.*);/m);
            this.discFile = this.getFromRegExp(data, /^#DISCFILE:(.*);/m);
            this.difficulty = this.getFromRegExp(data, /^#DIFFICULTY:(.*);/m);


            // expression = TEXT("^#STEP:([.\\n]+)");
            var stringStep = this.getFromRegExp(data, /#STEP:([\S\s]+)/);
            var eachSteps = stringStep.split('\n');
            for(var i=0; i<eachSteps.length; i++){
                console.log(eachSteps[i]);
                var firstChar = eachSteps[i][0];
                if(firstChar == '|'){
                    var lastIndex = this.steps.length - 1;
                    console.log("lastIndex = ", lastIndex);
                    this.steps[lastIndex].unitCOP.push(eachSteps[i]);
                }
                else if(firstChar == '2'){
                }
                else{
                    var stepdata = new StepData();
                    stepdata.unitStep = eachSteps[i];
                    stepdata.unitCOP = [];

                    this.steps.push(stepdata); 
                }
            } 
            finish();
        });
    } 
}
