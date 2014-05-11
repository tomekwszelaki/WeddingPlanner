/**
 * Created by tomasj on 2/05/14.
 */


var redisClass = require('./../utils/redisCtrl');
var fs = require('fs');
var path = require('path');
var redisCtrl = new redisClass();

//
//setInterval(function(){
//    redisCtrl.checkAccessTokenTTL(function(err, replay) {
//        if (err) {
//            console.error('ERROR checkAccessTokenTTL:' + err);
//        }
//        console.log('Redis replay checkAccessTokenTTL: ' + replay);
//    });
//    redisCtrl.checkRefreshTokenTTL(function(err, replay) {
//        if (err) {
//            console.error('ERROR checkRefreshTokenTTL:' + err);
//        }
//        console.log('Redis replay checkRefreshTokenTTL: ' + replay);
//    });
//},8000);

//redisCtrl.connect();
//var BoxClass = require('./boxCtrl');
//
//var boxCtrl = new BoxClass(redisCtrl);
//setTimeout(function() {
//    boxCtrl.getRootFolder(function(err, resp) {
////        console.log('getRootFolder response: ', resp);
//    });
//}, 5000);
//
//setTimeout(function() {
//    boxCtrl.uploadFile(streambuffer, function(err, resp) {
//        console.log('uploadFile response: ', resp);
//    });
//}, 15000);


console.log(process.env);