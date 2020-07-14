<template>
  <components
    :is="pages[step]"
    @next="next">
  </components>
</template>

<script>
import HlUpdateMobileStep1 from './update-mobile-step-1'
import HlUpdateMobileStep2 from './update-mobile-step-2'
export default {
  name: 'HlUpdateMobile',
  components: {
    HlUpdateMobileStep1,
    HlUpdateMobileStep2
  },
  data () {
    return {
      step: 0,
      pages: [
        HlUpdateMobileStep1,
        HlUpdateMobileStep2
      ]
    }
  },
  methods: {
    next () {
      this.step++
    }
  }
}
</script>
