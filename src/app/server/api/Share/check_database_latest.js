var dbLoader = require('./shareDBLoader.js');
var appLoader = require('../../app.js');
var app = require("express")();
module.exports = app;

app.get("/", function (req, res) {
    var response = {};
    dbLoader.LatestDataCheckDB.find({IsDownloaded:1}).exec(function (err, data) {
        if(data.length === 0 ){
            response = { 'status': 0};
			res.send(response);
        }else{
            response = { 'status': 1,'last_download':data[0].last_download};
			res.send(response);
        }
    });

});

app.post("/", function (req, res) {
    var response = {};
    dbLoader.LatestDataCheckDB.insert({'IsDownloaded':1,'last_download':appLoader.getCurrentTimeStamp()}, function (err, docs) {
        if(docs!=null && docs !='undefined'){
            response = { 'status': 1};
            res.setHeader('content-type', 'text/javascript');
            res.json(response);
        }else{
            response = { 'status': 0};
            res.setHeader('content-type', 'text/javascript');
            res.json(response);
        }
    });
});