<template>
  <div class="hl-scroll">
    <slot></slot>
    <infinite-loading
      ref="infiniteLoading"
      spinner="waveDots"
      :identifier="identifier"
      @infinite="debouncedInfiniteHandler">
      <div slot="spinner" class="hl-scroll__line">加载更多</div>
      <div slot="no-more" class="hl-scroll__line">我是有底线的</div>
      <div slot="no-results" class="hl-scroll__line">我是有底线的</div>
    </infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import Utils from 'common/utils'
export default {
  name: 'HlScroll',
  components: {
    InfiniteLoading
  },
  data () {
    return {
      identifier: new Date().getTime()
    }
  },
  created () {
    this.debouncedInfiniteHandler = Utils.debounce(300, this.infiniteHandler)
  },
  methods: {
    infiniteHandler (state) {
      this.$emit('more', state)
    },
    reset () {
      setTimeout(() => {
        this.identifier = new Date().getTime()
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-scroll {
  .hl-scroll__line {
    position: relative;
    margin: 20px 0;
    text-align: center;
    font-size: $descriptionSize;
    color: $descriptionColor;
    user-select: none;
    padding: 5px 0;
  }
}
</style>
