var dbLoader = require('./loginDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
module.exports = app;

app.get("/", function (req, res) {
    var response = {};
    var posLoggedData = JSON.parse(localStorage.getItem('LoggedInData'));
    var SignOnID = localStorage.getItem('SIGN_ON_ID');
    if (typeof posLoggedData != 'undefined' && posLoggedData != null) {
        var POSSignOffParam = {
            "SignOnID":SignOnID,
            "WorkstationID": posLoggedData.WorkstationID,
            "BusinessUnitID": posLoggedData.BusinessUnitID,
            "OperatorID": posLoggedData.OperatorID,
            "BusinessUnitGroupID": posLoggedData.BusinessGroupID,
            "EndDateTimestamp": appLoader.getCurrentTimeStamp(),
            "SequenceNumber":appLoader.getSequenceNumber()
        };

        if(SignOnID!=null && SignOnID!='undefined'){
            if (POSSignOffParam!=null && POSSignOffParam!='undefined'){
                dbLoader.OperatorSignOffDB.insert(POSSignOffParam, function (err, docs) {
                    if(docs!=null && docs!='undefined'){
                        localStorage.removeItem('SIGN_ON_ID');
                        console.log('POS SignOff Data Saved.');
                        response = { "status": 1, "message": "SignOff Transaction Done." };
                        res.send(response);
                    }
                });
            }else{
                response = { "status": 0, "message": "Inavalid Parameters." };
                res.send(response);
            }
        }else{
            response = { "status": 0, "message": "There was no sign on transaction started." };
            res.send(response);
        }
    }
});

