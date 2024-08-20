var dbLoader = require('../Download/downloadedDBLoader.js');
var app = require("express")();
module.exports = app;

app.get("/", function (req, res) {
    dbLoader.DinominationDB.find().sort({MonetaryValueAmount : -1}).exec(function (err, data) {
        if(data!=null && data!='undefined'){
            if(data.length === 0){
                response = { 'status': 0, 'message':'No data found.'};
                res.send(response);
            }else{
                response = { 'status': 1, 'message':'Data found.','result':data};
                res.send(response);
            }
        }
    });
});

