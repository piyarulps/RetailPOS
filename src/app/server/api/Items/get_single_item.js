var dbLoader = require('./itemdbLoader.js');
var app = require("express")();
var jQuery = require('jquery');
var appLoader = require('../../app.js');
var fs = require('fs');
var mime = require('mime');
var DataDownloadFromServer = [];

module.exports = app;

app.get("/:_id", function (req, res) {


    // var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');
    var requestParam = req;
    var ITEMID = requestParam.params._id;
    //console.log(ITEMID);



    var response = {};
    var ItemData = {};
    dbLoader.ItemDB.find({ _id: ITEMID }).exec(function (err, data) {
        if (data.length > 0) {
            var images = [];
            var promise1 = new Promise(function (resolve, reject) {
                var tempCount = 0;
                dbLoader.ImagesDB.find({ Item: ITEMID }).exec(function (err, imgdata) {
                    if (imgdata.length > 0) {
                        var dir = process.cwd() + '/src/app/server/api/Items/item-images/' + ITEMID + '/';
                        imgdata.forEach(function (ipkey, ipval) {
                            tempCount++;
                            // fs.readdirSync(dir).forEach(file => {
                            //     console.log(file);
                            // });
                            images.push(dir + ipkey.filename);
                        });
                        if (tempCount == imgdata.length) {
                            resolve(images);
                        }
                    } else {
                        resolve(images = []);
                    }
                });
            });
            promise1.then(function (images) {
                ItemData = {
                    "ItemSellingRule": (data[0].ItemSellingRule != null) ? data[0].ItemSellingRule.id : data[0].ItemSellingRule,
                    "AuthorizedForSaleFlag": data[0].AuthorizedForSaleFlag,
                    "DiscountFlag": data[0].DiscountFlag,
                    "PriceAuditFlag": data[0].PriceAuditFlag,
                    "TaxExemptCode": data[0].TaxExemptCode,
                    "UsageCode": data[0].UsageCode,
                    "ItemName": data[0].ItemName,
                    "Description": data[0].Description,
                    "LongDescription": data[0].LongDescription,
                    "TypeCode": data[0].TypeCode,
                    "KitSetCode": data[0].KitSetCode,
                    "SubstituteIdentifiedFlag": data[0].SubstituteIdentifiedFlag,
                    "OrderCollectionCode": data[0].OrderCollectionCode,
                    "SerializedIUnitValidationFlag": data[0].SerializedIUnitValidationFlag,
                    "ABV": data[0].ABV,
                    "isblocked": "n",
                    "MerchandiseHierarchyGroup": data[0].MerchandiseHierarchyGroup,
                    "ItemSellingPrices": data[0].ItemSellingPrices,
                    "POSDepartment": data[0].POSDepartment,
                    "PriceLine": data[0].PriceLine,
                    "BrandName": data[0].BrandName,
                    "Parent": data[0].Parent,
                    "SubBrand": data[0].SubBrand,
                    "ItemID": data[0].upc_a,
                    "merchandise": data[0].merchandise,
                    "min_inventory_level": data[0].min_inventory_level,
                    "max_inventory_level": data[0].max_inventory_level,
                    "desired_inventory_level": data[0].desired_inventory_level,
                    "size": data[0].size,
                    "retail_package_size": data[0].retail_package_size,
                    "group_item_filter": null,
                    "images": images
                };

                response = { 'status': 1, 'message': 'Item data found.', 'result': ItemData };
                res.send(response);
            });
        }
    });

});

app.put("/:_id", function (req, res) {


    // var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');
    var errCount = 0;
    var requestParam = req;
    var ITEMIDS = requestParam.params._id.split(",");
    var ItemCreateManage = {};
    var UpdateItemBody = req.body;
    var UPC_A = [];
    var BRAND = null;
    var SellingRuleID = null;
    var POSDepartment = null;
    var ITEMSELLINGPRICES = {};
    var SUPPLIER = []
    //console.log(ITEMIDS);

    ITEMIDS.forEach(function (key, val) {
        dbLoader.ItemDB.find({ _id: key }).exec(function (err, data) {
            if (data.length > 0) {
                SUPPLIER = data[0].supplier; 
                if (UpdateItemBody.pos_department_name != null) {
                    POSDepartment = { 'POSDepartmentName': UpdateItemBody.pos_department_name };
                } else {
                    if (data[0].POSDepartment != null) {
                        POSDepartment = { 'POSDepartmentName': data[0].POSDepartment.POSDepartmentName };
                    } else {
                        POSDepartment = null;
                    }
                }
                if (UpdateItemBody.brand_name != null) {
                    BRAND = { 'BrandName': UpdateItemBody.brand_name };
                } else {
                    if (data[0].BrandName != null) {
                        BRAND = { 'BrandName': data[0].BrandName.BrandName };
                    } else {
                        BRAND = null;
                    }
                }

                if (UpdateItemBody.selling_rule_id != null) {
                    SellingRuleID = UpdateItemBody.selling_rule_id;
                } else {
                    if (data[0].ItemSellingRule != null) {
                        SellingRuleID = data[0].ItemSellingRule.id;
                    } else {
                        SellingRuleID = null;
                    }
                }

                if (data[0].ItemSellingPrices != null) {
                    ITEMSELLINGPRICES = {
                        "id": (UpdateItemBody.ItemSellingPrices != null) ? UpdateItemBody.ItemSellingPrices : null,
                        "PermanentSaleUnitRetailPriceAmount": null,
                        "PermanentSaleUnitRetailPriceOriginalMarkdownFlag": 0,
                        "PermanentRetailPricePermanentMarkdownCount": null,
                        "PermanentRetailPriceEffectiveDate": null,
                        "CurrentSaleUnitRetailPriceAmount": (UpdateItemBody.CurrentSaleUnitReturnPrice != 0) ? UpdateItemBody.CurrentSaleUnitReturnPrice : data[0].ItemSellingPrices.CurrentSaleUnitRetailPriceAmount,
                        "CurrentSaleUnitRetailPriceTypeCode": null,
                        "CurrentSaleUnitRetailPricePointAllowedFlag": 0,
                        "CurrentSaleUnitRetailPriceEffectiveDate": (UpdateItemBody.begin_date != null) ? UpdateItemBody.begin_date : data[0].ItemSellingPrices.CurrentSaleUnitRetailPriceEffectiveDate,
                        "CurrentSaleUnitRetailPriceExpirationDate": (UpdateItemBody.end_date != null) ? UpdateItemBody.end_date : data[0].ItemSellingPrices.CurrentSaleUnitRetailPriceExpirationDate,
                        "ManufacturerSaleUnitRecommendedRetailPriceAmount": (UpdateItemBody.msrp != null) ? UpdateItemBody.msrp : data[0].ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount,
                        "ManufacturerSaleUnitRecommendedRetailPriceEffectiveDate": (UpdateItemBody.msrp_date != null) ? UpdateItemBody.msrp_date : data[0].ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceEffectiveDate,
                        "CompareAtSaleUnitRetailPriceAmount": (UpdateItemBody.compare_at_sale_unit_price != 0) ? UpdateItemBody.compare_at_sale_unit_price : data[0].ItemSellingPrices.CompareAtSaleUnitRetailPriceAmount,
                        "QuantityPricingFlag": 0,
                        "CurrentPackagePriceQuantity": "1",
                        "CurrentPackagePrice": (UpdateItemBody.price != 0) ? UpdateItemBody.price : data[0].ItemSellingPrices.CurrentPackagePrice,
                        "PermanentPackagePriceQuantity": null,
                        "PermanentPackagePrice": null,
                        "PermanentSaleUnitReturnPrice": null,
                        "CurrentSaleUnitReturnPrice": (UpdateItemBody.CurrentSaleUnitReturnPrice != 0) ? UpdateItemBody.CurrentSaleUnitReturnPrice : data[0].ItemSellingPrices.CurrentSaleUnitReturnPrice,
                        "IncludesSalesTaxFlag": 0,
                        "PermanentSalesTaxAmount": null,
                        "CurrentSalesTaxAmount": null,
                        "MinimumAdvertisedRetailUnitPrice": (UpdateItemBody.MinimumAdvertisedRetailUnitPrice != null) ? UpdateItemBody.MinimumAdvertisedRetailUnitPrice : data[0].ItemSellingPrices.MinimumAdvertisedRetailUnitPrice,
                        "MinimumAdvertisedRetailUnitPriceEffectiveDate": (UpdateItemBody.MinimumAdvertisedRetailUnitPriceEffectiveDate != null) ? UpdateItemBody.MinimumAdvertisedRetailUnitPriceEffectiveDate : data[0].ItemSellingPrices.MinimumAdvertisedRetailUnitPriceEffectiveDate,
                        "margin": (UpdateItemBody.margin != 0) ? UpdateItemBody.margin : data[0].ItemSellingPrices.margin,
                        "profit": (UpdateItemBody.profit != 0) ? UpdateItemBody.profit : data[0].ItemSellingPrices.profit,
                        "cost": (UpdateItemBody.cost != 0) ? UpdateItemBody.cost : data[0].ItemSellingPrices.cost,
                        "selling_price_type": (UpdateItemBody.selling_price_type != null) ? UpdateItemBody.selling_price_type : data[0].ItemSellingPrices.selling_price_type,
                        "markup": (UpdateItemBody.markup != 0) ? UpdateItemBody.markup : data[0].ItemSellingPrices.markup
                    };
                } else {
                    ITEMSELLINGPRICES = {
                        "PermanentSaleUnitRetailPriceAmount": null,
                        "PermanentSaleUnitRetailPriceOriginalMarkdownFlag": 0,
                        "PermanentRetailPricePermanentMarkdownCount": null,
                        "PermanentRetailPriceEffectiveDate": null,
                        "CurrentSaleUnitRetailPriceAmount": (UpdateItemBody.CurrentSaleUnitReturnPrice != 0) ? UpdateItemBody.CurrentSaleUnitReturnPrice : null,
                        "CurrentSaleUnitRetailPriceTypeCode": null,
                        "CurrentSaleUnitRetailPricePointAllowedFlag": 0,
                        "CurrentSaleUnitRetailPriceEffectiveDate": (UpdateItemBody.begin_date != null) ? UpdateItemBody.begin_date : null,
                        "CurrentSaleUnitRetailPriceExpirationDate": (UpdateItemBody.end_date != null) ? UpdateItemBody.end_date : null,
                        "ManufacturerSaleUnitRecommendedRetailPriceAmount": (UpdateItemBody.msrp != null) ? UpdateItemBody.msrp : null,
                        "ManufacturerSaleUnitRecommendedRetailPriceEffectiveDate": (UpdateItemBody.msrp_date != null) ? UpdateItemBody.msrp_date : null,
                        "CompareAtSaleUnitRetailPriceAmount": (UpdateItemBody.compare_at_sale_unit_price != 0) ? UpdateItemBody.compare_at_sale_unit_price : null,
                        "QuantityPricingFlag": 0,
                        "CurrentPackagePriceQuantity": "1",
                        "CurrentPackagePrice": (UpdateItemBody.price != 0) ? UpdateItemBody.price : null,
                        "PermanentPackagePriceQuantity": null,
                        "PermanentPackagePrice": null,
                        "PermanentSaleUnitReturnPrice": null,
                        "CurrentSaleUnitReturnPrice": (UpdateItemBody.CurrentSaleUnitReturnPrice != 0) ? UpdateItemBody.CurrentSaleUnitReturnPrice : null,
                        "IncludesSalesTaxFlag": 0,
                        "PermanentSalesTaxAmount": null,
                        "CurrentSalesTaxAmount": null,
                        "MinimumAdvertisedRetailUnitPrice": (UpdateItemBody.MinimumAdvertisedRetailUnitPrice != null) ? UpdateItemBody.MinimumAdvertisedRetailUnitPrice : null,
                        "MinimumAdvertisedRetailUnitPriceEffectiveDate": (UpdateItemBody.MinimumAdvertisedRetailUnitPriceEffectiveDate != null) ? UpdateItemBody.MinimumAdvertisedRetailUnitPriceEffectiveDate : null,
                        "margin": (UpdateItemBody.margin != 0) ? UpdateItemBody.margin : null,
                        "profit": (UpdateItemBody.profit != 0) ? UpdateItemBody.profit : null,
                        "cost": (UpdateItemBody.cost != 0) ? UpdateItemBody.cost : null,
                        "selling_price_type": (UpdateItemBody.selling_price_type != null) ? UpdateItemBody.selling_price_type : null,
                        "markup": (UpdateItemBody.markup != 0) ? UpdateItemBody.markup : null
                    };

                }


                ItemCreateManage = {
                    "ItemSellingPrices": ITEMSELLINGPRICES,
                    "ItemSellingRule": SellingRuleID,
                    "AuthorizedForSaleFlag": 0,
                    "DiscountFlag": 0,
                    "PriceAuditFlag": 0,
                    "TaxExemptCode": 0,
                    "UsageCode": 0,
                    "ItemName": (UpdateItemBody.description != null) ? UpdateItemBody.description : data[0].ItemName,
                    "Description": (UpdateItemBody.description != null) ? UpdateItemBody.description : data[0].Description,
                    "LongDescription": "",
                    "TypeCode": "",
                    "KitSetCode": "",
                    "SubstituteIdentifiedFlag": "",
                    "OrderCollectionCode": "",
                    "SerializedIUnitValidationFlag": "",
                    "ABV": "",
                    "isblocked": "n",
                    "retail_package_size": (UpdateItemBody.retail_package_size != null) ? UpdateItemBody.retail_package_size : data[0].retail_package_size,
                    "MerchandiseHierarchyGroup": UpdateItemBody.MerchandiseHierarchyGroup,
                    "POSDepartment": POSDepartment,
                    "PriceLine": "",
                    "BrandName": BRAND,
                    "Parent": "",
                    "SubBrand": "",
                    "is_expand": "n",
                    "upc_a": data[0].upc_a,
                    "size": (UpdateItemBody.size != null) ? UpdateItemBody.size : data[0].size,
                    "supplier": SUPPLIER,
                    "merchandise9_shelflocation": "",
                    "merchandise12_cateogy": "",
                    "merchandise14_age": "",
                    "merchandise15_cigarettepricetiers": "",
                    "merchandise17_departments": "",
                    "merchandise16_groups": "",
                    "merchandise18_categories": "",
                    "merchandise10_location": "",
                    "merchandise13_gender": "",
                    "current_price": UpdateItemBody.current_price,
                    "current_cost": UpdateItemBody.current_cost,
                    "qty_on_hand": "",
                    "qty_in_case": "",
                    "margin": UpdateItemBody.margin,
                    "isExpandable": true
                };
                //console.log(ItemCreateManage);
                if (ItemCreateManage != null) {
                    dbLoader.ItemDB.find({ _id: key }, function (err, CB) {
                        if (err) {
                            errCount += 1;
                        } else {
                            if (UpdateItemBody.uploadedImage.length > 0) {
                                var IMAGEARRAY = UpdateItemBody.uploadedImage;
                                var imgresponse = {};
                                var dir = process.cwd() + '/src/app/server/api/Items/item-images/' + key + '/';

                                if (!fs.existsSync(dir)) {
                                    fs.mkdirSync(dir);
                                }
                                var i = 0;
                                IMAGEARRAY.forEach(function (basekey, baseval) {
                                    i++;
                                    var matches = basekey.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                                    if (matches.length !== 3) {
                                        return new Error('Invalid input string');
                                    }
                                    imgresponse.type = matches[1];
                                    imgresponse.data = new Buffer.from(matches[2], 'base64');
                                    var decodedImg = imgresponse;
                                    var imageBuffer = decodedImg.data;
                                    var type = decodedImg.type;
                                    var extension = mime.getExtension(type);
                                    var fileName = "image_" + i + "." + extension;
                                    try {
                                        fs.writeFileSync(dir + fileName, imageBuffer, 'utf8');
                                        dbLoader.ImagesDB.remove({ 'Item': key }, { multi: true }, function (err, imageDeleted) {
                                            if (!err) {
                                                dbLoader.ImagesDB.insert({ 'filename': fileName, 'Item': key }, function (err, ItemSaved) { });
                                            }
                                        });
                                    } catch (e) {
                                        console.log(e);
                                    }
                                });
                            }
                            if ('id' in CB[0]) {
                                ItemCreateManage.id = data[0].id;
                                ItemCreateManage.upc_a = data[0].upc_a;
                                dbLoader.ItemDB.update({ _id: CB[0]._id }, { $set: ItemCreateManage }, function (err) { });
                                dbLoader.ItemUpdateDB.insert(ItemCreateManage, function (err) { });
                                console.log(key + 'Server Data updated');
                                UpdateToServer();
                            } else {
                                dbLoader.ItemDB.update({ _id: CB[0]._id }, { $set: ItemCreateManage }, function (err) { });
                                console.log(key + 'Local Data updated');
                            }
                        }
                    });
                }
            }

        });
    });
    if (errCount == 0) {
        response = { 'status': 1, 'message': 'Item updated successfully.' };
        res.send(response);
    } else {
        response = { 'status': 1, 'message': 'Oops! something went wrong.' };
        res.send(response);
    }

});


function UpdateToServer() {

    var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');
    console.log(appLoader.WORKER_ID);


    dbLoader.ItemUpdateDB.find({}, function (err, data) {
        var responseCreate = {};
        if (data.length > 0) {
            var ITEMID = 0;
            data.forEach(function (lkey, val) {
                ITEMID = lkey.id;
                var ParamConfig = {
                    "workerId":appLoader.WORKER_ID,
                    "business_group":[BusinessGroupID],
                    "upc": lkey.upc_a,
                    "size": lkey.size,
                    "description": lkey.Description,
                    "pos_department_name": (lkey.POSDepartment != null) ? lkey.POSDepartment.POSDepartmentName : null,
                    "brand_name": (lkey.BrandName != null) ? lkey.BrandName.BrandName : null,
                    "sub_brand": null,
                    "retail_package_size": (lkey.retail_package_size!=null)?lkey.retail_package_size:null,
                    "merchandise": null,
                    "selling_rule_id": (lkey.ItemSellingRule!=null)?lkey.ItemSellingRule:null,
                    "min_inventory_level": 0,
                    "max_inventory_level": 0,
                    "desired_inventory_level": 0,
                    "price": (lkey.ItemSellingPrices.CurrentPackagePrice!=null)?lkey.ItemSellingPrices.CurrentPackagePrice:null,
                    "cost": (lkey.ItemSellingPrices.cost!=null)?lkey.ItemSellingPrices.cost:null,
                    "margin": (lkey.ItemSellingPrices.margin!=null)?lkey.ItemSellingPrices.margin:null,
                    "markup": (lkey.ItemSellingPrices.markup!=null)?lkey.ItemSellingPrices.markup:null,
                    "profit": (lkey.ItemSellingPrices.profit!=null)?lkey.ItemSellingPrices.profit:null,
                    "begin_date": (lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceEffectiveDate!=null)?lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceEffectiveDate:null,
                    "end_date": (lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceExpirationDate!=null)?lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceExpirationDate:null,
                    "msrp": (lkey.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount!=null)?lkey.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceAmount:null,
                    "msrp_date": (lkey.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceEffectiveDate!=null)?lkey.ItemSellingPrices.ManufacturerSaleUnitRecommendedRetailPriceEffectiveDate:null,
                    "compare_at_sale_unit_price": (lkey.ItemSellingPrices.CompareAtSaleUnitRetailPriceAmount!=null)?lkey.ItemSellingPrices.CompareAtSaleUnitRetailPriceAmount:null,
                    "ItemSellingPrices": null,
                    "selling_price_type": 1,
                    "CurrentSaleUnitReturnPrice":(lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceAmount!=null)?lkey.ItemSellingPrices.CurrentSaleUnitRetailPriceAmount:null,
                    "MinimumAdvertisedRetailUnitPrice": (lkey.ItemSellingPrices.MinimumAdvertisedRetailUnitPrice!=null)?lkey.ItemSellingPrices.MinimumAdvertisedRetailUnitPrice:null,
                    "MinimumAdvertisedRetailUnitPriceEffectiveDate": (lkey.ItemSellingPrices.MinimumAdvertisedRetailUnitPriceEffectiveDate!=null)?lkey.ItemSellingPrices.MinimumAdvertisedRetailUnitPriceEffectiveDate:null
                };
                console.log(JSON.stringify(ParamConfig));
                var PutURL = appLoader.BASEURL + "item_basic_info/" + ITEMID + "/";
                console.log(PutURL);
                appLoader.CallDataFromServer("PUT", PutURL, ParamConfig).then(function (callback) {
                    responseCreate = callback;
                    if (responseCreate.status == 1) {

                        dbLoader.ItemUpdateDB.remove({ _id: lkey._id }, { multi: true }, function (err, cb) {
                            if (err) {
                                errCount += 1;
                            } else {
                                var getURL = appLoader.BASEURL + "upctoitem/" + lkey.upc_a[0] + "/?business_group="+BusinessGroupID;
                                appLoader.CallDataFromServer("GET", getURL, {}).then(function (serverData) {
                                    console.log(serverData);

                                    if (typeof serverData.result != 'undefined' && serverData.result != null && serverData.status == 1) {
                                        DataDownloadFromServer.push(serverData.result);
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

}