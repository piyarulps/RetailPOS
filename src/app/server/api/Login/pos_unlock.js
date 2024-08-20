var dbLoader = require('./loginDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
var ElasticSearch = require('../../ping.js');
var gm = require('getmac');
var mac = gm.default();
module.exports = app;

app.post("/", function (req, res) {
    var response = {};
    var MachineAddress = mac;
    var RequestData = req.body;
    var PASSWORD = RequestData.password;
    var posLockData = JSON.parse(localStorage.getItem('LoggedInData'));
    //console.log('posLockData', posLockData);
    //console.log('PASSWORD', PASSWORD)
    if (typeof posLockData != 'undefined' && posLockData != null) {
        var POSUNLockParam = {
            "WorkstationID": posLockData.WorkstationID,
            "BusinessUnitID": posLockData.BusinessUnitID,
            "OperatorID": posLockData.OperatorID,
            "BusinessUnitGroupID": posLockData.BusinessGroupID,
            "POSLOCKTransactionID": localStorage.getItem('POSLOCKTransactionID'),
            "BeginDateTimestamp": appLoader.getCurrentTimeStamp(),
            "SequenceNumber":appLoader.getSequenceNumber()
        };
        if (navigator.onLine == true) {
            dbLoader.OperatorLoginDB.find({ userid: posLockData.userid, Password: PASSWORD, DeviceAddress: MachineAddress }).exec(function (err, data) {
                if (data.length > 0 && data != null && data != 'undefined') {
                    var posUNLockUrl = appLoader.BASEURLSHORT + "posunlock-transaction/";
                    appLoader.CallDataFromServer("POST", posUNLockUrl, POSUNLockParam).then(function (POSUNLockResponse) {
                        if (POSUNLockResponse != null && POSUNLockResponse != 'undefined') {
                            //console.log('POSUNLockResponse', POSUNLockResponse);
                            var Parameters = {
                                "Transaction": "ControlTransaction",
                                "TransactionType": "POS UNLOCK",
                                "Request": {
                                    headers: req.headers,
                                    body: POSUNLockParam
                                },
                                "Response": POSUNLockResponse
                            };
                            ElasticSearch.CallElasticSearchServer(Parameters);
                            //console.log(Parameters);
                            //console.log('Success.');
                        } else {
                            console.log('Oops! Something went wrong..');
                        }
                    }).catch(function (err) {
                        //console.log('Fail.');
                    });
                    response = { "status": 1, "message": "Unlocked successfully." };
                    res.send(response);
                } else {
                    response = { 'status': 0, 'message': 'Sorry, your password is incorrect.', 'result': {} };
                    res.send(response);
                }
            });
        } else {
            //console.log('Do Offline Transaction.');
            dbLoader.OperatorLoginDB.find({ userid: posLockData.userid, Password: PASSWORD, DeviceAddress: MachineAddress }).exec(function (err, data) {
                if (data.length > 0 && data != null && data != 'undefined') {
                    if (POSUNLockParam!=null && POSUNLockParam!='undefined'){
                        dbLoader.POSUnlockDB.insert(POSUNLockParam, function (err, docs) {
                            if(docs!=null && docs!='undefined'){
                                console.log('POS UnLock Saved.');
                            }
                        });
                        response = { "status": 1, "message": "Unlocked successfully." };
                        res.send(response);
                    }else{
                        response = { "status": 0, "message": "Inavalid Parameters." };
                        res.send(response);
                    }
                }else{
                    response = { 'status': 0, 'message': 'Sorry, your password is incorrect.', 'result': {} };
                    res.send(response);
                }
            });

        }
    }
});

