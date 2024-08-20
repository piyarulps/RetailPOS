var app = require("express")();
var dbLoader = require('./itemdbLoader.js');
var SupplierdbLoader = require('../Vendors/vendordbloader.js');
var jQuery = require('jquery');
var appLoader = require('../../app.js');
var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');

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
        // console.log(data);
        if (data[0].supplier != null) {
            SupplierItemDatas = data[0].supplier;
            if (SupplierItemDatas.length > 0) {
                TotolCount = SupplierItemDatas.length;
                var SupplierData = [];
                var promise1 = new Promise(function (resolve, reject) {
                    var tempCount = 0;
                    SupplierItemDatas.forEach(function (key, val) {
                        //console.log('supplier name',key);
                        SupplierdbLoader.SupplierListDB.find({ SupplierName: key }).exec(function (err, sdata) {
                            // console.log('supplier name',sdata)
                            if (sdata.length > 0) {
                                tempCount++;
                                var ItemSupplierData={
                                    'AssortmentDescription': null,
                                    'AssortmentFlag': 0,
                                    'Item': ITEMID,
                                    'LastReceiptSaleByUnitCount': "0",
                                    'LastReceiptSaleUnitBaseCost': "0.00",
                                    'Supplier': sdata[0].PartyData.SupplierID,
                                    'SupplierItem': null,
                                    'id': sdata[0].PartyData.VendorID,
                                    'isblocked': "n",
                                    'isdeleted': "n",
                                    're_order': 0
                                };
                                SupplierData.push(ItemSupplierData);
                            } else {
                                errCount += 1;
                            }
                            // console.log('TotolCount', TotolCount, 'tempCount', tempCount, 'condition', TotolCount == tempCount);
                            if (TotolCount == tempCount) {
                                resolve(SupplierData);
                            }
                        });
                    });
                });
                promise1.then(function (SupplierData) {
                    // console.log(SupplierData);

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


app.put("/:_id", function (req, res) {

    var errCount=0;
    var requestParam= req;
    var ITEMIDS=requestParam.params._id.split(",");
    var ItemCreateManage={};
    var UpdateItemBody = req.body;

    var SUPPLIER=[];
    var TotolCount=0;

    console.log(ITEMIDS);

    ITEMIDS.forEach(function (key, val) {
        dbLoader.ItemDB.find({_id:key}).exec(function (err, data) {
            if(data.length > 0){
                if(UpdateItemBody.supplier_ids.length > 0){
                    var SupplierItemDatas=UpdateItemBody.supplier_ids;
                    var tempCount = 0;
                    var SupplierData=[];
                    var SupplierIds=[];
                    var SupplierCompbinedData=[];
                    TotolCount=UpdateItemBody.supplier_ids.length;

                    var promise1 = new Promise(function (resolve, reject) {
                        SupplierItemDatas.forEach(function (skey, val) {
                            SupplierdbLoader.SupplierListDB.find({ 'PartyData.SupplierID': skey }).exec(function (err, sdata) {
                                // console.log('supplier name',sdata)
                                if (sdata.length > 0) {
                                    tempCount++;                                
                                    SupplierData.push(sdata[0].SupplierName);
                                    SupplierIds.push(sdata[0].PartyData.SupplierID);
                                } else {
                                    errCount += 1;
                                }
                                if (TotolCount == tempCount) {
                                    SupplierCompbinedData=[SupplierData,SupplierIds]
                                    resolve(SupplierCompbinedData);
                                }
                            });
                        });
                    });

                    promise1.then(function (SupplierData,SupplierIds) {
                        console.log(SupplierCompbinedData[0]);
                        console.log(SupplierCompbinedData[1]);
                        SUPPLIER=SupplierCompbinedData[0];

                        ItemCreateManage= {
                            "ItemSellingPrices":data[0].ItemSellingPrices,
                            "ItemSellingRule":data[0].ItemSellingRule,
                            "AuthorizedForSaleFlag": 0,
                            "DiscountFlag": 0,
                            "PriceAuditFlag": 0,
                            "TaxExemptCode": 0,
                            "UsageCode": 0,
                            "ItemName": data[0].ItemName,
                            "Description": data[0].Description,
                            "LongDescription": "",
                            "TypeCode": "",
                            "KitSetCode":"",
                            "SubstituteIdentifiedFlag":"",
                            "OrderCollectionCode": "",
                            "SerializedIUnitValidationFlag":"",
                            "ABV": "",
                            "isblocked": "n",
                            "retail_package_size":data[0].retail_package_size,
                            "MerchandiseHierarchyGroup":data[0].MerchandiseHierarchyGroup,
                            "POSDepartment": data[0].POSDepartment,
                            "PriceLine": "",
                            "BrandName":data[0].BrandName,
                            "Parent": "",
                            "SubBrand":"",
                            "is_expand":"n",
                            "upc_a":data[0].upc_a,
                            "size": data[0].size,
                            "supplier":SUPPLIER,
                            "merchandise9_shelflocation": "",
                            "merchandise12_cateogy": "",
                            "merchandise14_age": "",
                            "merchandise15_cigarettepricetiers": "",
                            "merchandise17_departments": "",
                            "merchandise16_groups": "",
                            "merchandise18_categories": "",
                            "merchandise10_location": "",
                            "merchandise13_gender": "",
                            "current_price":data[0].current_price,
                            "current_cost":data[0].current_cost,
                            "qty_on_hand":"",
                            "qty_in_case":"",
                            "margin":data[0].margin,
                            "isExpandable":true
                        };
                        console.log(SUPPLIER);
                        if(ItemCreateManage!=null){
                            dbLoader.ItemDB.find({_id: key}, function (err,CB) {
                                if(err){
                                    errCount+=1;
                                }else{
                                    if('id' in CB[0]){
                                        dbLoader.ItemDB.update({_id: CB[0]._id},{ $set: ItemCreateManage}, function (err) {
                                            if(err){
                                                errCount+=1;
                                            }else{
                                                var ItemSupplierDBData={
                                                    'IITEMID':CB[0].id,
                                                    'SUPPLIERS':SupplierCompbinedData[1]
                                                };
                                                dbLoader.SupplierItemDB.insert(ItemSupplierDBData, function (err){});
                                                console.log(key+' Server Data updated');
                                                UpdateToServer();
                                            }

                                        });

                                    }else{
                                        dbLoader.ItemDB.update({_id: CB[0]._id},{ $set: ItemCreateManage}, function (err) {});
                                        console.log(key+' Local Data updated');
                                    }
                                }
                            });
                        }

                        if(errCount==0){
                            response = { 'status': 1, 'message': 'Supplier updated successfully.'};
                            res.send(response);
                        }else{
                            response = { 'status': 1, 'message': 'Oops! something went wrong.'};
                            res.send(response);
                        }
                    });
                }else{
                    response = { 'status': 1, 'message': 'Item not Found.'};
                    res.send(response);
                }
            }

        });
    });


});





app.post("/:_id", function (req, res) {

    var errCount=0;
    var requestParam= req;
    var ITEMIDS=requestParam.params._id.split(",");
    var ItemCreateManage={};
    var UpdateItemBody = req.body;

    var SUPPLIER=[];
    var TotolCount=0;

    console.log(ITEMIDS);

    ITEMIDS.forEach(function (key, val) {
        dbLoader.ItemDB.find({_id:key}).exec(function (err, data) {
            if(data.length > 0){
                if(UpdateItemBody.supplier_ids.length > 0){
                    var SupplierItemDatas=UpdateItemBody.supplier_ids;
                    var tempCount = 0;
                    var SupplierData=[];
                    TotolCount=UpdateItemBody.supplier_ids.length;

                    var promise1 = new Promise(function (resolve, reject) {
                        SupplierItemDatas.forEach(function (skey, val) {
                            SupplierdbLoader.SupplierListDB.find({ 'PartyData.SupplierID': skey }).exec(function (err, sdata) {
                                // console.log('supplier name',sdata)
                                if (sdata.length > 0) {
                                    tempCount++;                                
                                    SupplierData.push(sdata[0].SupplierName);
                                } else {
                                    errCount += 1;
                                }
                                if (TotolCount == tempCount) {
                                    resolve(SupplierData);
                                }
                            });
                        });
                    });

                    promise1.then(function (SupplierData) {
                        // console.log(SupplierData);
                        SUPPLIER=SupplierData;

                        ItemCreateManage= {
                            "business_group":data[0].business_group,
                            "ItemSellingPrices":data[0].ItemSellingPrices,
                            "ItemSellingRule":data[0].ItemSellingRule,
                            "AuthorizedForSaleFlag": 0,
                            "DiscountFlag": 0,
                            "PriceAuditFlag": 0,
                            "TaxExemptCode": 0,
                            "UsageCode": 0,
                            "ItemName": data[0].ItemName,
                            "Description": data[0].Description,
                            "LongDescription": "",
                            "TypeCode": "",
                            "KitSetCode":"",
                            "SubstituteIdentifiedFlag":"",
                            "OrderCollectionCode": "",
                            "SerializedIUnitValidationFlag":"",
                            "ABV": "",
                            "isblocked": "n",
                            "retail_package_size":data[0].retail_package_size,
                            "MerchandiseHierarchyGroup":data[0].MerchandiseHierarchyGroup,
                            "POSDepartment": data[0].POSDepartment,
                            "PriceLine": "",
                            "BrandName":data[0].BrandName,
                            "Parent": "",
                            "SubBrand":"",
                            "is_expand":"n",
                            "upc_a":data[0].upc_a,
                            "size": data[0].size,
                            "supplier":SUPPLIER,
                            "merchandise9_shelflocation": "",
                            "merchandise12_cateogy": "",
                            "merchandise14_age": "",
                            "merchandise15_cigarettepricetiers": "",
                            "merchandise17_departments": "",
                            "merchandise16_groups": "",
                            "merchandise18_categories": "",
                            "merchandise10_location": "",
                            "merchandise13_gender": "",
                            "current_price":data[0].current_price,
                            "current_cost":data[0].current_cost,
                            "qty_on_hand":"",
                            "qty_in_case":"",
                            "margin":data[0].margin,
                            "isExpandable":true
                        };
                        console.log(SUPPLIER);
                        if(ItemCreateManage!=null){
                            dbLoader.ItemDB.find({_id: key}, function (err,CB) {
                                if(err){
                                    errCount+=1;
                                }else{
                                    if('id' in CB[0]){
                                        var ItemSupplierDBData={
                                            'IITEMID':CB[0].id,
                                            'SUPPLIERS':SUPPLIER
                                        };
                                        dbLoader.ItemDB.update({_id: CB[0]._id},{ $set: ItemCreateManage}, function (err) {
                                            if(err){
                                                errCount+=1;
                                            }else{
                                                dbLoader.SupplierItemDB.insert(ItemSupplierDBData, function (err){});
                                                console.log(key+' Server Data updated');
                                                UpdateToServer();
                                            }

                                        });

                                    }else{
                                        dbLoader.ItemDB.update({_id: CB[0]._id},{ $set: ItemCreateManage}, function (err) {});
                                        console.log(key+' Local Data updated');
                                    }
                                }
                            });
                        }

                        if(errCount==0){
                            response = { 'status': 1, 'message': 'Supplier updated successfully.'};
                        }else{
                            response = { 'status': 1, 'message': 'Oops! something went wrong.'};
                        }
                    });
                }else{
                    response = { 'status': 1, 'message': 'Item not Found.'};
                }
            }

        });
    });


    res.send(response);


});


function UpdateToServer() { 

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
                        "workerId":appLoader.WORKER_ID
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
                        console.err(err);
                    });
                }
            });
        }
    });

}