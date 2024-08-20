var dbLoader = require('./loginDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
var ElasticSearch = require('../../ping.js');

module.exports = app;

app.get("/", function (req, res) {
    var response = {};

    if (navigator.onLine == true) {
        dbLoader.OperatorSignOnDB.find({IsSynced:0}).exec(function (err, data) {
            if(data!='undefined' && data!=null){
                var COUNT = 0 ;
                data.forEach(function (key, val) {
                    var LocalSignOnParam = {
                        "defaultBalance":key.defaultBalance,
                        "WorkstationID": key.WorkstationID,
                        "BusinessUnitID": key.BusinessUnitID,
                        "OperatorID": key.OperatorID,
                        "BusinessUnitGroupID": key.BusinessUnitGroupID,
                        "BeginDateTimestamp": key.BeginDateTimestamp,
                        "SequenceNumber":key.SequenceNumber,
                        "TILL_ID":key.tillID
                    };
                    var signOnTransactionUrl = appLoader.BASEURLSHORT + "signon-transaction/";
                    appLoader.CallDataFromServer("POST", signOnTransactionUrl, LocalSignOnParam).then(function (SignOnTransactionResponse) {
                        if(SignOnTransactionResponse!=null && SignOnTransactionResponse!='undefined' && SignOnTransactionResponse.transaction_data!='undefined'){
                            if(SignOnTransactionResponse.transaction_data.TillID!='' && SignOnTransactionResponse.transaction_data.TillID!='undefined'){
                                var TILLID = SignOnTransactionResponse.transaction_data.TillID;
                                var POSTMTParam = {
                                    "Enterprise":"Safe",
                                    "MovementDirectionCode":"SW",
                                    "TillID":TILLID,
                                    "WorkstationID": posLoggedData.WorkstationID,
                                    "BusinessUnitID": posLoggedData.BusinessUnitID,
                                    "OperatorID": posLoggedData.OperatorID,
                                    "BusinessUnitGroupID": posLoggedData.BusinessGroupID,
                                    "BeginDateTimestamp": appLoader.getCurrentTimeStamp(),
                                    "SequenceNumber":appLoader.getSequenceNumber()
                                };
                                var TMTransactionUrl = appLoader.BASEURLSHORT + "till-movement-transaction/";
                                appLoader.CallDataFromServer("POST", TMTransactionUrl, POSTMTParam).then(function (TillMovementTransactionResponse) {
                                    if (TillMovementTransactionResponse!='undefined' && TillMovementTransactionResponse!=null){
                                        var TillMovementParameters={
                                            "Transaction":"ControlTransaction",
                                            "TransactionType": "Till Movement Transaction",
                                            "Request": {
                                                headers: req.headers,
                                                body: POSTMTParam
                                            },
                                            "Response":TillMovementTransactionResponse
                                        };
                                        ElasticSearch.CallElasticSearchServer(TillMovementParameters);
                                    }
            
                                }).catch(function (err) {
                                    console.log(err);
                                });
                            }
                            // console.log(SignOnTransactionResponse);
                            var Parameters={
                                "Transaction":"ControlTransaction",
                                "TransactionType": "Sign On",
                                "Request": {
                                    headers: req.headers,
                                    body: POSSignOnParam
                                },
                                "Response":SignOnTransactionResponse
                            };
                            ElasticSearch.CallElasticSearchServer(Parameters);
                            LocalSignOnParam.IsSynced = 1;
                            dbLoader.OperatorSignOnDB.update({ _id :key._id }, { $set: LocalSignOnParam }, function (err, updated) {
                                if(!err){
                                    COUNT++;
                                }
                                if(COUNT == data.length){
                                    response = { 'status': 1, 'message': 'SignOn transaction synced.'};
                                    res.send(response);
                                }
                            });
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
               });
            }else{
                response = { 'status': 1, 'message': 'No transaction is present.'};
                res.send(response);
            }
        });
    }
});



app.post("/", function (req, res) {
    var response = {};
    var RequestData = req.body;
    var defaultBalance = RequestData.default_balance;
    var posLoggedData = JSON.parse(localStorage.getItem('LoggedInData'));
    if (typeof posLoggedData != 'undefined' && posLoggedData != null) {
        var POSSignOnParam = {
            "defaultBalance":defaultBalance,
            "WorkstationID": posLoggedData.WorkstationID,
            "BusinessUnitID": posLoggedData.BusinessUnitID,
            "OperatorID": posLoggedData.OperatorID,
            "BusinessUnitGroupID": posLoggedData.BusinessGroupID,
            "BeginDateTimestamp": appLoader.getCurrentTimeStamp(),
            "SequenceNumber":appLoader.getSequenceNumber()
        };
        dbLoader.SignOnMasterDB.find({OperatorID:posLoggedData.OperatorID,WorkstationID:posLoggedData.WorkstationID}).exec(function (err, data) {
            if (data.length === 0 && navigator.onLine == true){
                var signOnTransactionUrl = appLoader.BASEURLSHORT + "signon-transaction/";
                appLoader.CallDataFromServer("POST", signOnTransactionUrl, POSSignOnParam).then(function (SignOnTransactionResponse) {
                    if(SignOnTransactionResponse!=null && SignOnTransactionResponse!='undefined' && SignOnTransactionResponse.transaction_data!='undefined'){
                        if(SignOnTransactionResponse.transaction_data.TillID!='' && SignOnTransactionResponse.transaction_data.TillID!='undefined'){
                            var TILLID = SignOnTransactionResponse.transaction_data.TillID;
                            var POSTMTParam = {
                                "Enterprise":"Safe",
                                "MovementDirectionCode":"SW",
                                "TillID":TILLID,
                                "WorkstationID": posLoggedData.WorkstationID,
                                "BusinessUnitID": posLoggedData.BusinessUnitID,
                                "OperatorID": posLoggedData.OperatorID,
                                "BusinessUnitGroupID": posLoggedData.BusinessGroupID,
                                "BeginDateTimestamp": appLoader.getCurrentTimeStamp(),
                                "SequenceNumber":appLoader.getSequenceNumber()
                            };
                            var TMTransactionUrl = appLoader.BASEURLSHORT + "till-movement-transaction/";
                            appLoader.CallDataFromServer("POST", TMTransactionUrl, POSTMTParam).then(function (TillMovementTransactionResponse) {
                                if (TillMovementTransactionResponse!='undefined' && TillMovementTransactionResponse!=null){
                                    var TillMovementParameters={
                                        "Transaction":"ControlTransaction",
                                        "TransactionType": "Till Movement Transaction",
                                        "Request": {
                                            headers: req.headers,
                                            body: POSTMTParam
                                        },
                                        "Response":TillMovementTransactionResponse
                                    };
                                    ElasticSearch.CallElasticSearchServer(TillMovementParameters);
                                }
    
                            }).catch(function (err) {
                                console.log(err);
                            });
                        }
                        // console.log(SignOnTransactionResponse);
                        var Parameters={
                            "Transaction":"ControlTransaction",
                            "TransactionType": "Sign On",
                            "Request": {
                                headers: req.headers,
                                body: POSSignOnParam
                            },
                            "Response":SignOnTransactionResponse
                        };
                        ElasticSearch.CallElasticSearchServer(Parameters);


                        if (SignOnTransactionResponse.transaction_data.TillID!=''){
                            var TillData = {"defaultBalance":defaultBalance};
                            dbLoader.TillDB.insert(TillData, function (inserterr, docs) {
                                if(!inserterr){
                                    console.log('till balance saved.');
                                }
                            });
                            POSSignOnParam.tillID = SignOnTransactionResponse.transaction_data.TillID;
                            dbLoader.SignOnMasterDB.insert(POSSignOnParam, function (err, insertedDoc) {
                                if(!err){
                                    POSSignOnParam._id = insertedDoc._id;
                                    console.log(insertedDoc._id);
                                    dbLoader.OperatorSignOnDB.insert(POSSignOnParam, function (errsignon, docs) {
                                        if(!errsignon){
                                            localStorage.setItem('SIGN_ON_ID',docs._id);
                                            console.log(localStorage.getItem('SIGN_ON_ID'));
                                            var result = {
                                                "TillID":SignOnTransactionResponse.transaction_data.TillID,
                                                "DefaultBalance":defaultBalance
                                            };
                                            response = { 'status': 1, 'message': 'SignOnTransaction started.','result': result};
                                            res.send(response);
                                        }
                                    });
                                }else{
                                    response = { 'status': 0, 'message': 'Oops! Something went wrong.' };
                                    res.send(response);
                                }
                            });
                        }
                    }
                }).catch(function (err) {
                    console.log(err);
                });
                //process
            }else if (data.length === 0 && navigator.onLine == false){
                response = { 'status': 0, 'message': 'You are offline. You have to connect internet for first time entry.'};
                res.send(response);

            }else if (data.length > 0 && navigator.onLine == true){

                var signOnTransactionUrl = appLoader.BASEURLSHORT + "signon-transaction/";
                appLoader.CallDataFromServer("POST", signOnTransactionUrl, POSSignOnParam).then(function (SignOnTransactionResponse) {
                    if(SignOnTransactionResponse!=null && SignOnTransactionResponse!='undefined' && SignOnTransactionResponse.transaction_data!='undefined'){
                        if(SignOnTransactionResponse.transaction_data.TillID!='' && SignOnTransactionResponse.transaction_data.TillID!='undefined'){
                            var TILLID = SignOnTransactionResponse.transaction_data.TillID;
                            var POSTMTParam = {
                                "Enterprise":"Safe",
                                "MovementDirectionCode":"SW",
                                "TillID":TILLID,
                                "WorkstationID": posLoggedData.WorkstationID,
                                "BusinessUnitID": posLoggedData.BusinessUnitID,
                                "OperatorID": posLoggedData.OperatorID,
                                "BusinessUnitGroupID": posLoggedData.BusinessGroupID,
                                "BeginDateTimestamp": appLoader.getCurrentTimeStamp(),
                                "SequenceNumber":appLoader.getSequenceNumber()
                            };
                            var TMTransactionUrl = appLoader.BASEURLSHORT + "till-movement-transaction/";
                            appLoader.CallDataFromServer("POST", TMTransactionUrl, POSTMTParam).then(function (TillMovementTransactionResponse) {
                                if (TillMovementTransactionResponse!='undefined' && TillMovementTransactionResponse!=null){
                                    var TillMovementParameters={
                                        "Transaction":"ControlTransaction",
                                        "TransactionType": "Till Movement Transaction",
                                        "Request": {
                                            headers: req.headers,
                                            body: POSTMTParam
                                        },
                                        "Response":TillMovementTransactionResponse
                                    };
                                    ElasticSearch.CallElasticSearchServer(TillMovementParameters);
                                }
    
                            }).catch(function (err) {
                                console.log(err);
                            });
                        }
                        // console.log(SignOnTransactionResponse);
                        var Parameters={
                            "Transaction":"ControlTransaction",
                            "TransactionType": "Sign On",
                            "Request": {
                                headers: req.headers,
                                body: POSSignOnParam
                            },
                            "Response":SignOnTransactionResponse
                        };
                        ElasticSearch.CallElasticSearchServer(Parameters);


                        if (SignOnTransactionResponse.transaction_data.TillID!=''){
                            var TillData = {"defaultBalance":defaultBalance};
                            dbLoader.TillDB.insert(TillData, function (inserterr, docs) {
                                if(!inserterr){
                                    console.log('till balance saved.');
                                }
                            });
                            POSSignOnParam.tillID = SignOnTransactionResponse.transaction_data.TillID;

                            dbLoader.SignOnMasterDB.remove({},{multi:true}, function (err, insertedDoc) {
                                if(!err){
                                    dbLoader.SignOnMasterDB.insert(POSSignOnParam, function (err, insertedDoc) {
                                        if(!err){
                                            POSSignOnParam._id = insertedDoc._id;
                                            console.log(insertedDoc._id);
                                            dbLoader.OperatorSignOnDB.insert(POSSignOnParam, function (errsignon, docs) {
                                                if(!errsignon){
                                                    localStorage.setItem('SIGN_ON_ID',docs._id);
                                                    console.log(localStorage.getItem('SIGN_ON_ID'));
                                                    var result = {
                                                        "TillID":SignOnTransactionResponse.transaction_data.TillID,
                                                        "DefaultBalance":defaultBalance
                                                    };
                                                    response = { 'status': 1, 'message': 'SignOnTransaction started.','result': result};
                                                    res.send(response);
                                                }
                                            });
                                        }else{
                                            response = { 'status': 0, 'message': 'Oops! Something went wrong.' };
                                            res.send(response);
                                        }
                                    });
                                }
                            });
                        }
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }else if (data.length > 0 && navigator.onLine == false){
                dbLoader.OperatorSignOnDB.insert(POSSignOnParam, function (errsignon, docs) {
                    if(!errsignon){
                        var result = {
                            "TillID":data[0].tillID,
                            "DefaultBalance":defaultBalance
                        };
                        response = { 'status': 1, 'message': 'SignOnTransaction started.','result': result};
                        res.send(response);
                        localStorage.setItem('SIGN_ON_ID',docs._id);
                        console.log(localStorage.getItem('SIGN_ON_ID'));
                    }else{
                        response = { 'status': 0, 'message': 'Oops! Something went wrong.' };
                        res.send(response);
                    }
                });
            }
        });
    }
});


