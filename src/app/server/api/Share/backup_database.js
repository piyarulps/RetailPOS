var app = require("express")();
var appLoader = require('../../app.js');
const _fse = require('fs-extra');
const { remote: myRemote } = require("electron");
var _app = myRemote.app;
const BACKUP_PATH = `${_app.getPath('userData')}/Models`;
const IDENTITY_PATH = `Models/identity.json`;
var ipinfo = localStorage.getItem('identifier');

module.exports = app;

app.get("/", function (req, res) {
    ipinfo = localStorage.getItem('identifier');
    var response = {};
    console.log('_app userData', _app.getPath('userData'));
    _fse.ensureFile(IDENTITY_PATH, err => {
        if (err == null) {
            _fse.writeJson(IDENTITY_PATH, { identifier: ipinfo }, err => {
                if (err) {
                    handleError(err)
                }
                else {
                    _fse.copy(`Models`, BACKUP_PATH, err => {
                        if (err) {
                            handleError(err)
                        }
                        else {
                            res.send({
                                status: 1,
                                message: `Database has been copied to ${_app.getPath('userData')}`
                            })
                        }
                    })
                }
            })
        }
        else {
            handleError(err)
        }
    })
    function handleError(err) {
        res.send({
            status: 0,
            message: `Could not copy database`,
            error: err
        })
    }
});
