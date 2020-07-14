import FormData from 'form-data'
import BaseRequest from 'common/request'

class OcrApi extends BaseRequest {
  constructor () {
    super()
    this.url = '/jinjian/ocr'
  }

  idcard (file, isEstimate = false) {
    const formData = new FormData()
    formData.append('id5Front', file)
    return super.post(`${this.url}/${isEstimate ? 'userAssessOcrId5Front' : 'id5'}`, formData, {
      loading: '正在上传中...'
    })
  }

  house (file, type = 1) {
    const formData = new FormData()
    formData.append('pic', file)
    formData.append('type', type)
    return super.post(`${this.url}/house`, formData, {
      loading: '正在上传中...'
    })
  }

  credit (file) {
    const formData = new FormData()
    formData.append('pic', file)
    return super.post(`${this.url}/credit`, formData, {
      loading: '正在上传中...'
    })
  }
}

export {
  OcrApi
}

export default new OcrApi()
