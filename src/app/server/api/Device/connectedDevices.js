var app = require("express")();
var HID = require('node-hid');
var response = {
    status: 0,
    message: 'Failed to read devices. Please try again later.',
    data: []
};

module.exports = app;

app.get('/', function (req, res) {
    var devices = HID.devices();
    if (devices) {
        response.status = 1;
        response.message = '';
        response.data = devices;
    }
    res.send(response);
});