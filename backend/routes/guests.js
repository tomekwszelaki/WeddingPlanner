/**
 * Created by tomasj on 24/04/14.
 */

var winston = require('winston');
var mongo = require('./../utils/mongoCtrl');
var ObjectId = require('mongodb').ObjectID;
var middleware = require('./../utils/middleware');

function addGuest(req, res) {
    console.log("%s: %j", "addGuest request, body", req.body, {});
    winston.debug("%s: %j", "addGuest request, body:", req.body, {});
    mongo.execute(mongo.methods.insert, mongo.collections.guests, null, req.body, null, function(err, data) {
        if (err) {
            console.error(err)
        }
        console.log({id: data[0]._id, name: data[0].name});
        res.set('Content-Type', 'application/json');
        res.set('Access-Control-Allow-Origin', '*');
        res.send(200, {id: data[0]._id, name: data[0].name});
    });
}

function modifyGuest(req, res) {
    console.log("%s: %j", "modifyGuest request, body:", req.body, {})
    winston.debug("%s: %j", "modifyGuest request, body:", req.body, {});
    var doc = req.body;
    delete doc._id;
    mongo.execute(mongo.methods.update, mongo.collections.guests, {_id: ObjectId(req.params.id)}, {$set: doc}, {upsert: false}, function(err, data) {
        if (err) {
            console.error(err)
        }
        res.set('Content-Type', 'application/json');
        res.set('Access-Control-Allow-Origin', '*');
        res.send(200, {'status': 'OK'});
    });
}

function getGuests(req, res) {
    winston.debug("getGuests request");
    mongo.execute(mongo.methods.find, mongo.collections.guests, null, {}, null, function(err, data) {
        if (err) {
            throw err
        }
        res.set('Content-Type', 'application/json');
        res.set('Access-Control-Allow-Origin', '*');
        res.send(200, data);
    });
}

function options(req, res) {
    res.set('Accept', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.send(200);
}

function setup(app) {
    app.get('/guests', middleware.ensureUserIsAdmin, getGuests);
    app.post('/guests', middleware.ensureUserIsAdmin, addGuest);
    app.options('/guests', options);
    app.put('/guests/:id', middleware.ensureUserIsAdmin, modifyGuest);
    app.options('/guests/:id', options);
}

module.exports = setup