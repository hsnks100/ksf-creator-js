
class StepData {
    unitStep : Array<string>;
    unitCOP : Array<string>; 
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


    steps : StepData;

    constructor(name: string) { this.title = name; }

    private getFromRegExp(data, regex) {
        var res = regex.exec(data);
        if (res) {
            return res[1];
        }
        return null;
    }

    public showData() {
        console.log(this.title);
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

            finish();


            // let regexResult = /^#STEP:((.|\n)+)/m.exec(data);
            // console.log(regexResult);
            // let strSteps = regexResult[1]; 
        });
        // let temp : Array<string>;
        // this.steps.unitStep.push("qwewe");
        // this.steps.unitStep.push("qwewe2"); 
    }

}
