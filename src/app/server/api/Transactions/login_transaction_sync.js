var dbLoader = require('../Login/loginDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
var ElasticSearch = require('../../ping.js');
var ResponseManager = {};
module.exports = app;

app.get("/", function (req, res) {
    var response = {};
    var TransactionParam = {};
    var transactionUrl = appLoader.BASEURLSHORT + "postransaction/";

    dbLoader.POSTransactionDB.find().exec(function (err, data) {
        if(data!='undefined' && data!=null){
            data.forEach(function (key, val) {
                TransactionParam = {
                    "BusinessUnitID":key.BusinessUnitID,
                    "WorkstationID":key.WorkstationID,
                    "OperatorID":key.OperatorID,
                    "BeginDateTimestamp":key.BeginDateTimestamp,
                    "BusinessUnitGroupID":key.BusinessUnitGroupID,
                    "SequenceNumber":key.SequenceNumber
                };
                appLoader.CallDataFromServer("POST", transactionUrl, TransactionParam).then(function (TransactionResponse) {
                    //console.log(TransactionResponse);
                    if(TransactionResponse!=null && TransactionResponse!='undefined' && TransactionResponse.status==1){
                        TransactionParam = {};
                        dbLoader.POSTransactionDB.remove({_id:key._id}, function (err, deleted) {
                            console.log(deleted, 'Transactions synced.');
                            if ('BusinessUnitGroupReportinPeriod' in TransactionResponse.transaction_data){
                                ResponseManager = {};
                                if (TransactionResponse.transaction_data.BusinessUnitGroupReportinPeriod.id!=''){
                                    var MainTransactionID = TransactionResponse.transaction_data.BusinessUnitGroupReportinPeriod.id;
                                    localStorage.removeItem('MainTransaction');
                                    localStorage.removeItem('ReportingID');
                                    localStorage.setItem('MainTransaction','BusinessUnitGroupReporting');
                                    localStorage.setItem('ReportingID',MainTransactionID);
                                }
                                ResponseManager = {
                                    "status":1,
                                    "message":"Business Unit Group Reporting started & Period Open.",
                                    "transaction_info":TransactionResponse.transaction_data.BusinessUnitGroupReportinPeriod
                                };
                                var Parameters={
                                    "Transaction": "ControlTransaction",
                                    "TransactionType":"Period Open",
                                    "Request": {
                                        headers: req.headers,
                                        body: TransactionParam
                                    },
                                    "Response":ResponseManager
                                };
                                ElasticSearch.CallElasticSearchServer(Parameters);
                            }
                            if ('WorkstationReportingPeriod' in TransactionResponse.transaction_data){
                                ResponseManager = {};
                                var TransactionInfo = {};
                                if ('MainTransactionID' in TransactionResponse.transaction_data){
                                    var MainTransactionID = TransactionResponse.transaction_data.MainTransactionID;
                                    localStorage.removeItem('MainTransaction');
                                    localStorage.removeItem('ReportingID');
                                    localStorage.setItem('MainTransaction','BusinessUnitGroupReporting');
                                    localStorage.setItem('ReportingID',MainTransactionID);
                                }
                                if (TransactionResponse.transaction_data.WorkstationReportingPeriod.id!=''){
                                    var WSTNRP_ID = TransactionResponse.transaction_data.WorkstationReportingPeriod.id;
                                    var WSTNPSTXN_ID = TransactionResponse.transaction_data.WorkstationReportingPeriod.WorkstationStartTransactionData.TransactionData.id;
                                    localStorage.removeItem('WSTNRP_ID');
                                    localStorage.removeItem('WSTNPSTXN_ID');
                                    localStorage.setItem('WSTNRP_ID',WSTNRP_ID);
                                    localStorage.setItem('WSTNPSTXN_ID',WSTNPSTXN_ID);
                                    TransactionInfo = TransactionResponse.transaction_data.WorkstationReportingPeriod;
                                }
                                if('TimePunchTransactionData' in TransactionResponse.transaction_data){
                                    TransactionInfo.TimePunchTransactionData = TransactionResponse.transaction_data.TimePunchTransactionData; 
                                }    
                                ResponseManager = {
                                    "status":1,
                                    "message":"Workstation Reporting Period Started.",
                                    "transaction_info":TransactionInfo
                                };
                                var Parameters={
                                    "Transaction": "ControlTransaction",
                                    "TransactionType":"Workstation Period Start",
                                    "Request": {
                                        headers: req.headers,
                                        body: TransactionParam
                                    },
                                    "Response":ResponseManager
                                };
                                ElasticSearch.CallElasticSearchServer(Parameters);
                            }
                            if('password_authorization_transaction_data' in TransactionResponse){
                                var Parameters={
                                    "Transaction": "ControlTransaction",
                                    "TransactionType":"Password Authorization",
                                    "Request": {
                                        headers: req.headers,
                                        body: TransactionParam
                                    },
                                    "Response":TransactionResponse.password_authorization_transaction_data
                                };
                                ElasticSearch.CallElasticSearchServer(Parameters);
                            }
                        });
                    }else{
                        var Parameters={
                            "Transaction": "ControlTransaction",
                            "TransactionType":"Business SOD.",
                            "Request": {
                                headers: req.headers,
                                body: TransactionParam
                            },
                            "Response":TransactionResponse
                        };
                        ElasticSearch.CallElasticSearchServer(Parameters);
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            });


        }
    });
    response = {'status':1,'message':'synced successfully.'}
    res.send(response);
               
});

