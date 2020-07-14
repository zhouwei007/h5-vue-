import Vue from 'vue'

const Bus = new Vue()

export const EVENT = {
  LOGOUT: 'LOGOUT',
  ROUTE_ANIMATION: 'ROUTE_ANIMATION',
  HEADER_BUTTON_CLICK: 'HEADER_BUTTON_CLICK',
  INPUT_FOCUS: 'INPUT_FOCUS',
  INPUT_BLUR: 'INPUT_BLUR'
}

export default Bus
