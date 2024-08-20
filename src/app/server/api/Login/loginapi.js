var dbLoader = require('./loginDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
var gm = require('getmac');
var mac = gm.default();
var ElasticSearch = require('../../ping.js');
var ResponseManager = {};
module.exports = app;

app.post("/", function (req, res) {
    var response = {};
    if(mac!='') {
        //console.log(navigator.onLine);
        var MachineAddress = mac;
        var loginData = req.body;
        if(typeof loginData!='undefined' && loginData!=null){
            var LoginParam = {
                "userid":loginData.UserId,
                "DeviceAddress":MachineAddress,
                "accessPassword":loginData.AccessPassword
            };
            if(navigator.onLine==true){
                var LoginDataSave={};
                console.log(LoginParam)
                var loginUrl=appLoader.BASEURLSHORT + "loginapi/";
                appLoader.CallDataFromServer("POST", loginUrl, LoginParam).then(function (loginResponse) {
                    if(loginResponse.status==1){
                        //Store local database.
                        localStorage.removeItem('BUSINESS_GROUP_ID');
                        localStorage.setItem('BUSINESS_GROUP_ID',loginResponse.business_group[0].group_id[0]);
                        var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');
                        console.log('BusinessGroupID',BusinessGroupID);
                        //console.log('BusinessGroupID',BusinessGroupID);

                        LoginDataSave={
                            "userid":loginData.UserId,
                            "Password":loginData.AccessPassword,
                            "DeviceAddress":MachineAddress,
                            "BusinessUnitID":loginResponse.businessuits[0],
                            "BusinessGroupID":loginResponse.business_group[0].group_id[0],
                            "WorkstationID":loginResponse.workstationid,
                            "OperatorID":loginResponse.operatorid,
                            "WorkerID":loginResponse.workerid,
                            "WorkerImage":appLoader.ServerImageFolder+loginResponse.workerimage,
                            "token":loginResponse.token,
                            "LocationName":loginResponse.location_name

                        };
                        if(LoginDataSave!='undefined' && LoginDataSave!=null){
                            localStorage.removeItem('LoggedInData');
                            localStorage.setItem('LoggedInData',JSON.stringify(LoginDataSave));
                            dbLoader.OperatorLoginDB.find({userid:loginData.UserId,OperatorID:loginResponse.operatorid}).exec(function (err, data) {
                                if(data.length > 0 && data!=null && data!='undefined'){
                                    dbLoader.OperatorLoginDB.update({ _id: data[0]._id }, { $set: LoginDataSave }, function (err, cb) {});
                                }else{
                                    dbLoader.OperatorLoginDB.insert(LoginDataSave);
                                }
                            });
                        }
                        // Control transaction start.
                        // Password Authorization transaction.
                        var TransactionParam = {
                            "BusinessUnitID":loginResponse.businessuits[0],
                            "WorkstationID":loginResponse.workstationid,
                            "OperatorID":loginResponse.operatorid,
                            "BeginDateTimestamp":appLoader.getCurrentTimeStamp(),
                            "BusinessUnitGroupID":loginResponse.business_group[0].group_id[0],
                            "SequenceNumber":appLoader.getSequenceNumber()
                        };
                        //console.log('Request Control Transaction',TransactionParam);
                        var transactionUrl = appLoader.BASEURLSHORT + "postransaction/";
                        appLoader.CallDataFromServer("POST", transactionUrl, TransactionParam).then(function (TransactionResponse) {
                            //console.log(TransactionResponse);
                            if(TransactionResponse!=null && TransactionResponse!='undefined' && TransactionResponse.status==1){
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
                                    if(TransactionResponse.password_authorization_transaction_data.status == 2){
                                        response = {'status':2,'message':'Your password has been expired. please change your password.'};   
                                    }
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
                        response=loginResponse;
                        res.send(response);
                    }else{
                        response=loginResponse;
                        res.send(response);
                    }

                }).catch(function (err) {
                    console.log(err);
                    response = { 'status': 0, 'message': 'Oops! something wrong.', 'result': err };
                    res.send(response);
                });  
            }else{
                console.log('false');
                dbLoader.OperatorLoginDB.find({userid:loginData.UserId,Password:loginData.AccessPassword,DeviceAddress:MachineAddress}).exec(function (err, data) {
                    if(data.length > 0 && data!=null && data!='undefined'){
                        response={
                            "userid":loginData.UserId,
                            "DeviceAddress":MachineAddress,
                            "BusinessUnitID":data[0].BusinessUnitID,
                            "WorkstationID":data[0].WorkstationID,
                            "OperatorID":data[0].OperatorID,
                            "WorkerID":data[0].WorkerID,
                            "token":data[0].token,
                            "LocationName":data[0].LocationName,
                            "status":1
                        };

                        localStorage.removeItem('LoggedInData');
                        localStorage.setItem('LoggedInData',JSON.stringify(response));
                        //Business unit group reporting param.
                        var TransactionParam = {
                            "BusinessUnitID":data[0].BusinessUnitID,
                            "WorkstationID":data[0].WorkstationID,
                            "OperatorID":data[0].OperatorID,
                            "BeginDateTimestamp":appLoader.getCurrentTimeStamp(),
                            "BusinessUnitGroupID":data[0].BusinessGroupID,
                            "SequenceNumber":appLoader.getSequenceNumber()
                        };
                        dbLoader.POSTransactionDB.insert(TransactionParam, function (err, docs) {
                            if(docs!=null && docs!='undefined'){
                                console.log('POS Transaction Saved.');
                            }
                        });
                        res.send(response);
                    }else{
                        response = { 'status': 0, 'message': 'Invalid Login.', 'result': {} };
                        res.send(response);
                    }
                });
            }
        }
    }
});

