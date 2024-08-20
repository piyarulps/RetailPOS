const Crypto = require('crypto')
const Swarm = require('discovery-swarm')
const Defaults = require('dat-swarm-defaults')
const GetPort = require('get-port')

// const WebSocket = require('ws');
// var globalWs;
var myFs = require('fs');
var myPath = require('path');
// Get MAC address
var myGm = require('getmac');
var myMac = myGm.default();
// Get local ip address
var os = require('os');
var interfaces = os.networkInterfaces();
var localIp;
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        // console.log('address', address);
        if (address.family === 'IPv4' && !address.internal) {
            localIp = address.address;
            sessionStorage.setItem('localIp', localIp);
        }
    }
}

var appLoader = require('../src/app/server/app.js');

// Mention channel name
const channelName = 'apm-rpos-channel';

/**
 * Here we will save our TCP peer connections
 * using the peer id as key: { peer_id: TCP_Connection }
 */
const peers = {}
// Counter for connections, used for identify connections
let connSeq = 0

// Peer Identity, a random hash for identify your peer
const myId = Crypto.randomBytes(16)
console.log('Your P2P identity: ' + myId.toString('hex'))

// Send data to other peers
function publish(data) {
    for (let id in peers) {
        console.log(peers[id].conn.write(JSON.stringify(data)));
    }
    console.log('Published data: ', data);
}
// Use received data
function receive(data) {
    var requestMethod = (data.method).toUpperCase();
    var requestURL = `http://${localIp}:52878/${data.url}`;
    var requestParams = data.data;
    if (requestMethod == 'DELETE' && typeof requestParams.body != 'undefined' && appLoader.isJsonString(requestParams.body)) {
        requestParams = JSON.parse(requestParams.body);
    }
    if (requestMethod == 'DELETE' || requestMethod == 'PUT' || requestMethod == 'POST') {
        appLoader.CallDataFromServer(requestMethod, requestURL, requestParams).then(function (response) {
            console.log('Response after operating received data: ', response);
            // let temp = {
            //     message: 'Database updated from remote connection.'
            // }
            // globalWs.send(JSON.stringify(temp));
        }).catch(function (err) {
            console.log(err);
        });
    }
    else if (requestMethod == 'FINDING_DB') {
        requestMethod = 'GET';
        requestURL = `http://${localIp}:52878/check-database-latest/`;
        requestParams = {};
        appLoader.CallDataFromServer(requestMethod, requestURL, requestParams).then(function (response) {
            if (typeof response.status != 'undefined' && response.status == 1) {
                var publishData = {
                    mac: myMac,
                    identifier: '',
                    method: 'SHARING_DB',
                    url: `http://${localIp}:52878/share-database/`,
                    data: {},
                    moduleName: ''
                }
                publish(publishData);
            }
        }).catch(function (err) {
            console.log(err);
        });
    }
    else if (requestMethod == 'SHARING_DB') {
        requestMethod = 'GET';
        requestURL = data.url;
        requestParams = {};
        appLoader.CallDataFromServer(requestMethod, requestURL, requestParams).then(function (response) {
            console.log('Response after operating received data: ', response);
            if (typeof response.data != 'undefined' && response.data.length) {
                var i = 1;
                var responseLength = response.data.length;
                response.data.forEach(element => {
                    if (typeof element.moduleName != 'undefined' && element.moduleName != null) {
                        appLoader.CallDataFromServer('POST', `http://${localIp}:52878/receive-database/`, element).then(function (response) {
                            console.log('receive-database response', response);
                            appLoader.CallDataFromServer('POST', `http://${localIp}:52878/set-last-sync/`, { ModuleName: element.moduleName }).then(function (response) {
                                i++;
                                console.log('set-last-sync response', response);
                                if (i == responseLength) {
                                    appLoader.CallDataFromServer('GET', `http://${localIp}:52878/manage-last-sync/`, {}).then(function (response) {
                                        console.log('manage-last-sync response', response);
                                        appLoader.CallDataFromServer('POST', `http://${localIp}:52878/check-database-latest/`, {}).then(function (response) {
                                            console.log('check-database-latest response', response);
                                        }).catch(function (err) {
                                            console.log('check-database-latest err', err);
                                        });
                                    }).catch(function (err) {
                                        console.log('manage-last-sync err', err);
                                    });
                                }
                            }).catch(function (err) {
                                console.log('set-last-sync err', err);
                            });
                        }).catch(function (err) {
                            console.log('receive-database err', err);
                        });
                    }
                });
                localStorage.setItem('dataSyncTime', new Date().toString());
            }
        }).catch(function (err) {
            console.log(err);
        });
    }
}
// Using websocket to pass data from js to ts
// const wss = new WebSocket.Server({ port: 2752 });
// wss.on('connection', function connection(ws) {
//     globalWs = ws;
//     globalWs.on('message', function incoming(message) {
//         console.log('received: ', message);
//     });
//     // ws.send('something');
// });
/** 
 * Default DNS and DHT servers
 * This servers are used for peer discovery and establishing connection
 */
const config = Defaults({
    // peer-id
    id: myId
})

/**
 * discovery-swarm library establishes a TCP p2p connection and uses
 * discovery-channel library for peer discovery
 */
const sw = Swarm(config);
(async () => {

    // Choose a random unused port for listening TCP peer connections
    const port = await GetPort()

    sw.listen(port)
    // console.log('Listening to port: ' + port)

    /**
     * The channel we are connecting to.
     * Peers should discover other peers in this channel
     */
    sw.join(channelName)

    sw.on('connection', (conn, info) => {
        // Connection id
        const seq = connSeq

        const peerId = info.id.toString('hex')
        // console.log(`Connected #${seq} to peer: ${peerId}`)

        // Keep alive TCP connection with peer
        if (info.initiator) {
            try {
                conn.setKeepAlive(true, 600)
            } catch (exception) {
                // console.log('exception', exception)
            }
        }

        conn.on('data', data => {
            // Here we handle incomming messages
            if (appLoader.isJsonString(data.toString())) {
                let jsonData = JSON.parse(data.toString());
                console.log(`Received data from ${peerId}: `, jsonData);
                receive(jsonData);
            }
        })

        conn.on('close', () => {
            // Here we handle peer disconnection
            // console.log(`Connection ${seq} closed, peer id: ${peerId}`)
            // If the closing connection is the last connection with the peer, removes the peer
            if (typeof peers[peerId] != 'undefined' && peers[peerId].seq === seq) {
                delete peers[peerId]
            }
        })

        // Save the connection
        if (!peers[peerId]) {
            peers[peerId] = {}
        }
        peers[peerId].conn = conn
        peers[peerId].seq = seq
        connSeq++
    })

})()