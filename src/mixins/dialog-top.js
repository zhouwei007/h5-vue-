import { EVENT } from 'common/bus'
export default {
  data () {
    return {
      dialogTop: '45%',
      _initDialogTop: null
    }
  },
  mounted () {
    const isWeChat = /MicroMessenger/.test(navigator.userAgent)
    const isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
    if (isWeChat && isIOS) {
      this.$data._initDialogTop = this.dialogTop
      this.$root.Bus.$on(EVENT.INPUT_FOCUS, this._handleKeyboardUp)
      this.$root.Bus.$on(EVENT.INPUT_BLUR, this._handleKeyboardDown)
    }
  },
  destroyed () {
    this.$root.Bus.$off(EVENT.INPUT_FOCUS)
    this.$root.Bus.$off(EVENT.INPUT_BLUR)
  },
  methods: {
    _handleKeyboardUp () {
      this.dialogTop = '25%'
      document.body.scrollTop = 0
      document.getElementsByTagName('html')[0].scrollTop = 0
    },
    _handleKeyboardDown () {
      this.dialogTop = this.$data._initDialogTop
    }
  }
}
