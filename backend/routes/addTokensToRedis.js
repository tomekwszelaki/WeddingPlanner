/**
 * Created by tomasj on 3/05/14.
 */

var RedisClass = require('./../utils/redisCtrl');

//Code below can be used to manually upload access and refresh tokens, in case the system fails to refresh them on time

var ctrl = new RedisClass();
ctrl.connect();

var manualResp = {
    access_token: 'AcYukLMOk5sZsPWTZLfnfaCIpRSIx94o',
    expires_in: 60,
    restricted_to: [],
    refresh_token: 'OrUif5fd3AZEoeqLcpFTXDtIBocR9FugxsZEafw8omj8igpH3p0eX1Hirid0ZYRb',
    token_type: 'bearer'
};
//
//setTimeout(function(){
//    ctrl.insertAccessToken(manualResp.access_token, manualResp.expires_in, function(err, replay) {
//        if (err) {
//            console.error(err);
//        }
//        console.log(replay);
//    });
//    ctrl.insertRefreshToken(manualResp.refresh_token, function(err, replay) {
//        if (err) {
//            console.error(err);
//        }
//        console.log(replay);
//    })
//},5000);

setTimeout(function(){
    ctrl.getAccessToken(function(err, replay) {
        if (err) {
            console.error(err);
        }
        console.log(replay);
    });
    ctrl.getRefreshToken(function(err, replay) {
        if (err) {
            console.error(err);
        }
        console.log(replay);
    })
},5000);
//
//setInterval(function(){
//    ctrl.checkAccessTokenTTL(function(err, replay) {
//        if (err) {
//            console.error('ERROR checkAccessTokenTTL:' + err);
//        }
//        console.log('Redis replay checkAccessTokenTTL: ' + replay);
//    });
//    ctrl.checkRefreshTokenTTL(function(err, replay) {
//        if (err) {
//            console.error('ERROR checkRefreshTokenTTL:' + err);
//        }
//        console.log('Redis replay checkRefreshTokenTTL: ' + replay);
//    });
//},8000);