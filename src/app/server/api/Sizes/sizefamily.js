var app = require("express")();
var dbLoader = require('./sizedbLoader.js');

module.exports = app;
app.get("/", function(req, res) {

    dbLoader.SizeFamilyDB.find({}).sort({ id:-1}).limit(100).exec(function(err, data) {
        var response={};
        //response={'status':1,'message':'Size family Record.','result':data};
        res.send(data);
    });
});
