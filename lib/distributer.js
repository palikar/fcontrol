const logging = require('./logging.js');
const saver = require('./saver.js');





var user_info_cache = {};
function cache_update(event, api, callback){
		var id = event.senderID || event.userID || event.from;
		
		if (! (id in user_info_cache)) {
				api.getUserInfo(id, (err, ret) => {
						if(err) return console.error(err);
						user_info_cache[id] = ret[id];
						event.userInfo = user_info_cache[id];
						callback(event);
				});
		} else {
				event.userInfo = user_info_cache[id];
				callback(event);
		}
		
}


var processors = {};

processors['message'] = function(event, api){
		const userID = api.getCurrentUserID();

		cache_update(event, api, function(event){
				if(event.senderID == userID){
						logging.log_personal(event.threadID + ' : ' +
																 user_info_cache[event.senderID]['name'] + ' : ' +
																 event.body);
						saver.save_attachment_personal(event.attachments, event, api);
				}else{
						logging.log_msg(event.threadID + ' : ' +
														user_info_cache[event.senderID]['name'] + ' : ' +
														event.body);
						saver.save_attachment(event.attachments, event, api);
				}
		});

};

processors['typ'] = function(event, api){
		cache_update(event, api, function(event){
				if(event.userInfo !== undefined){
						logging.log_presence(event.threadID + ' : ' +
																 event.userInfo['name'] + ' : typing : ' +
																 event.isTyping );
				}
		});
};

processors['presence'] = function(event, api){
		cache_update(event, api, function(event){

				if(event.userInfo !== undefined){
						var stat;
						if (event.statuses == 0){
								stat = '(0) idle, away for 2 minutes';
						}else if(event.statuses == 2){
								stat = '(2) online';
						}else{
								stat = event.statuses;
						}
						logging.log_presence(event.userInfo['name'] + ' : presence : ' +
																 stat);
				}
				
		});
};


var process = function(event, api){
		if (event.type in processors)
				processors[event.type](event, api);
};


module.exports = {
		process
};
