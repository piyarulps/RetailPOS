var app = require("express")();
var ipinfo = localStorage.getItem('identifier');
var appLoader = require('../../app.js');
module.exports = app;

app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');

    var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');
    var response = {};
    var PostURL = appLoader.BASEURLSHORT + "downloading-count/";
    var RequestParam = {
        'IPADDRESS': ipinfo,
        'BusinessGroupID': BusinessGroupID
    };
    console.log(RequestParam)
    appLoader.CallDataFromServer("POST", PostURL, RequestParam).then(function (CountResponse) {
        if (CountResponse != 'undefined' && CountResponse != null) {
            var PriceLineGetUrl = appLoader.BASEURL + "priceline_list/";
            appLoader.CallDataFromServer("GET", PriceLineGetUrl, {}).then(function (responsePriceLine) {
                if (responsePriceLine != 'undefined' && responsePriceLine != null) {
                    CountResponse.PriceLines = responsePriceLine.result.length;
                    var ItemTypeListGetUrl = appLoader.BASEURL + "item_type_list/";
                    appLoader.CallDataFromServer("GET", ItemTypeListGetUrl, {}).then(function (responseItemTypelist) {
                        if (responseItemTypelist != 'undefined' && responseItemTypelist != null) {
                            CountResponse.ItemTypeLists = responseItemTypelist.result.length;
                            var PosDeptGetUrl = appLoader.BASEURL + "posfromnacs/?nacs_category=null&nacs_subcategory=null&/";
                            appLoader.CallDataFromServer("GET", PosDeptGetUrl, {}).then(function (responsePOSDept) {
                                if (responsePOSDept != 'undefined' && responsePOSDept != null) {
                                    CountResponse.POSDepartments = (responsePOSDept.result.length != 'undefined') ? responsePOSDept.result.length : 0;
                                    var sellingruleGetUrl = appLoader.BASEURL + "sellingrule/";
                                    appLoader.CallDataFromServer("GET", sellingruleGetUrl, {}).then(function (responseSellingRule) {
                                        if (responseSellingRule != 'undefined' && responseSellingRule != null) {
                                            CountResponse.SellingRules = responseSellingRule.result.length;
                                            CountResponse.VendorRelatedDropdowns = 1;
                                            var UnitOFMGetUrl = appLoader.BASEURL + "uomlist/?colname=UOMName&/";
                                            appLoader.CallDataFromServer("GET", UnitOFMGetUrl, {}).then(function (responseUOM) {
                                                if (responseUOM != 'undefined' && responseUOM != null) {
                                                    CountResponse.UnitOfMeasurements = responseUOM.result.length;
                                                    response = CountResponse;
                                                    res.send(response);
                                                }
                                            }).catch(function (err) {
                                                console.log(err);
                                            });
                                        }
                                    }).catch(function (err) {
                                        console.log(err);
                                    });
                                }
                            }).catch(function (err) {
                                console.log(err);
                            });
                        }
                    }).catch(function (err) {
                        console.log(err);
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