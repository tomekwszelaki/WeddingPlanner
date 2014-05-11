/**
 * Created by tomasj on 7/05/14.
 */

var amqpClient = require('./amqp');
var config = require('../../config');

var publisherOptions = {
    url: config.rabbitmq.publisherURL,
    implOptions: config.rabbitmq.implOptions,
    qname: config.rabbitmq.uploadQueue
};

amqpClient.init(publisherOptions, function(err) {
    if (err) {
        console.error("There was an error: " + err);
    }
    else {
        console.log('you can publish now');
    }
});

function publish(msg) {
    amqpClient.publish(publisherOptions.qname, msg, function(err) {
        if (err) {
            console.error('Publish error: ' + err)
        }
        else {
            console.log('message sent: ', msg);
        }
    });
};

module.exports.publish = publish


