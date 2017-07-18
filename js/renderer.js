// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//


var KSFView = require('./KSFView').KSFView;
var KSFInfo = require('./KSFInfo').KSFInfo;


var $, jQuery;
$ = jQuery = require('jquery');
console.log($);
// require('semantic-ui');




var ksfView = null;
var game = null;

const main = require('electron').remote.require('./main'); 
const {clipboard} = require('electron');

window.onload = function(){
    var ksf = new KSFInfo();
    var game = new KSFView(function() {
        ksfView = game;
        console.log(ksfView);
        ksf.attach(ksfView);
        ksfView.setKSF(ksf);

        ksf.notifyObservers(); 
    });

    $('#newksf').click(function() {
        const {ipcRenderer} = require('electron');
        console.log(ipcRenderer);
        ipcRenderer.send('create-new-instance'); 
    });
    $('#openksf').click(function(){
        var editedOpenFile = ksfView.hasPath && ksfView.isEdited;
        var editedNewFile = !ksfView.hasPath && ksfView.isEdited;
        var noEditedNewFile = !ksfView.hasPath && !ksfView.isEditied;

        function openDialog() {
            var data = main.loadDataFromFile();
            if(data != null) {
                ksf.loadKSF(data.data); 
                ksfView.filePath = data.path;
                ksfView.hasPath = true;
                ksfView.isEdited = false;
                ksfView.selBegin = ksfView.selEnd = 0;
                ksf.notifyObservers(); 
            }
        }

        if(editedOpenFile) {
            main.showMessageBox({"type":"question", "buttons":["save", "no", "cancel"],
                "message":"Do you want to save ksf?"},
                function(response, checkboxChecked){
                    if(response == 0) {
                        ksfView.save();
                        openDialog();
                    }
                    else if(response == 1) {
                        openDialog();
                    } 
                }) ; 
        }
        else if(editedNewFile) {
            main.showMessageBox({"type":"question", "buttons":["save", "no", "cancel"],
                "message":"Do you want to save ksf?"},
                function(response, checkboxChecked){
                    if(response == 0) {
                        ksfView.save();
                        openDialog();
                    }
                    else if(response == 1) {
                        openDialog();
                    } 
                }) ; 
        }
        else{
            openDialog();
        }
    }); 
    $('#saveksf').click(function() {
        ksfView.save();
    }); 

    $('#x1').click(function() {
        ksfView.setScale(1);
    });
    $('#x2').click(function() {
        ksfView.setScale(2);
    });
    $('#x4').click(function() {
        ksfView.setScale(4);
    });
    $('#x6').click(function() {
        ksfView.setScale(6);
    });
    $('#x8').click(function() {
        ksfView.setScale(8);
    });
};

$( window ).resize(function() {
    ksfView && ksfView.resize();
});





