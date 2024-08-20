var app = require("express")();
var DataDownloadFromServer = [];
var ipinfo = localStorage.getItem('identifier');
var appLoader = require('../../app.js');
var DownloadeddbLoader = require('../Download/downloadedDBLoader.js');

module.exports = app;

app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');
    //console.log('ipinfo', ipinfo);

    //var moduleListFound =  req.body; 

    var noderesponse = {};
    var errCount = 0;

    // Brand data loading...
    var dbLoader = require('../Brands/barnddbLoader.js');

    var getURL = appLoader.BASEURL + "brands/?limit=0&IPADDRESS=" + ipinfo;
    appLoader.CallDataFromServer("GET", getURL, {}).then(function (response) {
        DataDownloadFromServer = response.result;
        if (DataDownloadFromServer.length > 0) {
            noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': DataDownloadFromServer.length };
            res.send(noderesponse);
            var promise1 = new Promise(function (resolve, reject) {
                var tempCount = 0;
                var TotolCount = response.RecordsCount;
                DataDownloadFromServer.forEach(function (key, val) {
                    var _brandName = key.BrandName;
                    var BrandServerID = key.id;
                    if (typeof (_brandName) != 'undefined') {
                        dbLoader.BrandDB.find({ id: BrandServerID }, function (err, docs) {
                            key["_myId"] = appLoader.getMyId(key.BrandName);
                            if (docs.length === 0) {
                                //console.log('INSERT DOC');
                                dbLoader.BrandDB.insert(key, function (err) { });
                                tempCount++;
                            } else {
                                dbLoader.BrandDB.update({ _myId: docs[0]._myId }, { $set: key }, function (err) {
                                    if (err) {
                                        errCount += 1;
                                    } else {
                                        //console.log('Updated.');
                                        tempCount++;
                                    }
                                });
                            }
                            if (TotolCount == tempCount) {
                                resolve(TotolCount);
                                DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'Brands', 'Total': TotolCount, 'Downloaded': tempCount });
                            }
                        });
                    }
                });
            });
            promise1.then(function (TotolCount) {
                console.log(TotolCount, ' Inserted.');
            });
        } else {
            DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'Brands', 'Total': 0, 'Downloaded': 0 });
            noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': 0 };
            res.send(noderesponse);
        }
    }).catch(function (err) {
        console.log(err);
    });

});