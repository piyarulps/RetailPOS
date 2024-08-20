var dbLoader = require('./loginDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
module.exports = app;

app.get("/", function (req, res) {
    var response = {};
    var TillData = {};
    dbLoader.TillDB.find({}).exec(function (err, data) {
        if(data!='undefined'){
            if(data.length > 0){
                TillData = data[0];
                response = {'status':1,'message':'Till data found.','result':TillData};
                res.send(response);
            }else{
                response = {'status':0,'message':'Till data not found.','result':TillData};
                res.send(response);
            }
        }
    });
});

app.post("/", function (req, res) {
    var response = {};
    var RequestData = req.body;
    var TillData = RequestData;
    dbLoader.TillDB.remove({},{multi:true}, function (err, deleted) {
        if(!err){
            dbLoader.TillDB.insert(TillData, function (inserterr, insertedDoc) {
                if (!inserterr) {
                    response = { 'status': 1, 'message': 'Till data stored.', 'result': insertedDoc };
                    res.send(response);
                }else{
                    response = { 'status': 0, 'message': 'Till data not stored.'};
                    res.send(response);
                }
            });
        }else{
            response = { 'status': 0, 'message': 'Till data not stored.'};
            res.send(response);
        }
    });
});

