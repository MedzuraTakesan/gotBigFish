import axios from "axios";

export default {
  async fetchMarkets({commit}) {
    const response = await axios.get('/api/markets')
    commit('setMarkets', response.data)
  },
  async fetchStatus({commit}) {
    const response = await axios.get('/api/status')
    commit('setStatus', response.data)
  },
  async fetchMarket({commit}, market) {
    const response = await axios.get('/api/market', {
      params: {
        market
      }
    })
    commit('setMarket', response.data)
  },
  async fetchToken({commit}, token) {
    await axios.get('/api/set-token', {
      params: {
        token
      }
    })
  },
  async fetchCase({commit}, { market, caseName}) {
    const response = await axios.get('/api/case', {
      params: {
        market,
        case: caseName
      }
    })
    commit('setCase', response.data)
  }
}
