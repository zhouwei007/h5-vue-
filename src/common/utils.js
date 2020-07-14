import SETTING from '@/setting'
import Toast from '@/components/toast'

class Utils {
  static setCookie (key, value, expires = 7) {
    if (typeof document === 'undefined') {
      return
    }
    const exp = new Date()
    exp.setTime(exp.getTime() + expires * 24 * 60 * 60 * 1000)
    document.cookie = `${key}=${escape(value)};expires=${exp.toGMTString()}`
  }

  static getCookie (key, cookie) {
    if (typeof document !== 'undefined') {
      cookie = document.cookie
    }
    const arr = new RegExp('' + key + '[^;]+').exec(cookie)
    const str = arr ? arr[0] : ''
    return unescape(str ? str.toString().replace(/^[^=]+./, '') : '')
  }

  static jsonClone (obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  static deepClone (obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj
    }
    const newObj = obj.constructor === Array ? [] : {}
    for (const key in obj) {
      newObj[key] = obj[key] instanceof Date
        ? new Date(obj[key].valueOf())
        : this.deepClone(obj[key])
    }
    return newObj
  }

  static date2String (date, format = 'yyyy-MM-dd hh:mm:ss') {
    if (!(date instanceof Date)) {
      return date
    }
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '')
        .substr(4 - RegExp.$1.length))
    }
    for (const key of Object.keys(o)) {
      if (new RegExp('(' + key + ')').test(format)) {
        format = format.replace(
          RegExp.$1, RegExp.$1.length === 1
            ? o[key]
            : ('00' + o[key]).substr(('' + o[key]).length)
        )
      }
    }
    return format
  }

  static utf8ToBase64 (str) {
    return btoa(unescape(encodeURIComponent(str)))
  }

  static base64ToUtf8 (str) {
    return decodeURIComponent(escape(atob(str)))
  }

  static utf16ToUtf8 (str) {
    let out = ''
    for (let i = 0, len = str.length; i < len; i++) {
      const c = str.charCodeAt(i)
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i)
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      }
    }
    return out
  }

  static fileDownload (content, filename) {
    const link = document.createElement('a')
    link.download = filename
    link.style.display = 'none'
    var blob = new Blob([content])
    link.href = URL.createObjectURL(blob)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  static imageOnload (src) {
    return new Promise(resolve => {
      const image = new Image()
      image.setAttribute('crossOrigin', 'Anonymous')
      image.onload = () => resolve(image)
      image.onerror = () => resolve(null)
      image.src = src
    })
  }

  static url2file (url) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('GET', url, true)
      request.responseType = 'blob'
      request.onload = () => {
        let type = request.response.type
        if (type && type.includes('/')) {
          type = type.split('/')[1]
        }
        resolve(new File([request.response], `file.${type}`))
      }
      request.onerror = e => reject(e)
      request.send()
    })
  }

  static file2base64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = e => reject(e)
    })
  }

  static string2json (str) {
    return Object.prototype.toString.call(str) === '[object String]' ? JSON.parse(str) : str
  }

  static percent2float (decimal) {
    if (!decimal) {
      return 0
    }
    const str = decimal.toString()
    const index = str.indexOf('.')
    const power = 10 ** (str.length - index - 1)
    return Math.round(decimal * power) / (power * 100)
  }

  static randString (len = 8) {
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    let str = ''
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return str
  }

  static combineURL (base, url) {
    const result = url ? `${base.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}` : base
    return result.length > 1 ? result.replace(/\/+$/, '') : result
  }

  static getSubObject (obj, template) {
    return Object.keys(template).reduce((result, key) => {
      result[key] = obj[key]
      return result
    }, {})
  }

  static safeGet (obj, keys, defaultSymbol = null) {
    const path = keys.split(/[.[\]]+/).filter(item => item !== '')
    if (typeof obj === 'string') {
      obj = JSON.parse(obj)
    }
    for (const key of path) {
      if (obj !== null && obj !== undefined) {
        obj = obj[key]
      } else {
        break
      }
    }
    return defaultSymbol ? (obj || defaultSymbol) : obj
  }

  static throttle (delay, noTrailing, callback, debounceMode) {
    let timeoutID
    let lastExec = 0
    if (typeof noTrailing !== 'boolean') {
      debounceMode = callback
      callback = noTrailing
      noTrailing = undefined
    }
    function wrapper () {
      let self = this
      let elapsed = Number(new Date()) - lastExec
      let args = arguments
      function exec () {
        lastExec = Number(new Date())
        callback.apply(self, args)
      }
      function clear () {
        timeoutID = undefined
      }
      if (debounceMode && !timeoutID) {
        exec()
      }
      if (timeoutID) {
        clearTimeout(timeoutID)
      }
      if (debounceMode === undefined && elapsed > delay) {
        exec()
      } else if (noTrailing !== true) {
        timeoutID = setTimeout(
          debounceMode ? clear : exec,
          debounceMode === undefined ? delay - elapsed : delay
        )
      }
    }
    return wrapper
  }

  static debounce (delay, atBegin, callback) {
    return callback === undefined
      ? this.throttle(delay, atBegin, false)
      : this.throttle(delay, callback, atBegin !== false)
  }

  static errorLog (err, modules = 'SAAS-YJJ', silent = null) {
    if (silent !== true && (silent === false || !SETTING.ERROR_SILENT)) {
      Toast.show(err.message)
    }
    if (!SETTING.DEBUG) {
      return
    }
    const message = `[${modules}] ${err.message}`
    // eslint-disable-next-line no-console
    console.log(message)
  }

  static formatNone (str, message = '-') {
    const items = ['', null, undefined, '--']
    if (items.indexOf(str) !== -1) {
      return message
    }
    return str
  }

  static formatTail (str, bit = 4) {
    if (!str) {
      return ''
    }
    if (typeof bit !== 'number') {
      return str
    }
    return String(str).slice(-bit)
  }

  static formatEncrypt (str, start, end = null, bit = null) {
    if (!str) {
      return ''
    }
    if (typeof start !== 'number') {
      return str
    }
    str = String(str)
    if (!end) {
      return `${str.substr(0, start)}${'*'.repeat(bit || str.length - start)}`
    } else if (str.length <= start + end) {
      return str
    } else {
      return `${str.substr(0, start)}${'*'.repeat(bit || str.length - start - end)}${str.substr(str.length - end, str.length)}`
    }
  }

  static formatTime (date, format = 'yyyy-MM-dd hh:mm:ss') {
    if (!date) {
      return '-'
    }
    try {
      if (typeof date === 'string' && date.includes('T')) {
        date = date.substr(0, 19).replace(/T/g, ' ').replace(/-/g, '/')
      } else {
        const numberDate = Number(date)
        date = isNaN(numberDate) ? date : numberDate
      }
      const timeObj = new Date(date)
      return Utils.date2String(timeObj, format)
    } catch (err) {
      return '-'
    }
  }

  static formatYuan (amount) {
    amount = Number(amount)
    if (isNaN(amount)) {
      return ''
    }
    return (Math.round(parseFloat(amount)) / 100).toFixed(2)
  }

  static formatMoney (amount, fixed = 2, unit = 'cent', split = true) {
    amount = Number(amount)
    if (isNaN(amount)) {
      return ''
    }
    amount = (unit === 'cent' ? amount / 100 : amount).toFixed(fixed)
    return String(amount).replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, split ? '$1,' : '$1')
  }

  static formatUfileUrl (url, { type = 6, width = 100, height = 100 }) {
    if (!url) {
      return null
    }
    return url.includes('UCloudPublicKey')
      ? `${url}${url.includes('iopcmd') ? '|' : '&'}iopcmd=thumbnail&type=${type}&width=${width}&height=${height}`
      : url
  }

  static formatQrcodeUrl (str) {
    return `${SETTING.QRCODE_API_URL}?keycode=${str}`
  }

  static creditMoneyFormat (str, place) {
    if (!str || !place) {
      return ''
    }
    if (place === 'before') {
      return str.match(/^\D+(?=\d)/) && str.match(/^\D+(?=\d)/)[0]
    }
    if (place === 'center') {
      return str.replace(/[^\d]/g, '') || ''
    }
    if (place === 'after') {
      return str.match(/(?:\D+)$/) && str.match(/(?:\D+)$/)[0]
    }
  }
}

export default Utils
