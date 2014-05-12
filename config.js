/**
 * Created by tomasj on 29/01/14.
 */


var config = module.exports;
//var PRODUCTION = process.env.NODE_ENV === "production";


config.express = {
  port: process.env.PORT || 5000,
  ip: process.env.EXPRESS_IP || "localhost",
  cookieSecret: process.env.COOKIE_SECRET,
  sessionSecret: process.env.SESSION_SECRET
};

config.mongodb = {
  mongolabUri: process.env.MONGOLAB_URI
};

config.redis = {
  redisCloudUrl: process.env.REDISCLOUD_URL
}

config.box = {
  clientId: process.env.BOX_CLIENT_ID,
  clientSecret: process.env.BOX_CLIENT_SECRET,
  callbackURL: 'http://127.0.0.1:' + config.express.port + '/auth/box/callback'
}

config.facebook = {
  clientId: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: 'https://judytaitomek.herokuapp.com/auth/facebook/callback'
}

config.rabbitmq = {
    publisherURL: process.env.RABBITMQ_BIGWIG_TX_URL,
    receiverURL: process.env.RABBITMQ_BIGWIG_RX_URL,
    implOptions: {
        reconnect: true,
        reconnectBackoffStrategy: 'linear', // or 'exponential'
        reconnectBackoffTime: 500,
        durable: true,
        autoDelete: true
    },
    uploadQueue: 'upload'
}
