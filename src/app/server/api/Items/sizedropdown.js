var app = require("express")();
var dbLoader = require('./itemdbLoader.js');

module.exports = app;
app.get("/", function(req, res) {
    dbLoader.SizeItemDB.loadDatabase();
    var response={};
    var SizeData=[];
    var sObj={};
    dbLoader.SizeItemDB.find({}).sort({id:-1}).projection({TableName:1}).limit(200).exec(function(err, data) {
        if(data.length > 0){
            data.forEach(function(key, val){
                sObj={'id':key._id,'text':key.TableName};
                SizeData.push(sObj);
            });
        }

        response={'status':1,'message':'Data Found.','result':SizeData};
        res.send(response);
    });
});
