const fs = require('fs');
const path = require('path');
const login = require('facebook-chat-api');
const readline = require('readline');
const dispatch = require('./distributer.js');


initFacebookChat('','',true, true);




var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


if (fs.existsSync(path.join(__dirname, '.appstate.json'))) {
    rl.question('Restore app state(y/n): ', (yn) => {
        if (yn === 'y'){
            initFacebookChat('', '', true);
        }else {
            rl.question('Facebook Email adress: ', (name) => {
                rl.stdoutMuted = true;
                rl.query = 'Password : ';
                rl.question(rl.query, (pass) => {
                    console.log('\n');
                    initFacebookChat(name, pass, false);
                    rl.history = rl.history.slice(1);
                    rl.close();
                });
                rl._writeToOutput = function _writeToOutput(stringToWrite) {
                    if (rl.stdoutMuted)
                        rl.output.write('\x1B[2K\x1B[200D'+rl.query+'['+((rl.line.length%2==1)?'=-':'-=')+']');
                    else
                        rl.output.write(stringToWrite);
                };
            });

        }


        
    });

}


function initFacebookChat(email, pass, saveState, restoreState){


    var loginInfo;
    if (!restoreState){
        loginInfo ={email: email, password: pass};        
    }
    else{
        loginInfo = {appState: JSON.parse(fs.readFileSync(path.join(__dirname,'.appstate.json'), 'utf8'))}; 
    }

    login(loginInfo, (err, api) => {
        if (saveState)
            fs.writeFileSync('.appstate.json', JSON.stringify(api.getAppState()));
        
        api.setOptions({
            logLevel: 'silent',
            updatePresence: true,
            selfListen : true,
            listenEvents: true
        });

        api.listen((err, event) => {
            if(err) return console.error(err);
            dispatch.process(event, api);
        });

        
    });
}





