var dbLoader = require('./shareDBLoader.js');
var app = require("express")();
var appLoader = require('../../app.js');
module.exports = app;

app.get("/", function (req, res) {
    var BusinessGroupID = localStorage.getItem('BUSINESS_GROUP_ID');

    var response = {};
    var errCount = 0;
    var last_sync_store_url = appLoader.BASEURLSHORT + "last-sync-store/";
    if(navigator.onLine==true){
        dbLoader.LastSyncDB.find({}, function (err, data) {
            if (data.length > 0) {
                data.forEach(function (key, val) {
                    console.log(key)
                    var ParamConfig = {
                        "IPADDRESS":key.ipinfo,
                        "ModuleName":key.ModuleName,
                        "LastSyncTime":key.LastSyncTime
                    };
                    console.log(ParamConfig);
                    if(key.ModuleName='Item'){
                        ParamConfig.BusinessGroupID=BusinessGroupID;
                    }
                    appLoader.CallDataFromServer("POST", last_sync_store_url, ParamConfig).then(function (LastSyncTimeResponse) {
                        if (LastSyncTimeResponse != null && LastSyncTimeResponse != 'undefined') {
                            console.log(LastSyncTimeResponse);
                            if(LastSyncTimeResponse.status ==1){
                                dbLoader.LastSyncDB.remove({ _id: key._id }, { multi: true }, function (err, cb) {
                                    if(err){
                                        errCount += 1;
                                    }else{
                                        console.log('removed.');
                                    }
                                });
                            }
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                });
            }
        });
    }
    if (errCount == 0) {
        response = { 'status': 1, 'message': 'Download DB sync successfully.' };
    } else {
        response = { 'status': 1, 'message': 'Sorry, something went wrong. Pls try again.' };
    }
    res.setHeader('content-type', 'text/javascript');
    res.json(response);
});
