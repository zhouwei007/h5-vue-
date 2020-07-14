import BaseRequest from 'common/request'

class CustomerApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/jinjian/customer'
  }

  detail (customerId) {
    return super.post(`${this.url}/baseInfo`, {
      customerId
    }, {
      loading: false
    })
  }

  list ({ groupCode = null, name = null, pageNo = 0, pageSize = 10 }) {
    return super.post(`${this.url}${groupCode ? '/group/list' : '/list'}`, {
      groupCode,
      name,
      pageNo,
      pageSize
    }, {
      loading: false
    })
  }

  recent ({ name = null, pageNo = 0, pageSize = 10 }) {
    return super.post(`${this.url}/lately/list`, {
      name,
      pageNo,
      pageSize
    }, {
      loading: false
    })
  }

  group () {
    return super.post(`${this.url}/myGroup`, null, {
      loading: false
    })
  }

  save ({ id = null, file = null, name, mobile, cardId, groupCode,
    company = '', industry = '', address = '', email = '' }) {
    const formData = new FormData()
    id && formData.append('id', id)
    file && formData.append('file', file)
    file && formData.append('fileType', CustomerApi.FILE_TYPE.AVATAR)
    formData.append('name', name)
    formData.append('mobile', mobile)
    formData.append('cardType', 1)
    formData.append('cardId', cardId)
    formData.append('groupCode', groupCode)
    formData.append('company', company)
    formData.append('industry', industry)
    formData.append('address', address)
    formData.append('email', email)
    return super.post(`${this.url}/save`, formData, {
      loading: false
    })
  }

  delete (id) {
    return super.post(`${this.url}/delete`, {
      id
    }, {
      loading: false
    })
  }

  getLoanList ({ name, cardId, pageNo = 0, pageSize = 5 }) {
    return super.post(`${this.url}/borrowApplyHistory`, {
      name,
      cardId,
      cardType: 1,
      pageNo,
      pageSize
    }, {
      loading: false
    })
  }

  getEstimateList ({ name, cardId, pageNo = 1, pageSize = 5 }) {
    return super.post(`${this.url}/userAssess`, {
      name,
      cardId,
      pageNo,
      pageSize
    }, {
      loading: false
    })
  }

  getImageList ({ customerId, fileType = CustomerApi.FILE_TYPE.OTHER,
    pageNo = 0, pageSize = 100 }) {
    return super.post(`${this.url}/media/getList`, {
      customerId,
      fileType,
      pageNo,
      pageSize
    }, {
      loading: false
    })
  }

  getRecommendImages (customerId) {
    return super.post(`${this.url}/recommend/getMediaList`, {
      id: customerId
    }, {
      loading: false
    })
  }

  upload ({ customerId, id = [], file = [],
    fileType = CustomerApi.FILE_TYPE.OTHER }) {
    if (!Array.isArray(file)) {
      file = [file]
    }
    const formData = new FormData()
    file.forEach((file, index) => {
      formData.append(`file[${index}]`, file)
    })
    formData.append('customerId', customerId)
    formData.append('id', id)
    formData.append('fileType', fileType)
    return super.post(`${this.url}/media/save`, formData, {
      loading: false
    })
  }

  getShareToken (customerId) {
    return super.post(`${this.url}/media/share`, {
      customerId
    }, {
      loading: false
    })
  }

  getShareData (token) {
    return super.post(`${this.url}/media/getShareResult`, {
      key: token
    }, {
      loading: false
    })
  }

  saveShareData (token, type = 1, { idCardStr = null, idCard = [],
    properTyCertificate = [], creditReport = [], other = [] }) {
    if (!Array.isArray(idCard)) {
      idCard = [idCard]
    }
    const url = type === 1 ? '/media/shareSave' : '/media/encrypt/save'
    const formData = new FormData()
    formData.append('key', token)
    idCardStr && formData.append('idCardStr', idCardStr)
    idCard.length && formData.append('idCard', idCard[0])
    properTyCertificate.forEach((file, index) => {
      formData.append(`properTyCertificate[${index}]`, file)
    })
    creditReport.forEach((file, index) => {
      formData.append(`creditReport[${index}]`, file)
    })
    other.forEach((file, index) => {
      formData.append(`other[${index}]`, file)
    })
    return super.post(`${this.url}${url}`, formData, {
      loading: type === 1
    })
  }

  getEncryptShareToken (customerId) {
    return super.post(`${this.url}/media/encryptShare`, {
      customerId
    }, {
      loading: false
    })
  }

  getEncryptShareInfo ({ token }) {
    return super.post(`${this.url}/media/getAuthInfo`, {
      key: token
    }, {
      loading: false
    })
  }

  sendEncryptShareSms ({ token, mobile }) {
    return super.post(`${this.url}/sendSms`, {
      key: token,
      mobile
    }, {
      loading: false
    })
  }

  validateEncryptShareSms ({ token, mobile, smsCode }) {
    return super.post(`${this.url}/validSms`, {
      key: token,
      mobile,
      smsCode
    }, {
      loading: false
    })
  }

  saveEncryptShareCode ({ token, mobile, password }) {
    return super.post(`${this.url}/media/saveAuthCode`, {
      key: token,
      mobile,
      authCode: password
    })
  }

  validateEncryptShareCode (customerId, password) {
    return super.post(`${this.url}/media/validAuthCode`, {
      customerId,
      authCode: password
    })
  }

  getEncryptShareData (token) {
    return super.post(`${this.url}/media/getEncShareResult`, {
      key: token
    }, {
      loading: false
    })
  }

  getEncryptImages (customerId) {
    return super.post(`${this.url}/getFilePaths`, {
      customerId
    }, {
      loading: false
    })
  }

  getEncryptImage (filePath) {
    return super.post(`${this.url}/getFile`, {
      filePath
    }, {
      loading: false,
      original: true,
      responseType: 'blob'
    })
  }

  downloadEncryptFile (customerId) {
    location.href = `${this.url}/getZipFile?customerId=${customerId}`
  }
}

CustomerApi.FILE_TYPE = {
  AVATAR: 1,
  IDCARD: 2,
  PROPERTY_CERTIFICATE: 3,
  CREDIT_REPORT: 4,
  ACCESS_RECORD: 5,
  OTHER: 99
}

export {
  CustomerApi as Customer
}

export default new CustomerApi()
