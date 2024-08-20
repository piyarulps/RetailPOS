var app = require("express")();
var dbLoader = require('./itemdbLoader.js');
var vendordbLoader = require('../Vendors/vendordbloader.js');

module.exports = app;
app.get("/", function (req, res) {

    var response = {};
    var requestParam = req;
    var SupplierItemDatas = [];
    var errCount = 0;
    //console.log(requestParam);
    var ITEMID = requestParam.query.item;
    var TotolCount = 0;
    dbLoader.ItemDB.find({ _id: ITEMID }).exec(function (err, data) {
        console.log(data);
        if (data[0].supplier != null) {
            SupplierItemDatas = data[0].supplier;
            if (SupplierItemDatas.length > 0) {
                TotolCount = SupplierItemDatas.length;
                var SupplierData = [];
                var promise1 = new Promise(function (resolve, reject) {
                    var tempCount = 0;
                    SupplierItemDatas.forEach(function (key, val) {
                        console.log('supplier name',key);
                        vendordbLoader.SupplierListDB.find({ SupplierName: key }).exec(function (err, sdata) {
                            console.log('supplier name',sdata)
                            if (sdata.length > 0) {
                                tempCount++;
                                sdata[0].PartyData.supplier_item_data={};
                                sdata[0].id=sdata[0].PartyData.VendorID;
                                SupplierData.push(sdata[0]);
                            } else {
                                errCount+= 1;
                            }
                            console.log('TotolCount', TotolCount, 'tempCount', tempCount, 'condition', TotolCount == tempCount);
                            if (TotolCount == tempCount) {
                                resolve(SupplierData);
                            }
                        });
                    });
                });
                promise1.then(function (SupplierData) {
                    console.log(SupplierData);
                    if (SupplierData.length > 0) {
                        response = { 'RecordsCount': TotolCount, 'message': 'Records Found.', 'result': SupplierData, 'status':1};
                        res.send(response);
                    } else {
                        response = { 'RecordsCount': 0, 'message': 'No Records Found.', 'result': [] };
                        res.send(response);
                    }
                });
            }
        }else{
            response = { 'RecordsCount': 0, 'message': 'No Records Found.', 'result': [] };
            res.send(response);
        }

    });





});
