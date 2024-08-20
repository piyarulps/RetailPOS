var app = require("express")();
var dbLoader = require('./barnddbLoader.js');

module.exports = app;
app.get("/", function(req, res) {
    dbLoader.ManufacturerDropDownDB.loadDatabase();
    var response={};
    var manufacturerData=[];
    var mnObj={};
    dbLoader.ManufacturerDropDownDB.find({}).projection({ManufacturerName:1}).limit(100).exec(function(err, data) {
        if(data.length > 0){
            data.forEach(function(key, val){
                mnObj={'id':key._id,'text':key.ManufacturerName};
                manufacturerData.push(mnObj);
            });
        }

        response={'status':1,'message':'Data Found.','result':manufacturerData};
        res.send(response);
    });


});
