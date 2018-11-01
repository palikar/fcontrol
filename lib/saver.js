const utils = require('./utils.js');
const logging = require('./logging.js');
const path = require('path');
const fs = require('fs');


var folders = JSON.parse(fs.readFileSync(path.join(__dirname,'folders.json'), 'utf8'));

var atachment_processors = {};

atachment_processors['photo'] = function(atachment, folder, api, event){
    logging.log_atachment(event.threadID + ' : ' +
                          event.userInfo['name'] + ' : photo : ' +
                          atachment.ID + ' : ' +
                          __dirname);
    if(folder === undefined){
        utils.download(atachment.largePreviewUrl,
            path.join(__dirname, atachment.ID + '_' + atachment.filename + '.jpg'),
            (err) => {if(err)console.log(err);});
    }else{
        utils.makeDirs(utils.expandVariables(folder));
        utils.download(atachment.largePreviewUrl,
            path.join(utils.expandVariables(folder), atachment.ID + '_' + atachment.filename) + '.jpg',
            (err) => {if(err)console.log(err);});
    }    
};



var save_attachment = function(atachments, event, api){

    if (atachments.length == 0)
        return -1;
    
    var save_folder = folders[':collected:'];
    
    var err = -1;
    atachments.forEach(value => {
        if (value.type in atachment_processors){
            atachment_processors[value.type](value, save_folder, api, event); 
        }        
    });
    return err;

};

var save_attachment_personal = function(atachments, event, api){

    if (atachments.length == 0)
        return -1;
    
    var save_folder = folders[':collected:'];
    for (var entry in folders) {
        var key = entry;
        var folder = folders[entry];
        if (event.body.indexOf(key) != -1){
            save_folder = folder;
            break;
        }
    }
    var err = -1;
    atachments.forEach(value => {
        if (value.type in atachment_processors){
            err = atachment_processors[value.type](value, save_folder, api, event); 
        }
    });
    return err;
};


module.exports = {
    save_attachment,
    save_attachment_personal
};
