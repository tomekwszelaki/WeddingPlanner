/**
 * Created by tomasj on 26/03/14.
 */

var amqpClient = require('./amqp');
var config = require('../../config');

var receiverOptions = {
    url: config.rabbitmq.receiverURL,
    implOptions: config.rabbitmq.implOptions,
    qname: config.rabbitmq.uploadQueue
};



amqpClient.init(receiverOptions, function(err) {
    if (err) {
        console.error("There was an error: " + err);
    }
    else {
        amqpClient.subscribe(receiverOptions.qname, function(msg) {
            console.log("got a message: ", JSON.stringify(msg));
        });
    }
});


