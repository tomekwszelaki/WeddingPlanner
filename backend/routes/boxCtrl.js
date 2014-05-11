/**
 * Created by tomasj on 2/05/14.
 */

var config = require('../../config');
var request = require('request');
var async = require('async');
var fs = require('fs');
var path = require('path');
var redis = require('./../utils/redisCtrl');
redis.init();

function BoxCtrl() {
    this.clientId = config.box.clientId,
    this.clientSecret = config.box.clientSecret,
    this.callbackURL = config.box.callbackURL,
    this.contentApiURL = 'https://api.box.com/2.0/',
    this.uploadApiURL = 'https://upload.box.com/api/2.0/files/content',
    this.authApiURL = 'https://www.box.com/api/oauth2/token',
    this.weddingFolderId = 1891899051,
    this.headers = {
        Authorization: ''
    }
};

BoxCtrl.prototype._setAuthHeader = function(callback) {
    var self = this;
    redis.getAccessToken(function(err, replay) {
        if (err) {
            console.error(err);
        }
        else {
            self.headers.Authorization = 'Bearer ' + replay;
            if (callback) {
                console.log('_setAuthHeader caling callback with replay:', replay);
                callback(null, 'Token: ' + replay);
            }
        }
    });
};

BoxCtrl.prototype._refreshBoxTokens = function(currentRefreshToken, callback) {
    var self = this;
    var params = {
        grant_type: 'refresh_token',
        refresh_token: currentRefreshToken,
        client_id: config.box.clientId,
        client_secret: config.box.clientSecret
    }
    request.post(self.authApiURL, {form: params}, function(err, resp, body) {
        if (err) {
            console.error('BoxCtrl: refreshing tokens failed: ' + err + ' | ' + body);
        }
        else {
            var jsonBody = JSON.parse(body);
            async.parallel([
                function(callback) {
                    console.log('going to set access token to: ' + jsonBody.access_token);
                    redis.insertAccessToken(jsonBody.access_token, jsonBody.expires_in, function(err, resp) {
                        console.log(resp);
                        callback(err, resp);
                    });
                },
                function(callback) {
                    console.log('going to set refresh token to: ' + jsonBody.refresh_token);
                    redis.insertRefreshToken(jsonBody.refresh_token, function(err, resp) {
                        console.log(resp);
                        callback(err, resp);
                    });
                }
            ], function(err, results) {
                if (err) {
                    console.error(err);
                }
                callback(null, results);
            });
        }
    });
};

BoxCtrl.prototype._refreshAuthTokens = function(callback) {
    var self = this;
    redis.getRefreshToken(function(err, replay) {
        if (err) {
            console.error('BoxCtrl: unable to get refresh token')
        }
        else {
            self._refreshBoxTokens(replay, callback);
        }
    });
};

BoxCtrl.prototype.authenticate = function(callback) {
    var self = this;
    redis.checkAccessTokenTTL(function(err, replay) {
        if (err) {
            console.error('BoxCtrl: unable to check access token ttl!');
        }
        else {
            if (replay > 0) {
                console.log('token valid, setting header');
                self._setAuthHeader(callback);
            }
            else {
                console.log('token invalid, refreshing tokens');
                async.series([
                    function(callback) {
                        self._refreshAuthTokens(callback);
                    },
                    function(callback){
                        self._setAuthHeader(callback);
                    }
                ], function(err, results) {
                    if (err) {
                        console.error(err);
                    }
                    else if (callback) {
                        callback(null, results);
                    }
                });
            }
        }
    });
};

BoxCtrl.prototype.getRootFolder = function(callback) {
    var self = this;
    var options = {
        url: this.contentApiURL + 'folders/0',
        json: {},
        headers: this.headers
    }
    console.log('getRootFolder options: ', options);
    async.series({
        auth: function(callback) {
            self.authenticate(callback);
        },
        getRequest: function(callback) {
            request.get(options, function(err, resp, body) {
                if (err) {
                    console.error(err);
                }
                else {
                    callback(null, body);
                }
            });
        }
    }, function(err, results) {
        if (err) {
            console.error('getRootFolder error: ', err);
        }
        else {
            console.log('getRootFolder last callback, results: ', results.getRequest);
            callback(null, results.getRequest);
        }
    });
};

BoxCtrl.prototype.uploadFile = function(filePath, callback) {
    var self = this;
    var options = {
        url: self.uploadApiURL,
        headers: self.headers
    }
    async.series({
        auth: function(callback) {
            self.authenticate(callback);
        },
        upload: function(callback) {
            var r = request.post(options, function(err, resp, body) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log(resp.statusCode, body);
                    callback(null, body);
                }
            });
            var form = r.form();
            form.append('parent_id', self.weddingFolderId);
            form.append('filename', fs.createReadStream(filePath));
        },
        cleanup: function(callback) {
            fs.unlink(filePath, function (err) {
                if (err) {
                    callback(null, 'cleanup failed, but Heroku should do it anyways');
                }
                callback(null, 'Cleanup successful');
            });
        }
    }, function(err, results) {
        if (err) {
            console.error('uploadFile error: ', err);
        }
        else {
            console.log('uploadFile last callback, results: ', results);
            callback(null, results.upload);
        }
    });
};

module.exports = BoxCtrl