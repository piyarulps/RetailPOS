var app = require("express")();
var dbLoader = require('./itemdbLoader.js');

module.exports = app;
app.get("/", function(req, res) {

    dbLoader.PriceLineDB.find({}).sort({ id:-1}).limit(100).exec(function(err, data) {
        var response={};
        response={'status':1,'message':'Price Line Records.','result':data};
        res.send(response);
    });
});
