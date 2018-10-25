var fs = require('fs');
var request = require('request');
var shelljs = require('shelljs');
var expandenv = require('expandenv')



var expandVariables = function(string){
    return expandenv(string)
}

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        request(uri).pipe(
            fs.createWriteStream(expandVariables(filename))).on('close', callback);
    });
};

var makeDirs = function(dir){
    shelljs.mkdir('-p', dir);
}


module.exports = {
    download,
    expandVariables,
    makeDirs
}
