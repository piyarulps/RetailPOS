var dbLoader = require('./barnddbLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');

var LIMIT = 25;
var OFFSET = 1;
var SEARCHPARAM = '';
var requestParam = {};
var RecordsCount = 0;
var BrandsDataList = [];
var NewlyInsertedRecords = [];

module.exports = app;

app.get("/", function (req, res) {
	dbLoader.BrandDB.loadDatabase();

	requestParam = req;

	// dbLoader.BrandDB.find({ SavedWithLocal: "YES" }, function (err, Docs) {
	// 	NewlyInsertedRecords = Docs;
	// });

	if (typeof (requestParam.query) != 'undefined' && requestParam.query != null) {
		if (typeof (requestParam.query.offset) != 'undefined' && requestParam.query.offset != null && requestParam.query.offset == 1) {
			OFFSET = 1;
			if (typeof (requestParam.query.limit) != 'undefined' && requestParam.query.limit != null && requestParam.query.limit != '') {
				LIMIT = parseInt(requestParam.query.limit);
			}
		} else if (typeof (requestParam.query.offset) != 'undefined' && requestParam.query.offset != null && requestParam.query.offset > 1) {
			OFFSET = parseInt(requestParam.query.offset);
			if (typeof (requestParam.query.limit) != 'undefined' && requestParam.query.limit != null && requestParam.query.limit != '') {
				LIMIT = parseInt(requestParam.query.limit);
			}
		}
		console.log(OFFSET, ' requestParam-query ', LIMIT);
	}
	if (typeof (requestParam.query) != 'undefined' && requestParam.query != null) {
		if (typeof (requestParam.query.q) != 'undefined' && requestParam.query.q != null) {
			SEARCHPARAM = requestParam.query.q;
		}
	}
	console.log(SEARCHPARAM);
	if (SEARCHPARAM != '') {
		var REGEX = new RegExp("^" + SEARCHPARAM, "i");
		console.log(REGEX);
		var response = {};
		dbLoader.BrandDB.find({ BrandName: { $regex: REGEX } }).limit(10).exec(function (err, data) {
			console.log(data);
			if (data != 'undefined') {
				if (data.length > 0) {
					BrandsDataList = [];
					BrandsDataList = data;
					SEARCHPARAM = '';
				}
				if (BrandsDataList.length > 0) {
					response = { 'status': 1, 'message': 'Brands Record.', 'result': BrandsDataList, 'RecordsCount': RecordsCount };
					res.send(response);
				} else {
					response = { 'status': 0, 'message': 'Brands Record.', 'result': [], 'RecordsCount': 0 };
					res.send(response);
				}
			}
		});

	} else {
		//console.log('normal');
		dbLoader.BrandDB.find({}).sort({ id: -1 }).skip(parseInt((OFFSET - 1) * LIMIT)).limit(parseInt(LIMIT)).exec(function (err, data) {
			var response = {};
			if (data.length > 0) {
				dbLoader.BrandDB.count({}).exec(function (err, TotalRecords) {
					RecordsCount = TotalRecords;
				});
				BrandsDataList = [];
				BrandsDataList = data;
				// if (NewlyInsertedRecords.length > 0) {
				// 	//console.log(NewlyInsertedRecords);
				// 	BrandsDataList = NewlyInsertedRecords.concat(data);
				// } else {
				// 	BrandsDataList = data;
				// }
				if (BrandsDataList.length > 0) {
					response = { 'status': 1, 'message': 'Brands Record.', 'result': BrandsDataList, 'RecordsCount': RecordsCount };
					res.send(response);
				} else {
					response = { 'status': 0, 'message': 'Brands Record.', 'result': [], 'RecordsCount': 0 };
					res.send(response);
				}


			}
		});

	}



});

// Create Brands
app.post("/", function (req, res) {
	var response = {};
	var docsProcess = {};
	var newBrand = req.body;
	dbLoader.BrandDB.find({ BrandName: newBrand.BrandName }, function (err, docs) {
		if (docs.length === 0) {
			//console.log('INSERT DOC');
			docsProcess = {
				"_myId": appLoader.getMyId(newBrand.BrandName),
				"BrandName": newBrand.BrandName,
				"Description": newBrand.Description,
				"GradeCode": newBrand.GradeCode,
				"BrandStatus": 1,
				"Manufacturer": newBrand.Manufacturer,
				"Parent": newBrand.Parent,
				"ManufacturerName": newBrand.Manufacturer,
				"ParentBrandName": newBrand.Parent,
				"SavedWithLocal": "YES"
			}
			dbLoader.BrandDB.insert(docsProcess, function (err) { });
			console.log('Brand Created Successfully.');
			response = { 'status': 1, 'message': 'Brand Created Successfully.' };
			res.send(response);
			//CreateToServer();
		} else {
			console.log('Sorry, this brand already exist.');
			response = { 'status': 1, 'message': 'Sorry, this brand already exist.' };
			res.send(response);
		}
	});
});

app.put("/", function (req, res) {
	var response = {};
	var UpdateBrandsArr = req.body;
	var errCount = 0;
	UpdateBrandsArr.forEach(function (key, val) {
		if ('id' in key) {
			var brandsParamConfig = {
				"_myId": appLoader.getMyId(key.BrandName),
				"id": key.id,
				"BrandName": key.BrandName,
				"Description": key.Description,
				"GradeCode": key.GradeCode,
				"BrandStatus": key.BrandStatus,
				"Manufacturer": key.Manufacturer,
				"Parent": key.Parent,
				"ManufacturerName": key.Manufacturer,
				"ParentBrandName": key.Parent
			};
			dbLoader.BrandDB.update({ _myId: key._myId }, { $set: brandsParamConfig }, function (err, cb) {
				if (err) {
					errCount += 1;
				} else {
					dbLoader.BrandUpdatedDB.insert(brandsParamConfig, function (err) { });
					console.log('Brand updated successfully.');
					UpdateToServer();
				}
			});
		} else {
			var brandsParamConfig = {
				"_myId": appLoader.getMyId(key.BrandName),
				"BrandName": key.BrandName,
				"Description": key.Description,
				"GradeCode": key.GradeCode,
				"BrandStatus": key.BrandStatus,
				"Manufacturer": key.Manufacturer,
				"Parent": key.Parent,
				"ManufacturerName": key.Manufacturer,
				"ParentBrandName": key.Parent,
				"SavedWithLocal": "YES"
			};
			dbLoader.BrandDB.update({ _myId: key._myId }, { $set: brandsParamConfig }, function (err, cb) {
				if (err) {
					errCount += 1;
				} else {
					console.log('Brand updated successfully.');
				}
			});
		}
	});

	if (errCount == 0) {
		response = { 'status': 1, 'message': 'Brand updated successfully.' };
	} else {
		response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
	}
	res.setHeader('content-type', 'text/javascript');
	res.json(response);

});

app.delete("/", function (req, res) {
	var response = {};
	// console.log('delete req.body', req.body);
	var DeleteBrandsArr = req.body.DELETEDATA;
	//console.log(DeleteBrandsArr);
	var errCount = 0;

	DeleteBrandsArr.forEach(function (key, val) {
		if ('id' in key) {
			var brandsParamConfig = {
				"_myId": appLoader.getMyId(key.BrandName),
				"id": key.id,
				"BrandName": key.BrandName,
				"Description": key.Description,
				"GradeCode": key.GradeCode,
				"BrandStatus": key.BrandStatus,
				"Manufacturer": key.Manufacturer,
				"Parent": key.Parent,
				"ManufacturerName": key.Manufacturer,
				"ParentBrandName": key.Parent
			};
			dbLoader.BrandDB.remove({ _myId: key._myId }, { multi: true }, function (err, cb) {
				if (err) {
					errCount += 1;
				} else {
					dbLoader.BrandDeletedDB.insert(brandsParamConfig, function (err) { });
					DeleteToServer();
					console.log('Brand deleted successfully.');
				}
			});
		} else {
			dbLoader.BrandDB.remove({ _myId: key._myId }, { multi: true }, function (err, cb) {
				if (err) {
					errCount += 1;
				} else {
					console.log('Brand deleted successfully.');
				}
			});
		}
	});

	if (errCount == 0) {
		response = { 'status': 1, 'message': 'Brand deleted successfully.' };
	} else {
		response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
	}
	res.setHeader('content-type', 'text/javascript');
	res.json(response);
});


function UpdateToServer() {

	dbLoader.BrandUpdatedDB.find({}, function (err, data) {
		console.log(data);
		var responseCreate = {};
		if (data.length > 0) {
			data.forEach(function (key, val) {
				var brandsParamConfig = [{
					"BrandName": key.BrandName,
					"Description": key.Description,
					"GradeCode": key.GradeCode,
					"BrandStatus": key.BrandStatus,
					"Manufacturer": key.Manufacturer,
					"Parent": key.Parent,
					"id": key.id
				}];
				var PutURL = appLoader.BASEURL + "brands/";
				appLoader.CallDataFromServer("PUT", PutURL, brandsParamConfig).then(function (callback) {
					responseCreate = callback;
					if (responseCreate.status == 1) {
						dbLoader.BrandUpdatedDB.remove({ _myId: key._myId }, { multi: true }, function (err, cb) {
							if (err) {
								errCount += 1;
							} else {
								var SearchURL = appLoader.BASEURL + "brands/?q=" + key.BrandName;
								appLoader.CallDataFromServer("GET", SearchURL, {}).then(function (cb) {
									DataDownloadFromServer = cb.result;
									if (DataDownloadFromServer.length > 0) {
										DataDownloadFromServer.forEach(function (bkey, val) {
											bkey["_myId"] = appLoader.getMyId(bkey.BrandName);
											dbLoader.BrandDB.update({ _myId: key._myId }, { $set: bkey }, function (err) {
												if (err) {
													errCount += 1;
												} else {
													console.log('Both server & local Data updated');
												}
											});
										});
									}
								}).catch(function (err) {
									console.err(err);
								});

							}
						});
					}
				}).catch(function (err) {
					console.err(err);
				});

			});
		}
	});

}

function DeleteToServer() {

	dbLoader.BrandDeletedDB.find({}, function (err, data) {
		var responseCreate = {};
		if (data.length > 0) {
			data.forEach(function (key, val) {
				var brandsParamConfig = {
					"DELETEDATA": [{
						"BrandName": key.BrandName,
						"Description": key.Description,
						"GradeCode": key.GradeCode,
						"BrandStatus": 1,
						"Manufacturer": key.Manufacturer,
						"Parent": key.Parent,
						"id": key.id
					}], "ParentDelete": "False"
				};
				var DeleteURL = appLoader.BASEURL + "brands/";
				appLoader.CallDataFromServer("DELETE", DeleteURL, brandsParamConfig).then(function (callback) {
					responseCreate = callback;
					if (responseCreate.status == 1) {
						console.log(responseCreate);
						dbLoader.BrandDeletedDB.remove({ _myId: key._myId }, { multi: true }, function (err, cb) {
							// Delete All Records From Local Database.
							console.log(cb + " Deleted.");
							if (err) {
								errCount += 1;
							} else {
								console.log('Brand deleted successfully.');
							}
						});
					}
				}).catch(function (err) {
					console.err(err);
				});

			});
		}
	});


}


