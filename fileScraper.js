const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'js');
var res = []
const getFiles = async (dirPath) => {
    fs.readdir(dirPath, function (err, files) {

        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }


        files.forEach(function (file) {
            if (!file.match(/\./)) {
                getFiles(path.join(dirPath, file))
            } else {
                res.push(
                    path.join(dirPath.replace(__dirname, ''), file)
                        .replace(/\\/g, '/')
                        .substring(1)
                )
                const json = JSON.stringify(res);
                fs.writeFileSync('require.js', `const urlTree = ${json};urlTree.forEach(b=>{var a=document.createElement("script");a.src=b,a.defer=!0,document.head.appendChild(a)})`);
            }
        });
    });
}

getFiles(directoryPath)
