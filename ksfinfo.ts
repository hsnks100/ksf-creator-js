
class StepData {
    unitStep : Array<string>;
    unitCOP : Array<string>; 
}
class KSFInfo {
    title : string;
    player : string;
    bpm1 : string;
    startTime : number;
    tickCount : number; // 1,2,3,4,5,6,7,8 

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

    loadKSF(path:string) {
        let temp : Array<string>;
        this.steps.unitStep.push("qwewe");
        this.steps.unitStep.push("qwewe2"); 
    }

}
