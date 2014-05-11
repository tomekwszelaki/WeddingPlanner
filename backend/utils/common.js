/**
 * Created by tomasj on 7/05/14.
 */
var winston = require('winston');
var mongo = require('./../utils/mongoCtrl');
var ObjectId = require('mongodb').ObjectID;
var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';

function generate(length) {
  length = length || 10;

  var string = '';

  for (var i = 0; i < length; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    string += chars.substring(randomNumber, randomNumber + 1);
  }

  return string;
}

function upsertUser(profile, callback) {
    console.log("%s: %j", "upsertUser request, body", profile, {});
    winston.debug("%s: %j", "upsertUser request, body:", profile, {});
    getUser({fb_id: profile.id}, function(err, data) {
        if (err) {
            console.error('there was an error: ', err);
            callback(err);
        }
        else {
            var user = profile;
            user.fb_id = profile.id;
            delete user.id;
            if (data == null) {
                user.is_admin = false;
                upsert(user, function(err, insertData) {
                    if (err) {
                        console.error('there was an error while inserting new user: ', err);
                        callback(err);
                    }
                    else {
                        console.log('insert', insertData);
                        callback(null, insertData);
                    }
                });
            }
            else {
                user._id = data._id;
                user.is_admin = data.is_admin;
                upsert(user, function(err, updateData) {
                    if (err) {
                        console.error('there was an error while updating an existing user: ', err);
                        callback(err);
                    }
                    else {
                        console.log('update', updateData);
                        console.log('data', data);
                        callback(null, data);
                    }
                });
            }
        }
    });
}

function getUser(doc, callback) {
    winston.debug("getUser mongo query");
    mongo.execute(mongo.methods.findOne, mongo.collections.users, null, doc, null, callback);
}

function upsert(user, callback) {
    winston.debug('create user mongo query');
    mongo.execute(mongo.methods.save, mongo.collections.users, null, user, null, callback);
}


module.exports.generateRandomString = generate;
module.exports.upsertUser = upsertUser;