// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//




const mapNumbers = require('electron').remote.require('./ksfinfo') 
$('#btn').click(function(){
    window.alert("ttt");
    mapNumbers.loadKSF();
});





