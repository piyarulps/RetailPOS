var app = require("express")();
var dbLoader = require('./downloadedDBLoader.js');

module.exports = app;
app.get("/", function(req, res) {
    dbLoader.DownloadedDB.loadDatabase();
    var response={};
    var downloadedInfo=[];
    var tempCount=0;
    var TotalData=0;
    var TotalDownloaded=0;

        // max value returning query of filed.
    dbLoader.DownloadedDB.find({ModuleName:'Items'}).sort({Downloaded:-1}).limit(1).exec(function(err, item) {
        if(item.length > 0 && item!='undefined'){
            dbLoader.DownloadedDB.find({ModuleName:{$ne : "Items"}}).exec(function(err, brand) {
                if(brand.length > 0 && brand!='undefined'){
                    downloadedInfo=brand;
                    downloadedInfo.push(item[0]);
                    tempCount=1;
                    response={'status':1,'message':'Data Found.','Count':tempCount,'result':downloadedInfo};
                    res.send(response);
                }else{
                    tempCount=1;
                    downloadedInfo.push(item[0]);
                    response={'status':1,'message':'Data Found.','Count':tempCount,'result':downloadedInfo};
                    res.send(response);
                }
            });
        }else{
            dbLoader.DownloadedDB.find({}).exec(function(err, datas) {
                if(datas.length > 0 && datas!='undefined'){
                    downloadedInfo=datas;
                    tempCount=1;
                    response={'status':1,'message':'Data Found.','Count':tempCount,'result':downloadedInfo};
                    res.send(response);
                }else{
                    response={'status':1,'message':'Data Found.','Count':0,'result':downloadedInfo};
                    res.send(response);
                }
            });
        }
    });


});
