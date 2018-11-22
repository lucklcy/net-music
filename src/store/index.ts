import Vue from 'vue'
import Vuex from 'vuex'
import { State, default as state } from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store<State>({
  state,
  mutations,
  actions,
  getters
})
