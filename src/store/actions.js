import TYPES from './types'
import Identity from 'common/api/identity'

export default {
  [TYPES.SET_IDENTITY] ({ commit }) {
    return new Promise((resolve, reject) => {
      Identity.user().then(data => {
        commit(TYPES.SET_IDENTITY, data)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
