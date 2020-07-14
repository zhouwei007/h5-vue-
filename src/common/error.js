class ServiceError extends Error {
  constructor (code, message) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
  }
}

class RequestError extends Error {
  constructor (code, message) {
    super(message)
    this.name = 'RequestError'
    this.code = code
  }
}

class ResponseError extends Error {
  constructor (code, message) {
    super(message)
    this.name = 'ResponseError'
    this.code = code
  }
}

export {
  ServiceError,
  RequestError,
  ResponseError
}
