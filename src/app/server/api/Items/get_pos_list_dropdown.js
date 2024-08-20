var app = require("express")();
var dbLoader = require('./itemdbLoader.js');

module.exports = app;
app.get("/", function(req, res) {
    dbLoader.POSDepartmentDB.loadDatabase();
    var response={};
    var POSDATA=[];
    var posDepObj={};
    dbLoader.POSDepartmentDB.find({}).sort({id:-1}).projection({text:1}).limit(200).exec(function(err, data) {
        if(data.length > 0){
            data.forEach(function(key, val){
                posDepObj={'id':key.id,'text':key.text};
                POSDATA.push(posDepObj);
            });
        }

        response={'status':1,'message':'Data Found.','result':POSDATA};
        res.send(response);
    });
});
