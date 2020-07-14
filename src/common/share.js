import wx from 'weixin-js-sdk'
import WeChat from 'common/api/wechat'
import BS from 'common/bs'
import SETTING from '@/setting'

class Share {
  constructor (option) {
    this.option = {
      url: window.location.href,
      icon: `${location.origin}${process.env.BASE_URL}share.jpg`,
      ...option
    }
    Share.isWeChat && this._wx()
  }

  async _wx () {
    const config = {
      title: this.option.title,
      desc: this.option.description,
      link: this.option.url,
      imgUrl: this.option.icon
    }
    const hasReload = localStorage.getItem(SETTING.LS_WECHAT_RELOAD_KEY)
    WeChat.sign(
      window.location.href,
      await this._debug()
    ).then(data => {
      wx.config(data)
      wx.ready(() => {
        hasReload && localStorage.removeItem(SETTING.LS_WECHAT_RELOAD_KEY)
        wx.onMenuShareAppMessage(config)
        wx.onMenuShareTimeline(config)
      })
      wx.error(() => {
        if (!hasReload && Share.isIOS) {
          localStorage.setItem(SETTING.LS_WECHAT_RELOAD_KEY, '1')
          location.reload()
        } else if (hasReload) {
          localStorage.removeItem(SETTING.LS_WECHAT_RELOAD_KEY)
        }
      })
    })
  }

  async _debug () {
    const debug = await BS.getValue(SETTING.BS_ERROR_MESSAGE_KEY, SETTING.BS_WECHAT_DEBUG)
    return debug === '1'
  }
}

Share.isWeChat = /MicroMessenger/.test(navigator.userAgent)
Share.isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)

export default Share
