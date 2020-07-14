<template>
  <transition name="loading-fade" @after-leave="destroy">
    <div
      v-if="show"
      class="hl-loading__wrapper"
    >
      <div
        class="hl-loading"
        :style="{ top }"
      >
        <svg class="hl-pic"><use :xlink:href="`#${icon}`"></use></svg>
        <p class="hl-loading__message">
          {{ message }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'HlQuerying',
  data () {
    return {
      message: '数据查询中...',
      top: '45%',
      icon: 'hl-pic-query',
      show: false
    }
  },
  mounted () {
    this.open()
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.show = false
    },
    destroy () {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-loading__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $loadingIndex;
}

.hl-loading {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 50%;
  padding: 20px 30px;
  background-color: rgba(0, 0, 0, .7);
  box-shadow: 0 0 30px 0 rgba(0,0,0,0.15);
  border-radius: $cardRadius;
  transform: translate(-50%, -50%);
  overflow: hidden;

  .hl-pic {
    width: 60px;
    height: 60px;
    margin-right: 8px;
  }

  .hl-loading__message {
    font-size: $titleSize;
    line-height: 48px;
    color: $blockColor;
    @extend %text-overflow;
  }

  &.loading-fade-enter-active {
    animation: loading-fade-in .1s;
  }

  &.loading-fade-leave-active {
    animation: loading-fade-in .1s reverse;
  }
}

@keyframes loading-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
