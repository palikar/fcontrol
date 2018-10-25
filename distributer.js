var Queue = require('queuejs');
const fs = require("fs");
const utils = require('./utils.js')
const logging = require('./logging.js')

const MAX_QUEUE_SIZE = 200
const PROCESS_BATCH_SIZE = 200
var msgs_queue = new Queue()


var user_info_cache = {}
processors = {};


processors["message"] = function(event, api){

    const userID = api.getCurrentUserID();
    if (! (event.senderID in user_info_cache)) {
        console.log("updating cache")
        api.getUserInfo(event.senderID, (err, ret) => {
            if(err) return console.error(err);
            user_info_cache[event.senderID] = ret[event.senderID]
            logging.log_personal(ret[event.senderID].name + ' : ' + event.body)
        });
    }else{        
        if(event.senderID == userID){
            logging.log_personal(user_info_cache[event.senderID]['name'] + ' : ' + event.body)            
        }
    }
}

processors["typ"] = function(event, api){


}


processors["presence"] = function(event, api){


}


processors["read_receipt"] = function(event, api){


}


processors["message_reaction"] = function(event, api){


}



var flushQueue = function(){
    
    var processed = 0;
    while(!msgs_queue.isEmpty() && processed < PROCESS_BATCH_SIZE){
        var event = msgs_queue.deq();
        processors[event.type](event)
        processed++;
    }

}

var process = function(event, api){
    // console.log(event)

    processors[event.type](event,api)
    
    // msgs_queue.enqueue(event)

    // if (msgs_queue.size() > 5) {
    //     flushQueue()
    // }

}




module.exports = {
    process
}
