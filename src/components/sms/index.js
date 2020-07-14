import Sms from './src/sms'

Sms.install = Vue => {
  Vue.component(Sms.name, Sms)
}

export default Sms
