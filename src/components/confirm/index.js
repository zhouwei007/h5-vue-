import Vue from 'vue'
import HlConfirm from './src/confirm'

class Confirm {
  show (options = {}) {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    const instance = this._confirmFactory(options)
    document.body.appendChild(instance.$mount().$el)
    return instance
  }

  _confirmFactory (options) {
    const ConfirmConstructor = Vue.extend(HlConfirm)
    return new ConfirmConstructor({
      data: options
    })
  }
}

export default new Confirm()
