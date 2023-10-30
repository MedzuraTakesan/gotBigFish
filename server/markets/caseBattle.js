const WebSocketClient = require('websocket').client;
const { MARKETS, ITEM_PRICE, CASE_PRICE, ITEM_NAME, CASE_NAME } = require("./constants");
const { cases } = require("./caseBattleCases");
let handleMessage = null
const ignoreCases = ['upgrade']
const ignoreId = new Set()
let cookie = 'cf_clearance=u6.suxtwoaazYYQZuir5GjJgVYAVn7jDKR5P4lxDy4o-1698699248-0-1-55c801b8.edf3c715.2c95e58-160.0.0; supportOnlineTalkID=hxh1W2zfJ1f7wk9qvCSH3VnlKQJTOUAH; _sessionIdentity=m5l1atdg6sg746of6ot7ippsk4; _csrfParam=efb17cd764468cfd0e755f66be09b0e4b0356f6f9d7cc12a96161d905e4f7756a%3A2%3A%7Bi%3A0%3Bs%3A10%3A%22_csrfParam%22%3Bi%3A1%3Bs%3A32%3A%22ma1dDwrzxcZEXZCSp5FcvF5OUsQh2O_q%22%3B%7D'

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
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru',
            'Connection': 'Upgrade',
            'Host': 'case-battle.io',
            'Origin': 'https://case-battle.io',
            'Pragma': 'no-cache',
            'Sec-Websocket-Extensions': 'permessage-deflate; client_max_window_bits',
            'Sec-Websocket-Key': 'iBdcSJDFGrwB8Kcdmqpyxg==',
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
        console.log(error)
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
