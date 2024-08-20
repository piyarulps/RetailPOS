var app = require("express")();
var dbLoader = require('./vendordbloader.js');

module.exports = app;
app.get("/", function(req, res) {

    dbLoader.VendorDropdowns.find({}).exec(function(err, data) {
        var response={};
        response={'status':1,'message':'Vendor dropdowns.','result':data[0]};
        res.send(response);
    });
});
