var dbLoader = require('./customerDBLoader.js');
var app = require("express")();
var SEARCHPARAM = '';
var requestParam = {};
var DataList = [];


module.exports = app;

app.get("/", function (req, res) {

    dbLoader.CustomerDB.loadDatabase();

    requestParam = req;
    var response = {};
    var CustomerObjectLookup = {};

    if (typeof (requestParam.query) != 'undefined' && requestParam.query != null) {
        if (typeof (requestParam.query.q) != 'undefined' && requestParam.query.q != null) {
            SEARCHPARAM = requestParam.query.q;
        }
    }
    console.log(SEARCHPARAM);
    if (SEARCHPARAM != '') {
        var response = {};
        if (isNaN(SEARCHPARAM) == true) {
            var REGEX = new RegExp(SEARCHPARAM, "i");
            console.log(REGEX);
            DataList = [];
            dbLoader.CustomerDB.find({ CustomerName: { $regex: REGEX } }).limit(5).exec(function (err, data) {
                //console.log(data);
                if (data != 'undefined') {
                    if (data.length > 0) {
                        data.forEach(function (key, val) {
                            if (typeof key.CustomerName != 'undefined') {
                                var PhoneNumber = '';
                                if (key.ContactMethod.length > 0) {
                                    if (typeof key.ContactMethod[0].phone != 'undefined' && key.ContactMethod[0].phone != '') {
                                        PhoneNumber = key.ContactMethod[0].phone;
                                    } else {
                                        PhoneNumber = '';
                                    }
                                } else {
                                    PhoneNumber = '';
                                }
                                var customerDetails = key.PartyData.FirstName + ' ' + key.PartyData.LastName;
                                if (PhoneNumber != '') {
                                    customerDetails += ' | ' + PhoneNumber;
                                }
                                CustomerObjectLookup = {
                                    "CustomerName": customerDetails,
                                    "FirstName": key.PartyData.FirstName,
                                    "LastName": key.PartyData.LastName,
                                    "Points": 0,
                                    "PhoneNumber": PhoneNumber,
                                    "CustomerID": key.PartyData.CustomerID
                                };
                                DataList.push(CustomerObjectLookup);
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
            console.log('false');
        }

    }

});




