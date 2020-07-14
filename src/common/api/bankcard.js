import BaseRequest from 'common/request'

class BankcardApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/passport/bankCard'
  }

  get (id) {
    return super.post(`${this.url}/detail`, {
      id
    }, {
      loading: false
    })
  }

  list () {
    return super.post(`${this.url}/list`, null, {
      loading: false
    })
  }

  bind ({ name, id5, bankName, bankCode, bankCardNumber, branchBankName, mobile }) {
    return super.post(`${this.url}/save`, {
      name,
      id5,
      bankName,
      bankCode,
      branchBankName,
      bankCardNumber,
      mobile
    })
  }

  update (id, { name, id5, bankName, bankCode, bankCardNumber, branchBankName, mobile }) {
    return super.post(`${this.url}/save`, {
      id,
      name,
      id5,
      bankName,
      bankCode,
      bankCardNumber,
      branchBankName,
      mobile
    })
  }

  unbind (id) {
    return super.post(`${this.url}/unbind`, {
      id
    })
  }
}

export {
  BankcardApi
}

export default new BankcardApi()
