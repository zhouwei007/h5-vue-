/* eslint-disable no-console */
import { register } from 'register-service-worker'

(function () {
  if (typeof window.CustomEvent === 'function') return false
  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }
  window.CustomEvent = CustomEvent
})()

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      // console.log(
      //   'App is being served from cache by a service worker.\n' +
      //   'For more details, visit https://goo.gl/AFskqB'
      // )
    },
    registered (registration) {
      // console.log('Service worker has been registered.')
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)
    },
    cached () {
      // console.log('Content has been cached for offline use.')
    },
    updatefound () {
      // console.log('New content is downloading.')
    },
    updated (registration) {
      // console.log('New content is available; please refresh.')
      document.dispatchEvent(new CustomEvent('swUpdated', { detail: registration }))
    },
    offline () {
      // console.log('No internet connection found. App is running in offline mode.')
    },
    error () {
      // console.error('Error during service worker registration:', error)
    }
  })
}
