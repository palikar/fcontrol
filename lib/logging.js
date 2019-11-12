const {createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const { expandVariables, makeDirs } = require('./utils.js');
require('winston-daily-rotate-file');
const {join} = require('path')
const fs = require('fs')

var config = JSON.parse(fs.readFileSync(join(__dirname, 'config.json'), 'utf8'));
var logging_dir = expandVariables(config.logging_dir)

if (!fs.existsSync(logging_dir)){
    makeDirs(logging_dir);
}

const msg_format = printf(info => {
    return `${info.timestamp}:${info.message}`;
});

const personal = createLogger({
    transports: [
        new transports.File({filename: join(logging_dir, 'personal.log'), json: true, timestamp: true, level : 'info' })
    ],    
    format: combine(timestamp(), msg_format),
    exitOnError: false
});
var msgs = createLogger({
    transports: [
        new transports.File({ filename: join(logging_dir, 'msgs.log'), json: false, timestamp: true })
    ],
    format: combine(timestamp(),msg_format),
    exitOnError: false
});
var presence = createLogger({
    transports: [
        new transports.File({ filename: join(logging_dir, 'presence.log'), json: false, timestamp: true })
    ],
    format: combine(timestamp(),msg_format),
    exitOnError: false
});
var atachment = createLogger({
    transports: [
        new transports.File({ filename: join(logging_dir, 'atachments.log'), json: false, timestamp: true })
    ],
    format: combine(timestamp(),msg_format),
    exitOnError: false
});
var typ = createLogger({
    transports: [
        new transports.File({ filename: join(logging_dir, 'typing.log'), json: false, timestamp: true })
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

