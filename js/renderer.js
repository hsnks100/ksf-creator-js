// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//


var KSFView = require('./KSFView').KSFView;
var KSFInfo = require('./KSFInfo').KSFInfo;


var $, jQuery;
$ = jQuery = require('jquery');
// require('semantic-ui');




var ksfView = null;
var game = null;

const ksfinfo = require('electron').remote.require('./main') 
$('#btn1').click(function(){
    var data = ksfinfo.loadDataFromFile();
    var ksf = new KSFInfo();
    ksf.loadKSF(data);

    ksf.attach(ksfView);
    ksfView.setKSF(ksf);

    ksf.notifyObservers();
}); 

$('#btn2').click(function(){
    $('.ui.sidebar')
        .sidebar('toggle') ;

});

window.onload = function(){
    var game = new KSFView();
    ksfView = game;
    window.addEventListener('keydown', ksfView.keyUp, true)
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





