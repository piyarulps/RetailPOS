var dbLoader = require('./retail_transactionDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
module.exports = app;

app.post("/", function (req, res) {

    var ItemPurchaseRequest = req.body;
    console.log(ItemPurchaseRequest);
    var LogggedInData = JSON.parse(localStorage.getItem('LoggedInData'));
    var SEEQUENCE_NUMBER = appLoader.getSequenceNumber();
    //console.log(LogggedInData);
    var RetailTransactionData = ItemPurchaseRequest.Transaction.RetailTransaction;
    var response = {};
    //  var RetailTransactionData = {
    //      "RingElapsedTime":300,
    //      "TenderElapsedTime":100,
    //      "IdleElapsedTime":200,
    //      "LockElapsedTime":1500,
    //      "UnitCount":3,
    //      "LineItemsScannedCount":2,
    //      "LineItemsScannedPercent":0.02,
    //      "LineItemsKeyedCount":1,
    //      "LineItemsKeyedPercent":0.05,
    //      "KeyDepartmentCount":0,
    //      "KeyDepartmentPercent":0,
    //      "ReceiptDateTime":null,
    //      "Customer":null,
    //      "CustomerIDEntryMethodCode":null,
    //      "CustomerIDTypeCode":null,
    //      "Channel":null,
    //      "RetailShoppingTripTypeCode":null,
    //      "TransactionEntryModeCode":null,
    //      "ISOCurrencyCode":null,
    //      "CustomerSurvey":null,
    //      "LineItem":[
    //          {
    //              "Sale": {
    //                 "POSIdentity": {
    //                    "POSItemID": "27200194841"
    //                 },
    //                 "ItemType": "Stock",
    //                 "ActionCode":"SL",
    //                 "ItemIDEntryMethodCode":"Scan", // Between 4 Char.
    //                 "RegularSalesUnitPrice":"5.00",
    //                 "ExtendedDiscountAmount":"0.00",
    //                 "ActualSalesUnitPrice":"5.00",
    //                 "ExtendedAmount": "899.00",
    //                 "InventoryValuePrice":"0.00",
    //                 "UnitCostPrice":"0.00",
    //                 "UnitListPrice":"0.00",
    //                 "Quantity": "1"
    //              }
    //           },
    //           {
    //              "Sale": {
    //                 "ItemType": "Stock",
    //                 "ActionCode":"SL",
    //                 "ItemIDEntryMethodCode":"key", // Between 4 Char.
    //                 "POSIdentity": {
    //                    "POSItemID": "316497"
    //                 },
    //                 "ExtendedAmount": "50.00",
    //                 "ExtendedDiscountAmount":"0.00",
    //                 "RegularSalesUnitPrice":"5.00",
    //                 "ActualSalesUnitPrice":"5.00",
    //                 "UnitCostPrice":"0.00",
    //                 "UnitListPrice":"0.00",
    //                 "InventoryValuePrice":"0.00",
    //                 "Quantity": "1",
    //                 "ItemLink": "1"
    //              }
    //           },
    //           {
    //              "Sale": {
    //                 "ItemType": "Stock",
    //                 "ActionCode":"SL",
    //                 "ItemIDEntryMethodCode":"Scan", // Between 4 Char.
    //                 "POSIdentity": {
    //                    "POSItemID": "1850513771"
    //                 },
    //                 "ExtendedAmount": "50.00",
    //                 "ExtendedDiscountAmount":"0.00",
    //                 "RegularSalesUnitPrice":"5.00",
    //                 "ActualSalesUnitPrice":"5.00",
    //                 "UnitCostPrice":"0.00",
    //                 "UnitListPrice":"0.00",
    //                 "InventoryValuePrice":"0.00",
    //                 "Quantity": "1",
    //                 "ItemLink": "1"
    //              }
    //           }
    //       ]
    //  }; 
    if(ItemPurchaseRequest.IsCompleted==1){
        var Reatil_Transaction_Param = {
            "WorkstationID":LogggedInData.WorkstationID,
            "BusinessUnitID":LogggedInData.BusinessUnitID,
            "OperatorID":LogggedInData.OperatorID,
            "BusinessDayDate":ItemPurchaseRequest.StartTime,
            "BusinessUnitGroupID":LogggedInData.BusinessGroupID,
            "TillID":ItemPurchaseRequest.Transaction.TillID,
            "CancelFlag":ItemPurchaseRequest.Transaction.CancelFlag,
            "VoidedFlag":ItemPurchaseRequest.Transaction.VoidedFlag,
            "SuspendedFlag":ItemPurchaseRequest.Transaction.SuspendedFlag,
            "RetailTransaction":RetailTransactionData,
            "StartTime":ItemPurchaseRequest.StartTime,
            "EndTime":ItemPurchaseRequest.EndTime,
            "IsCompleted":ItemPurchaseRequest.IsCompleted,
            "SaleStartTime":ItemPurchaseRequest.SaleStartTime,
            "SaleEndTime":ItemPurchaseRequest.SaleEndTime,
            "TenderStartTime":ItemPurchaseRequest.TenderStartTime,
            "TenderEndTime":ItemPurchaseRequest.TenderEndTime,
            "SequenceNumber":SEEQUENCE_NUMBER
         };
    }else{
        var Reatil_Transaction_Param = {
            "WorkstationID":LogggedInData.WorkstationID,
            "BusinessUnitID":LogggedInData.BusinessUnitID,
            "OperatorID":LogggedInData.OperatorID,
            "BusinessDayDate":ItemPurchaseRequest.StartTime,
            "BusinessUnitGroupID":LogggedInData.BusinessGroupID,
            "TillID":ItemPurchaseRequest.Transaction.TillID,
            "CancelFlag":ItemPurchaseRequest.Transaction.CancelFlag,
            "VoidedFlag":ItemPurchaseRequest.Transaction.VoidedFlag,
            "SuspendedFlag":ItemPurchaseRequest.Transaction.SuspendedFlag,
            "RetailTransaction":RetailTransactionData,
            "StartTime":ItemPurchaseRequest.StartTime,
            "EndTime":ItemPurchaseRequest.EndTime,
            "IsCompleted":ItemPurchaseRequest.IsCompleted,
            "SaleStartTime":ItemPurchaseRequest.SaleStartTime,
            "SaleEndTime":ItemPurchaseRequest.SaleEndTime,
            "TenderStartTime":ItemPurchaseRequest.TenderStartTime,
            "TenderEndTime":ItemPurchaseRequest.TenderEndTime
         };
    }


    // Local network transaction.
    if ('_id' in ItemPurchaseRequest) {
        dbLoader.RetailTransactionDB.update({ _id: ItemPurchaseRequest._id }, { $set: Reatil_Transaction_Param }, function (err, updated) {
            if (!err) {
                dbLoader.RetailTransactionDB.findOne({ _id: ItemPurchaseRequest._id }).exec(function (err, data) {
                    console.log('updated', updated);
                    response = { 'status': 1, 'message': 'update', 'result': data };
                    res.send(response);
                });
                //console.log('updated',updated);
            }
        });
    } else {
        dbLoader.RetailTransactionDB.insert(Reatil_Transaction_Param, function (err, insertedDoc) {
            if (!err) {
                response = { 'status': 1, 'message': 'start', 'result': insertedDoc };
                //console.log(insertedDoc);
                //console.log(JSON.stringify(insertedDoc));
                res.send(response);
            }
        });
    }

});

