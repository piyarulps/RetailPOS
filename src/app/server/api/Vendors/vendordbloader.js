var Datastore = require("nedb");
var dbBasePath = localStorage.getItem('dbBasePath');

var ManufacturerListDB = new Datastore({ filename: dbBasePath + '/Vendors/manufacturerlist.db', autoload: true });
var ManufacturerUpdateDB = new Datastore({ filename: dbBasePath + '/Vendors/manufacturerupdate.db', autoload: true });
var ManufacturerDeleteDB = new Datastore({ filename: dbBasePath + '/Vendors/manufacturerdelete.db', autoload: true });
var SupplierListDB = new Datastore({ filename: dbBasePath + '/Vendors/supplierlist.db', autoload: true });
var SupplierUpdateDB = new Datastore({ filename: dbBasePath + '/Vendors/supplierupdate.db', autoload: true });
var SupplierDeleteDB = new Datastore({ filename: dbBasePath + '/Vendors/supplierdelete.db', autoload: true });
var ServiceproviderListDB = new Datastore({ filename: dbBasePath + '/Vendors/serviceproviderlist.db', autoload: true });
var ServiceproviderUpdateDB = new Datastore({ filename: dbBasePath + '/Vendors/serviceproviderupdate.db', autoload: true });
var ServiceproviderDeleteDB = new Datastore({ filename: dbBasePath + '/Vendors/serviceproviderdelete.db', autoload: true });
var VendorDropdowns = new Datastore({ filename: dbBasePath + '/Vendors/vendordropdowns.db', autoload: true });
var VendorStatusDB = new Datastore({ filename: dbBasePath + '/Vendors/vendorstatusupdate.db', autoload: true });

module.exports = {
    ManufacturerListDB,
    ManufacturerUpdateDB,
    ManufacturerDeleteDB,
    SupplierListDB,
    SupplierUpdateDB,
    SupplierDeleteDB,
    ServiceproviderListDB,
    ServiceproviderUpdateDB,
    ServiceproviderDeleteDB,
    VendorDropdowns,
    VendorStatusDB
};


