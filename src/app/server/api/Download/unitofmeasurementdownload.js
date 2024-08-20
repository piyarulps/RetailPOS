var app = require("express")();
var jQuery = require('jquery');
var DataDownloadFromServer = [];
var ipinfo = localStorage.getItem('identifier');
var appLoader = require('../../app.js');
var DownloadeddbLoader = require('../Download/downloadedDBLoader.js');

module.exports = app;

app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');
    var noderesponse = {};
    var dbLoader = require('../Items/itemdbLoader.js');

    jQuery.ajax({
        type: "GET",
        dataType: "json",
        crossOrigin: false,
        crossDomain: false,
        url: appLoader.BASEURL + "uomlist/?colname=UOMName&/",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': appLoader.TOKEN
        }
    }).done(function (response) {
        DataDownloadFromServer = response.result;
        noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': DataDownloadFromServer.length };
        res.send(noderesponse);
        if (DataDownloadFromServer.length > 0) {
            DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'UnitOfMeasurements', 'Total': DataDownloadFromServer.length, 'Downloaded': DataDownloadFromServer.length });

            DataDownloadFromServer.forEach(function (key, val) {
                var _retailPackageSize = key.text;
                if (typeof (_retailPackageSize) != 'undefined') {
                    dbLoader.RetailPackageSizeDB.find({ text: _retailPackageSize }, function (err, docs) {
                        if (docs.length === 0) {
                            dbLoader.RetailPackageSizeDB.insert(key, function (err) { });
                        } else {
                            return false;
                        }
                    });
                }
            });

        }
    });
});