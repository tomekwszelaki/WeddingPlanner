/**
 * Created by tomasj on 10/05/14.
 */

var winston = require('winston');
var mongo = require('./../utils/mongoCtrl');
var ObjectId = require('mongodb').ObjectID;


function upsertUser(req, res) {
    console.log("%s: %j", "upsertUser request, body", req.body, {});
    winston.debug("%s: %j", "upsertUser request, body:", req.body, {});
    getUser({fb_id: req.body.id}, function(err, data) {
        if (err) {
            console.error('there was an error: ', err);
            res.send(404, err);
        }
        else {
            var user = req.body;
            user.fb_id = req.body.id;
            delete user.id;
            user.is_admin = false;
            if (data == null) {
                upsert(user, function(err, insertData) {
                    if (err) {
                        console.error('there was an error while inserting new user: ', err);
                        res.send(500, err);
                    }
                    else {
                        console.log('insert', insertData);
                        res.send(200, insertData);
                    }
                });
            }
            else {
                user._id = data._id;
                upsert(user, function(err, updateData) {
                    if (err) {
                        console.error('there was an error while updating an existing user: ', err);
                        res.send(500, err);
                    }
                    else {
                        console.log('update', updateData);
                        console.log('data', data);
                        res.send(200, data);
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

function options(req, res) {
    res.set('Accept', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.send(200);
}

function setup(app) {
    app.post('/users', upsertUser);
    app.options('/users', options);
}

module.exports = setup