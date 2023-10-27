const fs = require('fs');
const { getAnalyticStatistic, getAnatyticsData } = require("./helpers/analytics");
const { PROPERTIES, SUM_PROPERTIES, TRANSLATE_PROPERTIES } = require("./helpers/consts");
const myCsGoShop = require('./markets/myCsGoShop')
const topSkins = require('./markets/topSkins')
const easyDrop = require('./markets/easyDrop')
const caseBattle = require('./markets/caseBattle')
const { CASE_NAME, MARKETS } = require("./markets/constants");
const markets_data = JSON.parse(fs.readFileSync('data.json'));

const initMarketData = (data) => {
    const sumProperties = SUM_PROPERTIES.reduce((obj, property) => {
        obj[property] = 0

        return obj
    }, {})
    markets_data[data.market] = {
        [PROPERTIES.NUMBER_OF_OPEN_CASES]: 0,
        [PROPERTIES.CASES]: {},
        ...sumProperties
    }
}

const getNewSumData = (oldData = {}, newData) => {
    const updatedData = {}

    SUM_PROPERTIES.forEach((property) => {
        updatedData[property] = (oldData[property] || 0) + newData[TRANSLATE_PROPERTIES[property]]
    })

    return updatedData
}

const addMarketData = (data) => {
    const oldData = markets_data[data.market]

    markets_data[data.market][PROPERTIES.NUMBER_OF_OPEN_CASES] = ++oldData[PROPERTIES.NUMBER_OF_OPEN_CASES]

    // заполняем информацию о кейсах
    const cases = markets_data[data.market][PROPERTIES.CASES]

    cases[data[CASE_NAME]] = {
        ...getNewSumData(cases[data[CASE_NAME]], data),
        ...getAnatyticsData(cases[data[CASE_NAME]], data),
        [PROPERTIES.NUMBER_OF_OPEN_CASES]: (cases[data[CASE_NAME]]?.[PROPERTIES.NUMBER_OF_OPEN_CASES] || 0) + 1
    }

    // заполняем общую информацию о маркете
    markets_data[data.market] = {
        [PROPERTIES.NUMBER_OF_OPEN_CASES]: ++oldData[PROPERTIES.NUMBER_OF_OPEN_CASES],
        ...getNewSumData(markets_data[data.market], data),
        ...getAnatyticsData(markets_data[data.market], data),
        [PROPERTIES.CASES]: cases
    }




    SUM_PROPERTIES.forEach((property) => {
        markets_data[data.market][property] = oldData[property] + data[TRANSLATE_PROPERTIES[property]]
    })
}

const saveData = (data) => {
    if (!markets_data[data.market]) {
        initMarketData(data)
    }

    addMarketData(data)
}

const handler = (msg) => {
    saveData(msg)
}

const getSumStatistic = (data, spaces = 1) => {
    let string = ''

    string = string + '&nbsp'.repeat(spaces) + `Кейсов открыто: ${data[PROPERTIES.NUMBER_OF_OPEN_CASES]}<br>`
    string = string + '&nbsp'.repeat(spaces) + `Маркет дал предметов на: ${data[PROPERTIES.AMOUNT_OF_MONEY_PAID_FROM_CASES]}<br>`
    string = string + '&nbsp'.repeat(spaces) + `Игроки потратили на кейсы: ${data[PROPERTIES.AMOUNT_OF_MONEY_SPENT_CASES]}<br>`

    return string
}

const getDefaultStatistic = (data) => {
    return  'Общая информация<br>' + getSumStatistic(data)
}

const sortByProperty = (object, property) => {
    let array = []
    Object.keys(object).forEach((key) => {
        array.push({
            key,
            data: object[key]
        })
    })

    array = array.sort((a, b) => b.data[property] - a.data[property])

    return array
}

const getCasesStatistic = (cases) => {
    let string = 'Информация по кейсам<br>'
    const sortedArray = sortByProperty(cases, PROPERTIES.NUMBER_OF_OPEN_CASES)

    sortedArray.forEach((openedCase) => {
        string = string + '-------<br>'
        string = string + '&nbsp&nbsp&nbsp&nbsp' +`Кейс: ${openedCase.key}<br>`
        string = string + getSumStatistic(cases[openedCase.key], 4)
        string = string + getAnalyticStatistic(cases[openedCase.key], 4)
    })

    return string
}

const getTextStatistic = () => {
    let text = ''
    Object.keys(markets_data).forEach((market) => {
        text = text +'__________________<br>' +
            `Маркет: ${market}<br>`+
            getDefaultStatistic(markets_data[market]) +
            getAnalyticStatistic(markets_data[market]) +
            getCasesStatistic(markets_data[market][PROPERTIES.CASES]) +
            '______________'
    })

    return text
}

const statisticLogger = () => {
    fs.writeFileSync('data.json', JSON.stringify(markets_data, null, ' '));
}

myCsGoShop.init(handler)
topSkins.init(handler)
easyDrop.init(handler)
caseBattle.init(handler)

setInterval(() => {
    statisticLogger()
}, 10000)

const ignoreFields = [PROPERTIES.AMOUNT_OF_MONEY_SPENT_TO_TRY_CASES, PROPERTIES.AMOUNT_OF_TRY_SPENT_CASES]


const _getMarketData = (req, isIgnoreFieldsEnabled = false) => {
    const market = req?.query?.market || Object.keys(markets_data)[0];
    const marketData = {
        ...markets_data[market]
    }
    if (isIgnoreFieldsEnabled) {
        ignoreFields.forEach((field) => {
            delete marketData[field]
        })
    }
    return {
        ...marketData,
        [PROPERTIES.CASES]: sortByProperty(marketData[PROPERTIES.CASES], PROPERTIES.NUMBER_OF_OPEN_CASES)
    };
}

const _getCaseData = (req) => {
    const market = _getMarketData(req)
    const caseName = req?.query?.case || Object.keys(market)[0]
    return market[PROPERTIES.CASES].find((item) => item.key === caseName)
}


function getDataKeys(req, res) {
    res.send(getTextStatistic())
}

function getMarketsData(req, res) {
    res.send(Object.keys(markets_data))
}

function getMarketData(req, res) {
    res.send(_getMarketData(req, true))
}

function getCaseData(req, res) {
    res.send(_getCaseData(req))
}

function getStatuses(req, res) {
    res.send({
        [MARKETS.MY_CSGO_SHOP]: myCsGoShop.getStatus(),
        [MARKETS.EASY_DROP]: easyDrop.getStatus(),
        [MARKETS.CASE_BATTLE]: caseBattle.getStatus(),
        [MARKETS.TOP_SKINS]: topSkins.getStatus(),
    })
}

function setToken(req, res) {
    const token = req?.query?.token || '';

    caseBattle.setCookie(token)
}


const express = require('express');
const app = express();

app.get('/data-markets', getDataKeys);
app.get('/markets', getMarketsData);
app.get('/market', getMarketData);
app.get('/case', getCaseData);
app.get('/status', getStatuses);
app.get('/set-token', setToken);



app.listen(3006, () => {
    console.log('Server started on port 3000');
});
