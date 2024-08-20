var Datastore = require("nedb");
var dbBasePath = localStorage.getItem('dbBasePath');

var RetailTransactionDB = new Datastore({ filename: dbBasePath + '/Transactions/retailtransactions.db', autoload: true });

module.exports = { RetailTransactionDB };





