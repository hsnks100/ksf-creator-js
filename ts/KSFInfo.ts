/// <reference path="./KSFView.ts"/>


/*
 *
 *
 * 전체의 큰 구조는 KSFInfo 
 */


var StringBuffer = function() {
    this.buffer = new Array();
};
StringBuffer.prototype.append = function(str) {
    var t = str.split('');
    console.log(t);
    console.log(this.buffer);
    var startIndex = this.buffer.length;
    for(var i=startIndex; i<startIndex + t.length; i++) {
        console.log(i);
        this.buffer[i] = str[i - startIndex];
    }
};
StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};

StringBuffer.prototype.charAt = function(i, char) {
    if(arguments.length == 1){
        return this.buffer[i];
    }
    else{
        this.buffer[i] = char; 
    }
};



// Object.prototype.replaceAt = "123";



// Function.prototype.applyParams = function(params: any) {
    // this.apply(this, params);
// };



const main = require('electron').remote.require('./main') ;
// var gg = require('./KSFView');
// console.log(gg);
import { Observer } from "./KSFView";
interface KSFData {
     attach(observer:Observer);
     detach(observer:Observer);
     notifyObservers();
} 





class StepData {
    unitStep : string;
    unitCOP : Array<string>; 
    constructor(){
        this.unitCOP = [];
    }

    public getString():string{
        let output:string = "";
        for(let i=0; i<this.unitCOP.length; i++) {
            output += this.unitCOP[i] + "\n"; 
        } 
        output += this.unitStep + "\n";
        return output;
    }

    public getCOP():string {
        let output:string = "";
        for(let i=0; i<this.unitCOP.length; i++) {
            output += this.unitCOP[i] + "\n"; 
        } 

        return output; 
    }
    public setStep(step:string) { 
        var stepBuffer = new StringBuffer();
        stepBuffer.append(this.unitStep);
        var index = this.getIndexWith(step);
        if(stepBuffer.charAt(index) == '1') {
            stepBuffer.charAt(index, "0");
        }
        else {
            stepBuffer.charAt(index, "1");
        } 
        this.unitStep = stepBuffer.toString();
    }
    public getIndexWith(unit:string) {
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
export class KSFInfo implements KSFData{
    public attach(observer:Observer) {
        this.observers.push(observer);
    }
    public detach(observer:Observer) {
    }
    public notifyObservers() {
        for(let i=0; i<this.observers.length; i++) {
            this.observers[i].reflectData();
        }
    }
    public observers:Array<Observer> = [];
    public title : string;
    public player : string;
    public bpm1 : number;
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

    public getCOP(cop:Array<string>, pattern) {
        var tick = null;
        for(let i=0; i<cop.length; i++){
            var matchs = cop[i].match(pattern);
            // console.log(matchs);
            if(matchs != null) { 
                tick = Number(matchs[1]);
            }
        }
        if(tick == null)
            return -1;
        else
            return tick; 
    }
    public getTickCount(cop:Array<string>) {
        return this.getCOP(cop, /\|T(.+)\|/);
    }
    public getBPM(cop:Array<string>) {
        return this.getCOP(cop, /\|B(.+)\|/);
    }


    public showData() {
        // console.log(this);
    }

    public loadKSF(data:string) {
        this.title = "temptitle"; 
        // console.log(data);

        this.title = (data.match(/^#TITLE:(.*);/m) || [,""])[1].trim();
        this.titleFile = (data.match(/^#TITLEFILE:(.*);/m) || [,""])[1].trim();
        this.tickCount = Number((data.match(/^#TICKCOUNT:(.*);/m) || [,""])[1]);
        this.bpm1 = Number((data.match(/^#BPM:(.*);/m) || [,""])[1]);
        this.startTime = Number((data.match(/^#STARTTIME:(.*);/m) || [,""])[1]);
        this.introFile = (data.match(/^#INTROFILE:(.*);/m) || [,""])[1].trim();
        this.songFile = (data.match(/^#SONGFILE:(.*);/m) || [,""])[1].trim();
        this.discFile = (data.match(/^#DISCFILE:(.*);/m) || [,""])[1].trim();
        this.difficulty = Number((data.match(/^#DIFFICULTY:(.*);/m) || [,""])[1]);



        // console.log("first steps length = ", this.steps.length);
        // expression = TEXT("^#STEP:([.\\n]+)");
        var stringStep = (data.match(/#STEP:([\S\s]+)/) || [,""])[1]; 
        stringStep = stringStep.trim();
        var eachSteps = stringStep.split('\n');
        let context : number = 0;
        for(var i=0; i<eachSteps.length; i++){
            // console.log(eachSteps[i]);
            var firstChar = eachSteps[i][0];
            if(firstChar == '|'){
                if(context != 1){
                    var stepdata = new StepData();
                    stepdata.unitStep = "";
                    stepdata.unitCOP = [];
                    this.steps.push(stepdata); 
                }
                var lastIndex = this.steps.length - 1;
                // console.log("lastIndex = ", lastIndex);
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
    public setCOPwithIndex(i:number, cop:Array<string>) {
        this.steps[i].unitCOP = cop;
    }

    public saveAsFile(filename:string) {
        let output:string = "";
        // this.title = (data.match(/^#TITLE:(.*);/m) || [,""])[1].trim();
        // this.titleFile = (data.match(/^#TITLEFILE:(.*);/m) || [,""])[1].trim();
        // this.tickCount = Number((data.match(/^#TICKCOUNT:(.*);/m) || [,""])[1]);
        // this.bpm1 = Number((data.match(/^#BPM:(.*);/m) || [,""])[1]);
        // this.startTime = Number((data.match(/^#STARTTIME:(.*);/m) || [,""])[1]);
        // this.introFile = (data.match(/^#INTROFILE:(.*);/m) || [,""])[1].trim();
        // this.songFile = (data.match(/^#SONGFILE:(.*);/m) || [,""])[1].trim();
        // this.discFile = (data.match(/^#DISCFILE:(.*);/m) || [,""])[1].trim();
        // this.difficulty = Number((data.match(/^#DIFFICULTY:(.*);/m) || [,""])[1]);



        // console.log("first steps length = ", this.steps.length);
        // expression = TEXT("^#STEP:([.\\n]+)");
        // var stringStep = (data.match(/#STEP:([\S\s]+)/) || [,""])[1]; 

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

        for(let i=0; i<this.steps.length; i++) { 
            output += this.steps[i].getString();
        } 
        main.saveAsFile(filename, output);
    }
    public setStep(i:number, step:string) {

        this.steps[i].setStep(step);
    }
}


