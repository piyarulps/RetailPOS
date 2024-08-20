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
    var dbLoader = require('../Vendors/vendordbloader.js');

    jQuery.ajax({
        type: "GET",
        dataType: "json",
        crossOrigin: false,
        crossDomain: false,
        url: appLoader.BASEURL + "organization-relations/",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': appLoader.TOKEN
        }
    }).done(function (response) {
        DataDownloadFromServer = response.result;
        DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'VendorRelatedDropdowns', 'Total': 1, 'Downloaded': 1 });

        noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': DataDownloadFromServer.length };
        res.send(noderesponse);
        dbLoader.VendorDropdowns.find({}, function (err, docs) {
            if (docs.length === 0) {
                dbLoader.VendorDropdowns.insert(DataDownloadFromServer, function (err) { });
            } else {
                return false;
            }
        });
    });
});