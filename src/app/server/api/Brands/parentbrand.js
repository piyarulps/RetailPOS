var app = require("express")();
var dbLoader = require('./barnddbLoader.js');

module.exports = app;
app.get("/", function(req, res) {

    dbLoader.BrandDB.find({}).sort({ id:-1}).limit(200).exec(function(err, data) {
        var response={};
        response={'status':1,'message':'Brands Record.','result':data};
        res.send(response);
    });
});
