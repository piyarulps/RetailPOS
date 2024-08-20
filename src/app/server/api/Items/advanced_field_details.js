var dbLoader = require('./itemdbLoader.js');
var app = require("express")();
var jQuery = require('jquery');
var appLoader = require('../../app.js');
var DataDownloadFromServer = [];
var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');



module.exports = app;

app.get("/:_id", function (req, res) {

    var requestParam = req;
    var ITEMID = requestParam.params._id;
    console.log(ITEMID);
    var response = {};
    var ItemData = {};
    dbLoader.ItemDB.find({ _id: ITEMID }).exec(function (err, data) {
        if (data.length > 0) {
            ItemData = {
                "LongDescription": data[0].LongDescription,
                "TaxExemptCode": data[0].TaxExemptCode,
                "UsageCode": data[0].UsageCode,
                "KitSetCode": data[0].KitSetCode,
                "OrderCollectionCode": data[0].OrderCollectionCode,
                "PriceLine_id": data[0].PriceLine_id,
                "counting": data[0].counting,
                "sale_weight_or_unit_count_code": data[0].sale_weight_or_unit_count_code,
                "unit_price_factor": data[0].unit_price_factor,
                "available_for_sale_date": data[0].available_for_sale_date,
                "TypeCode": data[0].TypeCode,
                "bulk_to_selling_unit_waste_factor_percent": data[0].bulk_to_selling_unit_waste_factor_percent,
                "bulk_to_selling_unit_waste_type_code": data[0].bulk_to_selling_unit_waste_type_code
            };

            response = { 'status': 1, 'message': 'Data found.', 'result': ItemData };
            res.send(response);
        }
    });

});

app.put("/:_id", function (req, res) {

    var errCount = 0;
    var requestParam = req;
    var ITEMIDS = requestParam.params._id.split(",");
    var ItemAdvanncedFieldManage = {};
    var UpdateItemBody = req.body;

    //console.log(ITEMIDS);

    ITEMIDS.forEach(function (key, val) {
        dbLoader.ItemDB.find({ _id: key }).exec(function (err, data) {
            if (data.length > 0) {
                ItemAdvanncedFieldManage = {
                    "LongDescription": UpdateItemBody.LongDescription,
                    "TaxExemptCode": UpdateItemBody.TaxExemptCode,
                    "UsageCode": UpdateItemBody.UsageCode,
                    "KitSetCode": UpdateItemBody.KitSetCode,
                    "OrderCollectionCode": UpdateItemBody.OrderCollectionCode,
                    "PriceLine_id": UpdateItemBody.PriceLine_id,
                    "counting": UpdateItemBody.counting,
                    "flag": null,
                    "sale_weight_or_unit_count_code": UpdateItemBody.sale_weight_or_unit_count_code,
                    "unit_price_factor": UpdateItemBody.unit_price_factor,
                    "available_for_sale_date": UpdateItemBody.available_for_sale_date,
                    "TypeCode": UpdateItemBody.TypeCode,
                    "bulk_to_selling_unit_waste_factor_percent": UpdateItemBody.bulk_to_selling_unit_waste_factor_percent,
                    "bulk_to_selling_unit_waste_type_code": UpdateItemBody.bulk_to_selling_unit_waste_type_code
                };
                //console.log(ItemCreateManage);
                if (ItemAdvanncedFieldManage != null) {
                    dbLoader.ItemDB.find({ _id: key }, function (err, CB) {
                        if (err) {
                            errCount += 1;
                        } else {
                            if ('id' in CB[0]) {
                                ItemAdvanncedFieldManage.id = data[0].id;
                                ItemAdvanncedFieldManage.upc_a = data[0].upc_a;
                                dbLoader.ItemDB.update({ _id: CB[0]._id }, { $set: ItemAdvanncedFieldManage }, function (err) { });
                                dbLoader.ItemAdvancedFieldDB.insert(ItemAdvanncedFieldManage, function (err) { });
                                console.log(key + ' Server Data updated');
                                UpdateToServer();
                            } else {
                                dbLoader.ItemDB.update({ _id: CB[0]._id }, { $set: ItemAdvanncedFieldManage }, function (err) { });
                                console.log(key + ' Local Data updated');
                            }
                        }
                    });
                }
            }

        });
    });
    if (errCount == 0) {
        response = { 'status': 1, 'message': 'Item advanced field updated successfully.' };
        res.send(response);
    } else {
        response = { 'status': 1, 'message': 'Oops! something went wrong.' };
        res.send(response);
    }

});

function UpdateToServer() {

    dbLoader.ItemAdvancedFieldDB.find({}, function (err, data) {
        var responseCreate = {};
        if (data.length > 0) {
            var ITEMID = 0;
            data.forEach(function (lkey, val) {
                ITEMID = lkey.id;
                var ParamConfig = {
                    "TypeCode": lkey.TypeCode,
                    "LongDescription": lkey.LongDescription,
                    "PriceLine_id": lkey.PriceLine_id,
                    "TaxExemptCode": lkey.TaxExemptCode,
                    "UsageCode": lkey.UsageCode,
                    "KitSetCode": lkey.KitSetCode,
                    "OrderCollectionCode": lkey.OrderCollectionCode,
                    "counting": lkey.counting,
                    "sale_weight_or_unit_count_code": lkey.sale_weight_or_unit_count_code,
                    "unit_price_factor": lkey.unit_price_factor,
                    "available_for_sale_date": lkey.available_for_sale_date,
                    "bulk_to_selling_unit_waste_factor_percent": lkey.bulk_to_selling_unit_waste_factor_percent,
                    "bulk_to_selling_unit_waste_type_code": lkey.bulk_to_selling_unit_waste_type_code,
                    "flag": lkey.flag
                };
                var AdvancedDetailsUrl = appLoader.BASEURL + "advanced_field_save/" + ITEMID + "/";
                appLoader.CallDataFromServer("PUT", AdvancedDetailsUrl, ParamConfig).then(function (callback) {
                    responseCreate = callback;
                    if (responseCreate.status == 1) {
                        dbLoader.ItemAdvancedFieldDB.remove({ _id: lkey._id }, { multi: true }, function (err, cb) {
                            if (err) {
                                errCount += 1;
                            } else {
                                var GetUrl = appLoader.BASEURL + "upctoitem/" + lkey.upc_a[0] + "/?business_group="+BusinessGroupID;
                                appLoader.CallDataFromServer("GET", GetUrl, {}).then(function (resData) {
                                    if (resData.result != null) {
                                        DataDownloadFromServer.push(resData.result);
                                        var ItemCreateManage = {};
                                        if (DataDownloadFromServer.length > 0) {
                                            DataDownloadFromServer.forEach(function (key, val) {
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
                                                    "upc_a": key.ItemID.map(String),
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

                                                dbLoader.ItemDB.update({ id: key.id }, { $set: ItemCreateManage }, function (err) {
                                                    if (err) {
                                                        errCount += 1;
                                                    } else {
                                                        console.log('Both server & local Data updated');
                                                    }
                                                });
                                            });
                                        }

                                    }

                                }).catch(function (err) {
                                    console.err(err);
                                });
                            }
                        });
                    }



                }).catch(function (err) {
                    console.err(err);
                });
            });
        }

    });


}