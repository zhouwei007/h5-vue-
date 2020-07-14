<template>
  <div
    v-if="show"
    class="hl-model"
    :class="{'hl-model_header': title}"
  >
    <div v-if="title" class="hl-model__header">
      <div class="hl-model__bg-1" />
      <div class="hl-model__bg-2" />
      <i class="hl-icon hl-icon-arrow-left" @click="close" />
      <div class="hl-model__title">{{ title }}</div>
    </div>
    <div ref="body" class="hl-model__body hl-dialog__lock">
      <i
        v-if="!title"
        class="hl-model__close hl-icon hl-icon-close"
        :class="{'hl-model__close_fixed': closeFixed}"
        @click="close"
      />
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HlModel',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    closeFixed: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      element: null
    }
  },
  watch: {
    show (val) {
      if (val && !this.element) {
        this.$nextTick(() => {
          this.element = this.$refs.body
          this.element.addEventListener('touchstart', this.handleTouchEvent)
        })
      }
    },
    '$route' () {
      this.close()
    }
  },
  destroyed () {
    this.element.removeEventListener('touchstart', this.handleTouchEvent)
  },
  methods: {
    close () {
      this.$emit('close')
    },
    handleTouchEvent () {
      const top = this.element.scrollTop
      const totalScroll = this.element.scrollHeight
      const currentScroll = top + this.element.offsetHeight
      if (top === 0) {
        this.element.scrollTop = 1
      } else if (currentScroll === totalScroll) {
        this.element.scrollTop = top - 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-model {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  max-width: $screenWidth;
  margin: auto;
  background-color: $blockColor;
  z-index: $dialogIndex;

  &.hl-model_header {
    background-color: $mainColor;
  }

  .hl-model__header {
    position: relative;
    height: $headerHeight;
    color: $blockColor;
    background-color: $subThemeColor;
    z-index: $headerIndex;
    overflow: hidden;

    .hl-model__bg-1 {
      position: absolute;
      top: 0;
      right: 137px;
      width: 408px;
      height: $headerHeight;
      background-image: linear-gradient(200deg, #2F304A 18%, rgba(30,31,50,0.00) 69%);
      transform: rotate(-45deg);
      z-index: -1;
    }

    .hl-model__bg-2 {
      position: absolute;
      top: 0;
      right: 25px;
      width: 388px;
      height: $headerHeight;
      background-image: linear-gradient(189deg, #33344F 19%, rgba(30,31,50,0.00) 56%);
      transform: rotate(-45deg);
      z-index: -1;
    }

    .hl-icon {
      position: absolute;
      top: 0;
      left: 0;
      width: $headerHeight;
      height: $headerHeight;
      line-height: $headerHeight;
      font-size: 55px;
      text-align: center;
      cursor: pointer;
    }

    .hl-model__title {
      flex: auto;
      width: 100%;
      font-size: $headerSize;
      line-height: $headerHeight;
      text-align: center;
    }
  }

  .hl-model__close {
    position: absolute;
    top: 0;
    left: 0;
    width: $headerHeight;
    height: $headerHeight;
    line-height: $headerHeight;
    text-align: center;
    color: $subTitleColor;
    z-index: $dialogIndex;
    cursor: pointer;

    &.hl-model__close_fixed {
      position: fixed;
    }
  }

  .hl-model__body {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &.hl-model_header .hl-model__body {
    top: $headerHeight;
  }
}
</style>
