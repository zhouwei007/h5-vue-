import BaseRequest from 'common/request'

class WeChatApi extends BaseRequest {
  constructor () {
    super()
    this.url = 'https://yun.huli.com'
  }

  sign (url, debug = false) {
    return super.get(`${this.url}/bind/wx/callBack/share/config`, {
      url: encodeURIComponent(url.split('#')[0]),
      debug
    })
  }
}

export {
  WeChatApi
}

export default new WeChatApi()
