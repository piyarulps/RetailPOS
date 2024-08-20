var app = require("express")();
var jQuery = require('jquery');
var DataDownloadFromServer = [];
var ipinfo = localStorage.getItem('identifier');
var appLoader = require('../../app.js');

module.exports = app;

app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');
    var noderesponse = {};
    var dbLoader = require('../Items/itemdbLoader.js');

    var getURL = appLoader.BASEURL + "items/?limit=200&IPADDRESS=" + ipinfo;
    appLoader.CallDataFromServer("GET", getURL, {}).then(function (response) {
        DataDownloadFromServer = response.result;
        if (DataDownloadFromServer.length > 0) {
            noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': response.RecordsCount };
            res.send(noderesponse);
            var promise1 = new Promise(function (resolve, reject) {
                var tempCount = 0;
                var TotolCount = response.RecordsCount;
                DataDownloadFromServer.forEach(function (key, val) {
                    var ItemCreateManage = {
                        "id": key.id,
                        "ItemSellingRule": key.ItemSellingRule,
                        "AuthorizedForSaleFlag": key.AuthorizedForSaleFlag,
                        "DiscountFlag": key.DiscountFlag,
                        "PriceAuditFlag": key.PriceAuditFlag,
                        "TaxExemptCode": key.TaxExemptCode,
                        "UsageCode": key.UsageCode,
                        "ItemName": key.ItemName,
                        "Description": key.Description,
                        "LongDescription": key.LongDescription,
                        "TypeCode": key.TypeCode,
                        "KitSetCode": key.KitSetCode,
                        "SubstituteIdentifiedFlag": key.SubstituteIdentifiedFlag,
                        "OrderCollectionCode": key.OrderCollectionCode,
                        "SerializedIUnitValidationFlag": key.SerializedIUnitValidationFlag,
                        "ABV": key.ABV,
                        "retail_package_size": key.retail_package_size,
                        "isblocked": key.isblocked,
                        "MerchandiseHierarchyGroup": key.MerchandiseHierarchyGroup,
                        "ItemSellingPrices": key.ItemSellingPrices,
                        "POSDepartment": key.POSDepartment,
                        "PriceLine": key.PriceLine,
                        "BrandName": key.BrandName,
                        "Parent": key.Parent,
                        "SubBrand": key.SubBrand,
                        "is_expand": key.is_expand,
                        "upc_a": key.upc_a.map(String),
                        "size": key.size,
                        "supplier": key.supplier,
                        "merchandise9_shelflocation": key.merchandise9_shelflocation,
                        "merchandise12_cateogy": key.merchandise12_cateogy,
                        "merchandise14_age": key.merchandise14_age,
                        "merchandise15_cigarettepricetiers": key.merchandise15_cigarettepricetiers,
                        "merchandise17_departments": key.merchandise17_departments,
                        "merchandise16_groups": key.merchandise16_groups,
                        "merchandise18_categories": key.merchandise18_categories,
                        "merchandise10_location": key.merchandise10_location,
                        "merchandise13_gender": key.merchandise13_gender,
                        "current_price": key.current_price,
                        "current_cost": key.current_cost,
                        "qty_on_hand": key.qty_on_hand,
                        "qty_in_case": key.qty_in_case,
                        "margin": key.margin,
                        "isExpandable": key.isExpandable
                    };
                    if (key.upc_a.length > 0) {
                        var UPClists = key.upc_a;
                        UPClists.forEach(function (upckey, upcval) {
                            dbLoader.UPCListDB.find({ 'upckey': upckey }, function (err, dataFound) {
                                if (dataFound.length === 0) {
                                    dbLoader.UPCListDB.insert({ 'upckey': upckey }, function (err, docs) { });
                                }
                            });
                        });
                    }

                    dbLoader.ItemDB.find({ 'id': key.id }, function (err, docs) {
                        if (docs.length === 0) {
                            dbLoader.ItemDB.insert(ItemCreateManage, function (err, docs) { });
                            tempCount++;

                        } else {
                            dbLoader.ItemDB.update({ _id: docs[0]._id }, { $set: ItemCreateManage }, function (err) {
                                if (err) {
                                    errCount += 1;
                                } else {
                                    console.log('Updated.');
                                    tempCount++;

                                }
                            });
                        }

                        if (TotolCount == tempCount) {
                            resolve(TotolCount);
                        }
                    });
                });
            });
            promise1.then(function (TotolCount) {
                console.log(TotolCount, ' Inserted.');
            });

        } else {
            noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': 0 };
            res.send(noderesponse);
        }
    });
});