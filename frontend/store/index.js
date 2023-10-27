import Vue from 'vue'
import Vuex from 'vuex'
import settings from './modules/settings'

Vue.use(Vuex);
const modules = {
  settings
};

const store = () => new Vuex.Store({
  modules,
});

export default store
