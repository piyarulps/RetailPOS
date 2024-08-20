var app = require("express")();
var dbLoader = require('./itemdbLoader.js');
var jQuery = require('jquery');

module.exports = app;


app.put("/:_id", function (req, res) {

    var errCount=0;
    var requestParam= req;
    var ITEMIDS=requestParam.params._id.split(",");
    var ItemCreateManage={};
    var UpdateItemBody = req.body;

    var SUPPLIER=[];
    var TotolCount=0;

    
    response = { 'status': 1, 'message': 'Updated.'};
    res.send(response);
});




app.get("/:_id", function (req, res) {
    response = { 'status': 1, 'message': 'Records Found.', 'result':[]};
    res.send(response);
});