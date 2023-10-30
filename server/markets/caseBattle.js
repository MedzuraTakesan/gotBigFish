const WebSocketClient = require('websocket').client;
const { MARKETS, ITEM_PRICE, CASE_PRICE, ITEM_NAME, CASE_NAME } = require("./constants");
const { cases } = require("./caseBattleCases");
let handleMessage = null
const ignoreCases = ['upgrade']
const ignoreId = new Set()
let cookie = 'cf_clearance=BngWVhjWYJjv1zuW.FtZxqnTKZAKT7BDj7A.0dmdlKM-1698653555-0-1-55c801b8.8c437b25.2c95e58-160.0.0; supportOnlineTalkID=nTFMrrXuXRGnV7iwopaG6yzcb6zCaHfp; _sessionIdentity=3i12r2hh39qagbph14kr92jmna; _csrfParam=c8c519fdac4226a367043351dda2efe4e3ff7f4bc1d5aed8380e02915d9af000a%3A2%3A%7Bi%3A0%3Bs%3A10%3A%22_csrfParam%22%3Bi%3A1%3Bs%3A32%3A%22OjGs-cOuSQRGlffJSwDb4-Ybd8XSA2cX%22%3B%7D'

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
