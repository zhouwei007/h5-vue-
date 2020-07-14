import BaseRequest from 'common/request'

class RecordApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/jinjian/customerRecord'
  }

  count (customerId) {
    return super.post(`${this.url}/count`, {
      customerId
    }, {
      loading: false
    })
  }

  list ({ customerId, pageNo = 0, pageSize = 10 }, recent = false) {
    return super.post(`${this.url}/${recent ? 'mlist' : 'list'}`, {
      customerId,
      pageNo,
      pageSize
    }, {
      loading: false
    })
  }

  create ({ customerId, description = '', images = [] }, config = {}) {
    if (!Array.isArray(images)) {
      images = [images]
    }
    const formData = new FormData()
    formData.append('customerId', customerId)
    formData.append('recordDesc', description)
    images.forEach((file, index) => {
      formData.append(`recordFile[${index}]`, file)
    })
    return super.post(`${this.url}/addRecord`, formData, config)
  }

  update ({ recordId, customerId, description, imageIndexs = [], images = [] }) {
    if (!Array.isArray(images)) {
      images = [images]
    }
    const formData = new FormData()
    formData.append('recordId', recordId)
    formData.append('customerId', customerId)
    formData.append('recordDesc', description)
    formData.append('recordFileIndexs', imageIndexs.join(','))
    images.forEach((file, index) => {
      formData.append(`recordFile[${index}]`, file)
    })
    return super.post(`${this.url}/updateRecord`, formData)
  }

  delete ({ recordId, customerId }) {
    return super.post(`${this.url}/deleteRecord`, {
      recordId,
      customerId
    })
  }
}

export {
  RecordApi
}

export default new RecordApi()
