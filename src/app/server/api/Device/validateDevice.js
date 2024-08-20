var app = require("express")();
var appLoader = require('../../app.js');
var response = {
    status: 0,
    message: 'Failed to read devices. Please try again later.',
    data: []
};

module.exports = app;

app.get('/', function (req, res) {
    // var url = appLoader.BASEURL + "upctoitem/" + ITEMUPC + "/";
    res.send(response);
});