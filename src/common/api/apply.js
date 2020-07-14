import BaseRequest from 'common/request'

class ApplyApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/jinjian/apply'
  }

  list ({ pageNo = 0, pageSize = 10, status }) {
    return super.post(`${this.url}/list`, {
      pageNo,
      pageSize,
      status
    }, {
      loading: false
    })
  }

  save ({ customerId, idCardPicture, propertyCertificate, borrowerName,
    cardId, borrowerMobile, expectedAmount, expectedPeriods,
    comeCityId }, idcardFileId = null, propertyList = []) {
    if (!Array.isArray(propertyCertificate)) {
      propertyCertificate = [propertyCertificate]
    }
    if (!Array.isArray(propertyList)) {
      propertyList = [propertyList]
    }
    if (expectedAmount) {
      expectedAmount *= 100
    }
    const formData = new FormData()
    formData.append('customerId', customerId)
    idcardFileId && idCardPicture
      ? formData.append('idCardPicture.sourcePicFileId', idcardFileId)
      : formData.append('idCardPicture.file', idCardPicture)
    propertyList.forEach((item, index) => {
      formData.append(`propertyCertificate[${index}].sourcePicFileId`, item.id)
    })
    propertyCertificate.forEach((file, index) => {
      formData.append(`propertyCertificate[${index + propertyList.length}].file`, file)
    })
    formData.append('borrowerName', borrowerName)
    formData.append('cardId', cardId)
    formData.append('borrowerMobile', borrowerMobile)
    formData.append('expectedAmount', expectedAmount)
    formData.append('expectedPeriodAndUnit', expectedPeriods)
    formData.append('comeCity.id', comeCityId)
    return super.post(`${this.url}/create`, formData)
  }
}

export {
  ApplyApi
}

export default new ApplyApi()
