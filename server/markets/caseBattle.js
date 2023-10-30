const WebSocketClient = require('websocket').client;
const { MARKETS, ITEM_PRICE, CASE_PRICE, ITEM_NAME, CASE_NAME } = require("./constants");
const { cases } = require("./caseBattleCases");
let handleMessage = null
const ignoreCases = ['upgrade']
const ignoreId = new Set()
let cookie = 'supportOnlineTalkID=x7twcgGB57rgkFtPhgZ5KoTdvQHcM4o8; _userIdentity=8f023524fc0bea306608bb981c482863a58717035dccc2d5dd271e9822c69433a%3A2%3A%7Bi%3A0%3Bs%3A13%3A%22_userIdentity%22%3Bi%3A1%3Bs%3A52%3A%22%5B1627897%2C%22voI1Y8L-ZoDJ3zgUu9gx37fPdQ1QhfI3%22%2C2592000%5D%22%3B%7D; _csrfParam=0c010cf7885ff6af237d7ca4eb1abe25d9dd768acfe3ab3ae181b053cfa79237a%3A2%3A%7Bi%3A0%3Bs%3A10%3A%22_csrfParam%22%3Bi%3A1%3Bs%3A32%3A%22UefyWgC4e_WQ72pixO6IWUAHDGGUweFQ%22%3B%7D; hideRogueAlert=true; cf_clearance=_bLwhjO3q4g2zPGt40FGNDGAjhm6EHI4DIKUrv11sqE-1698650858-0-1-55c801b8.ba3bb3b.2c95e58-250.0.0; _sessionIdentity=ktbfgpqgf12ol5r2rg44ttmgii'

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
        ws.connect('wss://case-battle.io/ws', 'echo-protocol', null );
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

    ws.config.tlsOptions.headers = {
        'Sec-Websocket-Extensions': 'permessage-deflate; client_max_window_bits',
        'Sec-Websocket-Key': 'RpvMraaSyMEOQj5F1pYHaA==',
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
    }

    connect()
}

const setCookie = (newCookie) => {
    ws.config.tlsOptions.headers['Cookie'] = newCookie
}

const getStatus = () => {
    return connectionWs?.state
}

module.exports = {
    init,
    getStatus,
    setCookie
}
