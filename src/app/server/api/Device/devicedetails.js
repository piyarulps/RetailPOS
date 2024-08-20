var app = require("express")();
var gm = require('getmac');

module.exports = app;

app.get('/', function (req, res) {
    var mac = gm.default();
    var HID = require('node-hid');
    var devices = HID.devices();
    // scanner = new HID.HID(9168, 512);
    res.send({ devices: devices, mac: mac });
});