var dbLoader = require('./loginDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
var ElasticSearch = require('../../ping.js');
module.exports = app;

app.get("/", function (req, res) {
    var response = {};
    var posLoggedData = JSON.parse(localStorage.getItem('LoggedInData'));
    if (typeof posLoggedData != 'undefined' && posLoggedData != null) {
        var POSLogoutParam = {
            "WorkstationID": posLoggedData.WorkstationID,
            "BusinessUnitID": posLoggedData.BusinessUnitID,
            "OperatorID": posLoggedData.OperatorID,
            "BusinessUnitGroupID": posLoggedData.BusinessGroupID,
            "WorskstationPeriodStartTransactionID": localStorage.getItem('WSTNPSTXN_ID'),
            "WorskstationReportingPeriodID": localStorage.getItem('WSTNRP_ID'),
            "BeginDateTimestamp": appLoader.getCurrentTimeStamp(),
            "SequenceNumber":appLoader.getSequenceNumber()
        };
        if (navigator.onLine == true) {
            var POSLogoutURL = appLoader.BASEURLSHORT + "poslogout-transaction/";
            appLoader.CallDataFromServer("POST", POSLogoutURL, POSLogoutParam).then(function (POSLogoutResponse) {
                if (POSLogoutResponse != null && POSLogoutResponse != 'undefined') {
                    var Parameters = {
                        "Transaction": "ControlTransaction",
                        "TransactionType": "Workstation Period End",
                        "Request": {
                            headers: req.headers,
                            body: POSLogoutParam
                        },
                        "Response": POSLogoutResponse
                    };
                    response = { "status": 1, "message": "Logged out successfully.","ElasticParameters": Parameters};
                    res.send(response);

                    //ElasticSearch.CallElasticSearchServer(Parameters);
                    //console.log('Success.');
                } else {
                    response = { "status": 0, "message": "Something went wrong."};
                    res.send(response);
                }
            }).catch(function (err) {
                //console.log('Fail.');
            });
        } else {
            console.log('Do Offline Transaction.');
        }
    }
});

