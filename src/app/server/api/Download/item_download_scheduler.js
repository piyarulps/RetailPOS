var app = require("express")();
var DataDownloadFromServer = [];
var ipinfo = localStorage.getItem('identifier');
var appLoader = require('../../app.js');
var jQuery = require('jquery');
var dbLoader = require('../Items/itemdbLoader.js');
var DownloadeddbLoader = require('../Download/downloadedDBLoader.js');
var PAGE = 1;


module.exports = app;

app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');
    var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');
    var noderesponse = {};

    var getExistURL = appLoader.BASEURL + "items/?limit=1&offset=1&IPADDRESS=" + ipinfo + "&business_group=" + BusinessGroupID;
    appLoader.CallDataFromServer("GET", getExistURL, {}).then(function (CountResponse) {

        var PAGESERVE = 0;
        var TotalItems = 0;
        if (CountResponse.RecordsCount > 0) {
            noderesponse = { 'status': 1, 'message': 'Data Encountered....', 'DataCount': CountResponse.RecordsCount };
            res.send(noderesponse);
            PAGESERVE = Math.ceil((CountResponse.RecordsCount) / 200);
            TotalItems = CountResponse.RecordsCount;
            console.log(PAGESERVE);
            if (PAGESERVE > 0) {
                downloadData(PAGE, PAGESERVE, TotalItems, BusinessGroupID);
            }
        } else {
            DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'Items', 'Total': TotalItems, 'Downloaded': TotalItems });
            noderesponse = { 'status': 1, 'message': 'Data Downloading....', 'DataCount': 0 };
            res.send(noderesponse);
        }
    }).catch(function (err) {
        console.log(err);
    });

});


function downloadData(Page, TotalPage, TotalItems, BusinessGroupID) {
    PAGE = Page;
    //var GENERATEURL = appLoader.BASEURL + "items/?limit=200&offset=" + PAGE;
    var GENERATEURL = appLoader.BASEURL + "items/?limit=200&offset=" + PAGE + "&business_group=" + BusinessGroupID;
    console.log(GENERATEURL);
    appLoader.CallDataFromServer("GET", GENERATEURL, {}).then(function (response) {
        DataDownloadFromServer = response.result;
        if (DataDownloadFromServer.length > 0) {
            var tempCount = 0;
            var TotalCount = DataDownloadFromServer.length;
            DataDownloadFromServer.forEach(function (key, val) {
                var ITEMSELLINGPRICE = {};
                if (key.business_unit_group_item[0] != 'undefined' && key.business_unit_group_item[0] != 'undefined') {
                    if (key.business_unit_group_item[0].ItemSellingPrices != 'undefined' && key.business_unit_group_item[0].ItemSellingPrices != null) {
                        ITEMSELLINGPRICE = key.business_unit_group_item[0].ItemSellingPrices;
                    }
                }
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
                    "ItemSellingPrices": ITEMSELLINGPRICE,
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
                dbLoader.ItemDB.find({ 'id': key.id }, function (err, docs) {
                    if (docs.length === 0) {
                        dbLoader.ItemDB.insert(ItemCreateManage, function (err, docs) { });
                    } else {
                        dbLoader.ItemDB.update({ _id: docs[0]._id }, { $set: ItemCreateManage }, function (err) {
                            if (err) {
                                errCount += 1;
                            } else {
                                //console.log('Updated.');
                            }
                        });
                    }
                    tempCount++;
                    //console.log(tempCount,TotolCount);
                    if (TotalCount == tempCount) {
                        if (Page == TotalPage) {
                            DownloadeddbLoader.DownloadedDB.remove({ 'ModuleName': 'Items' }, { multi: true });
                            DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'Items', 'Total': TotalItems, 'Downloaded': TotalItems });
                            var LAST_DOWNLOAD_PARAMETERS = {
                                "IPADDRESS": ipinfo,
                                "ModuleName": 'Item',
                                "LastSyncTime": appLoader.getCurrentTimeStamp(),
                                "BusinessGroupID": BusinessGroupID
                            };
                            var SERVER_TIME_SAVE_URL = appLoader.BASEURLSHORT + "last-sync-store/";
                            appLoader.CallDataFromServer("POST", SERVER_TIME_SAVE_URL, LAST_DOWNLOAD_PARAMETERS).then(function (ServerTimeResponse) {
                                console.log(ServerTimeResponse);
                            }).catch(function (err) {
                                console.log(err);
                            });
                        } else {
                            DownloadeddbLoader.DownloadedDB.insert({ 'ModuleName': 'Items', 'Total': TotalItems, 'Downloaded': Page * tempCount });
                            Page = Page + 1;
                            //console.log(Page,TotalPage,TotalItems);
                            downloadData(Page, TotalPage, TotalItems, BusinessGroupID);
                        }
                    }

                });
            });

        }
    }).catch(function (err) {
        console.log(err);
    });

}