<template>
  <components
    :is="pages[step]"
    :options="data"
    @next="next"
    @prev="prev"
  />
</template>

<script>
import HlRegisterStep1 from './register-step-1'
import HlRegisterStep2 from './register-step-2'
export default {
  name: 'HlRegister',
  components: {
    HlRegisterStep1,
    HlRegisterStep2
  },
  data () {
    return {
      step: 0,
      data: {
        mobile: '',
        password: '',
        inviteCode: '',
        isAgree: false
      },
      pages: [
        HlRegisterStep1,
        HlRegisterStep2
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
