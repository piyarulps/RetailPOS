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
    appLoader.CallDataFromServer("POST", PostURL, RequestParam).then(function (CountResponse) {
        if (CountResponse != 'undefined' && CountResponse != null) {
            response = CountResponse;
            res.send(response);
        }

    }).catch(function (err) {
        console.log(err);
    });
});