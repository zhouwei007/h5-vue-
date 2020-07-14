import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  identity: null,
  welcome: false,
  title: '',
  background: '',
  headerBack: {},
  headerButton: null,
  customerInfo: null,
  customerRecord: null,
  isUploadCustomerImageErrorRecent: false,
  isAddCustomerRecordRecent: false,
  message: null,
  estimateRecord: null
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
