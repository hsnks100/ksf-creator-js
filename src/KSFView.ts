/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/>
const main = require('electron').remote.require('./main') ;
const $ = require('jquery');
require('jquery-modal');

// import $ from 'jquery-ui';

import { KSFInfo } from "./KSFInfo";

// const Phaser = require('../lib/phaser.min.js');

const Phaser = require('phaser');
// import {Phaser} from 'phaser';
// var Phaser = require('../node_modules/phaser/build/phaser.js');
// var Phaser = require('../node_modules/phaser/build/phaser.js');
// var P2 = require('../node_modules/phaser/build/p2.js');
// var PIXI = require('../node_modules/phaser/build/pixi.js');
// var Phaser = require('phaser');
// var pixi = require('phaser');
// var p2 = require('phaser');
// import Phaser = require('phaser'); // works!
// import Phaser = require('phaser'); // works!
// import * as Phaser from 'phaser';



export interface Observer { 
     reflectData(); 
} 

class Arrow extends Phaser.Sprite {
    game:Phaser.Game;
    position:Phaser.Point;
    anchor:Phaser.Point;
    theta:number;
    public constructor(game:Phaser.Game, arrow:string) { 
        super(game, 0, 0, arrow);
        this.game = game;
        // var gg : Phaser.Sprite = new Phaser.Sprite(game, 0, 0, '1');
        // gg.position.x = 0;
        this.anchor.y = 0;
    }

    public update() { 
    }
} 


export class KSFView implements Observer {
    game:Phaser.Game;
    arrowSize:number = 16;
    ksfinfo:KSFInfo = null;
    index2Coord:object = {};
    index2Column:object = {};
    columns:number = 1;
    coord2index:object = {};
    selBegin:number = 0;
    selEnd:number = 0;
    selector:Phaser.Graphics;
    arrows:Phaser.Group;
    lines:Phaser.Group;
    cops:Phaser.Group;
    selections:Phaser.Group; 
    copState:boolean = false;
    scale:number = 1; 
    isEdited:boolean = false;
    hasPath:boolean = false;
    filePath:string = "newksf.ksf"; 

    public reflectData() {
        $('#ksf-title').attr("value", this.ksfinfo.title);
        $('#ksf-bpm').attr("value", this.ksfinfo.bpm1);
        $('#ksf-tickcount').attr("value", this.ksfinfo.tickCount);
        $('#ksf-starttime').attr("value", this.ksfinfo.startTime); 

        this.redraw();
    }

    public getCurrentPosition() {
        // get current position = cur / total
    }

    constructor(callback) {
        this.game = new Phaser.Game(800, 1000, Phaser.AUTO, 
            'ksf-view', 
            { preload: this.preload, 
                create:() => {
                    this.create();
                    callback(); 
                },
                
                update:this.update });
        // $('#ksf-view')[0].addEventListener('keydown', this.keyUp, true);
        $('#main-view').keydown(this.keyUp); // ('keydown', this.keyUp, true);
        // window.addEventListener('keydown', this.keyUp, true);

    }
    public preload = () => {
        this.game.load.image('1', '1.png'); 
        this.game.load.image('3', '3.png'); 
        this.game.load.image('5', '5.png'); 
        this.game.load.image('7', '7.png'); 
        this.game.load.image('9', '9.png'); 
        this.game.load.image('cop', 'cop.png'); 
        this.game.load.image('selcop', 'cop2.png'); 
    } 
    public create = () => {
        this.game.stage.backgroundColor = '#FFFFFF';

        this.selections = this.game.add.group();
        this.lines = this.game.add.group();
        this.arrows = this.game.add.group();
        this.cops = this.game.add.group();
    }
    public update = () => {
    }
    public resize = () => {
        if(this.ksfinfo != null) {
            this.redraw();
        }
    }

    public keyUp = (e) => { 

        // if(this.copState) {
            // return;
        // }
        // e.preventDefault();
        // e.stopPropagation();
        var ksfViewDom = $('#ksf-view')[0];
        var maxScrollLeft = ksfViewDom.scrollWidth - ksfViewDom.clientWidth;
        var tid = null;
        console.log(e);

        if(e.key.includes("Arrow")){
            if(e.key == "ArrowDown") {
                var changeIndex;
                if(e.shiftKey == true) {
                    changeIndex = this.selEnd;
                }
                else{
                    changeIndex = this.selBegin;
                }
                changeIndex++;
                changeIndex = Math.min(this.ksfinfo.steps.length - 1, changeIndex);

                if(e.shiftKey == true) {
                    this.selEnd = changeIndex;
                }
                else {
                    this.selBegin = changeIndex;
                    this.selEnd = this.selBegin;
                }
                this.drawSelection();
            }
            if(e.key == "ArrowUp") {
                var changeIndex;
                if(e.shiftKey == true) {
                    changeIndex = this.selEnd;
                }
                else{
                    changeIndex = this.selBegin;
                }
                changeIndex--;
                changeIndex = Math.max(0, changeIndex);

                if(e.shiftKey == true) {
                    this.selEnd = changeIndex;
                }
                else{
                    this.selBegin = changeIndex;
                    this.selEnd = this.selBegin;
                }
                this.drawSelection();
            }
            if(e.key == "ArrowLeft") {
                var changeIndex;
                if(e.shiftKey == true) {
                    changeIndex = this.selEnd;
                }
                else{
                    changeIndex = this.selBegin;
                }

                var prevY = this.index2Coord[changeIndex].y;
                var prevX = this.index2Coord[changeIndex].x;
                var minDiffY = 9999999;
                var goalIndex = changeIndex;

                for(let i=changeIndex - 1; i>=0;i--) {
                    var diffY = Math.abs(this.index2Coord[i].y - prevY);
                    if(this.index2Coord[i].x != prevX){
                        if(minDiffY > diffY) {
                            minDiffY = diffY; 
                            goalIndex = i;
                        }
                        else{ 
                            break;
                        } 
                    } 
                }
                if(e.shiftKey == true) {
                    this.selEnd = goalIndex;
                }
                else{
                    this.selBegin = goalIndex;
                    this.selEnd = this.selBegin;
                }
                this.drawSelection();
            }
            if(e.key == "ArrowRight") {
                var changeIndex;
                if(e.shiftKey == true) {
                    changeIndex = this.selEnd;
                }
                else{
                    changeIndex = this.selBegin;
                }

                var prevY = this.index2Coord[changeIndex].y;
                var prevX = this.index2Coord[changeIndex].x;
                var minDiffY = 9999999;
                var goalIndex = changeIndex;

                for(let i=changeIndex + 1; i<this.ksfinfo.steps.length; i++) {
                    var diffY = Math.abs(this.index2Coord[i].y - prevY);
                    if(this.index2Coord[i].x != prevX){
                        if(minDiffY > diffY) {
                            minDiffY = diffY; 
                            goalIndex = i;
                        }
                        else{ 
                            break;
                        } 
                    } 
                }
                if(e.shiftKey == true) {
                    this.selEnd = goalIndex;
                }
                else{
                    this.selBegin = goalIndex;
                    this.selEnd = this.selBegin;
                }
                this.drawSelection();
            } 
            (() => {
                var prevScrollLeft = $('#ksf-view').scrollLeft();
                var goalScrollValue = prevScrollLeft;
                while( this.index2Coord[this.selEnd].x + this.arrowSize * 11 > goalScrollValue + ksfViewDom.clientWidth ) {
                    goalScrollValue++;
                }
                $('#ksf-view').scrollLeft(goalScrollValue); 
            })();

            (() => {
                var prevScrollLeft = $('#ksf-view').scrollLeft();
                var goalScrollValue = prevScrollLeft;
                while( this.index2Coord[this.selEnd].x < goalScrollValue) {
                    goalScrollValue--;
                }
                $('#ksf-view').scrollLeft(goalScrollValue);
            })();
        }
        else if(e.key == "End") {
                
        } 
        else if(e.key == " "){
            
            $('#dialog').modal({
                closable  : true,
                onApprove : () => {
                    var t = $('#modal_cop').val();
                    var arrayT = t.split('\n');
                    if(t == "") {
                        arrayT = [];
                    }
                    this.ksfinfo.setCOPwithIndex(this.selEnd, arrayT);
                    this.redraw(); 
                    this.isEdited = true;
                    return false;
                },
                onHidden : function() {
                    // window.alert('hidden!');
                }, 
                onShow : () => {
                    $('#modal_cop').val( this.ksfinfo.steps[this.selEnd].getCOP() );
                },
            }).modal('show');
            $('#dialog').keydown(function(e){ 
                // e.preventDefault();
                e.stopPropagation(); 
                console.log(e);
            });

            // $( () => {

                // console.log($('#dialog'));
                // var dialog = $("#dialog").dialog(
                    // {
                        // modal : true,
                        // width:300,
                        // height:200,
                        // buttons: {
                            // "Create an account": function() {
                            // },
                            // Cancel: () => {
                                // dialog.dialog( "close" );
                                // // this.copState = false;
                            // }
                        // },
                        // close: () => {

                            // this.copState = false;


                            // // form[ 0 ].reset();
                            // // allFields.removeClass( "ui-state-error" );
                        // }, 
                    // }
                
                // );
                // this.copState = true;
                // // $("#dialog").dialog();
            // } ); 
        }
        else if(e.ctrlKey == false && "zscqwevgnry".includes(e.key)) { 
            this.ksfinfo.setStep(this.selEnd, e.key);

            this.redraw(); 
            this.isEdited = true;
        }
        
        else if(e.ctrlKey == true && e.key == "c") {
            this.copyStep(this.selBegin, this.selEnd);

        }
        else if(e.ctrlKey == true && e.key == "v") {
            this.pasteStep();
            this.redraw();
            this.isEdited = true;
            //this.copyStep(this.selBegin, this.selEnd); 
        }

        else if(e.key == "Insert") {
            if(e.ctrlKey == true) {
                this.ksfinfo.pushBack();
            }
            else{
                this.ksfinfo.insert(this.selEnd);
            }
            this.isEdited = true;

            this.redraw();
        } 

        else if(e.key == "Delete") {
            this.ksfinfo.deleteStep(this.selEnd);
            this.redraw();
            this.isEdited = true;
        } 
    }

    public redraw = () => {
        this.game.scale.setGameSize(this.game.scale.width, $( window ).height() - 170);
        this.arrows.removeAll();
        this.lines.removeAll(); 
        this.cops.removeAll();
        this.selections.removeAll();
        // this.game.world.removeAll();
        var xCount = this.drawKSF();
        this.drawLines(xCount);
        this.selector = this.game.add.graphics(0, 0);
        // this.selector.blendMode = PIXI.blendModes.NORM;
        this.selections.add(this.selector);
        this.drawSelection();
        // this.selector.lineStyle(10, 0xFF0000, 0.8);
    }

    public drawLine = (x, y, color) => { 
        x += this.arrowSize;
        let line = new Phaser.Line(x, y, x + this.arrowSize * 10, y);
        let graphicsLine = new Phaser.Graphics(this.game, 0, 0);
        this.lines.add(graphicsLine);

        graphicsLine.clear();
        graphicsLine.lineStyle(1, color, 1);
        graphicsLine.moveTo(line.start.x, line.start.y);
        graphicsLine.lineTo(line.end.x, line.end.y);
        graphicsLine.endFill(); 
    }

    public drawArrow = (x, y, unitStep) => {
        x += this.arrowSize;
        let offsetToArrow = {
            0:'1',
            1:'7',
            2:'5',
            3:'9',
            4:'3',
            5:'1',
            6:'7',
            7:'5',
            8:'9',
            9:'3'};
        for(let offset=0; offset<unitStep.length; offset++) {
            if(unitStep[offset] == '1' || unitStep[offset] == '4' || 0) {
                let arrow:Arrow = new Arrow(this.game, offsetToArrow[offset]);
                this.arrows.add( arrow ); 
                arrow.position.x = x + offset * this.arrowSize;
                arrow.position.y = y; 
            }
        } 
    }

    public drawCOP = (x, y, unitCOP) => {
        if(unitCOP.length >= 1){
            this.cops.add(this.game.add.sprite(x, y, 'cop'));
        }
    }


    public drawLines(xCount) {
        var numberOfEachRow = Math.floor(this.game.scale.height / this.arrowSize / 4);
        numberOfEachRow--;
        var lineCount = numberOfEachRow * xCount;
        // console.log(numberOfEachRow);

        var x, y;
        x = 0;
        y = 4 * this.arrowSize;
        for(let i=1; i<=lineCount; i++){
            if(i % 4 == 0){
                this.drawLine(x, y, 0xff0000);
            }
            else{
                this.drawLine(x, y, 0xffaddb);
            }
            y += 4 * this.arrowSize;
            if(i % numberOfEachRow == 0){
                y = 4 * this.arrowSize;
                x += this.arrowSize * 11;
            }
        }
        this.drawLine((xCount - 1) * this.arrowSize * 11, 
            this.index2Coord[this.ksfinfo.steps.length - 1].y + this.arrowSize, 0x000000);
    }
    public drawKSF() { 
        var xCount = 1;
        var computeScale = 64 * this.scale;
        var y = 0;
        var x = 0;
        var tickCount = this.ksfinfo.tickCount;
        var yMargin = computeScale / tickCount;
        console.log(yMargin);

        let steps:any = this.ksfinfo.steps;
        // console.log("step length = ", steps.length);

        // 64 / n tick

        var numberOfEachRow = Math.floor(this.game.scale.height / this.arrowSize / 4);
        console.log(numberOfEachRow);
        for(let i=0; i<steps.length; i++) {
            let unitStep = steps[i].unitStep;
            if(i == steps.length - 1){
                // console.log(unitStep);
            }
            let unitCOP = steps[i].unitCOP;

            if(y >= (numberOfEachRow - 1) * this.arrowSize * 4) {
                console.log("y = ", y);
                // this.drawLine2(x, y);
                // this.drawLine(x, y);
                y = 0;
                x += this.arrowSize * 11;
                xCount++;
            } 
            else{ 
            } 
            this.index2Column[i] = xCount;
            this.index2Coord[i] = {x:x, y:y};
            this.coord2index[JSON.stringify({x:x, y:y})] = i;
            this.drawArrow(x, y, unitStep);
            this.drawCOP(x, y, unitCOP);

            let newTick = this.ksfinfo.getTickCount(unitCOP);
            if(newTick != -1){
                yMargin = computeScale / newTick;
                tickCount = newTick;
            }
            y += yMargin; 
        } 
        // console.log("x : ", x);
        // console.log(this.coord2index);
        this.game.scale.setGameSize(x + this.arrowSize * 11, this.game.scale.height); 
        return this.columns = xCount;
    }

    public drawSelection() {
        let steps:any = this.ksfinfo.steps;
        this.selector.clear();
        this.selector.beginFill(0xaacbff, 1); 
        var begin, end;
        if(this.selBegin <= this.selEnd) {
            begin = this.selBegin;
            end = this.selEnd;
        }
        else{
            begin = this.selEnd;
            end = this.selBegin;
        }
        for(let i=begin; i<=end; i++){
            var x = this.index2Coord[i].x + this.arrowSize;
            var y = this.index2Coord[i].y;
            this.selector.drawRect(x, y, this.arrowSize * 10, this.arrowSize);
        }

        this.selector.endFill();
    }

    public loadKSF(ksfinfo : KSFInfo) {
        this.ksfinfo = ksfinfo; 
        this.redraw(); 
        this.drawSelection(); 
    }
    public setKSF(ksfinfo : KSFInfo) {
        this.ksfinfo = ksfinfo; 
        this.selBegin = 0;
    } 

    public getFileName() {

        const path = require('path');
        return path.basename(this.filePath); 
    }

    public save() {
        if(this.hasPath == false) {
            const main = require('electron').remote.require('./main'); 

            var file = main.saveDialog(this.getFileName()); 
            if(file != "") {
                this.filePath = file;
                this.saveAsFile(this.filePath);
                this.hasPath = true;
                this.isEdited = false;
            }
        }
        else {
            this.saveAsFile(this.filePath);
            this.isEdited = false;
        }
    }

    public saveAsFile(filename:string) { 
        this.ksfinfo.saveAsFile(filename);
    }


    public pushBack() {
        this.ksfinfo.pushBack();
    }

    public insert(pos:number) {
        this.ksfinfo.insert(pos);
    }

    public deleteStep(pos:number) {
        this.ksfinfo.deleteStep(pos);
    }

    public getTextFromRange(b:number, e:number) {
        if(b > e) {
            let temp = e;
            e = b;
            b = temp;
        }
        let ret:string = "";

        for(let i=b; i<=e; i++) {
            ret += this.ksfinfo.steps[i].getString();
        }

        return ret;
    }
    public copyStep(b:number, e:number) {
        const {clipboard} = require('electron');
        if(b > e) {
            let temp = e;
            e = b;
            b = temp;
        }
        clipboard.writeText(this.getTextFromRange(b, e));
    }

    public pasteStep() {
        const {clipboard} = require('electron');
        let stepsString = clipboard.readText();
        this.ksfinfo.insertSteps(this.selEnd,
            this.ksfinfo.getStepsFromString(stepsString));

    }

    public setScale(s:number) {
        this.scale = s;
        this.redraw();
    }
}

