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

const ksfinfo = require('electron').remote.require('./main'); 
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
        if(ksfView.isEdited) {
        }
        var data = ksfinfo.loadDataFromFile();
        if(data != null) {
            ksf.loadKSF(data.data); 
            ksfView.filePath = data.path;
            ksfView.hasPath = true;
            ksf.notifyObservers(); 
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





