var Datastore = require("nedb");
var dbBasePath = localStorage.getItem('dbBasePath');

var CustomerDB = new Datastore({ filename: dbBasePath + '/Customers/customer.db' });

module.exports = {
    CustomerDB
};


