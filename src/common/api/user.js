import BaseRequest from 'common/request'

class UserApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/jinjian/user'
  }

  submitPropertyInfo ({ ocrTaskId, cityId, cityName, countyName,
    constructionId, constructionName, buildingId, buildingName,
    houseId, houseName, position, houseType, houseNature, area,
    floor, totalFloor, buildYear, payType, mortgageBalance = null,
    houseOcrId = null }) {
    return super.post(`${this.url}/assess/propertyInfo`, {
      ocrTaskId,
      cityId,
      cityName,
      countyName,
      constructionId,
      constructionName,
      buildingId,
      buildingName,
      houseId,
      houseName,
      position,
      houseType,
      houseNature,
      area,
      floor,
      totalFloor,
      buildYear: buildYear instanceof Date ? buildYear.getFullYear() : null,
      payType,
      mortgageBalance: mortgageBalance ? mortgageBalance * 100 : null,
      houseOcrId
    })
  }

  submitPersonalInfo ({ cardIdPicture, name, cardId, mobile,
    marStatus, spouseName = null, spouseCardId = null, userOcrId = null }) {
    const formData = new FormData()
    formData.append('pic', cardIdPicture)
    formData.append('name', name)
    formData.append('cardId', cardId)
    formData.append('mobile', mobile)
    formData.append('marStatus', marStatus)
    spouseName && formData.append('spouseName', spouseName)
    spouseCardId && formData.append('spouseCardId', spouseCardId)
    userOcrId && formData.append('userOcrId', userOcrId)
    return super.post(`${this.url}/assess/personalInfo`, formData)
  }

  submitCreditInfo ({ ocrCreditTaskId, houseOcrId,
    userOcrId, balance, total, used, avg6 }) {
    return super.post(`${this.url}/assess/userCreditInfo`, {
      ocrCreditTaskId,
      houseOcrId,
      userOcrId,
      balance: balance * 100,
      total: total * 100,
      used: used * 100,
      avg6: avg6 * 100
    }, {
      loading: false
    })
  }

  getResult (requestId) {
    return super.post(`${this.url}/assess/getResult`, {
      requestId
    }, {
      loading: false
    })
  }

  getEstimateTimes () {
    return super.post(`${this.url}/assess/initUserAssess`, null, {
      loading: false
    })
  }

  getEstimateList ({ pageNo = 1, pageSize = 10 }) {
    return super.post(`${this.url}/assess/query/list`, {
      pageNo,
      pageSize
    }, {
      loading: false
    })
  }
}

export {
  UserApi
}

export default new UserApi()
