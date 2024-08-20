var app = require("express")();

module.exports = app;
app.get("/", function (req, res) {
    var data = [
        { 'DisplayModuleName': 'Control Transactions', 'ModuleName': 'ControlTransactions', 'DownloadingApi': 'login-transaction-sync' },
        { 'DisplayModuleName': 'Retail Transactions', 'ModuleName': 'RetailTransactions', 'DownloadingApi': 'retail-transaction-sync' }
    ]
    res.send(data);
});
