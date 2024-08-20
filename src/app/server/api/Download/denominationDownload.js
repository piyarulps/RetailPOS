var app = require("express")();
var DataDownloadFromServer = [];
var appLoader = require('../../app.js');
var dbLoader = require('../Download/downloadedDBLoader.js');

module.exports = app;

app.get("/", function (req, res) {


    var noderesponse = {};
    var errCount = 0;

    // Brand data loading...

    var getURL = appLoader.BASEURLSHORT + "denomination-list/";
    appLoader.CallDataFromServer("GET", getURL, {}).then(function (response) {
        DataDownloadFromServer = response.result;
        if (DataDownloadFromServer.length > 0) {
            var TotolCount = DataDownloadFromServer.length;
            noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': DataDownloadFromServer.length };
            res.send(noderesponse);
            var promise1 = new Promise(function (resolve, reject) {
                var tempCount =0;
                DataDownloadFromServer.forEach(function (key, val) {
                    var denominationData = {};
                    dbLoader.DinominationDB.find({id: key.id}, function (err, docs) {
                        denominationData = {
                            "id":key.id,
                            "MonetaryValueAmount":parseFloat(key.MonetaryValueAmount),
                            "Description":key.Description,
                            "ISOCurrencyCode":key.ISOCurrencyCode
                        };
                        if (docs.length === 0) {
                            //console.log('INSERT DOC');
                            dbLoader.DinominationDB.insert(denominationData, function (err) { 
                                if(!err){
                                    tempCount++;
                                }
                            });
                        } else {
                            dbLoader.DinominationDB.update({ id: key.id }, { $set: denominationData }, function (err) {
                                if (err) {
                                    errCount += 1;
                                } else {
                                    tempCount++;
                                    console.log('Updated.');
                                }
                            });
                        }
                        if (TotolCount == tempCount) {
                            resolve(TotolCount);
                        }
                    });
                });
            });
            promise1.then(function (TotolCount) {
                console.log(TotolCount, ' Inserted.');
            });
        } else {
            noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': 0 };
            res.send(noderesponse);
        }
    }).catch(function (err) {
        console.log(err);
    });

});