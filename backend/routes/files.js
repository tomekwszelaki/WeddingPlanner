/**
 * Created by tomasj on 24/04/14.
 */

var winston = require('winston');
var mongo = require('./../utils/mongoCtrl');
var ObjectId = require('mongodb').ObjectID;
var BoxClass = require('./boxCtrl');
var boxCtrl = new BoxClass();
var formidable = require('formidable');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;
var common = require('../utils/common');

function uploadFile(req, res) {
//    winston.debug("%s: %j", "uploadFile request, body:", req.body, {});
    var form = new formidable.IncomingForm();
    var file = null;
    form.onPart = function(part) {
        var self = this;
        var decoder = new StringDecoder(this.encoding);
        var value = '';
        if (part.name == 'flowFilename') {
            part.on('data', function(buffer) {
                value += decoder.write(buffer);
            });
            part.on('end', function() {
                self.emit('field', part.name, value);
                file = fs.createWriteStream('./tmp/' + common.generateRandomString(5) + value);
            });
        }
        else if (!part.filename) {
            // let formidable handle all non-file parts
            form.handlePart(part);
        }
        else {
          this.emit('fileBegin', part.name, file);

          part.on('data', function(buffer) {
            if (buffer.length == 0) {
              return;
            }
            self.pause();
            file.write(buffer, function() {
              self.resume();
            });
          });

          part.on('end', function() {
            file.end(function() {
              self.emit('file', part.name, file);
              self._maybeEnd();
            });
          });
        }
    }

    form.parse(req, function(err, fields, files) {
        if (files.file) {
            boxCtrl.uploadFile(files.file.path, function(err, results) {
                if (err) {
                    res.send(500, err);
                }
                else {
                    res.send(200, 'OK');
                }
            });
        }
        else {
            res.send(400, 'file not sent');
        }
    });
};

function options(req, res) {
    res.set('Accept', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'content-type');
    res.send(200);
}

function setup(app) {
    app.post('/files', uploadFile);
    app.options('/files', options);
}

module.exports = setup