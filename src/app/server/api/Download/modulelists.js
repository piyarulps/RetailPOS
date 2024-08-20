var app = require("express")();

module.exports = app;
app.get("/", function (req, res) {
    var data = [
        { 'DisplayModuleName': 'Items', 'ModuleName': 'Items', 'DownloadingApi': 'item-download' },
        { 'DisplayModuleName': 'Brands', 'ModuleName': 'Brands', 'DownloadingApi': 'barnd-download' },
        { 'DisplayModuleName': 'Sizes', 'ModuleName': 'Sizes', 'DownloadingApi': 'size-download' },
        { 'DisplayModuleName': 'Vendor Related Dropdowns', 'ModuleName': 'VendorRelatedDropdowns', 'DownloadingApi': 'vendordropdownlist-download' },
        { 'DisplayModuleName': 'Selling Rules', 'ModuleName': 'SellingRules', 'DownloadingApi': 'sellingrule-download' },
        { 'DisplayModuleName': 'POS Departments', 'ModuleName': 'POSDepartments', 'DownloadingApi': 'posdepartment-download' },
        { 'DisplayModuleName': 'Price Lines', 'ModuleName': 'PriceLines', 'DownloadingApi': 'priceline-download' },
        { 'DisplayModuleName': 'Item Type Lists', 'ModuleName': 'ItemTypeLists', 'DownloadingApi': 'itemtype-download' },
        { 'DisplayModuleName': 'Unit of Measurements', 'ModuleName': 'UnitOfMeasurements', 'DownloadingApi': 'uom-download' },
        { 'DisplayModuleName': 'Suppliers', 'ModuleName': 'Suppliers', 'DownloadingApi': 'supplier-download' },
        { 'DisplayModuleName': 'Service Providers', 'ModuleName': 'ServiceProviders', 'DownloadingApi': 'serviceprovider-download' },
        { 'DisplayModuleName': 'Manufacturers', 'ModuleName': 'Manufacturers', 'DownloadingApi': 'manufacturer-download' },
        { 'DisplayModuleName': 'Customers', 'ModuleName': 'Customers', 'DownloadingApi': 'customer-download' }


    ]
    res.send(data);
});
