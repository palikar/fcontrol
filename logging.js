// const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;






const msg_format = printf(info => {
    return `${info.timestamp} : ${info.message}`;
});


var personal = createLogger({
    transports: [
        new transports.File({ filename: __dirname + '/logging.d/personal.log', json: false, timestamp: true })
    ],
    format: combine(
        timestamp(),
        msg_format
    ),
    exitOnError: false
});


var msgs = createLogger({
    transports: [
        new transports.File({ filename: __dirname + '/logging.d/msgs.log', json: false, timestamp: true })
    ],
    format: combine(
        timestamp(),
        msg_format
    ),
    exitOnError: false
});


var presence = createLogger({
    transports: [
        new transports.File({ filename: __dirname + '/logging.d/presence.log', json: false, timestamp: true })
    ],
    format: combine(
        timestamp(),
        msg_format
    ),
    exitOnError: false
});


var atachment = createLogger({
    transports: [
        new transports.File({ filename: __dirname + '/logging.d/atachments.log', json: false, timestamp: true })
    ],
    format: combine(
        timestamp(),
        msg_format
    ),
    exitOnError: false
});


var typ = createLogger({
    transports: [
        new transports.File({ filename: __dirname + '/logging.d/typing.log', json: false, timestamp: true })
    ],
    format: combine(
        timestamp(),
        msg_format
    ),
    exitOnError: false
});



module.exports = {
    // log_personal : (msg) => personal.log({level:'info'}),
    log_personal : personal.info,
    log_msg : msgs.info,
    log_presence : presence.info,
    log_typ : typ.info,
    log_atachment : atachment.info

}

