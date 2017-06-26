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

    public loadKSF(data:string) {
        this.title = "temptitle"; 
        // console.log(data);

        this.title = this.getFromRegExp(data, /^#TITLE:(.*);/m).trim();
        this.titleFile = this.getFromRegExp(data, /^#TITLEFILE:(.*);/m).trim();
        this.tickCount = Number(this.getFromRegExp(data, /^#TICKCOUNT:(.*);/m));
        this.startTime = Number(this.getFromRegExp(data, /^#STARTTIME:(.*);/m));
        this.introFile = this.getFromRegExp(data, /^#INTROFILE:(.*);/m).trim();
        this.songFile = this.getFromRegExp(data, /^#SONGFILE:(.*);/m).trim();
        this.discFile = this.getFromRegExp(data, /^#DISCFILE:(.*);/m).trim();
        this.difficulty = Number(this.getFromRegExp(data, /^#DIFFICULTY:(.*);/m));


        console.log("first steps length = ", this.steps.length);
        // expression = TEXT("^#STEP:([.\\n]+)");
        var stringStep = this.getFromRegExp(data, /#STEP:([\S\s]+)/);
        stringStep = stringStep.trim();
        var eachSteps = stringStep.split('\n');
        let context : number = 0;
        for(var i=0; i<eachSteps.length; i++){
            console.log(eachSteps[i]);
            var firstChar = eachSteps[i][0];
            if(firstChar == '|'){
                if(context != 1){
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
            else if(firstChar == '2'){
            }
            else{
                if(context != 1){
                    var stepdata = new StepData();
                    stepdata.unitStep = eachSteps[i];
                    stepdata.unitCOP = [];

                    this.steps.push(stepdata); 
                }
                else{
                    this.steps[this.steps.length - 1].unitStep = eachSteps[i];
                }
                context = 2;
            }
        } 

    } 
}


