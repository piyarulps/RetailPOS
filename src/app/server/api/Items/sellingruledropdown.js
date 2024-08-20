var app = require("express")();
var dbLoader = require('./itemdbLoader.js');

module.exports = app;
app.get("/", function(req, res) {
    dbLoader.SellingRuleDB.loadDatabase();
    var response={};
    var SellingRuleData=[];
    var sellingruleObj={};
    dbLoader.SellingRuleDB.find({}).sort({id:-1}).projection({name:1}).limit(200).exec(function(err, data) {
        if(data.length > 0){
            data.forEach(function(key, val){
                sellingruleObj={'id':key._id,'text':key.name};
                SellingRuleData.push(sellingruleObj);
            });
        }
        response={'status':1,'message':'Data Found.','result':SellingRuleData};
        res.send(response);
    });
});
