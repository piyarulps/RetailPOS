var dbLoader = require('./shareDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
var ipinfo = localStorage.getItem('identifier');

module.exports = app;

app.post("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');
    var response = {};
    var LastSyncData = req.body;
    var ParamConfig = {
        "ipinfo": ipinfo,
        "ModuleName": LastSyncData.ModuleName,
        "LastSyncTime": appLoader.getCurrentTimeStamp()
    };
    dbLoader.LastSyncDB.insert(ParamConfig, function (err) {
        if (!err) {
            response = { 'status': 1, 'message': "Data saved to local." }
            res.json(response);
        }
    });
});
