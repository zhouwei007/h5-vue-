import TYPES from './types'

export default {
  [TYPES.SET_IDENTITY] (state, identity = null) {
    state.identity = identity
  },
  [TYPES.SET_WELCOME] (state, welcome = false) {
    state.welcome = welcome
  },
  [TYPES.SET_TITLE] (state, title) {
    state.title = title
  },
  [TYPES.SET_BACKGROUND] (state, color) {
    state.background = color
  },
  [TYPES.SET_HEADER_BACK] (state, option) {
    if (!option) {
      state.headerBack = null
      return
    }
    if (typeof option === 'string' || typeof option === 'function') {
      option = {
        to: option
      }
    }
    const defaultOption = {
      to: null,
      icon: null
    }
    state.headerBack = { ...defaultOption, ...option }
  },
  [TYPES.SET_HEADER_BUTTON] (state, option) {
    if (!option) {
      state.headerButton = null
      return
    }
    if (typeof option === 'string') {
      option = {
        text: option
      }
    }
    const defaultOption = {
      text: '保存',
      icon: null,
      event: null,
      disabled: false
    }
    state.headerButton = { ...defaultOption, ...option }
  },
  [TYPES.SET_CUSTOMER_INFO] (state, customerInfo = null) {
    const defaultCustomerInfo = state.customerInfo || {}
    state.customerInfo = customerInfo ? { ...defaultCustomerInfo, ...customerInfo } : null
  },
  [TYPES.SET_CUSTOMER_RECORD] (state, customerRecord = null) {
    state.customerRecord = customerRecord
  },
  [TYPES.SET_UPLOAD_CUSTOMER_IMAGE_ERROR_RECENT] (state, isUploadCustomerImageErrorRecent = false) {
    state.isUploadCustomerImageErrorRecent = isUploadCustomerImageErrorRecent
  },
  [TYPES.SET_ADD_CUSTOMER_RECORD_RECENT] (state, isAddCustomerRecordRecent = false) {
    state.isAddCustomerRecordRecent = isAddCustomerRecordRecent
  },
  [TYPES.SET_MESSAGE] (state, message = null) {
    state.message = message
  },
  [TYPES.SET_ESTIMATE_RECORD] (state, estimateRecord = null) {
    state.estimateRecord = estimateRecord
  }
}
