import BaseRequest from 'common/request'

class ProductApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/saas-harbour/open/product'
    this.clientId = process.env.VUE_APP_CLIENT_ID
  }

  list ({ cityId = null, index = 1, pageSize = 10 }, clientId = this.clientId) {
    return super.post(`${this.url}/list`, {
      clientId,
      cityId,
      index,
      pageSize
    }, {
      loading: false
    })
  }

  detail (id = null, clientId = this.clientId) {
    return super.post(`${this.url}/detail`, {
      id,
      clientId
    }, {
      loading: false
    })
  }
}

export {
  ProductApi
}

export default new ProductApi()
