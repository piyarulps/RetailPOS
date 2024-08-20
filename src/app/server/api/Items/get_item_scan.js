var dbLoader = require('./itemdbLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
var DataDownloadFromServer = [];

module.exports = app;

app.get("/:_id/:_scanner", function (req, res) {

    var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');
    var requestParam = req;
    var ITEMUPC = requestParam.params._id;
    var SCANNER = requestParam.params._scanner;
    // console.log(ITEMUPC);

    dbLoader.ItemDB.find({ upc_a: ITEMUPC }).exec(function (err, data) {
        var response = {};
        var ItemData = {};
        var ITEMPRICE = 0;
        var COSTPRICE = 0;
        var MSRPRICE = 0;
        if (data.length > 0) {
            if(data[0].ItemSellingPrices!=null && data[0].ItemSellingPrices!='undefined'){
                if('CurrentPackagePrice' in data[0].ItemSellingPrices && data[0].ItemSellingPrices.CurrentPackagePrice!='undefined'){
                    ITEMPRICE = data[0].ItemSellingPrices.CurrentPackagePrice;
                    if('cost' in data[0].ItemSellingPrices && data[0].ItemSellingPrices.cost!='undefined'){
                        COSTPRICE = data[0].ItemSellingPrices.cost;
                    }else{
                        COSTPRICE = 0;
                    }
                    if('ManufacturerSaleUnitRecommendedRetailPriceAmount' in data[0].ItemSellingPrices && data[0].ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount!='undefined'){
                        MSRPRICE = data[0].ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount;
                    }else{
                        MSRPRICE =0;
                    }
                }else{
                    ITEMPRICE = 0;
                }
            }
            ItemData = {
                "ItemUPC": data[0].upc_a,
                "ItemName": data[0].ItemName,
                "ItemID": data[0].id,
                "ItemDescription": data[0].Description,
                "ItemPrice": ITEMPRICE,
                "RegularUnitPrice": ITEMPRICE,
                "UnitCostPrice":COSTPRICE,
                "UnitListPrice":MSRPRICE,
                "ReturnUPC": ITEMUPC
            };
            response = { 'status': 1, 'message': 'Item data found.', 'result': ItemData };
            //equipmentStatisticsReadingApiCall(SCANNER);
            res.send(response);
        } else {
            var getURL = appLoader.BASEURL + "upctoitem/" + ITEMUPC + "/?business_group="+BusinessGroupID;
            //console.log(getURL);
            appLoader.CallDataFromServer("GET", getURL, {}).then(function (serverData) {
                //console.log(serverData);
                if (typeof serverData.result != 'undefined' && serverData.result != null && serverData.status == 1) {
                    DataDownloadFromServer.push(serverData.result);
                    var ItemCreateManage = {};
                    if (DataDownloadFromServer.length > 0) {
                        DataDownloadFromServer.forEach(function (key, val) {
                            if (typeof key.ItemID != 'undefined') {
                                ItemCreateManage = {
                                    "id": key.id,
                                    "business_group":key.business_group[0].group_id[0],
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
                                    "retail_package_size": key.retail_package_size,
                                    "ABV": key.ABV,
                                    "isblocked": key.isblocked,
                                    "MerchandiseHierarchyGroup": key.MerchandiseHierarchyGroup,
                                    "ItemSellingPrices": key.ItemSellingPrices,
                                    "POSDepartment": key.POSDepartment,
                                    "PriceLine": key.PriceLine,
                                    "BrandName": key.BrandName,
                                    "Parent": key.Parent,
                                    "SubBrand": key.SubBrand,
                                    "is_expand": key.is_expand,
                                    "upc_a": key.ItemID,
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
                            }
                        });
                        dbLoader.ItemDB.insert(ItemCreateManage, function (err, docs) {
                            if (!err) {
                                if(docs.ItemSellingPrices!=null && docs.ItemSellingPrices!='undefined'){
                                    if('CurrentPackagePrice' in docs.ItemSellingPrices && docs.ItemSellingPrices.CurrentPackagePrice!='undefined'){
                                        ITEMPRICE = docs.ItemSellingPrices.CurrentPackagePrice;
                                        if('cost' in docs.ItemSellingPrices && docs.ItemSellingPrices.cost!='undefined'){
                                            COSTPRICE = docs.ItemSellingPrices.cost;
                                        }else{
                                            COSTPRICE = 0;
                                        }
                                        if('ManufacturerSaleUnitRecommendedRetailPriceAmount' in docs.ItemSellingPrices && docs.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount!='undefined'){
                                            MSRPRICE = docs.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount;
                                        }else{
                                            MSRPRICE =0;
                                        }
                                    }else{
                                        ITEMPRICE = 0;
                                    }
                                }
                                //console.log(docs, docs._id);
                                ItemData = {
                                    "ItemUPC": docs.upc_a,
                                    "ItemName": docs.ItemName,
                                    "ItemID": docs.id,
                                    "ItemDescription": docs.Description,
                                    "ItemPrice": ITEMPRICE,
                                    "RegularUnitPrice":ITEMPRICE,
                                    "UnitCostPrice":COSTPRICE,
                                    "UnitListPrice":MSRPRICE,
                                    "ReturnUPC": ITEMUPC
                                };
                                response = { 'status': 1, 'message': 'Item data found.', 'result': ItemData };
                                //equipmentStatisticsReadingApiCall();
                                res.send(response);
                            }
                        });
                        //console.log(docs.upc_a, ' Item Created.');
                    } else {
                        response = { 'status': 0, 'message': 'Oops! item not found.', 'result': {} };
                        res.send(response);
                    }
                } else {
                    response = { 'status': 0, 'message': 'Oops! item not found.', 'result': {} };
                    res.send(response);
                }

            }).catch(function (err) {
                response = { 'status': 0, 'message': 'Oops! item not found.', 'result': {} };
                res.send(response);
            });
        }
    });


});


function equipmentStatisticsReadingApiCall(scanner_serial_key) {

    var PutUrl = appLoader.BASEURL + "equipment_statistics_event/";
    var SerialNumberData = {
        "DeviceAddress": scanner_serial_key
    };

    appLoader.CallDataFromServer("PUT", PutUrl, SerialNumberData).then(function (reponse) {
        console.log(reponse);
    }).catch(function (err) {
        response = { 'status': 0, 'message': 'Oops! item not found.', 'result': {} };
        res.send(response);
    });
}
