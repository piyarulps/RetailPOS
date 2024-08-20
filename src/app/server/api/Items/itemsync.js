var app = require("express")();
var dbLoader = require('./itemdbLoader.js');
var jQuery = require('jquery');

var ipinfo = localStorage.getItem('identifier');
var DataDownloadFromServer = [];
var SupplierdbLoader = require('../Vendors/vendordbloader.js');
var appLoader = require('../../app.js');

var RecordsCount = 0;
module.exports = app;

app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');

    var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');
    var response = {};
    var errCount = 0;
    dbLoader.ItemDB.find({ SavedWithLocal: "YES" }, function (err, data) {
        var responseCreate = {};
        if (data.length > 0) {
            data.forEach(function (lskey, val) {
                var ParamConfig = {
                    "workerId": appLoader.WORKER_ID,
                    "business_group": [BusinessGroupID],
                    "upc": lskey.upc_a,
                    "size": lskey.size,
                    "ismultistore": "n",
                    "description": lskey.Description,
                    "pos_department_name": lskey.POSDepartment.POSDepartmentName,
                    "brand_name": lskey.BrandName.BrandName,
                    "sub_brand": null,
                    "retail_package_size": lskey.retail_package_size,
                    "merchandise": null,
                    "selling_rule_id": lskey.ItemSellingRule,
                    "min_inventory_level": 0,
                    "max_inventory_level": 0,
                    "desired_inventory_level": 0,
                    "price": lskey.ItemSellingPrices.CurrentPackagePrice,
                    "cost": lskey.ItemSellingPrices.cost,
                    "margin": lskey.ItemSellingPrices.margin,
                    "markup": lskey.ItemSellingPrices.markup,
                    "profit": lskey.ItemSellingPrices.profit,
                    "begin_date": lskey.ItemSellingPrices.CurrentSaleUnitRetailPriceEffectiveDate,
                    "end_date": lskey.ItemSellingPrices.CurrentSaleUnitRetailPriceExpirationDate,
                    "msrp": lskey.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount,
                    "msrp_date": lskey.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceEffectiveDate,
                    "compare_at_sale_unit_price": lskey.ItemSellingPrices.CompareAtSaleUnitRetailPriceAmount,
                    "ItemSellingPrices": null,
                    "selling_price_type": 1,
                    "CurrentSaleUnitReturnPrice": lskey.ItemSellingPrices.CurrentSaleUnitRetailPriceAmount,
                    "MinimumAdvertisedRetailUnitPrice": lskey.ItemSellingPrices.MinimumAdvertisedRetailUnitPrice,
                    "MinimumAdvertisedRetailUnitPriceEffectiveDate": lskey.ItemSellingPrices.MinimumAdvertisedRetailUnitPriceEffectiveDate
                };
                //console.log('itemadd',ParamConfig);
                var ItemAddUrl = appLoader.BASEURL + "item_add/";
                appLoader.CallDataFromServer("POST", ItemAddUrl, ParamConfig).then(function (response) {
                    if (response.item_id != 'undefined' && response.item_id != '') {
                        var getUpcUrl = appLoader.BASEURL + "upctoitem/" + lskey.upc_a[0] + "/?business_group=" + BusinessGroupID;
                        // console.log(getUpcUrl);
                        appLoader.CallDataFromServer("GET", getUpcUrl, {}).then(function (serverData) {
                            //console.log(serverData);
                            DataDownloadFromServer = [];
                            DataDownloadFromServer.push(serverData.result);
                            var ItemCreateManage = {};
                            if (DataDownloadFromServer.length > 0) {
                                DataDownloadFromServer.forEach(function (ckey, val) {
                                    console.log('ckey', ckey);
                                    ItemCreateManage = {
                                        "_id": lskey._id,
                                        "id": response.item_id,
                                        "business_group": ckey.business_group[0].group_id[0],
                                        "ItemSellingRule": ckey.ItemSellingRule,
                                        "AuthorizedForSaleFlag": ckey.AuthorizedForSaleFlag,
                                        "DiscountFlag": ckey.DiscountFlag,
                                        "PriceAuditFlag": ckey.PriceAuditFlag,
                                        "TaxExemptCode": ckey.TaxExemptCode,
                                        "UsageCode": ckey.UsageCode,
                                        "ItemName": ckey.ItemName,
                                        "Description": ckey.Description,
                                        "LongDescription": ckey.LongDescription,
                                        "TypeCode": ckey.TypeCode,
                                        "KitSetCode": ckey.KitSetCode,
                                        "SubstituteIdentifiedFlag": ckey.SubstituteIdentifiedFlag,
                                        "OrderCollectionCode": ckey.OrderCollectionCode,
                                        "SerializedIUnitValidationFlag": ckey.SerializedIUnitValidationFlag,
                                        "retail_package_size": ckey.retail_package_size,
                                        "ABV": ckey.ABV,
                                        "isblocked": ckey.isblocked,
                                        "MerchandiseHierarchyGroup": ckey.MerchandiseHierarchyGroup,
                                        "ItemSellingPrices": ckey.ItemSellingPrices,
                                        "POSDepartment": ckey.POSDepartment,
                                        "PriceLine": ckey.PriceLine,
                                        "BrandName": ckey.BrandName,
                                        "Parent": ckey.Parent,
                                        "SubBrand": ckey.SubBrand,
                                        "is_expand": ckey.is_expand,
                                        "upc_a": ckey.ItemID,
                                        "size": ckey.size,
                                        "supplier": ckey.supplier,
                                        "merchandise9_shelflocation": ckey.merchandise9_shelflocation,
                                        "merchandise12_cateogy": ckey.merchandise12_cateogy,
                                        "merchandise14_age": ckey.merchandise14_age,
                                        "merchandise15_cigarettepricetiers": ckey.merchandise15_cigarettepricetiers,
                                        "merchandise17_departments": ckey.merchandise17_departments,
                                        "merchandise16_groups": ckey.merchandise16_groups,
                                        "merchandise18_categories": ckey.merchandise18_categories,
                                        "merchandise10_location": ckey.merchandise10_location,
                                        "merchandise13_gender": ckey.merchandise13_gender,
                                        "current_price": ckey.current_price,
                                        "current_cost": ckey.current_cost,
                                        "qty_on_hand": ckey.qty_on_hand,
                                        "qty_in_case": ckey.qty_in_case,
                                        "margin": ckey.margin,
                                        "isExpandable": ckey.isExpandable
                                    };
                                });
                                dbLoader.ItemDB.remove({ _id: lskey._id, SavedWithLocal: "YES" }, { multi: true }, function (err, dataDelete) {
                                    if (!err) {
                                        dbLoader.ItemDB.insert(ItemCreateManage, function (err, docs) { });
                                        console.log('Item Created.');
                                    }
                                });
                            }

                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            });
        }
    });

    dbLoader.ItemUpdateDB.find({}, function (err, data) {
        var responseCreate = {};
        if (data.length > 0) {
            var ITEMID = 0;
            data.forEach(function (lkey, val) {
                ITEMID = lkey.id;
                var ParamConfig = {
                    "workerId": appLoader.WORKER_ID,
                    "business_group": [BusinessGroupID],
                    "upc": lkey.upc_a,
                    "size": lkey.size,
                    "description": lkey.Description,
                    "pos_department_name": (lkey.POSDepartment != null) ? lkey.POSDepartment.POSDepartmentName : null,
                    "brand_name": (lkey.BrandName != null) ? lkey.BrandName.BrandName : null,
                    "sub_brand": null,
                    "retail_package_size": (lkey.retail_package_size != null) ? lkey.retail_package_size : null,
                    "merchandise": null,
                    "selling_rule_id": (lkey.ItemSellingRule != null) ? lkey.ItemSellingRule : null,
                    "min_inventory_level": 0,
                    "max_inventory_level": 0,
                    "desired_inventory_level": 0,
                    "price": (lkey.ItemSellingPrices.CurrentPackagePrice != null) ? lkey.ItemSellingPrices.CurrentPackagePrice : null,
                    "cost": (lkey.ItemSellingPrices.cost != null) ? lkey.ItemSellingPrices.cost : null,
                    "margin": (lkey.ItemSellingPrices.margin != null) ? lkey.ItemSellingPrices.margin : null,
                    "markup": (lkey.ItemSellingPrices.markup != null) ? lkey.ItemSellingPrices.markup : null,
                    "profit": (lkey.ItemSellingPrices.profit != null) ? lkey.ItemSellingPrices.profit : null,
                    "begin_date": (lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceEffectiveDate != null) ? lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceEffectiveDate : null,
                    "end_date": (lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceExpirationDate != null) ? lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceExpirationDate : null,
                    "msrp": (lkey.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount != null) ? lkey.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount : null,
                    "msrp_date": (lkey.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceEffectiveDate != null) ? lkey.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceEffectiveDate : null,
                    "compare_at_sale_unit_price": (lkey.ItemSellingPrices.CompareAtSaleUnitRetailPriceAmount != null) ? lkey.ItemSellingPrices.CompareAtSaleUnitRetailPriceAmount : null,
                    "ItemSellingPrices": null,
                    "selling_price_type": 1,
                    "CurrentSaleUnitReturnPrice": (lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceAmount != null) ? lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceAmount : null,
                    "MinimumAdvertisedRetailUnitPrice": (lkey.ItemSellingPrices.MinimumAdvertisedRetailUnitPrice != null) ? lkey.ItemSellingPrices.MinimumAdvertisedRetailUnitPrice : null,
                    "MinimumAdvertisedRetailUnitPriceEffectiveDate": (lkey.ItemSellingPrices.MinimumAdvertisedRetailUnitPriceEffectiveDate != null) ? lkey.ItemSellingPrices.MinimumAdvertisedRetailUnitPriceEffectiveDate : null
                };
                console.log(ParamConfig);
                var ItemPutUrl = appLoader.BASEURL + "item_basic_info/" + ITEMID + "/";
                appLoader.CallDataFromServer("PUT", ItemPutUrl, ParamConfig).then(function (response) {
                    responseCreate = response;
                    // console.log(responseCreate);
                    if (responseCreate.status == 1) {
                        dbLoader.ItemUpdateDB.remove({ _id: lkey._id }, { multi: true }, function (err, cb) {
                            if (err) {
                                errCount += 1;
                            } else {
                                var getUrl = appLoader.BASEURL + "upctoitem/" + lkey.upc_a[0] + "/?business_group=" + BusinessGroupID;
                                appLoader.CallDataFromServer("GET", getUrl, {}).then(function (createresponse) {
                                    DataDownloadFromServer = [];
                                    DataDownloadFromServer.push(createresponse.result);
                                    var ItemCreateManage = {};
                                    if (DataDownloadFromServer.length > 0) {
                                        DataDownloadFromServer.forEach(function (key, val) {
                                            ItemCreateManage = {
                                                "id": key.id,
                                                "business_group": key.business_group[0].group_id[0],
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
                                                "upc_a": key.ItemID,
                                                "retail_package_size": key.retail_package_size,
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

                                }).catch(function (err) {
                                    console.log(err);
                                });
                            }

                        });
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            });
        }
    });

    dbLoader.ItemDeleteDB.find({}, function (err, data) {
        var ParamConfig = {};
        var delete_ids = [];
        if (data.length > 0) {
            data.forEach(function (key, val) {
                delete_ids.push(key.id);
            });
            if (delete_ids.length > 0) {
                ParamConfig = {
                    "ids": delete_ids,
                    "value": data[0].value,
                    "type": data[0].type
                };
                var ItemDeleteUrl = appLoader.BASEURL + "items/";
                appLoader.CallDataFromServer("DELETE", ItemDeleteUrl, ParamConfig).then(function (response) {

                    dbLoader.ItemDeleteDB.remove({}, function (err, data) { });
                    console.log('Item updated successfully.');

                }).catch(function (err) {
                    console.log(err);
                });
            }

        }
    });

    dbLoader.SupplierItemDB.find({}, function (err, data) {
        var responseCreate = {};
        var ITEMID = 0;
        var SupplierIDs = [];
        if (data.length > 0) {
            data.forEach(function (lkey, val) {
                ITEMID = lkey.IITEMID;
                if (lkey.SUPPLIERS.length > 0) {
                    var ParamConfig = {
                        "supplier_ids": lkey.SUPPLIERS,
                        "workerId": appLoader.WORKER_ID
                    };

                    var supllierUpdateUrl = appLoader.BASEURL + "supplier_update/" + ITEMID + "/";
                    appLoader.CallDataFromServer("PUT", supllierUpdateUrl, ParamConfig).then(function (response) {
                        responseCreate = response;
                        if (responseCreate.status == 1) {
                            dbLoader.SupplierItemDB.remove({ _id: lkey._id }, { multi: true }, function (err, cb) {
                                if (err) {
                                    errCount += 1;
                                } else {
                                    console.log('Supplier Added Successfully.');
                                }
                            });
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
            });
        }
    });

    dbLoader.ItemDB.count({}).exec(function (err, TotalRecords) {
        if (TotalRecords > 50) {
            var getURL = appLoader.BASEURL + "items/?IPADDRESS=" + ipinfo + "&business_group=" + BusinessGroupID;
            appLoader.CallDataFromServer("GET", getURL, {}).then(function (response) {
                if (response != 'undefined') {
                    DataDownloadFromServer = [];
                    DataDownloadFromServer = response.result;
                    if (DataDownloadFromServer.length > 0 && response.result != 'undefined') {
                        var ITEMSELLINGPRICE = {};
                        DataDownloadFromServer.forEach(function (key, val) {
                            if (key.business_unit_group_item[0] != 'undefined' && key.business_unit_group_item[0] != 'undefined') {
                                if (key.business_unit_group_item[0].ItemSellingPrices != 'undefined' && key.business_unit_group_item[0].ItemSellingPrices != null) {
                                    ITEMSELLINGPRICE = key.business_unit_group_item[0].ItemSellingPrices;
                                }
                            }
                            var ItemCreateManage = {
                                "id": key.id,
                                "business_group": key.business_unit_group_item[0].BusinessUnitGroup.id,
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
                                    dbLoader.ItemDB.insert(ItemCreateManage, function (err, docs) {
                                        console.log('Inserted.');
                                    });
                                } else {
                                    dbLoader.ItemDB.update({ _id: docs[0]._id }, { $set: ItemCreateManage }, function (err) {
                                        if (err) {
                                            errCount += 1;
                                        } else {
                                            console.log('Updated.');
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        console.log('No data found.');
                    }
                } else {
                    console.log('Server not responded.');
                }
            }).catch(function (err) {
                console.log(err);
            });
        }
    });


    if (errCount == 0) {
        response = { 'status': 1, 'message': 'Item sync successfully.' };
    } else {
        response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
    }
    res.setHeader('content-type', 'text/javascript');
    res.json(response);

});
