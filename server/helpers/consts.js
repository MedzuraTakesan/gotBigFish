const { CASE_PRICE, ITEM_PRICE } = require("../markets/constants");


const PROPERTIES = {
    // Количество открытий кейсов
    NUMBER_OF_OPEN_CASES: 'numberOfOpenCases',
    // Количество денег необходимых для кейса
    AMOUNT_OF_MONEY_SPENT_CASES: 'amountOfMoneySpentOnCases',
    // Количество денег который маркет выплатил
    AMOUNT_OF_MONEY_PAID_FROM_CASES: 'amountOfMoneyPaidFromCases',
    // Количество открытий до прибыльного кейса
    AMOUNT_OF_TRY_SPENT_CASES: 'amountOfTrySpentOnCases',
    // Количество денег на которое ушли в минус пользователи при попытки выбить прибыльный кейс
    AMOUNT_OF_MONEY_SPENT_TO_TRY_CASES: 'amountOfMoneySpentToTryCases',
    // Среднее число попыток
    AVERAGE_OF_TRY: 'avarageOfTry',
    // Среднее число потраченных денег на удачную попытку
    AVERAGE_OF_MONEY: 'avarageOfMoney',
    // Процент успешного открытия
    PERCENT_TO_SUCCESS_OPEN: 'percentToSuccessOpen',
    // Количество кейсов которые принесли прибыль
    GOOD_CASES: 'goodCases',
    // Количество кейсов которые принесли убыток
    BAD_CASES: 'badCases',
    // Количество кейсов которые принесли X10 прибыль
    X_10: 'X_10',
    // Количество кейсов которые принесли X5 прибыль
    X_5: 'X_5',
    // Количество кейсов которые принесли X2 прибыль
    X_2: 'X_2',
    // Кейсы
    CASES: 'cases',
}

const SUM_PROPERTIES = [
    PROPERTIES.AMOUNT_OF_MONEY_SPENT_CASES,
    PROPERTIES.AMOUNT_OF_MONEY_PAID_FROM_CASES
]

const ANALYTICS_DATA = [
    PROPERTIES.X_10,
    PROPERTIES.X_5,
    PROPERTIES.X_2,
    PROPERTIES.GOOD_CASES,
    PROPERTIES.BAD_CASES
]

const ANALYTICS_ARRAY_DATA = [
    PROPERTIES.AMOUNT_OF_TRY_SPENT_CASES,
    PROPERTIES.AMOUNT_OF_MONEY_SPENT_TO_TRY_CASES,
    PROPERTIES.AVERAGE_OF_TRY,
    PROPERTIES.AVERAGE_OF_MONEY
]

const ANALYTICS_AFTER_ARRAY_DATA = [
    PROPERTIES.PERCENT_TO_SUCCESS_OPEN
]

const TRANSLATE_PROPERTIES = {
    [PROPERTIES.AMOUNT_OF_MONEY_SPENT_CASES]: CASE_PRICE,
    [PROPERTIES.AMOUNT_OF_MONEY_PAID_FROM_CASES]: ITEM_PRICE,
}

module.exports = {
    ANALYTICS_DATA,
    ANALYTICS_ARRAY_DATA,
    ANALYTICS_AFTER_ARRAY_DATA,
    TRANSLATE_PROPERTIES,
    PROPERTIES,
    SUM_PROPERTIES
}
