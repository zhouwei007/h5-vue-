import BaseRequest from 'common/request'

class CmsApi extends BaseRequest {
  getBusinessImages () {
    return new Promise((resolve, reject) => {
      super.jsonp('https://help.souyidai.com/element/saas/index.json', data => {
        data instanceof Error ? reject(data) : resolve(data)
      }, {
        name: 'jsonpcallback'
      })
    })
  }
}

export {
  CmsApi
}

export default new CmsApi()
