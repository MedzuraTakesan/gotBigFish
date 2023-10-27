const { TRANSLATE_PROPERTIES, PROPERTIES, ANALYTICS_DATA, ANALYTICS_ARRAY_DATA } = require('./consts')

const getPaidData = (data) => {
    const paidMarket = data[TRANSLATE_PROPERTIES[PROPERTIES.AMOUNT_OF_MONEY_PAID_FROM_CASES]]
    const paidUser= data[TRANSLATE_PROPERTIES[PROPERTIES.AMOUNT_OF_MONEY_SPENT_CASES]]

    return {
        paidMarket,
        paidUser
    }
}

const getAnalyticData = (data, property) => {
    const { paidMarket, paidUser } = getPaidData(data)

    if (property === PROPERTIES.GOOD_CASES) {
        return paidMarket > paidUser ? 1 : 0
    }

    if (property === PROPERTIES.BAD_CASES) {
        return paidMarket < paidUser ? 1 : 0
    }

    if (paidUser && property === PROPERTIES.X_10) {
        return paidMarket > (paidUser * 10) ? 1 : 0
    }

    if (paidUser && property === PROPERTIES.X_5 && paidMarket < (paidUser * 10)) {
        return paidMarket > (paidUser * 5) ? 1 : 0
    }

    if (paidUser && property === PROPERTIES.X_2 && paidMarket < (paidUser * 5)) {
        return paidMarket > (paidUser * 2) ? 1 : 0
    }

    return 0
}

const getDataForTry = (data, paidMarket, paidUser) => {
    const isGood = paidMarket > paidUser
    if (isGood) {
        return [...data, 0]
    }

    const clonedData = [...data]
    const lastAmountOfTry = clonedData[clonedData.length - 1]
    clonedData[data.length - 1] = lastAmountOfTry + 1

    return  clonedData
}

const getDataMoneyForTry = (data, paidMarket, paidUser) => {
    const isGood = paidMarket > paidUser
    if (isGood) {
        return [...data, 0]
    }

    const clonedData = [...data]
    const lastAmountOfTry = clonedData[clonedData.length - 1]
    clonedData[data.length - 1] = parseInt(lastAmountOfTry + (paidUser - paidMarket))

    return  clonedData
}

const getAnalyticDataWithArray = (oldData = [0], newData, property) => {
    const { paidMarket, paidUser } = getPaidData(newData)

    if (property === PROPERTIES.AMOUNT_OF_TRY_SPENT_CASES) {
        return getDataForTry(oldData, paidMarket, paidUser)
    }

    if (property === PROPERTIES.AMOUNT_OF_MONEY_SPENT_TO_TRY_CASES) {
        return getDataMoneyForTry(oldData, paidMarket, paidUser)
    }

    return []
}

const getAnatyticsData = (oldData = {}, newData) => {
    const updatedData = {}

    ANALYTICS_DATA.forEach((property) => {
        updatedData[property] = (oldData[property] || 0) + getAnalyticData(newData, property)
    })

    ANALYTICS_ARRAY_DATA.forEach((property) => {
        updatedData[property] = getAnalyticDataWithArray(oldData[property], newData, property)
    })

    return updatedData
}

const getAnalyticStatistic = (data, spaces = 1) => {
    let string = ''

    string = string + '&nbsp'.repeat(spaces) + `Прибыльных кейсов: ${data[PROPERTIES.GOOD_CASES]}<br>`
    string = string + '&nbsp'.repeat(spaces) + `Убыточных кейсов: ${data[PROPERTIES.BAD_CASES]}<br>`
    string = string + '&nbsp'.repeat(spaces) + `Количество плохих кейсов до дроп: ${data[PROPERTIES.AMOUNT_OF_TRY_SPENT_CASES]}<br>`
    string = string + '&nbsp'.repeat(spaces) + `Минус пользователей до дроп: ${data[PROPERTIES.AMOUNT_OF_MONEY_SPENT_TO_TRY_CASES]}<br>`
    string = string + '&nbsp'.repeat(spaces) + `Кейсы давший х2: ${data[PROPERTIES.X_2]}<br>`
    string = string + '&nbsp'.repeat(spaces) + `Кейсы давший х5: ${data[PROPERTIES.X_5]}<br>`
    string = string + '&nbsp'.repeat(spaces) + `Кейсы давший х10: ${data[PROPERTIES.X_10]}<br>`

    return string
}

module.exports = {
    getAnalyticData,
    getAnatyticsData,
    getAnalyticStatistic
}
