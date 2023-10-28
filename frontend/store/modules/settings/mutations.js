export default {
  setMarkets (state, data) {
    state.markets = data
  },
  setMarketsCase (state, payload) {
    const caseChanged = state.market.cases.find((item) => item.key === payload.key)

    if (!caseChanged){
      return
    }

    caseChanged.data = payload.data
  },
  setStatus (state, data) {
    state.status = data
  },
  setMarket (state, data) {
    state.market = data
  },
  setCase (state, data) {
    state.case = {
      ...data.data
    }
  },
  updateCase (state, payload) {
    state.case = payload.data
  }
}
