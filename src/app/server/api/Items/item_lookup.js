var dbLoader = require('./itemdbLoader.js');
var app = require("express")();
var SEARCHPARAM = '';
var requestParam = {};
var DataList = [];


module.exports = app;

app.get("/", function (req, res) {

    requestParam = req;
    var response = {};
    var ItemObjectLookup = {};

    if (typeof (requestParam.query) != 'undefined' && requestParam.query != null) {
        if (typeof (requestParam.query.q) != 'undefined' && requestParam.query.q != null) {
            SEARCHPARAM = requestParam.query.q;
        }
    }
    // console.log(SEARCHPARAM);
    if (SEARCHPARAM != '') {
        var ITEMPRICE = 0.00;
        var response = {};
        if (isNaN(SEARCHPARAM) == true) {
            var REGEX = new RegExp(SEARCHPARAM, "i");
            // console.log(REGEX);
            DataList = [];
            dbLoader.ItemDB.find({ Description: { $regex: REGEX } }).limit(5).exec(function (err, data) {
                //console.log(data);
                if (data != 'undefined') {
                    if (data.length > 0) {
                        data.forEach(function (key, val) {
                            if (typeof key.upc_a != 'undefined') {
                                if(key.ItemSellingPrices!=null && key.ItemSellingPrices!='undefined'){
                                    if('CurrentPackagePrice' in key.ItemSellingPrices && key.ItemSellingPrices.CurrentPackagePrice!='undefined'){
                                        ITEMPRICE = key.ItemSellingPrices.CurrentPackagePrice;
                                    }else{
                                        ITEMPRICE = 0;
                                    }
                                }
                                ItemObjectLookup = {
                                    "ItemName": key.ItemName,
                                    "UPC": key.upc_a[0],
                                    "ItemPrice": ITEMPRICE
                                };
                                DataList.push(ItemObjectLookup);
                            }

                        });
                        SEARCHPARAM = '';
                    }
                }
                if (DataList.length > 0) {
                    response = { 'status': 1, 'message': 'Items Record.', 'result': DataList };
                    res.send(response);
                } else {
                    response = { 'status': 0, 'message': 'No products found.', 'result': [] };
                    res.send(response);
                }
            });
        } else {
            DataList = [];
            var REGEX = new RegExp("^"+SEARCHPARAM, "i");
            // console.log(REGEX);
            dbLoader.ItemDB.find({ upc_a: {$regex: REGEX} }).limit(5).exec(function (err, data) {
                if (data != 'undefined') {
                    if (data.length > 0) {
                        data.forEach(function (key, val) {
                            if (typeof key.upc_a != 'undefined') {
                                if(key.ItemSellingPrices!=null && key.ItemSellingPrices!='undefined'){
                                    if('CurrentPackagePrice' in key.ItemSellingPrices && key.ItemSellingPrices.CurrentPackagePrice!='undefined'){
                                        ITEMPRICE = key.ItemSellingPrices.CurrentPackagePrice;
                                    }else{
                                        ITEMPRICE = 0;
                                    }
                                }
                                ItemObjectLookup = {
                                    "ItemName": key.ItemName,
                                    "UPC": key.upc_a[0],
                                    "ItemPrice": ITEMPRICE
                                };
                                DataList.push(ItemObjectLookup);
                            }
                        });
                        SEARCHPARAM = '';
                    }
                }

                if (DataList.length > 0) {
                    response = { 'status': 1, 'message': 'Items Record.', 'result': DataList };
                    res.send(response);
                } else {
                    response = { 'status': 0, 'message': 'No products found.', 'result': [] };
                    res.send(response);
                }
            });
        }

    }

});




