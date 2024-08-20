var app = require("express")();

module.exports = app;
app.get("/", function (req, res) {
    var data = [
        { 'DisplayModuleName': 'Brand', 'ModuleName': 'Brands', 'DownloadingApi': 'brands' },
        { 'DisplayModuleName': 'Size', 'ModuleName': 'Sizes', 'DownloadingApi': 'sizes' },
        { 'DisplayModuleName': 'Supplier', 'ModuleName': 'Supplier', 'DownloadingApi': 'vendorlist' },
        { 'DisplayModuleName': 'Service Provider', 'ModuleName': 'ServiceProvider', 'DownloadingApi': 'vendorlist' },
        { 'DisplayModuleName': 'Manufacturer', 'ModuleName': 'Manufacturer', 'DownloadingApi': 'vendorlist' },
        { 'DisplayModuleName': 'Item', 'ModuleName': 'Items', 'DownloadingApi': 'itemlist' }
    ]
    res.send(data);
});
