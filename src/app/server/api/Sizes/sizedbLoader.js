var Datastore = require("nedb");
var dbBasePath = localStorage.getItem('dbBasePath');

var ListDB = new Datastore({ filename: dbBasePath + '/Sizes/sizes.db', autoload: true });
var UpdatedDB = new Datastore({ filename: dbBasePath + '/Sizes/sizeupdatesync.db', autoload: true });
var DeletedDB = new Datastore({ filename: dbBasePath + '/Sizes/sizesdeletesync.db', autoload: true });
var SizeFamilyDB = new Datastore({ filename: dbBasePath + '/Sizes/sizefamilies.db', autoload: true });

module.exports = { ListDB, UpdatedDB, DeletedDB, SizeFamilyDB };





