import Vue from 'vue'
import HlLoading from './src/loading'
import HlQuerying from './src/querying'

class Loading {
  constructor () {
    this.instance = null
  }

  open (options = {}) {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    if (this.instance) {
      this.instance.message = options.message || this.instance.message
      this.instance.top = options.top || this.instance.top
      return this.instance
    }
    this.instance = this._loadingFactory(options)
    document.body.appendChild(this.instance.$mount().$el)
    return this.instance
  }

  close () {
    if (this.instance) {
      this.instance.close()
      this.instance = null
    }
  }

  _loadingFactory (options) {
    const component = options.type === 'querying' ? HlQuerying : HlLoading
    const LoadingConstructor = Vue.extend(component)
    return new LoadingConstructor({
      data: options
    })
  }
}

export default new Loading()
