var app = require("express")();
var dbLoader = require('./sizedbLoader.js');
var DataFromServer = [];
var ipinfo = localStorage.getItem('identifier');
var appLoader = require('../../app.js');


module.exports = app;
app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');
    var response = {};
    var errCount = 0;


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
                    console.log(err);
                });
            });
        }
    });

    dbLoader.ListDB.find({ SavedWithLocal: "YES" }, function (err, data) {
        var responseCreate = {};
        if (data.length > 0) {
            data.forEach(function (key, val) {
                var ParamConfig = {
                    "TableName": key.TableName,
                    "TableCode": key.TableCode,
                    "SizeStatus": key.SizeStatus,
                    "SizeFamilyName": key.SizeFamilyName,
                    "SizeFamily": key.SizeFamily,
                    "Description": key.Description,
                    "ActualSizeTypeDescription": key.ActualSizeTypeDescription,
                    "ActualSizeProportionDescription": key.ActualSizeProportionDescription,
                    "ActualSizeCode": key.ActualSizeCode
                };
                var POSTURL = appLoader.BASEURL + "sizes/";
                appLoader.CallDataFromServer("POST", POSTURL, ParamConfig).then(function (response) {
                    responseCreate = response;
                    console.log(responseCreate);
                    dbLoader.ListDB.remove({ SavedWithLocal: "YES" }, { multi: true }, function (err, cb) {
                        if (err) {
                            errCount += 1;
                        } else {
                            var getURL = appLoader.BASEURL + "sizes/?q=" + key.TableName;
                            appLoader.CallDataFromServer("GET", getURL, {}).then(function (createresponse) {
                                if (typeof createresponse.result[0] != 'undefined') {
                                    createresponse.result[0]["_myId"] = appLoader.getMyId(createresponse.result[0]["TableName"]);
                                }
                                dbLoader.ListDB.insert(createresponse.result[0], function (err, cb) {
                                    console.log('Size created successfully.');
                                });
                            }).catch(function (err) {
                                console.log(err);
                            });
                        }
                    });
                }).catch(function (err) {
                    console.log(err);
                });
            });
        }
    });

    dbLoader.UpdatedDB.find({}, function (err, data) {
        var responseCreate = {};
        if (data.length > 0) {
            data.forEach(function (key, val) {
                var ParamConfig = [{
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
                                console.log(err);
                            });
                        }
                    });

                }).catch(function (err) {
                    console.log(err);
                });
            });
        }
    });

    var DownloadURL = appLoader.BASEURL + "sizes/?limit=0&IPADDRESS=" + ipinfo;
    appLoader.CallDataFromServer("GET", DownloadURL, {}).then(function (response) {
        DataFromServer = response.result;
        if (DataFromServer.length > 0) {
            DataFromServer.forEach(function (key, val) {
                var _sizeName = key.TableName;
                if (typeof (_sizeName) != 'undefined') {
                    dbLoader.ListDB.find({ TableName: _sizeName }, function (err, docs) {
                        key["_myId"] = appLoader.getMyId(key["TableName"]);
                        if (docs.length === 0) {
                            dbLoader.ListDB.insert(key, function (err) { });
                        } else {
                            if ('id' in docs[0]) {
                                dbLoader.ListDB.update({ _myId: docs[0]._myId }, { $set: key }, function (err, cb) {
                                    if (err) {
                                        errCount += 1;
                                    } else {
                                        console.log('Updated.');
                                    }
                                });
                            } else {
                                dbLoader.ListDB.remove({ _myId: docs[0]._myId }, function (err, cb) {
                                    if (cb === 1) {
                                        dbLoader.ListDB.insert(key, function (err) { });
                                    } else {
                                        console.log('Sorry, something went wrong. Pls try again.');
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }

    }).catch(function (err) {
        console.log(err);
    });

    if (errCount == 0) {
        response = { 'status': 1, 'message': 'Size sync successfully.' };
    } else {
        response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
    }
    res.setHeader('content-type', 'text/javascript');
    res.json(response);


});
