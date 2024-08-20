var Datastore = require("nedb");
var dbBasePath = localStorage.getItem('dbBasePath');

var BrandDB = new Datastore({ filename: dbBasePath + '/Brands/brands.db', autoload: true });
var BrandUpdatedDB = new Datastore({ filename: dbBasePath + '/Brands/brandupdatesync.db', autoload: true });
var BrandDeletedDB = new Datastore({ filename: dbBasePath + '/Brands/brandsdeletesync.db', autoload: true });
var ManufacturerDropDownDB = new Datastore({ filename: dbBasePath + '/Vendors/manufacturerlist.db' });

module.exports = { BrandDB, BrandUpdatedDB, BrandDeletedDB, ManufacturerDropDownDB };

