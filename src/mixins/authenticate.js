import { mapGetters } from 'vuex'
import Confirm from '@/components/confirm'
export default {
  computed: {
    ...mapGetters({
      $hasAuthenticate: 'hasAuthenticate'
    })
  },
  mounted () {
    this.$handleAuthenticate()
  },
  methods: {
    $handleAuthenticate () {
      const option = this.$data.$authenticateOption || {}
      !this.$hasAuthenticate && Confirm.show({
        title: '实名认证后可进行更多操作，快去认证吧',
        cancel: '暂不',
        submit: '立即认证',
        handleSubmit: this.goCertification,
        ...option
      })
      return this.$hasAuthenticate
    },
    goCertification () {
      this.$router.push({
        name: 'certification'
      })
    }
  }
}
