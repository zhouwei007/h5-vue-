import BaseRequest from 'common/request'

class AwardApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/jinjian/award'
  }

  list (date, month) {
    const startTime = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    const endTime = new Date(startTime - 1)
    startTime.setMonth(startTime.getMonth() - month)
    return super.post(`${this.url}/list`, {
      startTime: startTime.getTime(),
      endTime: endTime.getTime()
    }, {
      loading: false
    })
  }
}

export {
  AwardApi
}

export default new AwardApi()
