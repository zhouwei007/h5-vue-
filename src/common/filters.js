import Vue from 'vue'
import Utils from '@/common/utils'

Vue.filter('getattr', (value, path) => Utils.safeGet(value, path, '-'))
Vue.filter('none', (value, message = '-') => Utils.formatNone(value, message))
Vue.filter('date', (value, format = 'yyyy-MM-dd') => Utils.formatTime(value, format))
Vue.filter('datetime', value => Utils.formatTime(value, 'yyyy-MM-dd hh:mm:ss'))
Vue.filter('encrypt', (value, start = 1, end = null, bit = null) => Utils.formatEncrypt(value, start, end, bit))
Vue.filter('tail', (value, bit = 4) => Utils.formatTail(value, bit))
Vue.filter('yuan', value => Utils.formatYuan(value))
Vue.filter('money', (value, fixed = 2, unit = 'cent') => Utils.formatMoney(value, fixed, unit))
Vue.filter('creditUnit', value => Utils.creditMoneyFormat(value, 'after'))
Vue.filter('creditMoney', value => Utils.creditMoneyFormat(value, 'center'))
Vue.filter('creditMoneyBefore', value => Utils.creditMoneyFormat(value, 'before'))
