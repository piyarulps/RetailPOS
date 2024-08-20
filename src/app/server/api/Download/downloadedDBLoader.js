var Datastore = require("nedb");
var dbBasePath = localStorage.getItem('dbBasePath');

var DownloadedDB = new Datastore({ filename: dbBasePath + '/Datadownloads/downloadeddatas.db', autoload: true });
var DinominationDB = new Datastore({ filename: dbBasePath + '/Datadownloads/denominations.db', autoload: true });

module.exports = {
    DownloadedDB, DinominationDB
};
