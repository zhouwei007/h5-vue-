<template>
  <components
    :is="pages[step]"
    :options="data"
    @next="next"
    @prev="prev"
  />
</template>

<script>
import HlPasswordResetStep1 from './password-reset-step-1'
import HlPasswordResetStep2 from './password-reset-step-2'
export default {
  name: 'HlPasswordReset',
  components: {
    HlPasswordResetStep1,
    HlPasswordResetStep2
  },
  data () {
    return {
      step: 0,
      data: {
        mobile: '',
        kaptchaCode: '',
        hasAuthenticate: false
      },
      pages: [
        HlPasswordResetStep1,
        HlPasswordResetStep2
      ]
    }
  },
  methods: {
    next (data) {
      this.data = { ...data }
      this.step++
    },
    prev () {
      this.step--
    }
  }
}
</script>
