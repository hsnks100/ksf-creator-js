// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//



var ksfView = null;
var $ = require('jquery');

const ksfinfo = require('electron').remote.require('./main') 
$('#btn1').click(function(){
    var data = ksfinfo.loadDataFromFile();
    var ksf = new KSFInfo();
    ksf.loadKSF(data);
    ksfView.loadKSF(ksf);

}); 

window.onload = function(){
    var game = new KSFView();
    ksfView = game;
    // global.ksfView = game;
}
