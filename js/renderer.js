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

const ksfinfo = require('electron').remote.require('./main') 

window.onload = function(){
    var game = new KSFView();
    ksfView = game;
    $('#btn1').text("aaaa");
    $('#btn1').click(function(){
        var data = ksfinfo.loadDataFromFile();
        var ksf = new KSFInfo();
        ksf.loadKSF(data);

        ksf.attach(ksfView);
        ksfView.setKSF(ksf);

        ksf.notifyObservers();
    }); 

    $('#btn2').click( () => {
        ksfView.saveAsFile('./test.txt', 'asdasd');
        // $('.ui.sidebar')
            // .sidebar('toggle') ;

    });
    // $('#ksf-title').keydown(function(e) {
        // e.stopPropagation();
    // });
    // $('#ksf-bpm').keydown(function(e) {
        // e.stopPropagation();
    // });
    // $('#ksf-starttime').keydown(function(e) {
        // e.stopPropagation();
    // });
    // $('#ksf-tickcount').keydown(function(e) {
        // e.stopPropagation();
    // });
    // $('.overlay.sidebar')
        // .sidebar({
            // overlay: true
        // })
        // .sidebar('toggle')
// ;
    // $('.ui.sidebar').sidebar('toggle');
    // global.ksfView = game;
}

$( window ).resize(function() {
    ksfView && ksfView.resize();
    // ksfView.resize();
});





