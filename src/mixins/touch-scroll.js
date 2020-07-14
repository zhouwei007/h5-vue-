export default {
  data () {
    return {
      _touchElements: []
    }
  },
  mounted () {
    let elements = this.$refs.main
    if (!elements) {
      return
    }
    elements = Array.isArray(elements) ? elements : [elements]
    this.$data._touchElements = elements.map((el, index) => {
      el = el instanceof HTMLElement ? el : el.$el
      const callback = this._handleTouchEvent.bind(this, el)
      el.addEventListener('touchstart', callback)
      return { el, callback }
    })
  },
  destroyed () {
    this.$data._touchElements.forEach(item => {
      item.el.removeEventListener('touchstart', item.callback)
    })
  },
  methods: {
    _handleTouchEvent (el) {
      const top = el.scrollTop
      const totalScroll = el.scrollHeight
      const currentScroll = top + el.offsetHeight
      if (top === 0) {
        el.scrollTop = 1
      } else if (currentScroll === totalScroll) {
        el.scrollTop = top - 1
      }
    }
  }
}
