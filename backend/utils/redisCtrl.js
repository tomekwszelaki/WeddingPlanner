/**
 * Created by tomasj on 2/05/14.
 */
var express = require('express');
var config = require('../../config');
var redis = require('redis');
var url = require('url');

var redisCtrl;

function RedisCtrl() {
    this.redisURL = null;
    this.client = null;
    this.defaults = {
        tokenTimeout: 3600,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken'
    };
}

RedisCtrl.prototype.connect = function() {
    console.log('Redis: establishing connection...');
    this.redisURL = url.parse(config.redis.redisCloudUrl);
    this.client = redis.createClient(this.redisURL.port, this.redisURL.hostname, {no_ready_check: true});
    this.client.auth(this.redisURL.auth.split(":")[1]);
    this.client.on('connect'     , function() {
        console.log('Redis: connected.');
    });
    this.client.on('ready'       , function() {
        console.log('Redis: ready.');
    });
    this.client.on('reconnecting', function() {
        console.log('Redis: reconnecting.');
    });
    this.client.on('error'       , function(err) {
        console.error('Redis error: ' + err);
    });
    this.client.on('end'         , function() {
        console.log('Redis: connection ended.');
    });
}

RedisCtrl.prototype.insertToken = function(key, value, ttl, cb) {
    this.client.set(key, value, redis.print);
    this.client.expire(key, ttl || this.defaults.tokenTimeout);
    cb(null, 'created key: ' + key + ' | ' + value);
};

RedisCtrl.prototype.end = function() {
    this.client.end();
}

function init() {
    redisCtrl = new RedisCtrl();
    redisCtrl.connect();
}

function insertAccessToken(token, timeout, cb) {
    redisCtrl.insertToken(redisCtrl.defaults.accessToken, token, timeout, cb); // access token is valid for 1 hour
}

function insertRefreshToken(token, cb) {
    redisCtrl.insertToken(redisCtrl.defaults.refreshToken, token, redisCtrl.defaults.tokenTimeout * 24 * 60, cb); // refresh token is valid for 60 days
};

function checkAccessTokenTTL(cb) {
    redisCtrl.client.ttl(redisCtrl.defaults.accessToken, cb);
};

function checkRefreshTokenTTL(cb) {
    redisCtrl.client.ttl(redisCtrl.defaults.refreshToken, cb);
};

function getAccessToken(cb) {
    redisCtrl.client.get(redisCtrl.defaults.accessToken, cb);
};

function getRefreshToken(cb) {
    redisCtrl.client.get(redisCtrl.defaults.refreshToken, cb);
};

function end() {
    redisCtrl.end();
}

module.exports = {
    init: init,
    insertAccessToken: insertAccessToken,
    insertRefreshToken: insertRefreshToken,
    checkAccessTokenTTL: checkAccessTokenTTL,
    checkRefreshTokenTTL: checkRefreshTokenTTL,
    getAccessToken: getAccessToken,
    getRefreshToken: getRefreshToken,
    end: end
}
