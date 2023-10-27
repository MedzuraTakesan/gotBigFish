export default {
  setMarkets (state, data) {
    state.markets = data
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
  }
}
