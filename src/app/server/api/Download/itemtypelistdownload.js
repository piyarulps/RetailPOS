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
        url: appLoader.BASEURL + "item_type_list/",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': appLoader.TOKEN
        }
    }).done(function (response) {
        DataDownloadFromServer = response.result;
        noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': DataDownloadFromServer.length };
        res.send(noderesponse);
        if (DataDownloadFromServer.length > 0) {
            DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'ItemTypeLists', 'Total': DataDownloadFromServer.length, 'Downloaded': DataDownloadFromServer.length });

            DataDownloadFromServer.forEach(function (key, val) {
                var _ItemTypeID = key.id;
                if (typeof (_ItemTypeID) != 'undefined') {
                    dbLoader.ItemTypeListDB.find({ id: _ItemTypeID }, function (err, docs) {
                        if (docs.length === 0) {
                            dbLoader.ItemTypeListDB.insert(key, function (err) { });
                        } else {
                            return false;
                        }
                    });
                }
            });

        }
    });
});