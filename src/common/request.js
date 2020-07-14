import axios from 'axios'
import qs from 'query-string'
import FormData from 'form-data'
import BS from 'common/bs'
import Bus, { EVENT } from 'common/bus'
import Utils from 'common/utils'
import Validate from 'common/validate'
import { ServiceError, RequestError, ResponseError } from 'common/error'
import Loading from '@/components/loading'
import SETTING from '@/setting'

class BaseRequest {
  constructor () {
    this.$http = axios.create({
      maxContentLength: 300000,
      responseType: 'json'
    })
    this.defaultConfig = {
      headers: {},
      auth: true,
      loading: true,
      throwError: true,
      original: false
    }
  }

  get (url, params = null, config = {}) {
    this._handleLoading('open', config)
    return new Promise((resolve, reject) => {
      this.$http.get(url, {
        ...this._getHeaders(config),
        ...this._getTransformResponse(config),
        params: this._formatData(params),
        ...this._getAxiosConfig(config)
      }).then((response) => {
        resolve(response.data)
      }).catch(async (err) => {
        reject(await this._getError(err))
      }).finally(() => {
        this._handleLoading('close', config)
      })
    })
  }

  post (url, data = null, config = {}) {
    config = { ...this.defaultConfig, ...config }
    this._handleLoading('open', config)
    return new Promise((resolve, reject) => {
      this.$http.post(url, this._formatData(data), {
        ...this._getHeaders(config, data),
        ...this._getTransformRequest(config, data),
        ...this._getTransformResponse(config),
        ...this._getAxiosConfig(config)
      }).then((response) => {
        resolve(response.data)
      }).catch(async (err) => {
        reject(await this._getError(err))
      }).finally(() => {
        this._handleLoading('close', config)
      })
    })
  }

  put (url, data = null, config = {}) {
    config = { ...this.defaultConfig, ...config }
    this._handleLoading('open', config)
    return new Promise((resolve, reject) => {
      this.$http.put(url, this._formatData(data), {
        ...this._getHeaders(config, data),
        ...this._getTransformRequest(config, data),
        ...this._getTransformResponse(config),
        ...this._getAxiosConfig(config)
      }).then((response) => {
        resolve(response.data)
      }).catch(async (err) => {
        reject(await this._getError(err))
      }).finally(() => {
        this._handleLoading('close', config)
      })
    })
  }

  delete (url, data = null, config = {}) {
    config = { ...this.defaultConfig, ...config }
    this._handleLoading('open', config)
    return new Promise((resolve, reject) => {
      this.$http.delete(url, {
        ...this._getHeaders(config, data),
        ...this._getTransformRequest(config, data),
        ...this._getTransformResponse(config),
        data: this._formatData(data),
        ...this._getAxiosConfig(config)
      }).then((response) => {
        resolve(response.data)
      }).catch(async (err) => {
        reject(await this._getError(err))
      }).finally(() => {
        this._handleLoading('close', config)
      })
    })
  }

  jsonp (url, fn, config = {}) {
    const id = config.name || `_jsonp${Utils.randString()}`
    const param = config.param || 'callback'
    const timeout = config.timeout || 60000
    const target = document.getElementsByTagName('script')[0] || document.head
    let script
    let timer
    if (timeout) {
      timer = setTimeout(function () {
        cleanup()
        fn && fn(new Error('Timeout'))
      }, timeout)
    }
    function cleanup () {
      script.parentNode && script.parentNode.removeChild(script)
      window[id] = null
      timer && clearTimeout(timer)
    }
    function cancel () {
      window[id] && cleanup()
    }
    window[id] = data => {
      cleanup()
      fn && fn(data)
    }
    url += `${~url.indexOf('?') ? '&' : '?'}${param}=${encodeURIComponent(id)}`
    url = url.replace('?&', '?')
    script = document.createElement('script')
    script.src = url
    target.parentNode.insertBefore(script, target)
    return cancel
  }

  _getAxiosConfig (config = {}) {
    const result = { ...config }
    delete result.headers
    return result
  }

  _getHeaders (config = {}, data = null) {
    const isFormData = data instanceof FormData
    return {
      headers: {
        'Content-Type': isFormData
          ? `multipart/form-data; boundary=${data._boundary}`
          : 'application/x-www-form-urlencoded',
        ...config.headers
      }
    }
  }

  _formatData (data) {
    if (data instanceof FormData) {
      return data
    }
    const res = {
      t: new Date().getTime()
    }
    if (!data) {
      return res
    }
    return Object.keys(data).reduce((result, key) => {
      if (data[key] !== null && data[key] !== void 0) {
        result[key] = data[key]
      }
      return result
    }, res)
  }

  _getTransformRequest (config, data) {
    return {
      transformRequest: data instanceof FormData || config.headers['Content-Type'] === 'application/json'
        ? [] : [request => qs.stringify(request)]
    }
  }

  _getTransformResponse (config) {
    return {
      transformResponse: [(response) => {
        if (!response) {
          throw new ServiceError(500, '系统服务繁忙')
        }
        const defaultErrorMessage = '系统服务内部错误'
        if (typeof response === 'string') {
          try {
            response = JSON.parse(response)
          } catch (err) {
            throw new ServiceError(500, defaultErrorMessage)
          }
        }
        if (config.throwError) {
          if (response.errorCode === 302) {
            config.auth && Bus.$emit(EVENT.LOGOUT)
            throw new RequestError(302, config.auth ? '' : '您的登录状态已过期')
          }
          if (response.errorCode !== void 0 && response.errorCode !== 0) {
            let message = response.data ? response.data.errorMessage : ''
            message = response.errorMessage || response.errMsg || message || defaultErrorMessage
            throw new ResponseError(response.errorCode, message)
          }
        }
        if (config.original) {
          return response
        }
        return response.data !== void 0 ? response.data : response.result
      }]
    }
  }

  _handleLoading (method, config) {
    const isServer = typeof window === 'undefined'
    if (isServer || !config.loading) {
      return
    }
    typeof config.loading === 'boolean'
      ? Loading[method]()
      : Loading[method](config.loading)
  }

  async _getError (err) {
    return err.name === 'ResponseError'
      ? new ResponseError(err.code, await this.getErrorMessage(err)) : err
  }

  async getErrorMessage (err) {
    const messageDict = await BS.getValue(SETTING.BS_ERROR_MESSAGE_KEY)
    return messageDict[err.message] || err.message
  }

  static validateParams (data, rules) {
    const validateResult = Validate.test(data, rules)
    if (!validateResult.result) {
      return new Promise((resolve, reject) => {
        reject(new RequestError(400, validateResult.message))
      })
    }
    return null
  }
}

export default BaseRequest
