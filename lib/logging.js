const {createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
require('winston-daily-rotate-file');
const {join} = require('path')
const fs = require('fs')

var config = JSON.parse(fs.readFileSync(join(__dirname, 'config.json'), 'utf8'));


if (!fs.existsSync(config.logging_dir)){
    fs.mkdirSync(config.logging_dir, { recursive: true });
}

const msg_format = printf(info => {
    return `${info.timestamp}:${info.message}`;
});

const personal = createLogger({
    transports: [
        new transports.File({filename: join(config.logging_dir, 'personal.log'), json: true, timestamp: true, level : 'info' })
    ],    
    format: combine(timestamp(), msg_format),
    exitOnError: false
});
var msgs = createLogger({
    transports: [
        new transports.File({ filename: join(config.logging_dir, 'msgs.log'), json: false, timestamp: true })
    ],
    format: combine(timestamp(),msg_format),
    exitOnError: false
});
var presence = createLogger({
    transports: [
        new transports.File({ filename: join(config.logging_dir, 'presence.log'), json: false, timestamp: true })
    ],
    format: combine(timestamp(),msg_format),
    exitOnError: false
});
var atachment = createLogger({
    transports: [
        new transports.File({ filename: join(config.logging_dir, 'atachments.log'), json: false, timestamp: true })
    ],
    format: combine(timestamp(),msg_format),
    exitOnError: false
});
var typ = createLogger({
    transports: [
        new transports.File({ filename: join(config.logging_dir, 'typing.log'), json: false, timestamp: true })
    ],
    format: combine(timestamp(),msg_format),
    exitOnError: false
});


if (process.env.LOGGING) {
    personal.add(new transports.Console());
    msgs.add(new transports.Console({json: false, timestamp: true}));
    presence.add(new transports.Console({json: false, timestamp: true}));
    atachment.add(new transports.Console({json: false, timestamp: true}));
    typ.add(new transports.Console({json: false, timestamp: true}));   
}

module.exports = {
    log_personal : personal.info,
    log_msg : msgs.info,
    log_presence : presence.info,
    log_typ : typ.info,
    log_atachment : atachment.info
};

