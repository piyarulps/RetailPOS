var request = require("request");
var es = require('elasticsearch');
const PASSCODE = 'InsightRetailPOS';
const ENABLE_ENCRYPTION = false; //true | false

var useLocalServer = false; //true | false
var ServerImageFolder = "https://rposio.s3.amazonaws.com/dev/";
if (useLocalServer) {
    var BASEURLSHORT = 'http://192.168.0.107:8000/irsbackend/';
    var TOKEN = 'Token 68ad45fbd302f064742a7768e74fcf1041151fc7';
}
else {
    var BASEURLSHORT = 'http://dev.rpos.io:8088/irsbackend/';
    var TOKEN = 'Token 8e2359775a8b8da22592d0d826fcfcb87d06a43c';
}
var BASEURL = BASEURLSHORT + 'itemapis/';
var LOCALAPIURL = "http://localhost:52878/";
var ELASTICURL = 'http://dev.rpos.io:9200';
var LOGINSESSIONDATA = JSON.parse(localStorage.getItem('LoggedInData'));
var WORKER_ID = typeof LOGINSESSIONDATA != 'undefined' && LOGINSESSIONDATA != null && typeof LOGINSESSIONDATA.WorkerID != 'undefined' ? LOGINSESSIONDATA.WorkerID : null;
function CallDataFromServer(Method, URL, Parameters) {
    return new Promise(function (resolve, reject) {
        if (Method == "POST" || Method == "PUT" || Method == "DELETE") {
            request({
                url: URL,
                method: Method,
                json: true,
                body: Parameters,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': TOKEN
                },
            }, function (error, response, body) {
                if (error) return reject(error);
                try {
                    resolve(body);
                } catch (e) {
                    reject(e);
                }
            });
        } else {
            request({
                uri: URL,
                method: Method,
                timeout: 200000,
                followRedirect: true,
                maxRedirects: 10,
                pool: { maxSockets: Infinity },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': TOKEN
                },
                json: true

            }, function (error, response, body) {
                if (error) return reject(error);
                try {
                    resolve(body);
                } catch (e) {
                    reject(e);
                }
            });
        }
    });
}
function getCurrentTimeStamp() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    return dateTime.toString();
}

var esClient = new es.Client({
    host: ELASTICURL,
    log: 'trace'
});

function getSequenceNumber() {
    var LoggedInData = JSON.parse(localStorage.getItem('LoggedInData'));
    var today = new Date();
    // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var dateTime = String(date + ' ' + time);
    var WS = String(LoggedInData.WorkstationID);
    var BU = String(LoggedInData.BusinessUnitID);
    var OP = String(LoggedInData.OperatorID);
    var DT = String(time).replace(/[: -]/g, "");
    var SequenceNumber = WS.concat(BU, OP, DT);
    return SequenceNumber;
}

function getMyId(myString) {
    return btoa(encodeURI(myString));
}

function encryptCodes(content, passcode = PASSCODE) {
    content = JSON.stringify(content);
    var result = []; var passLen = passcode.length;
    for (var i = 0; i < content.length; i++) {
        var passOffset = i % passLen;
        var calAscii = (content.charCodeAt(i) + passcode.charCodeAt(passOffset));
        result.push(calAscii);
    }
    return JSON.stringify(result);
}

function decryptCodes(content, passcode = PASSCODE) {
    var result = []; var str = '';
    var codesArr = JSON.parse(content); var passLen = passcode.length;
    for (var i = 0; i < codesArr.length; i++) {
        var passOffset = i % passLen;
        var calAscii = (codesArr[i] - passcode.charCodeAt(passOffset));
        result.push(calAscii);
    }
    for (var i = 0; i < result.length; i++) {
        var ch = String.fromCharCode(result[i]); str += ch;
    }
    return JSON.parse(str);
}

// If a string is a valid JSON string
function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

module.exports = {
    BASEURL,
    TOKEN,
    CallDataFromServer,
    BASEURLSHORT,
    getCurrentTimeStamp,
    esClient,
    getSequenceNumber,
    LOCALAPIURL,
    getMyId,
    encryptCodes,
    decryptCodes,
    isJsonString,
    ENABLE_ENCRYPTION,
    WORKER_ID,
    ServerImageFolder
};







