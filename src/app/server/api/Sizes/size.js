var dbLoader = require('./sizedbLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');

var LIMIT = 25;
var OFFSET = 1;
var SEARCHPARAM = '';
var requestParam = {};
var RecordsCount = 0;
var PAGE = 1;
var DataList = [];
var NewlyInsertedRecords = [];

module.exports = app;

app.get("/", function (req, res) {
	dbLoader.ListDB.loadDatabase();

	requestParam = req;

	var response = {};
	dbLoader.ListDB.find({ SavedWithLocal: "YES" }, function (err, Docs) {
		NewlyInsertedRecords = Docs.reverse();
	});

	//console.log('requestParam.query', requestParam.query);
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
		dbLoader.ListDB.find({ TableName: { $regex: REGEX } }).limit(10).exec(function (err, data) {
			console.log(data);
			if (data != 'undefined') {
				if (data.length > 0) {
					DataList = [];
					DataList = data;
					SEARCHPARAM = '';
				}
			}
		});
	} else {
		dbLoader.ListDB.count({}).exec(function (err, TotalRecords) {
			RecordsCount = TotalRecords;
		});
		dbLoader.ListDB.find({}).sort({ id: -1 }).skip(parseInt((OFFSET - 1) * LIMIT)).limit(parseInt(LIMIT)).exec(function (err, data) {
			if (data.length > 0) {
				if (NewlyInsertedRecords.length > 0) {
					console.log(NewlyInsertedRecords);
					DataList = NewlyInsertedRecords.concat(data);
				} else {
					DataList = data;
				}
				response = { 'status': 1, 'message': 'Sizes Record.', 'result': DataList, 'RecordsCount': RecordsCount };
				res.send(response);
			}
		});
	}


});

// Create Brands
app.post("/", function (req, res) {
	var response = {};
	var docsProcess = {};
	var newDoc = req.body;
	dbLoader.ListDB.find({ TableName: newDoc.TableName }, function (err, docs) {
		if (docs.length === 0) {
			//console.log('INSERT DOC');
			docsProcess = {
				"_myId": appLoader.getMyId(newDoc.TableName),
				"TableName": newDoc.TableName,
				"TableCode": newDoc.TableCode,
				"SizeStatus": 1,
				"SizeFamilyName": newDoc.SizeFamily,
				"SizeFamily": newDoc.SizeFamily,
				"Description": newDoc.Description,
				"ActualSizeTypeDescription": newDoc.ActualSizeTypeDescription,
				"ActualSizeProportionDescription": newDoc.ActualSizeProportionDescription,
				"ActualSizeCode": newDoc.ActualSizeCode,
				"SavedWithLocal": "YES"
			}
			dbLoader.ListDB.insert(docsProcess, function (err) { });
			//CreateToServer();
			console.log('Size Created Successfully.');
			response = { 'status': 1, 'message': 'Size Created Successfully.' };
			res.send(response);
		} else {
			console.log('Sorry, this Size already exist.');
			response = { 'status': 1, 'message': 'Sorry, this Size already exist.' };
			res.send(response);
		}
	});
});

app.put("/", function (req, res) {
	var response = {};
	var errCount = 0;

	var UpdateArr = req.body;
	//console.log(UpdateBrandsArr);
	UpdateArr.forEach(function (key, val) {
		if ('id' in key) {
			var ParamConfig = {
				"_myId": appLoader.getMyId(key.TableName),
				"id": key.id,
				"TableName": key.TableName,
				"TableCode": key.TableCode,
				"SizeStatus": key.SizeStatus,
				"SizeFamilyName": key.SizeFamily,
				"SizeFamily": key.SizeFamily,
				"Description": key.Description,
				"ActualSizeTypeDescription": key.ActualSizeTypeDescription,
				"ActualSizeProportionDescription": key.ActualSizeProportionDescription,
				"ActualSizeCode": key.ActualSizeCode
			};
			dbLoader.ListDB.update({ _myId: key._myId }, { $set: ParamConfig }, function (err, cb) {
				if (err) {
					errCount += 1;
				} else {
					dbLoader.UpdatedDB.insert(ParamConfig, function (err) { });
					console.log('Size updated successfully.');
					UpdateToServer();
				}
			});
		} else {
			var ParamConfig = {
				"_myId": appLoader.getMyId(key.TableName),
				"TableName": key.TableName,
				"TableCode": key.TableCode,
				"SizeStatus": key.SizeStatus,
				"SizeFamilyName": key.SizeFamilyName,
				"SizeFamily": key.SizeFamily,
				"Description": key.Description,
				"ActualSizeTypeDescription": key.ActualSizeTypeDescription,
				"ActualSizeProportionDescription": key.ActualSizeProportionDescription,
				"ActualSizeCode": key.ActualSizeCode,
				"SavedWithLocal": "YES"
			};
			dbLoader.ListDB.update({ _myId: key._myId }, { $set: ParamConfig }, function (err, cb) {
				if (err) {
					errCount += 1;
				} else {
					console.log('Size updated successfully.');
				}
			});
		}
	});
	if (errCount == 0) {
		response = { 'status': 1, 'message': 'Size updated successfully.' };
	} else {
		response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
	}
	res.setHeader('content-type', 'text/javascript');
	res.json(response);


});

app.delete("/", function (req, res) {
	var response = {};
	var errCount = 0;
	var DeleteArr = req.body;
	//console.log(DeleteBrandsArr);
	DeleteArr.forEach(function (key, val) {
		if ('id' in key) {
			var ParamConfig = {
				"_myId": appLoader.getMyId(key.TableName),
				"id": key.id
			};
			dbLoader.ListDB.remove({ _myId: key._myId }, { multi: true }, function (err, cb) {
				if (cb === 1) {
					dbLoader.DeletedDB.insert(ParamConfig, function (err) { });
					DeleteToServer();
				} else {
					errCount += 1;
				}
			});
		} else {
			dbLoader.ListDB.remove({ _myId: key._myId }, { multi: true }, function (err, cb) {
				if (cb === 1) {
					console.log('Size deleted successfully.');
				} else {
					errCount += 1;
				}
			});
		}
	});

	if (errCount == 0) {
		response = { 'status': 1, 'message': 'Size deleted successfully.' };
	} else {
		response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
	}
	res.setHeader('content-type', 'text/javascript');
	res.json(response);


});


function UpdateToServer() {

	dbLoader.UpdatedDB.find({}, function (err, data) {
		var responseCreate = {};
		if (data.length > 0) {
			data.forEach(function (key, val) {
				var ParamConfig = [{
					"_myId": appLoader.getMyId(key.TableName),
					"TableName": key.TableName,
					"TableCode": key.TableCode,
					"SizeStatus": key.SizeStatus,
					"SizeFamilyName": key.SizeFamilyName,
					"SizeFamily": key.SizeFamily,
					"Description": key.Description,
					"ActualSizeTypeDescription": key.ActualSizeTypeDescription,
					"ActualSizeProportionDescription": key.ActualSizeProportionDescription,
					"ActualSizeCode": key.ActualSizeCode,
					"id": key.id
				}];
				var PUTURL = appLoader.BASEURL + "sizes/";
				appLoader.CallDataFromServer("PUT", PUTURL, ParamConfig).then(function (response) {
					responseCreate = response;
					console.log(responseCreate);
					dbLoader.UpdatedDB.remove({ _myId: key._myId }, { multi: true }, function (err, cb) {
						if (err) {
							errCount += 1;
						} else {
							var getURL = appLoader.BASEURL + "sizes/?q=" + key.TableName;
							appLoader.CallDataFromServer("GET", getURL, {}).then(function (createresponse) {
								DataDownloadFromServer = createresponse.result;
								if (DataDownloadFromServer.length > 0) {
									DataDownloadFromServer.forEach(function (skey, val) {
										skey["_myId"] = appLoader.getMyId(skey["TableName"]);
										dbLoader.ListDB.update({ _myId: key._myId }, { $set: skey }, function (err) {
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

				}).catch(function (err) {
					console.err(err);
				});
			});
		}
	});
}

function DeleteToServer() {

	dbLoader.DeletedDB.find({}, function (err, data) {
		var responseCreate = {};
		if (data.length > 0) {
			data.forEach(function (key, val) {
				var ParamConfig = [{
					"id": key.id
				}];
				var DeleteURL = appLoader.BASEURL + "sizes/";
				appLoader.CallDataFromServer("DELETE", DeleteURL, ParamConfig).then(function (callback) {
					responseCreate = callback;
					console.log(responseCreate);
					dbLoader.DeletedDB.remove({}, { multi: true }, function (err, cb) {
						// Delete All Records From Local Database.
						console.log(cb + " Deleted.");
					});

				}).catch(function (err) {
					console.err(err);
				});
			});
		}
	});

}


