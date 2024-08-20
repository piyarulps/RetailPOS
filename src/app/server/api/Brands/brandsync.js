var app = require("express")();
var dbLoader = require('./barnddbLoader.js');
var appLoader = require('../../app.js');
var ipinfo = localStorage.getItem('identifier');
var DataDownloadFromServer = [];

module.exports = app;

app.get("/", function (req, res) {
	ipinfo = localStorage.getItem('identifier');
	var response = {};
	var errCount = 0;

	dbLoader.BrandDB.find({ SavedWithLocal: "YES" }, function (err, data) {
		var responseCreate = {};
		if (data.length > 0) {
			data.forEach(function (key, val) {
				var brandsParamConfig = {
					"BrandName": key.BrandName,
					"Description": key.Description,
					"GradeCode": key.GradeCode,
					"BrandStatus": 1,
					"Manufacturer": key.Manufacturer,
					"Parent": key.Parent
				};
				var PostURL = appLoader.BASEURL + "brands/";
				appLoader.CallDataFromServer("POST", PostURL, brandsParamConfig).then(function (callback) {
					responseCreate = callback;
					if (responseCreate != null && responseCreate != 'undefined') {
						console.log(responseCreate);
						var MY_ID = key._myId;
						var Node_ID = key._id;
						dbLoader.BrandDB.remove({ _myId: key._myId, SavedWithLocal: "YES" }, { multi: true }, function (err, cb) {
							if (err) {
								errCount += 1;
							} else {
								var SearchURL = appLoader.BASEURL + "brands/?q=" + key.BrandName;
								appLoader.CallDataFromServer("GET", SearchURL, {}).then(function (cb) {
									DataDownloadFromServer = cb.result;
									if (DataDownloadFromServer.length > 0) {
										DataDownloadFromServer.forEach(function (bkey, val) {
											bkey["_myId"] = MY_ID;
											bkey["_id"] = Node_ID;
											var BrandServerID = bkey.id;
											dbLoader.BrandDB.find({ id: BrandServerID }, function (err, edocs) {
												if (edocs.length === 0) {
													console.log('INSERT DOC');
													dbLoader.BrandDB.insert(bkey, function (err) {
														if (err) {
															errCount += 1;
														} else {
															console.log('Brand created successfully.');
														}
													});
												} else {
													dbLoader.BrandDB.update({ _myId: edocs[0]._myId }, { $set: bkey }, function (err) {
														if (err) {
															errCount += 1;
														} else {
															console.log('Updated.');
														}
													});
												}
											});
										});
									}
								}).catch(function (err) {
									console.log(err);
								});

							}

						});
					}
				}).catch(function (err) {
					console.log(err);
				});

			});
		}
	});

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
					console.log(err);
				});

			});
		}
	});

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
											bkey["_myId"] = key._myId;
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
									console.log(err);
								});

							}
						});
					}
				}).catch(function (err) {
					console.log(err);
				});

			});
		}
	});



	var DownloadURL = appLoader.BASEURL + "brands/?limit=0&IPADDRESS=" + ipinfo;
	appLoader.CallDataFromServer("GET", DownloadURL, {}).then(function (callback) {
		//console.log(val);
		if (typeof callback != 'undefined' && callback.status == 1) {
			DataDownloadFromServer = callback.result;
			if (DataDownloadFromServer.length > 0) {
				DataDownloadFromServer.forEach(function (key, val) {
					var _brandName = key.BrandName;
					var BrandServerID = key.id;
					var MYTD = appLoader.getMyId(key.BrandName);
					// console.log(_brandName);
					if (typeof (_brandName) != 'undefined') {
						dbLoader.BrandDB.find({ id: BrandServerID }, function (err, docs) {
							key["_myId"] = MYTD;
							if (docs.length === 0) {
								//console.log('INSERT DOC');
								dbLoader.BrandDB.insert(key, function (err) { });
							} else {
								dbLoader.BrandDB.update({ _myId: docs[0]._myId }, { $set: key }, function (err) {
									if (err) {
										errCount += 1;
									} else {
										console.log('Updated.');
									}
								});
							}
						});
					}
				});
			}
		}

	}).catch(function (err) {
		console.log(err);
	});


	if (errCount == 0) {
		response = { 'status': 1, 'message': 'Brand sync successfully.' };
	} else {
		response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
	}
	res.setHeader('content-type', 'text/javascript');
	res.json(response);

});
