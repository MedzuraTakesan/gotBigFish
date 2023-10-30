const WebSocketClient = require('websocket').client;
const { MARKETS, ITEM_PRICE, CASE_PRICE, ITEM_NAME, CASE_NAME } = require("./constants");
const { cases } = require("./caseBattleCases");
let handleMessage = null
const ignoreCases = ['upgrade']
const ignoreId = new Set()
let cookie = 'asdas'

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

const init = (handler) => {
    if (connectionWs && connectionWs.state === 'closed') {
        connectionWs = null
    }
    handleMessage = handler

    ws.on('connectFailed', function(error) {
        setTimeout(() => {
            console.log(`${MARKETS.CASE_BATTLE} error`)
            isClosed = true
            init(handler)
        }, 5000);
    });

    ws.on('connect', (connection)=> {
        connectionWs = connection
        console.log(`${MARKETS.CASE_BATTLE} connected`)
        connection.on('error', function(error) {
            setTimeout(() => {
                console.log(`${MARKETS.CASE_BATTLE} error`)
                isClosed = true
                init(handler)
            }, 5000);
        });
        connection.on('close', function() {
            setTimeout(() => {
                console.log(`${MARKETS.CASE_BATTLE} close`)
                isClosed = true
                init(handler)
            }, 5000);
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

    ws.connect('wss://case-battle.io/ws', 'echo-protocol', null, {
        'Sec-Websocket-Extensions': 'permessage-deflate; client_max_window_bits',
        'Sec-Websocket-Key': 'RpvMraaSyMEOQj5F1pYHaA==',
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
    });
}

const setCookie = (newCookie) => {
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
