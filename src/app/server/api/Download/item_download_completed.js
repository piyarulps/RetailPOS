var app = require("express")();
var ipinfo = localStorage.getItem('identifier');
var appLoader = require('../../app.js');


module.exports = app;

app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');
    var response = {};

    var SaveIPgetURL = appLoader.BASEURL + "items/?limit=2&IPADDRESS=" + ipinfo;
    appLoader.CallDataFromServer("GET", SaveIPgetURL, {}).then(function (IPINSERTresponse) {
        response = IPINSERTresponse;
        res.json(response);
    }).catch(function (err) {
        console.log(err);
    });


});