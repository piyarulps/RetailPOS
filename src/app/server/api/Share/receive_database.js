var dbLoader = require('./shareDBLoader.js');
var app = require("express")();
// var gm = require('getmac');
// var mac = gm.default();
module.exports = app;

var dbFiles = {
    Brand: dbLoader.ShareBrandDB,
    Size: dbLoader.ShareSizeDB,
    Item: dbLoader.ShareItemDB,
    Manufacturer: dbLoader.ShareManufacturerDB,
    ServiceProvider: dbLoader.ShareServiceProviderDB,
    Supplier: dbLoader.ShareSupplierDB,
};
app.post("/", function (req, res) {
    var response = {};
    var requestData = req.body;
    var receivedData = requestData.data;
    var ModuleName = requestData.moduleName;
    var currentDB = dbFiles[ModuleName];
    currentDB.loadDatabase();
    currentDB.insert(receivedData, function (err, docs) {
        if (!err) {
            currentDB.find({}).exec(function (err, data) {
                console.log('received and inserted data', { moduleName: ModuleName, data: data });
            });
            response = { 'status': 1, 'message': 'Data received.' };
            res.send(response);
        }
        else {
            response = { 'status': 0, 'message': 'Data not received.', 'error': err };
            res.send(response);
        }
    });

});