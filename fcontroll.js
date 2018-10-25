const fs = require("fs");
const login = require("facebook-chat-api");
const readline = require('readline');
const dispatch = require('./distributer.js');
var Writable = require('stream').Writable;





initFacebookChat("","",true, true)



var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



// rl.question("Facebook Email adress: ", (name) => {

//     rl.stdoutMuted = true;
//     rl.query = "Password : ";
//     rl.question(rl.query, (pass) => {


//         console.log('\n')
        
//         initFacebookChat(name, pass, true)
//         rl.history = rl.history.slice(1);
//         rl.close();
//     })

//     rl._writeToOutput = function _writeToOutput(stringToWrite) {
//         if (rl.stdoutMuted)
//             rl.output.write("\x1B[2K\x1B[200D"+rl.query+"["+((rl.line.length%2==1)?"=-":"-=")+"]");
//         else
//             rl.output.write(stringToWrite);
//     };
// });


var stopListening


function initFacebookChat(email, pass, saveState, restoreState){


    var loginInfo;
    if (!restoreState){
        loginInfo ={email: email, password: pass}        
    }
    else{
        loginInfo = {appState: JSON.parse(fs.readFileSync('.appstate.json', 'utf8'))} 
    }

    login(loginInfo, (err, api) => {
        if (saveState)
            fs.writeFileSync('.appstate.json', JSON.stringify(api.getAppState()));
        
        api.setOptions({
            logLevel: "silent",
            updatePresence: true,
            selfListen : true,
            listenEvents: true
        });

        stopListening = api.listen((err, event) => {
            if(err) return console.error(err);
            dispatch.process(event, api)
        });

        
    });
}





