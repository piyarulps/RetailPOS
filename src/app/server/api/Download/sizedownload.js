var app = require("express")();
var DataFromServer = [];
var ipinfo = localStorage.getItem('identifier');
var appLoader = require('../../app.js');
var DownloadeddbLoader = require('../Download/downloadedDBLoader.js');

module.exports = app;

app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');
    //console.log('ipinfo', ipinfo);

    //var moduleListFound =  req.body; 

    var noderesponse = {};


    // Brand data loading...
    var dbLoader = require('../Sizes/sizedbLoader.js');

    var getURL = appLoader.BASEURL + "sizes/?limit=0&IPADDRESS=" + ipinfo;
    appLoader.CallDataFromServer("GET", getURL, {}).then(function (response) {

        DataFromServer = response.result;
        if (DataFromServer.length > 0) {
            noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': DataFromServer.length };
            res.send(noderesponse);

            var promise1 = new Promise(function (resolve, reject) {
                var tempCount = 0;
                var TotolCount = response.RecordsCount;
                DataFromServer.forEach(function (key, val) {
                    var _sizeName = key.TableName;
                    if (typeof (_sizeName) != 'undefined') {
                        dbLoader.ListDB.find({ TableName: _sizeName }, function (err, docs) {
                            key["_myId"] = appLoader.getMyId(key.TableName);
                            if (docs.length === 0) {
                                //console.log('INSERT DOC');
                                dbLoader.ListDB.insert(key, function (err) { });
                                tempCount++;
                            } else {
                                if ('id' in docs[0]) {
                                    dbLoader.ListDB.remove({ _myId: docs[0]._myId }, { multi: true }, function (err, cb) {
                                        if (cb === 1) {
                                            dbLoader.ListDB.insert(key, function (err) { });
                                            tempCount++;
                                        } else {
                                            console.log('Sorry, something went wrong. Pls try again.');
                                        }
                                    });
                                } else {
                                    dbLoader.ListDB.remove({ _myId: docs[0]._myId }, function (err, cb) {
                                        if (cb === 1) {
                                            dbLoader.ListDB.insert(key, function (err) { });
                                            tempCount++;
                                        } else {
                                            console.log('Sorry, something went wrong. Pls try again.');
                                        }
                                    });
                                }
                            }
                            if (TotolCount == tempCount) {
                                resolve(TotolCount);
                                DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'Sizes', 'Total': TotolCount, 'Downloaded': tempCount });

                            }
                        });
                    }
                });
            });
            promise1.then(function (TotolCount) {
                console.log(TotolCount, ' Inserted.');
            });
        } else {
            DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'Sizes', 'Total': 0, 'Downloaded': 0 });
            noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': 0 };
            res.send(noderesponse);
        }


    }).catch(function (err) {
        console.log(err);
    });


});