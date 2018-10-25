var fs = require('fs');
var request = require('request');
var expandenv = require('expandenv')


var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};


var expandVariables = function(string){
    return expandenv(string)
}


module.exports = {
    download,
    expandVariables
}
