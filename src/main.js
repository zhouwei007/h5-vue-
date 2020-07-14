import 'lib-flexible'
import '@babel/polyfill'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import VueTouch from 'vue-touch'
import index from './index'
import router from './router'
import store from './store'
import Bus from 'common/bus'
import SETTING from '@/setting'
import 'common/filters'
import 'fonts/hl-pic'
import 'fonts/hl-icon.css'
import 'common/sensors'
// import './registerServiceWorker'

SETTING.DEBUG && import('vconsole').then(data => {
  const VConsole = data.default
  new VConsole().hide()
})

Vue.use(VueTouch, { name: 'hl-touch' })

Vue.use(VueClipboard)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  data: {
    Bus
  },
  render: h => h(index)
}).$mount('#hl-index')
