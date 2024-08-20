var Datastore = require("nedb");
var dbBasePath = localStorage.getItem('dbBasePath');

var OperatorLoginDB = new Datastore({ filename: dbBasePath + '/LoginDatas/operatorlogins.db', autoload: true });
var OperatorSignOnDB = new Datastore({ filename: dbBasePath + '/LoginDatas/operatorsignon.db', autoload: true });
var OperatorSignOffDB = new Datastore({ filename: dbBasePath + '/LoginDatas/operatorsignoff.db', autoload: true });
var POSTransactionDB = new Datastore({ filename: dbBasePath + '/LoginDatas/postransactions.db', autoload: true });
var POSLockDB = new Datastore({ filename: dbBasePath + '/LoginDatas/poslocks.db', autoload: true });
var POSUnlockDB = new Datastore({ filename: dbBasePath + '/LoginDatas/posunlocks.db', autoload: true });
var TillDB = new Datastore({ filename: dbBasePath + '/LoginDatas/tillbalance.db', autoload: true });
var SignOnMasterDB = new Datastore({ filename: dbBasePath + '/LoginDatas/firsttimesignon.db', autoload: true });

module.exports = { OperatorLoginDB, OperatorSignOnDB, POSTransactionDB, POSLockDB, POSUnlockDB, OperatorSignOffDB, TillDB, SignOnMasterDB };

