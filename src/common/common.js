import store from '@/store'
import STORE_TYPES from '@/store/types'
import Utils from '@/common/utils'
import sensors from '@/common/sensors'

class Common {
  static async auth () {
    try {
      if (store.getters.hasIdentity) {
        return store.state.identity
      }
      const identity = await Common.getIdentity()
      sensors.login(store.getters.accountId)
      return identity
    } catch (err) {
      Utils.errorLog(err, 'PERSONAL-CENTER')
      return false
    }
  }

  static clearIdentity () {
    store.commit(STORE_TYPES.SET_IDENTITY)
    sensors.logout()
  }

  static getIdentity () {
    return store.dispatch(STORE_TYPES.SET_IDENTITY)
  }
}

export default Common
