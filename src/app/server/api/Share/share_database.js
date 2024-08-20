var dbLoader = require('./shareDBLoader.js');
var app = require("express")();
var gm = require('getmac');
var mac = gm.default();
module.exports = app;

var dbFiles = [
    {
        dbName: dbLoader.ShareBrandDB,
        moduleName: 'Brand'
    },
    {
        dbName: dbLoader.ShareSizeDB,
        moduleName: 'Size'
    },
    {
        dbName: dbLoader.ShareItemDB,
        moduleName: 'Item'
    },
    {
        dbName: dbLoader.ShareManufacturerDB,
        moduleName: 'Manufacturer'
    },
    {
        dbName: dbLoader.ShareServiceProviderDB,
        moduleName: 'ServiceProvider'
    },
    {
        dbName: dbLoader.ShareSupplierDB,
        moduleName: 'Supplier'
    }
];
app.get("/", function (req, res) {
    var response = { status: 1, message: `Response from ${mac} for share database call` };

    var myBuffer = [];
    var myBufferIndex = 0;
    setBuffer();
    function setBuffer() {
        var currentDB = dbFiles[myBufferIndex].dbName;
        currentDB.loadDatabase();
        currentDB.find({}).exec(function (err, data) {
            var temp = data;
            myBuffer.push({
                moduleName: dbFiles[myBufferIndex].moduleName,
                data: temp
            });
            if (typeof dbFiles[myBufferIndex + 1] != 'undefined') {
                myBufferIndex++;
                setBuffer()
            }
            else {
                response.data = myBuffer;
                res.send(response);
            }
        });
    }
});