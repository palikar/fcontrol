const login = require("facebook-chat-api");
var fs = require('fs'),
    request = require('request');



var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


/* 
 * login({email: "stanislav_ts@abv.bg", password: "stargatesg22"}, (err, api) => {
 * 
 *   api.setOptions({
 *     logLevel: "silent",
 *     updatePresence: true,
 *     selfListen : true
 *   });
 * 
 * 
 *   
 *   var yourID = api.getCurrentUserID();
 * 
 *   
 *   var stopListening = api.listen((err, event) => {
 * 
 *     switch(event.type) {
 *       case "message":
 *         console.log(event.body);
 *         console.log(event.attachments[0].largePreviewUrl);
 *         break;
 *       case "event":
 *         console.log(event);
 *         break;
 *       case "typ":
 *         console.log("The bitch is typing");
 *         break;
 *     }
 *   });
 * });
 *  */







