var dbLoader = require('./loginDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
var ElasticSearch = require('../../ping.js');

module.exports = app;

app.get("/", function (req, res) {
    var response = {};
    var posLockData = JSON.parse(localStorage.getItem('LoggedInData'));
    //console.log('test',posLockData);
    if (typeof posLockData != 'undefined' && posLockData != null) {
        var POSLockParam = {
            "WorkstationID": posLockData.WorkstationID,
            "BusinessUnitID": posLockData.BusinessUnitID,
            "OperatorID": posLockData.OperatorID,
            "BusinessUnitGroupID": posLockData.BusinessGroupID,
            "BeginDateTimestamp": appLoader.getCurrentTimeStamp(),
            "SequenceNumber":appLoader.getSequenceNumber()
        };
        if (navigator.onLine == true) {
            var posLockUrl = appLoader.BASEURLSHORT + "poslock-transaction/";
            appLoader.CallDataFromServer("POST", posLockUrl, POSLockParam).then(function (POSLockResponse) {
                if (POSLockResponse != null && POSLockResponse != 'undefined') {
                    localStorage.removeItem('POSLOCKTransactionID');
                    localStorage.setItem('POSLOCKTransactionID', POSLockResponse.transaction_data[0].id);
                    //console.log('POSLockResponse1',POSLockResponse);
                    var Parameters = {
                        "Transaction": "ControlTransaction",
                        "TransactionType": "POS LOCK",
                        "Request": {
                            headers: req.headers,
                            body: POSLockParam
                        },
                        //"Request": POSLockParam,
                        "Response": POSLockResponse
                    };
                    ElasticSearch.CallElasticSearchServer(Parameters);
                    //console.log(Parameters);
                    //console.log('Success.');
                } else {
                    console.log('Oops! Something went wrong..');
                }
                res.send(response);
            }).catch(function (err) {
                //console.log('Fail.');
            });
        } else {
            //console.log('Do Offline Transaction.');
            if (POSLockParam!=null && POSLockParam!='undefined'){
                dbLoader.POSLockDB.insert(POSLockParam, function (err, docs){
                    if(docs!=null && docs!='undefined'){
                        localStorage.removeItem('POSLOCKTransactionID');
                        localStorage.setItem('POSLOCKTransactionID', docs._id);
                        console.log('POS Lock Saved.');
                    }
                });
                response = {'status':1,'message':'POSLock offline transaction done.'};
                res.send(response);
            }else{
                response = { 'status': 0, 'message': 'Invalid parameters.', 'result': {} };
                res.send(response);
            }
        }
    }
});

