import BaseRequest from 'common/request'
import BS from 'common/bs'
import SETTING from '@/setting'
const NodeRSA = require('node-rsa')

class PassportApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/passport'
  }

  async formatPassword (password) {
    const pubsignData = await BS.getValue(SETTING.BS_PASSWORD_PUBLIC, 'publickey')
    const keyData = `-----BEGIN PUBLIC KEY-----\n ${pubsignData} \n-----END PUBLIC KEY-----`
    const key = new NodeRSA()
    key.setOptions({ encryptionScheme: 'pkcs1' })
    key.importKey(keyData, 'pkcs8-public')
    return encodeURI(key.encrypt(password, 'base64')).replace(/\+/g, '%2B')
  }

  async login (mobile, password) {
    return super.post(`${this.url}/login`, {
      mobile,
      password: await this.formatPassword(password)
    })
  }

  logout () {
    return super.post(`${this.url}/logout`)
  }

  authentication (realname, id5, mobile) {
    return super.post(`${this.url}/authentication/id5Bind`, {
      realname,
      id5,
      mobile
    })
  }

  getAuthenticate () {
    return super.post(`${this.url}/authentication/info`, null, {
      loading: false
    })
  }

  sendKaptcha (t) {
    return super.get(`${this.url}/connect/passimage.jpg`, {
      t
    }, {
      transformResponse: [response => response],
      responseType: 'blob'
    }, {
      loading: false
    })
  }

  validateRegistMobile (mobile, inviteCode) {
    return super.post(`${this.url}/regist/checkMobile`, {
      mobile,
      inviteCode
    }, {
      loading: false
    })
  }

  sendRegistSms (mobile, inviteCode) {
    return super.post(`${this.url}/regist/sendSms`, {
      mobile,
      inviteCode
    }, {
      loading: false
    })
  }

  validateRegistSms (mobile, smscode) {
    return super.post(`${this.url}/regist/checkSms`, {
      mobile,
      smscode
    }, {
      loading: false
    })
  }

  async regist (mobile, password, inviteCode, smscode) {
    return super.post(`${this.url}/regist/submit`, {
      mobile,
      password: await this.formatPassword(password),
      inviteCode,
      smscode
    })
  }

  async changePassword (oldPassword, newPassword) {
    return super.post(`${this.url}/userAccount/changePassword`, {
      oldPassword: await this.formatPassword(oldPassword),
      newPassword: await this.formatPassword(newPassword)
    })
  }

  getFindPasswordProcess (t = 0) {
    return super.post(`${this.url}/findPassword/process`, {
      t
    }, {
      loading: false
    })
  }

  validateFindPasswordMobile (mobile, t) {
    return super.post(`${this.url}/findPassword/mobile`, {
      mobile,
      t
    }, {
      loading: false
    })
  }

  validateFindPasswordKaptcha (mobile, kaptcha, t) {
    return super.post(`${this.url}/findPassword/checkCaptcha`, {
      mobile,
      kaptcha,
      t
    }, {
      loading: false
    })
  }

  sendFindPasswordSms (mobile, t) {
    return super.post(`${this.url}/findPassword/sendSms`, {
      mobile,
      t
    }, {
      loading: false
    })
  }

  validateFindPasswordSms (mobile, t, smscode) {
    return super.post(`${this.url}/findPassword/checkSms`, {
      mobile,
      t,
      smscode
    }, {
      loading: false
    })
  }

  validateAuthenticate (realName, mobile, id5, t) {
    return super.post(`${this.url}/findPassword/checkId5`, {
      realName,
      mobile,
      id5,
      t
    }, {
      loading: false
    })
  }

  async resetPassword (mobile, password, t) {
    return super.post(`${this.url}/findPassword/resetPassword`, {
      mobile,
      password: await this.formatPassword(password),
      t
    }, {
      loading: false
    })
  }

  getChangeMobileProcess (t = 0) {
    return super.post(`${this.url}/changeMobile/process`, {
      t
    }, {
      loading: false
    })
  }

  validateChangeMobileKaptcha (t, kaptcha) {
    return super.post(`${this.url}/changeMobile/checkCaptcha`, {
      kaptcha,
      t
    }, {
      loading: false
    })
  }

  sendChangeMobileOldSms (t, realname = null, id5 = null) {
    return super.post(`${this.url}/changeMobile/sendOldSms`, {
      realname,
      id5,
      t
    }, {
      loading: false
    })
  }

  validateChangeMobileOldSms (t, smscode) {
    return super.post(`${this.url}/changeMobile/checkOldMobile`, {
      t,
      smscode
    }, {
      loading: false
    })
  }

  sendChangeMobileNewSms (t, mobile) {
    return super.post(`${this.url}/changeMobile/sendNewSms`, {
      mobile,
      t
    }, {
      loading: false
    })
  }

  resetMobile (t, smscode) {
    return super.post(`${this.url}/changeMobile/resetMobile`, {
      t,
      smscode
    }, {
      loading: false
    })
  }

  inviteCode () {
    return super.post(`${this.url}/invite/code`, null, {
      loading: false
    })
  }
}

export {
  PassportApi
}

export default new PassportApi()
