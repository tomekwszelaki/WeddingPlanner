'use strict';

var amqp = require('amqp');
var winston = require('winston');

var conn, exchange;
var queues = {};

function createQueue(qname, callback) {
    exchange = conn.exchange('');
    var queue = conn.queue(qname, {durable:true,autoDelete:false}, function() {
        queues[qname] = queue;
        callback();
    });
}

function init(options, callback) {
    try {
        conn = amqp.createConnection({ url: options.url }, options.implOpts)
        conn.on('ready', function() {
            winston.info('Connection opened.');
            createQueue(options.qname, callback);
        });
        conn.on('error', function(e) {
            winston.error('Connection error.');
            callback(e);
        });
        conn.on('close', function(e) {
            winston.error('Connection closed.');
            callback(e);
        });
    } catch (e) {
        winston.error(e);
        console.error('ERROROROROROROORO ' + e.message);
    }

}

function end(){
    conn.end();
}

function publish(qname, message, callback){
    exchange.publish(qname, message);
    callback();
}

function subscribe(qname, callback) {
    if ( queues[qname] === undefined ) {
        callback(new Error());
    } else {
        queues[qname].subscribe(function(msg){
            winston.debug(JSON.stringify(msg));
            callback(msg);
        });
    }
}

exports.init = init;
exports.end = end;
exports.createQueue = createQueue;
exports.publish = publish;
exports.subscribe = subscribe;