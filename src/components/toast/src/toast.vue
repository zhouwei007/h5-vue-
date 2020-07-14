<template>
  <transition name="toast-fade">
    <div class="hl-toast"
      :style="{ top }"
      v-if="show">
      <p class="hl-toast__message">{{ message }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'HlToast',
  data () {
    return {
      message: '',
      duration: 1500,
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
      this.duration > 0 && setTimeout(this.close, this.duration)
    },
    close () {
      this.show = false
      this.$el.addEventListener('transitionend', this.destroy)
    },
    destroy () {
      this.$el.removeEventListener('transitionend', this.destroy)
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-toast {
  position: fixed;
  width: $screenWidth;
  text-align: center;
  z-index: $toastIndex;

  .hl-toast__message {
    display: inline-block;
    text-align: center;
    min-width: 100px;
    max-width: 460px;
    padding: 15px 30px;
    font-size: $textSize;
    line-height: 35px;
    word-wrap:break-word;
    color: $blockColor;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 30px;
  }

  &.toast-fade-enter-active {
    animation: toast-fade-in .3s;
  }

  &.toast-fade-leave-active {
    animation: toast-fade-in .3s reverse;
  }
}

@keyframes toast-fade-in {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
