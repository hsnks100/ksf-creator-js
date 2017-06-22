
// mapNumbers.js 메인 프로세스
exports.withRendererCallback = function(i) {
    const {dialog} = require('electron');
    var file  = dialog.showOpenDialog({properties: ['openFile']});
    file = file.length ? file[0] : '';
    console.log(file);

    // console.log(fs);
    var ksfinfo = new KSFInfo("mytitle");
    ksfinfo.showData();

    if (file !== '') {
        ksfinfo.loadKSF(file, () => {
            ksfinfo.showData();
        });
        // console.log(ksfinfo);
        // console.log(ksfinfo.title);
    }

}

exports.withLocalCallback = () => {
    return [1, 2, 3].map(x => x + 1)
}

