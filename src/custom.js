const APP_NAME = 'Insight Retail POS';
const PORT = 52878;
var _appLoader = require('../src/app/server/app.js');
var _elastic = require('../src/app/server/ping.js');
var titleBar;
var _browserWindow;
const customTitlebar = require('custom-electron-titlebar');

(async () => {
    const { remote } = require("electron");
    var _app = remote.app;
    await _app.whenReady();
    // console.log('_app userData', _app.getPath('userData'));
    _browserWindow = remote.BrowserWindow;
    if (_browserWindow != null && _browserWindow.getFocusedWindow() != null) {
        _browserWindow.getFocusedWindow().focus();
    }
    // CUSTOM TITLE BAR start
    titleBar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#313131'), // fde300
        overflow: 'visible'
    });
    titleBar.updateTitle(APP_NAME);
    titleBar.updateIcon('../src/assets/icons/favicon.png');
    var windowClose_old = document.querySelector('.window-close');
    var windowClose = windowClose_old.cloneNode(true);
    windowClose_old.parentNode.replaceChild(windowClose, windowClose_old);
    windowClose.addEventListener('click', function (e) {
        e.preventDefault();
        const LOCAL_IP = sessionStorage.getItem('localIp');
        const LOCAL_SERVER_URL = `http://${LOCAL_IP}:${PORT}/`;
        var currentUserString = localStorage.getItem('currentUser');
        if (typeof currentUserString != 'undefined' && currentUserString != null && JSON.parse(currentUserString)) {
            _appLoader.CallDataFromServer('GET', `${LOCAL_SERVER_URL}logout`, {}).then(function (response) {
                if (response.status == 1 && typeof response.ElasticParameters != 'undefined') {
                    saveLog(response.ElasticParameters);
                    closeWindow();
                }
            }).catch(function (err) {
                console.log('closeWindow err', err);
            });
        }
        else {
            closeWindow();
        }
    });
})();

function hideWindow() {
    var window = _browserWindow.getFocusedWindow();
    window.hide();
}

function closeWindow() {
    var window = _browserWindow.getFocusedWindow();
    window.hide();
    setTimeout(() => {
        window.close();
        _app.quit();
    }, 5000);

}

function setTitleBar(params = { section: '', title: APP_NAME }) {
    // return;
    if (typeof params.section == 'undefined') {
        params.section = '';
    }
    if (typeof params.title == 'undefined') {
        params.title = APP_NAME;
    }
    if (typeof titleBar != 'undefined') {
        titleBar.updateTitle(params.title);
        if (params.section == 'login' || params.section == 'ob-entry') {
            titleBar.updateBackground(customTitlebar.Color.fromHex('#fde300'));
        }
        else if (params.section == 'dashboard') {
            titleBar.updateBackground(customTitlebar.Color.fromHex('#f12213'));
        }
        else if (params.section == 'adminMode') {
            titleBar.updateBackground(customTitlebar.Color.fromHex('#bd0055'));
        }
        else if (params.section == 'saleMode') {
            titleBar.updateBackground(customTitlebar.Color.fromHex('#ef9106'));
        }
        else {
            titleBar.updateBackground(customTitlebar.Color.fromHex('#fffff'));
        }
    }
}
// CUSTOM TITLE BAR end

function scannerStatus(deviceDetails) {
    console.log('deviceDetails', deviceDetails);
    var HID = require('node-hid');
    device = new HID.HID(deviceDetails.vendorId, deviceDetails.productId);
    console.log('device', device);
    console.log('device info', device.getDeviceInfo());
}

function getMac() {
    var gm = require('getmac');
    var mac = gm.default();
    return mac ? mac : false;
}

function saveLog(params) {
    return _elastic.CallElasticSearchServer(params);
}

function doPrint(cartItems) {
    // printer integration
    try {
        const escpos = require('escpos');
        // Select the adapter based on your printer type
        const device = new escpos.USB();
        // const device  = new escpos.Network('localhost');
        // const device  = new escpos.Serial('/dev/usb/lp0');
        const options = { encoding: "GB18030" /* default */ }
        // encoding is optional
        const printer = new escpos.Printer(device, options);
        // console.log("doPrint device", device);
        // console.log("doPrint printer", printer);
        var today = new Date();
        var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
        var itemList = [];
        var itemCount = 0;
        var totalPrice = 0;
        var temp = {};
        cartItems.forEach(element => {

            var itemName = `${element.ItemUPC[0]} ${element.ItemDescription}`;
            var itemNameLength = itemName.length;
            var totalLines = itemNameLength / 47;
            temp = {
                text: `${itemName}`,
                align: 'LEFT',
                width: Math.ceil(totalLines)
            };
            itemList.push(temp);

            temp = {
                text: '',
                align: 'LEFT',
                width: 0.50
            };
            itemList.push(temp);

            itemCount += parseInt(element.ItemQty);
            temp = {
                text: `${element.ItemQty}`,
                align: 'CENTER',
                width: 0.25
            };
            itemList.push(temp);

            var itemPrice = parseFloat(element.ItemPrice);
            itemPrice = itemPrice.toFixed(2);
            temp = {
                text: `$${itemPrice}`,
                align: 'RIGHT',
                width: 0.25
            };
            itemList.push(temp);

            var itemTotalPrice = parseFloat(itemPrice * parseInt(element.ItemQty));
            totalPrice += itemTotalPrice;
            itemTotalPrice = itemTotalPrice.toFixed(2);
            temp = {
                text: `$${itemTotalPrice}`,
                align: 'RIGHT',
                width: 1
            };
            itemList.push(temp);

        });
        // console.log('doPrint itemList', itemList)
        setTimeout(() => {
            totalPrice = totalPrice.toFixed(2);
            device.open(function (error) {
                printer
                    .font('a')
                    .align('ct')
                    .style('b')
                    .size(2, 2)
                printer
                    .text('Insight Retail POS')
                printer
                    .style('bu')
                    .size(1, 1)
                    .text('Tel No. +1 111-111-1111')
                    .text('dev.rpos.io')
                    .feed()
                printer
                    .tableCustom([
                        { text: "Shift #", align: "LEFT", width: 0.25 },
                        { text: ": 1", align: "LEFT", width: 0.25 },
                        { text: "Date", align: "LEFT", width: 0.25 },
                        { text: `: ${date}`, align: "LEFT", width: 0.25 },
                        { text: "Cashier", align: "LEFT", width: 0.25 },
                        { text: ": 1234", align: "LEFT", width: 0.25 },
                        { text: "POS", align: "LEFT", width: 0.25 },
                        { text: ": 123", align: "LEFT", width: 0.25 },
                        { text: "Name", align: "LEFT", width: 0.25 },
                        { text: ": Tim Rischbieter", align: "LEFT", width: 0.75 },
                    ])
                    .feed()
                    .text('--- TAX INVOICE ---')
                printer
                    .drawLine()
                    .tableCustom([
                        // { text: "------------------------------------------------", align: "CENTER", width: 1 },
                        { text: "DESCRIPTION", align: "LEFT", width: 0.50 },
                        { text: "QTY", align: "CENTER", width: 0.25 },
                        { text: "AMOUNT", align: "RIGHT", width: 0.25 },
                        // { text: "------------------------------------------------", align: "CENTER", width: 1 }
                    ])
                    .drawLine()
                    .tableCustom(itemList)
                    .drawLine()
                    .tableCustom([
                        // { text: "------------------------------------------------", align: "CENTER", width: 1 },
                        { text: "Total", align: "LEFT", width: 0.50 },
                        { text: `${itemCount} Items`, align: "CENTER", width: 0.25 },
                        { text: `$${totalPrice}`, align: "RIGHT", width: 0.25 },
                        // { text: "------------------------------------------------", align: "CENTER", width: 1 }
                    ])
                    .drawLine()
                printer
                    .font('a')
                    .align('ct')
                    .size(1, 1)
                    .text('Thank you for shopping with us!')
                    .drawLine()
                    .barcode('1234567', 'EAN8', { width: 4 })
                    .feed()
                    .cut()
                    .cashdraw()
                    .close()
                // .qrimage('https://github.com/song940/node-escpos', function (err) {
                //     this.cut();
                //     this.close();
                //     this.cashdraw();
                // });
            });
        });
    }
    catch (e) {
        console.log('Print failed: ', e);
        // console.log('Printer not connected');
    }
}