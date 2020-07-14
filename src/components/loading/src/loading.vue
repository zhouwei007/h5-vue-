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
        <svg viewBox="0 0 32 32">
          <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4" />
          <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z" />
        </svg>
        <p class="hl-loading__message">
          {{ message }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'HlLoading',
  data () {
    return {
      message: '数据加载中...',
      top: '45%',
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
  left: 50%;
  width: 220px;
  height: 220px;
  margin-top: -110px;
  margin-left: -110px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  overflow: hidden;

  svg {
    width: 64px;
    height: 64px;
    margin-top: 60px;
    margin-bottom: 20px;
    fill: $blockColor;
    animation: loading-rotate 2s linear infinite both;
  }

  .hl-loading__message {
    font-size: $descriptionSize;
    color: $blockColor;
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

@keyframes loading-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
