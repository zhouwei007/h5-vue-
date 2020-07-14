import BaseRequest from 'common/request'

class QueryApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/jinjian/query'
  }

  query ({ areaCode, constructionId, constructionName,
    buildingId, buildingName, houseId, houseName, houseSize }) {
    return super.post(`${this.url}/start`, {
      areaCode,
      constructionId,
      constructionName,
      buildingId,
      buildingName,
      houseId,
      houseName,
      houseSize
    })
  }

  getResult (requestId) {
    return super.post(`${this.url}/getResult`, {
      requestId
    }, {
      loading: false
    })
  }

  getQueryTimes () {
    return super.post(`${this.url}/getQueryTimes`, null, {
      loading: false
    })
  }

  getConstructionList (areaCode, name) {
    if (name && name.trim) {
      name = name.trim()
    }
    return super.post(`${this.url}/construction/list`, {
      areaCode,
      name
    }, {
      loading: false
    })
  }

  getBuildingList (id) {
    return super.post(`${this.url}/building/list`, {
      id
    }, {
      loading: false
    })
  }

  getHouseList (id) {
    return super.post(`${this.url}/house/list`, {
      id
    }, {
      loading: false
    })
  }

  getQueryList ({ pageNo = 1, pageSize = 10 }) {
    return super.post(`${this.url}/getQueryList`, {
      pageNo,
      pageSize
    }, {
      loading: false
    })
  }
}

export {
  QueryApi
}

export default new QueryApi()
