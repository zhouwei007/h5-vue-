import BaseRequest from 'common/request'

class IdentityApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/jinjian'
  }

  user (auth = true) {
    return super.post(`${this.url}/personalCenter/detail`, null, {
      auth,
      loading: false
    })
  }

  bs (key, code = null, type = true) {
    return super.get(`${this.url}/bs/value`, {
      parentKey: key,
      codeKey: code,
      type
    }, {
      loading: false
    })
  }

  isFans () {
    return super.post(`${this.url}/personalCenter/fans`, null, {
      loading: false
    })
  }

  getMessageList ({ pageNo = 0, pageSize = 10, status = 0 }) {
    return super.post(`${this.url}/message/list`, {
      pageNo,
      pageSize,
      status
    }, {
      loading: false
    })
  }

  getMessageStatus () {
    return super.post(`${this.url}/message/hasunread`, null, {
      loading: false
    })
  }

  updateMessage (ids, status = 1) {
    if (Array.isArray(ids)) {
      ids = ids.join(',')
    }
    return super.post(`${this.url}/message/status/update`, {
      ids,
      status
    }, {
      loading: false
    })
  }

  getBrokerList ({ pageNo = 0, pageSize = 10 }) {
    return super.post(`${this.url}/myBroker/query`, {
      pageNo,
      pageSize
    }, {
      loading: false
    })
  }

  getBrokerDetail (brokerAccountId, { pageNo = 0, pageSize = 10 }) {
    return super.post(`${this.url}/myBroker/detail`, {
      brokerAccountId,
      pageNo,
      pageSize
    }, {
      loading: false
    })
  }

  feedback ({ description, images = [] }) {
    if (!Array.isArray(images)) {
      images = [images]
    }
    const formData = new FormData()
    formData.append('opinionText', description)
    images.forEach((file, index) => {
      formData.append(`pics[${index}]`, file)
    })
    return super.post(`${this.url}/opinion`, formData)
  }
}

export {
  IdentityApi
}

export default new IdentityApi()
