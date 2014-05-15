/**
 * Created by tomasj on 24/04/14.
 */

var winston = require('winston');
var mongo = require('./../utils/mongoCtrl');
var ObjectId = require('mongodb').ObjectID;
var middleware = require('./../utils/middleware');
var common = require('./../utils/common');

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

function _getSurname(guest) {
    var nameParts = guest.name.split(' ');
    return nameParts[nameParts.length - 1];
}

function _getUsersAsData(doc, options, res) {
    console.log("_getUsersAsData request");
    mongo.execute(mongo.methods.find, mongo.collections.guests, null, doc, options, function(err, data) {
        if (err) {
            throw err
        }
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send(200, data);
    });
}

function _getUsersAsCSVFile(doc, options, res) {
    console.log("_getUsersAsCSVFile request");
    mongo.execute(mongo.methods.find, mongo.collections.guests, null, doc, options, function(err, data) {
        if (err) {
            throw err
        }
        var content = '';
        var noOfColumns = 2;
        data.sort(function(guest1, guest2) {
            return _getSurname(guest1).localeCompare(_getSurname(guest2));
        })
        data.forEach(function(guest) {
            content += common.padString(guest.name, 35);
            noOfColumns--;
            if (noOfColumns == 0) {
                content += '\n';
                noOfColumns = 2;
            }
        });
        var filename = 'Kocham Cie - lista gosci.doc';
        res.setHeader('content-type', 'application/octet-stream;charset=utf-8');
        res.setHeader('content-disposition', 'attachment; filename=' + filename);
        res.send(content, 200);
        });
}

function getGuests(req, res) {
    console.log('getUsers: query:', req.query);
    var doc = {};
    var options = {};
    if (req.query.file == 'true') {
        doc.confirmed = 'Tak, przyjedzie';
        options.name = true;
//        options.confirmed = true;
        _getUsersAsCSVFile(doc, options, res);
    }
    else {
        _getUsersAsData(doc, options, res);
    }
}

function options(req, res) {
    res.set('Accept', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.send(200);
}

function setup(app) {
    app.get('/guests', getGuests);
    app.post('/guests', middleware.ensureUserIsAdmin, addGuest);
    app.options('/guests', options);
    app.put('/guests/:id', middleware.ensureUserIsAdmin, modifyGuest);
    app.options('/guests/:id', options);
}

module.exports = setup