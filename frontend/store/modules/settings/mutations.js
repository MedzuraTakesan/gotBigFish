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
  updateFavoriteCase (state, payload) {
    const newCases = state.favoriteCasesData.filter((item) => item.favoriteName !== payload.favoriteName)
    state.favoriteCasesData = [...newCases, payload]
  },
  setMarket (state, data) {
    state.market = data
  },
  loadFavoritesCases (state) {
    state.favoriteCases = localStorage.getItem('favorite-cases')?.split(',') || []
  },
  addFavoriteCase (state, newFavoriteCase) {
    state.favoriteCases = [...state.favoriteCases, newFavoriteCase]
    this.commit('settings/updateFavoriteCases', state.favoriteCases)
  },
  removeFavoriteCase (state, removedCase) {
    state.favoriteCases = state.favoriteCases.filter((caseName) => removedCase !== caseName)
    this.commit('settings/updateFavoriteCases', state.favoriteCases)
  },
  updateFavoriteCases (state, payload) {
    localStorage.setItem('favorite-cases', payload)
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
