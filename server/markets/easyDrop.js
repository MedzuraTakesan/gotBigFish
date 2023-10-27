const WebSocket = require('ws')
const { MARKETS, ITEM_PRICE, CASE_PRICE, ITEM_NAME, CASE_NAME } = require("./constants");
let handleMessage = null
const ignoreCases = ['upgrade']
const ignoreUsers = [1212944, 1506034, 1213865, 8]
const rolls = new Set()

let webSocket = null

const getId = (data) => {
    return JSON.stringify(data?.fields)
}

const parseData = (data) => {
    if (data.msg !== 'added' || data.collection !== 'live_drops' || !data.fields) {
        return
    }

    const item = data.fields?.item

    if (!item) {
        return
    }

    if (ignoreUsers.includes(data?.fields?.user?.id)) {
        return;
    }

    if (ignoreCases.includes(data.fields?.caseID)) {
        return;
    }

    if (rolls.has(getId(data))) {
        return;
    }

    rolls.add(getId(data))

    handleMessage({
        market: MARKETS.EASY_DROP,
        [CASE_NAME]: data.fields?.caseID,
        [ITEM_NAME]: item.itemID,
        [ITEM_PRICE]: item?.itemPrice,
        [CASE_PRICE]: item?.price,
    })
}

const init = (handler) => {
    let ws = new WebSocket('wss://easydrop.win/websocket');

    webSocket = ws
    handleMessage = handler

    ws.onopen = function(){
        console.log(`${MARKETS.EASY_DROP} connected`)
        //Subscribe to the channel
        ws.send(JSON.stringify({"msg":"connect","version":"1","support":["1","pre2","pre1"]}))
        ws.send(JSON.stringify({"msg":"sub","id":"m8yQSLGoof6pTewYL","name":"live_drops","params":[]}))
    }

    ws.onmessage = function(msg) {
        if (!handleMessage || !msg?.data) {
            return
        }

        parseData(JSON.parse(msg.data))
    }

    ws.on('error', function() {
        console.log(`${MARKETS.EASY_DROP} error`)
    });

    ws.on('close', function() {
        setTimeout(() => {
            console.log(`${MARKETS.EASY_DROP} close`)
            init(handler)
        }, 5000);
    });
}

const getStatus = () => {
    return webSocket.readyState
}


module.exports = {
    init,
    getStatus
}
