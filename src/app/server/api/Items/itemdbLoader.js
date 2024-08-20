var Datastore = require("nedb");
var dbBasePath = localStorage.getItem('dbBasePath');

var SellingRuleDB = new Datastore({ filename: dbBasePath + '/Items/itemsellingrules.db', autoload: true });
var SellingPriceDB = new Datastore({ filename: dbBasePath + '/Items/itemsellingprices.db', autoload: true });
var POSDepartmentDB = new Datastore({ filename: dbBasePath + '/Items/posdepartments.db', autoload: true });
var PriceLineDB = new Datastore({ filename: dbBasePath + '/Items/pricelines.db', autoload: true });
var ItemTypeListDB = new Datastore({ filename: dbBasePath + '/Items/itemtypelists.db', autoload: true });
var RetailPackageSizeDB = new Datastore({ filename: dbBasePath + '/Items/retailpackagesizes.db', autoload: true });
var ItemDB = new Datastore({ filename: dbBasePath + '/Items/items.db', autoload: true });
var BrandItemDB = new Datastore({ filename: dbBasePath + '/Brands/brands.db' });
var SizeItemDB = new Datastore({ filename: dbBasePath + '/Sizes/sizes.db' });
var ItemUpdateDB = new Datastore({ filename: dbBasePath + '/Items/itemupdate.db', autoload: true });
var ItemDeleteDB = new Datastore({ filename: dbBasePath + '/Items/itemdelete.db', autoload: true });
var ItemAdvancedFieldDB = new Datastore({ filename: dbBasePath + '/Items/itemadvancedfield.db', autoload: true });
var SupplierItemDB = new Datastore({ filename: dbBasePath + '/SupplierItems/supplieritems.db', autoload: true });
var UPCListDB = new Datastore({ filename: dbBasePath + '/Items/upclist.db', autoload: true });
var ImagesDB = new Datastore({ filename: dbBasePath + '/Images/Item/images.db', autoload: true });

module.exports = {
    SellingPriceDB,
    SellingRuleDB,
    BrandItemDB,
    SizeItemDB,
    POSDepartmentDB,
    ItemDB,
    PriceLineDB,
    ItemTypeListDB,
    RetailPackageSizeDB,
    ItemUpdateDB,
    ItemDeleteDB,
    ItemAdvancedFieldDB,
    //ItemSupplierDB,
    SupplierItemDB,
    UPCListDB,
    ImagesDB
};
