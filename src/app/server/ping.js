var appLoader = require('./app.js');
var gm = require('getmac');
var mac = gm.default();
var MachineAddress = mac;

function CheckConnectionElasticSearchServer() {
    appLoader.esClient.ping({
        // ping usually has a 3000ms timeout
        requestTimeout: 1000
    }, function (error) {
        if (error) {
            console.trace('elasticsearch cluster is down!');
        } else {
            console.log('All is well');
        }
    });
}
function IndexCreateOnElasticsearch() {

    var createIndex = async function (indexName) {
        return await appLoader.esClient.indices.create({
            index: indexName
        });
    }
    async function index_create() {
        try {
            var resp = await createIndex('master_transactions');
            console.log(resp);
        } catch (e) {
            console.log(e);
        }
    }
    index_create();
}
function CallElasticSearchServer(Parameters) {
    var response = {};
    var insertDoc = async function (indexName, mappingType, data) {
        return await appLoader.esClient.index({
            index: indexName,
            type: mappingType,
            body: data
        });
    }
    async function insertTOELASTICSERVER() {
        var data = Parameters;
        var loginData = localStorage.getItem('LoggedInData');
        // Common parameters for all logs
        data.MainTransaction = localStorage.getItem('MainTransaction');
        data.MainTransactionID = localStorage.getItem('ReportingID');
        data.MachineAddress = MachineAddress;
        data.CurrentTime = appLoader.getCurrentTimeStamp();
        if (typeof loginData != 'undefined' && loginData != null && JSON.parse(loginData)) {
            loginData = JSON.parse(loginData);
            data.WorkstationID = loginData.WorkstationID;
            data.BusinessUnitID = loginData.BusinessUnitID;
            data.OperatorID = loginData.OperatorID;
            data.LoginID = loginData.userid;
        }

        try {
            const resp = await insertDoc('master_transactions', 'POSLOG', data);
            response = resp;
            console.log(resp);

        } catch (e) {
            console.log(e);
        }
    }
    insertTOELASTICSERVER();
    return response;

}

module.exports = { CallElasticSearchServer, IndexCreateOnElasticsearch, CheckConnectionElasticSearchServer };
