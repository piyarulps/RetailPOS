const _fse = require('fs-extra');
const { remote: myRemote } = require("electron");
var _app = myRemote.app;
// const BACKUP_PATH = `${_app.getPath('userData')}/Models`;
const DB_BASE_PATH = `${_app.getPath('userData')}/Models`;
localStorage.setItem('dbBasePath', DB_BASE_PATH);
// const IDENTITY_PATH = `Models/identity.json`;
const IDENTITY_PATH = `${DB_BASE_PATH}/identity.json`;
var identifier = '';
var identifierLength = 32;
// Restoring old backup, either create new database
// _fse.pathExists(BACKUP_PATH, (err, exists) => {
// 	console.log('backupPath', exists) // => false
// 	if (err == null && exists) {
// 		_fse.copy(BACKUP_PATH, `Models`, err => {
// 			if (err) {
// 				console.log('backup restore error', err);
// 				createIdentity();
// 				setupDb('folder');
// 			}
// 			else {
// 				_fse.readJson(IDENTITY_PATH, (err, packageObj) => {
// 					if (err) {
// 						console.log('identityFile error', err);
// 						createIdentity();
// 						setupDb('folder');
// 					}
// 					else {
// 						console.log('identityFile', packageObj.identifier)
// 						localStorage.setItem('identifier', packageObj.identifier)
// 						console.log('Your App identity:', localStorage.getItem('identifier'));
// 					}
// 				})
// 			}
// 		})
// 	}
// 	else {
// 		console.log('backupPath error', err);
// 		createIdentity();
// 		setupDb('folder');
// 	}
// })
_fse.readJson(IDENTITY_PATH, (err, packageObj) => {
	if (err) {
		console.log('identityFile readJson error', err);
		createIdentity();
	}
	else {
		// console.log('identityFile', IDENTITY_PATH, packageObj.identifier);
		localStorage.setItem('identifier', packageObj.identifier);
		console.log('Your App identity (Existing):', localStorage.getItem('identifier'));
	}
})
function createIdentity() {
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < identifierLength; i++) {
		identifier += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	localStorage.removeItem('syncRecord');
	localStorage.setItem('identifier', identifier);
	console.log('Your App identity (New):', localStorage.getItem('identifier'));
	_fse.ensureFile(IDENTITY_PATH, err => {
		if (err == null) {
			// console.log('createIdentity ensureFile');
			_fse.writeJson(IDENTITY_PATH, { identifier: identifier }, err => {
				// console.log('createIdentity ensureFile writeJson');
				if (err) {
					console.log('createIdentity ensureFile writeJson error', err);
				}
			})
		}
		else {
			console.log('createIdentity ensureFile error', err);
		}
	})
}
// Creating unique identifier end

var express = require('express');

http = require("http");
port = 52878;
app = require("express")();
server = http.createServer(app);

bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Get local ip address
var os = require('os');
var interfaces = os.networkInterfaces();
var localIp;
for (var k in interfaces) {
	for (var k2 in interfaces[k]) {
		var address = interfaces[k][k2];
		// console.log('address', address);
		if (address.family === 'IPv4' && !address.internal) {
			localIp = address.address;
			sessionStorage.setItem('localIp', localIp);
		}
	}
}

// Encrypt and decrypt API interactions
var appLoader = require('../src/app/server/app.js');
function decryptRequest(req, res, next) {
	// console.log('decryptRequest req', req);
	if (req.method.toLowerCase() == 'put' || req.method.toLowerCase() == 'post') {
		req.body = appLoader.decryptCodes(JSON.stringify(req.body));
		if (appLoader.isJsonString(req.body)) {
			req.body = JSON.parse(req.body);
		}
	}
	next();
}
function encryptResponse(req, res, next) {
	// console.log('encryptResponse req', req);
	var oldSend = res.send;
	res.send = function (data) {
		// arguments[0] (or `data`) contains the response body
		arguments[0] = appLoader.encryptCodes(arguments[0]);
		oldSend.apply(res, arguments);
	}
	next();
}
if (appLoader.ENABLE_ENCRYPTION) {
	app.use(encryptResponse);
	app.use(decryptRequest);
}

app.all("/*", function (req, res, next) {
	// CORS headers
	res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	// Set custom headers for CORS
	res.header(
		"Access-Control-Allow-Headers",
		"Content-type,Accept,X-Access-Token,X-Key"
	);
	if (req.method == "OPTIONS") {
		res.status(200).end();
	} else {
		next();
	}
});
app.get("/", function (req, res) {
	res.send("Retailpos Desktop Application Local Server Started.");
});
// Data Downloading Api(s) From Server..
app.use("/refreshlists", require("../src/app/server/api/Download/refreshlist.js"));
app.use("/modulelists", require("../src/app/server/api/Download/modulelists.js"));
app.use("/barnd-download", require("../src/app/server/api/Download/barnddownload.js"));
app.use("/size-download", require("../src/app/server/api/Download/sizedownload.js"));
app.use("/manufacturer-download", require("../src/app/server/api/Download/manufacturerdownload.js"));
app.use("/supplier-download", require("../src/app/server/api/Download/supplierdownload.js"));
app.use("/serviceprovider-download", require("../src/app/server/api/Download/serviceproviderdownload.js"));
app.use("/sellingrule-download", require("../src/app/server/api/Download/sellingruledownload.js"));
app.use("/posdepartment-download", require("../src/app/server/api/Download/posdepartmentdownload.js"));
app.use("/priceline-download", require("../src/app/server/api/Download/pricelinedownload.js"));
app.use("/itemtype-download", require("../src/app/server/api/Download/itemtypelistdownload.js"));
app.use("/uom-download", require("../src/app/server/api/Download/unitofmeasurementdownload.js"));
app.use("/vendordropdownlist-download", require("../src/app/server/api/Download/vendordropdownlistdownload.js"));
//app.use("/item-download", require("../src/app/server/api/Download/itemdownload.js"));
app.use("/item-download", require("../src/app/server/api/Download/item_download_scheduler.js"));
//app.use("/item-donload-scheduler", require("../src/app/server/api/Download/item_download_scheduler.js"));
app.use("/downloaded-data", require("../src/app/server/api/Download/downloaded_data.js"));
// empty db records
app.use("/empty-dbfiles", require("../src/app/server/api/Download/emptydbfiles.js"));
app.use("/count-modules", require("../src/app/server/api/Download/get_total_count_of_modules.js"));
app.use("/check-server-update", require("../src/app/server/api/Download/server_update_count.js"));
app.use("/item-download-completed", require("../src/app/server/api/Download/item_download_completed.js"));
app.use("/customer-download", require("../src/app/server/api/Download/customerdownload.js"));
app.use("/denomination-download", require("../src/app/server/api/Download/denominationDownload.js"));


// Local Api(s)..
app.use("/brands", require("../src/app/server/api/Brands/brand.js"));
app.use("/manufacturers", require("../src/app/server/api/Brands/manufacturerdropdown.js"));
app.use("/parentbrands", require("../src/app/server/api/Brands/parentbrand.js"));
app.use("/brandsync", require("../src/app/server/api/Brands/brandsync.js"));
app.use("/sizes", require("../src/app/server/api/Sizes/size.js"));
app.use("/sizefamilies", require("../src/app/server/api/Sizes/sizefamily.js"));
app.use("/sizesync", require("../src/app/server/api/Sizes/sizesync.js"));
app.use("/vendordropdownlists", require("../src/app/server/api/Vendors/vendordropdown.js"));
app.use("/vendorlist", require("../src/app/server/api/Vendors/vendorlist.js"));
app.use("/manufacturersync", require("../src/app/server/api/Vendors/manufacturersync.js"));
app.use("/suppliersync", require("../src/app/server/api/Vendors/suppliersync.js"));
app.use("/serviceprovidersync", require("../src/app/server/api/Vendors/serviceprovidersync.js"));
app.use("/itemlist", require("../src/app/server/api/Items/itemlist.js"));
app.use("/branddropdown", require("../src/app/server/api/Items/branddropdown.js"));
app.use("/itemtypedropdown", require("../src/app/server/api/Items/itemtypedropdown.js"));
app.use("/pricelinedropdown", require("../src/app/server/api/Items/pricelinedropdown.js"));
app.use("/sizedropdown", require("../src/app/server/api/Items/sizedropdown.js"));
app.use("/uomdropdown", require("../src/app/server/api/Items/uomdropdown.js"));
app.use("/posdeptdropdown", require("../src/app/server/api/Items/get_pos_list_dropdown.js"));
app.use("/getsingleitem", require("../src/app/server/api/Items/get_single_item.js"));
app.use("/advanced_field_save", require("../src/app/server/api/Items/advanced_field_details.js"));
app.use("/item_supplier_list", require("../src/app/server/api/Items/item_supplier_list.js"));
app.use("/itemsync", require("../src/app/server/api/Items/itemsync.js"));
app.use("/supplier_update", require("../src/app/server/api/Items/supplier_update.js"));
app.use("/shelf_field_save", require("../src/app/server/api/Items/shelf_field_manage.js"));
app.use("/get_item_scan", require("../src/app/server/api/Items/get_item_scan.js"));
app.use("/item_lookups", require("../src/app/server/api/Items/item_lookup.js"));
app.use("/customer_lookups", require("../src/app/server/api/Customers/customer_lookup.js"));
// Images
app.use('/images', express.static(__dirname + '/Images'));
// Device API
app.use("/device_details", require("../src/app/server/api/Device/devicedetails.js"));
app.use("/connected_devices", require("../src/app/server/api/Device/connectedDevices.js"));
app.use("/validate_device", require("../src/app/server/api/Device/validateDevice.js"));

// Login to POS..
app.use("/loginapi", require("../src/app/server/api/Login/loginapi.js"));
app.use("/pos-lock", require("../src/app/server/api/Login/pos_lock.js"));
app.use("/pos-unlock", require("../src/app/server/api/Login/pos_unlock.js"));
app.use("/check-till-balance", require("../src/app/server/api/Login/till_balance.js"));
app.use("/pos-signon", require("../src/app/server/api/Login/sign_on.js"));
app.use("/pos-signoff", require("../src/app/server/api/Login/sign_off.js"));
app.use("/logout", require("../src/app/server/api/Login/logout.js"));

// Transaction Syncing..
app.use("/transaction-module-lists", require("../src/app/server/api/Transactions/transaction_module_lists.js"));
// Control transaction..
app.use("/login-transaction-sync", require("../src/app/server/api/Transactions/login_transaction_sync.js"));
// Retail Transaction..
app.use("/item-purchase", require("../src/app/server/api/Retail/item_purchase.js"));
app.use("/retail-transaction-sync", require("../src/app/server/api/Retail/retail_transaction_sync.js"));
app.use("/denomination-list", require("../src/app/server/api/Retail/denomination_list.js"));

// Share Databse..
app.use("/share-database", require("../src/app/server/api/Share/share_database.js"));
app.use("/check-database-latest", require("../src/app/server/api/Share/check_database_latest.js"));
app.use("/receive-database", require("../src/app/server/api/Share/receive_database.js"));
app.use("/manage-last-sync", require("../src/app/server/api/Share/manage_last_sync.js"));
app.use("/set-last-sync", require("../src/app/server/api/Share/set_last_sync.js"));
app.use("/backup-database", require("../src/app/server/api/Share/backup_database.js"));


// server.listen(8500,'127.0.0.1',function(){
//   server.close(function(){
//     server.listen(8500,'192.168.0.107')
//   })
//  })

server.listen(port, localIp, () => console.log(`Listening on port ${port}`));

// create db folders and files
const fs = require('fs');
const path = require('path');
function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
	const sep = path.sep;
	const initDir = path.isAbsolute(targetDir) ? sep : '';
	const baseDir = isRelativeToScript ? __dirname : '.';
	return targetDir.split(sep).reduce((parentDir, childDir) => {
		const curDir = path.resolve(baseDir, parentDir, childDir);
		try {
			fs.mkdirSync(curDir, { recursive: true });
		} catch (err) {
			if (err.code === 'EEXIST') { // curDir already exists!
				return curDir;
			}
			// To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
			if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
				throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
			}
			const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
			if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
				throw err; // Throw if it's just the last created dir.
			}
		}
		return curDir;
	}, initDir);
}
function mkFileByPathSync(filename) {
	if (!fs.existsSync(filename)) {
		fs.open(filename, 'r', function (err, fd) {
			if (err) {
				fs.writeFile(filename, '', function (err) {
					if (err) {
						console.log(err);
					}
					// console.log("The file was saved!");
				});
			} else {
				// console.log("The file exists!");
			}
		});
	} else {
		return true;
	}
}
var dbParentFodler = DB_BASE_PATH;
var dbFolders = ['Brands', 'Customers', 'Datadownloads', 'Images', 'Images/Item', 'Items', 'Sizes', 'SupplierItems', 'Vendors', 'LoginDatas', 'Transactions', 'ShareDatabase'];
// If you modify dbFiles variable, replicate it in share_database.js, exclude logins and transactions
var dbFiles = [
	'Brands/brands.db',
	'Brands/brandsdeletesync.db',
	'Brands/brandupdatesync.db',
	'Datadownloads/downloadeddatas.db',
	'Datadownloads/denominations.db',
	'Customers/customer.db',
	'Images/Item/images.db',
	'Items/itemadvancedfield.db',
	'Items/itemdelete.db',
	'Items/items.db',
	'Items/itemsellingprices.db',
	'Items/itemsellingrules.db',
	'Items/itemtypelists.db',
	'Items/itemupdate.db',
	'Items/posdepartments.db',
	'Items/pricelines.db',
	'Items/retailpackagesizes.db',
	'Items/upclist.db',
	'Sizes/sizefamilies.db',
	'Sizes/sizes.db',
	'Sizes/sizesdeletesync.db',
	'Sizes/sizeupdatesync.db',
	'SupplierItems/supplieritems.db',
	'LoginDatas/operatorlogins.db',
	'LoginDatas/firsttimesignon.db',
	'LoginDatas/operatorsignon.db',
	'LoginDatas/operatorsignoff.db',
	'LoginDatas/postransactions.db',
	'LoginDatas/poslocks.db',
	'LoginDatas/posunlocks.db',
	'LoginDatas/tillbalance.db',
	'Vendors/manufacturerdelete.db',
	'Vendors/manufacturerlist.db',
	'Vendors/manufacturerupdate.db',
	'Vendors/serviceproviderdelete.db',
	'Vendors/serviceproviderlist.db',
	'Vendors/serviceproviderupdate.db',
	'Vendors/supplierdelete.db',
	'Vendors/supplierlist.db',
	'Vendors/supplierupdate.db',
	'Vendors/vendordropdowns.db',
	'Vendors/vendorstatusupdate.db',
	'Transactions/retailtransactions.db',
	'ShareDatabase/lastsync.db',
	'ShareDatabase/latestdatacheck.db'
];
var folderIndex = 0, fileIndex = 0;
mkDirByPathSync(dbParentFodler);
function setupDb(type) {
	if (type == 'folder') {
		mkDirByPathSync(dbParentFodler + '/' + dbFolders[folderIndex]);
		if (typeof dbFolders[folderIndex + 1] != 'undefined') {
			folderIndex++;
			setupDb('folder');
		}
		else {
			setupDb('file');
		}
	}
	else if (type == 'file') {
		mkFileByPathSync(dbParentFodler + '/' + dbFiles[fileIndex]);
		if (typeof dbFiles[fileIndex + 1] != 'undefined') {
			fileIndex++;
			setupDb('file');
		}
	}
}
setupDb('folder');