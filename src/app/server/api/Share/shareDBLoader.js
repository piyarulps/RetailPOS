var Datastore = require("nedb");
var dbBasePath = localStorage.getItem('dbBasePath');

var LastSyncDB = new Datastore({ filename: dbBasePath + '/ShareDatabase/lastsync.db', autoload: true });
var ShareBrandDB = new Datastore({ filename: dbBasePath + '/Brands/brands.db' });
var ShareSizeDB = new Datastore({ filename: dbBasePath + '/Sizes/sizes.db' });
var ShareItemDB = new Datastore({ filename: dbBasePath + '/Items/items.db' });
var ShareManufacturerDB = new Datastore({ filename: dbBasePath + '/Vendors/manufacturerlist.db' });
var ShareServiceProviderDB = new Datastore({ filename: dbBasePath + '/Vendors/serviceproviderlist.db' });
var ShareSupplierDB = new Datastore({ filename: dbBasePath + '/Vendors/supplierlist.db' });
var LatestDataCheckDB = new Datastore({ filename: dbBasePath + '/ShareDatabase/latestdatacheck.db', autoload: true });

module.exports = { LastSyncDB, ShareBrandDB, ShareItemDB, ShareSizeDB, ShareManufacturerDB, ShareServiceProviderDB, ShareSupplierDB, LatestDataCheckDB };





