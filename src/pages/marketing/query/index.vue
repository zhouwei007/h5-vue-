<template>
  <components
    :is="pages[step]"
    :options="data"
    @next="next"
    @prev="prev"
  />
</template>

<script>
import HlQueryStep1 from './query-step-1'
import HlQueryStep2 from './query-step-2'
export default {
  name: 'HlQuery',
  components: {
    HlQueryStep1,
    HlQueryStep2
  },
  data () {
    return {
      step: 0,
      data: {},
      pages: [
        HlQueryStep1,
        HlQueryStep2
      ]
    }
  },
  methods: {
    next (data) {
      this.data = { ...data }
      this.step++
    },
    prev (data) {
      this.data = { ...data }
      this.step--
    }
  }
}
</script>
