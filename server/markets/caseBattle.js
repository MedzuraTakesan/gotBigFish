const WebSocketClient = require('websocket').client;
const { MARKETS, ITEM_PRICE, CASE_PRICE, ITEM_NAME, CASE_NAME } = require("./constants");
const { cases } = require("./caseBattleCases");
let handleMessage = null
const ignoreCases = ['upgrade']
const ignoreId = new Set()
let cookie = 'supportOnlineTalkID=WN0PQV0hq9g80R7SML674ziP5PCSw2QH; _sessionIdentity=1ehnt0qriarat0lr3dl1ddpjp4; _csrfParam=6127e840ff2e3c2ad32c78fa6d300b835f72e60850702f0002d6f1c3c90afa38a%3A2%3A%7Bi%3A0%3Bs%3A10%3A%22_csrfParam%22%3Bi%3A1%3Bs%3A32%3A%225ZVGPOBJ5_4Vn00UgCtNAF0jD8-bYh6y%22%3B%7D; cf_clearance=kfE3OLQbjobhbn__hcMYTLEpr90UACPg.TBbUNV5_ng-1698692187-0-1-55c801b8.940f0918.2c95e58-160.0.0'

let ws = new WebSocketClient('');
let connectionWs = null

let isClosed = false

const parseItem = (data) => {

    const item = data?.asset

    if (!item || ignoreId.has(data.id)) {
        return
    }

    if (!data?.case?.title) {
        return;
    }

    if (!cases?.[data.case?.title]) {
        return;
    }

    ignoreId.add(data.id)

    handleMessage({
        market: MARKETS.CASE_BATTLE,
        [CASE_NAME]: data.case?.title,
        [ITEM_NAME]: `${item.title} ${item.name}`,
        [ITEM_PRICE]: item?.price,
        [CASE_PRICE]: cases[data.case?.title],
    })
}

const parseData = (data) => {
    if (data.t !== 'ld' || !data.v?.length) {
        return
    }

    data.v.forEach(parseItem)
}

const connect = () => {
    setTimeout(() => {
        ws.connect('wss://case-battle.io/ws', 'echo-protocol', null ,{
            'Sec-Websocket-Extensions': 'permessage-deflate; client_max_window_bits',
            'Sec-Websocket-Key': 'BdEVb4iMaratkLiWiQXh1w==',
            'Cookie': cookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        });
    }, 5000)
}

const init = (handler) => {
    if (connectionWs && connectionWs.state === 'closed') {
        connectionWs = null
    }
    handleMessage = handler

    ws.on('connectFailed', function(error, cs) {
        console.log(`${MARKETS.CASE_BATTLE} error`)
        connect()
    });

    ws.on('connect', (connection)=> {
        connectionWs = connection
        console.log(`${MARKETS.CASE_BATTLE} connected`)
        connection.on('error', function(error) {
            console.log(`${MARKETS.CASE_BATTLE} error`)
            connect()

        });
        connection.on('close', function() {
            console.log(`${MARKETS.CASE_BATTLE} close`)
            connect()

        });
        connection.on('message', function(msg) {
            if (!handleMessage || !msg?.utf8Data) {
                return
            }


            parseData(JSON.parse(msg.utf8Data))
        });

        function sendNumber() {
            if (connection.connected) {
                var number = Math.round(Math.random() * 0xFFFFFF);
                connection.sendUTF(number.toString());
                setTimeout(sendNumber, 1000);
            }
        }
        sendNumber();
    })

    connect()
}

const setCookie = (newCookie) => {
    console.log(newCookie)
    cookie = newCookie
}

const getStatus = () => {
    return connectionWs?.state
}

module.exports = {
    init,
    getStatus,
    setCookie
}
