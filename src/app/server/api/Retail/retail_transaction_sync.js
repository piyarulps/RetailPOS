var dbLoader = require('./retail_transactionDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
var ElasticSearch = require('../../ping.js');

module.exports = app;

app.get("/", function (req, res) {

    var response = {};
    var errCount = 0;
    var itemPurchaseUrl = appLoader.BASEURLSHORT + "rpos_sale_item/";
    if(navigator.onLine==true){
        dbLoader.RetailTransactionDB.find({ IsCompleted: 1, EndTime: { "$nin": [ null ] } }, function (err, data) {
            if (data.length > 0) {
                var i = 0;
                data.forEach(function (key, val) {
                    //console.log(key)
                    // console.log(appLoader.getSequenceNumber());

                    i++;
                    var ParamConfig = {
                            "Transaction":{
                                "TillID":key.TillID,
                                "OperatorID":key.OperatorID,
                                "WorkstationID":key.WorkstationID,
                                "BusinessUnitID":key.BusinessUnitID,
                                "BusinessDayDate":key.BusinessDayDate,
                                "BusinessUnitGroupID":key.BusinessUnitGroupID,
                                "RetailTransaction":key.RetailTransaction,
                                "SequenceNumber":key.SequenceNumber,
                                "CancelFlag":key.CancelFlag,
                                "VoidedFlag":key.VoidedFlag,
                                "SuspendedFlag":key.SuspendedFlag,
                                "EndDateTimestamp":key.EndTime,
                                "SaleStartTime":key.SaleStartTime,
                                "SaleEndTime":key.SaleEndTime,
                                "TenderStartTime":key.TenderStartTime,
                                "TenderEndTime":key.TenderEndTime
                            }
                    };
                    // console.log(ParamConfig);
                    appLoader.CallDataFromServer("POST", itemPurchaseUrl, ParamConfig).then(function (ItemPurchaseResponse) {
                        if (ItemPurchaseResponse != null && ItemPurchaseResponse != 'undefined') {
                            console.log(ItemPurchaseResponse);
                            if(ItemPurchaseResponse.status ==1){
                                dbLoader.RetailTransactionDB.remove({ _id: key._id }, { multi: true }, function (err, cb) {
                                    if(err){
                                        errCount += 1;
                                    }else{
                                        console.log('removed.');
                                        // var ElasticParameters = {
                                        //     "Transaction": "Retail Transaction Data",
                                        //     "RTITransactionTypeCode": "Sale",
                                        //     "Request": ParamConfig,
                                        //     "Response": ItemPurchaseResponse
                                        // };
                                        //ElasticSearch.CallElasticSearchServer(ElasticParameters);
                                    }
                                });
                            }
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                });
            }
        });
    }
    if (errCount == 0) {
        response = { 'status': 1, 'message': 'Transaction sync successfully.' };
    } else {
        response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
    }
    res.setHeader('content-type', 'text/javascript');
    res.json(response);

});
