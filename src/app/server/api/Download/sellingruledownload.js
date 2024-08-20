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
        url: appLoader.BASEURL + "sellingrule/",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': appLoader.TOKEN
        }
    }).done(function (response) {
        DataDownloadFromServer = response.result;
        noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': DataDownloadFromServer.length };
        res.send(noderesponse);
        if (DataDownloadFromServer.length > 0) {
            DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'SellingRules', 'Total': DataDownloadFromServer.length, 'Downloaded': DataDownloadFromServer.length });

            DataDownloadFromServer.forEach(function (key, val) {
                var _sellingRuleName = key.name;
                if (typeof (_sellingRuleName) != 'undefined') {
                    dbLoader.SellingRuleDB.find({ name: _sellingRuleName }, function (err, docs) {
                        if (docs.length === 0) {
                            //console.log('INSERT DOC');
                            dbLoader.SellingRuleDB.insert(key, function (err) { });
                        } else {
                            if ('id' in docs[0]) {
                                dbLoader.SellingRuleDB.remove({ id: docs[0].id }, { multi: true }, function (err, cb) {
                                    if (cb === 1) {
                                        dbLoader.SellingRuleDB.insert(key, function (err) { });
                                    } else {
                                        console.log('Sorry, something went wrong. Pls try again.');
                                    }
                                });
                            } else {
                                dbLoader.SellingRuleDB.remove({ _id: docs[0]._id }, function (err, cb) {
                                    if (cb === 1) {
                                        dbLoader.SellingRuleDB.insert(key, function (err) { });
                                    } else {
                                        console.log('Sorry, something went wrong. Pls try again.');
                                    }
                                });
                            }
                        }
                    });
                }
            });

        }
    });
});