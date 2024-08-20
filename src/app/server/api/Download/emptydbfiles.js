var app = require("express")();
var dbLoader = require('./downloadedDBLoader.js');

// var SellingRule = new Datastore({ filename: './Models/Items/itemsellingrules.db'});
// var SellingPrice = new Datastore({ filename: './Models/Items/itemsellingprices.db' });
// var POSDepartment = new Datastore({ filename: './Models/Items/posdepartments.db' });
// var PriceLine= new Datastore({ filename: './Models/Items/pricelines.db'});
// var RetailPackageSize = new Datastore({ filename: './Models/Items/retailpackagesizes.db' });
// var DownloadedDb = new Datastore({ filename: './Models/Datadownloads/downloadeddatas.db'});
// var Item = new Datastore({ filename: './Models/Items/items.db'});
// var Brand = new Datastore({ filename: './Models/Brands/brands.db'});
// var Size = new Datastore({ filename: './Models/Sizes/sizes.db'});
// var UPCList= new Datastore({ filename: './Models/Items/upclist.db'});
// var Images = new Datastore({ filename: './Models/Images/Item/images.db'});
// var ManufacturerList = new Datastore({ filename: './Models/Vendors/manufacturerlist.db'});
// var SupplierList= new Datastore({ filename: './Models/Vendors/supplierlist.db'});
// var ServiceproviderList = new Datastore({ filename: './Models/Vendors/serviceproviderlist.db'});

module.exports = app;

app.get("/", function(req, res) {
    var response={};
    dbLoader.DownloadedDB.loadDatabase();
    dbLoader.DownloadedDB.remove({},{multi:true},function(err, docDeleted) {
        if(docDeleted!=null && docDeleted!='undefined'){
            response={'status':1,'message':'All dbs are empty.'};
            res.send(response);
        }else{
            response={'status':0,'message':'Oops!'};
            res.send(response);
        }
    });
    // SellingRule.remove({},{multi:true});
    // SellingPrice.remove({},{multi:true});
    // POSDepartment.remove({},{multi:true});
    // PriceLine.remove({},{multi:true});
    // RetailPackageSize.remove({},{multi:true});
    // Item.remove({},{multi:true});
    // Brand.remove({},{multi:true});
    // Size.remove({},{multi:true});
    // UPCList.remove({},{multi:true});
    // Images.remove({},{multi:true});
    // ManufacturerList.remove({},{multi:true});
    // SupplierList.remove({},{multi:true});
    // ServiceproviderList.remove({},{multi:true});



});