var app = require("express")();
var dbLoader = require('./itemdbLoader.js');

module.exports = app;
app.get("/", function(req, res) {

    dbLoader.RetailPackageSizeDB.find({}).sort({ text: 1}).limit(500).exec(function(err, data) {
        var response={};
        response={'status':1,'message':'UOM Records.','result':data};
        res.send(response);
    });
});
