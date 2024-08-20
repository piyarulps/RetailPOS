var app = require("express")();
var dbLoader = require('./itemdbLoader.js');

module.exports = app;
app.get("/", function(req, res) {
    dbLoader.BrandItemDB.loadDatabase();
    var response={};
    var BrandData=[];
    var bnObj={};
    dbLoader.BrandItemDB.find({}).sort({id:-1}).projection({BrandName:1}).limit(200).exec(function(err, data) {
        if(data.length > 0){
            data.forEach(function(key, val){
                bnObj={'id':key._id,'text':key.BrandName};
                BrandData.push(bnObj);
            });
        }

        response={'status':1,'message':'Data Found.','result':BrandData};
        res.send(response);
    });
});
