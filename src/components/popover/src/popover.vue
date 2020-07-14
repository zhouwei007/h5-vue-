<template>
  <div class="hl-popover__wrapper">
    <div
      ref="button"
      class="hl-popover__button"
      @click="handleTrigger"
    >
      <slot name="button" />
    </div>
    <transition :name="transitionName">
      <div
        v-if="show"
        ref="popover"
        class="hl-popover"
        :class="[`hl-popover_${direction}`, customClass]"
        :style="style"
        v-click-outside="handleOutsideClick"
        @click="handleOutsideClick"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
import HlClickOutside from '@/components/click-outside'
export default {
  name: 'HlPopover',
  directives: {
    'click-outside': HlClickOutside
  },
  props: {
    direction: {
      type: String,
      default: 'top',
      validator (val) {
        return [
          'top',
          'right',
          'bottom',
          'left'
        ].includes(val)
      }
    },
    customClass: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      el: null,
      htmlEl: null,
      show: false,
      triggerDisabled: false,
      bounding: {}
    }
  },
  computed: {
    style () {
      const e = this.bounding
      const dict = {
        top: {
          bottom: `${e.bottom + e.height + 5}px`,
          left: `${e.left + e.width / 2}px`
        },
        right: {
          top: `${e.top + e.height / 2}px`,
          left: `${e.left + e.width + 10}px`
        },
        bottom: {
          top: `${e.top + e.height + 5}px`,
          left: `${e.left + e.width / 2}px`
        },
        left: {
          top: `${e.top + e.height / 2}px`,
          right: `${e.right + e.width + 10}px`
        }
      }
      return dict[this.direction]
    },
    transitionName () {
      return ['right', 'left'].includes(this.direction) ? 'pop' : 'fade'
    }
  },
  mounted () {
    this.el = this.$refs.button
    this.htmlEl = document.getElementsByTagName('html')[0]
    document.addEventListener('scroll', this.handleOutsideClick, true)
  },
  beforeDestroy () {
    const popover = this.$refs.popover
    if (popover && popover.parentNode) {
      popover.parentNode.removeChild(popover)
    }
    document.removeEventListener('scroll', this.handleOutsideClick)
  },
  methods: {
    handleTrigger () {
      if (this.triggerDisabled) {
        return
      }
      this.show = !this.show
      this.show && this.$nextTick(() => {
        this.getButtonSize()
        document.body.appendChild(this.$refs.popover)
      })
    },
    handleOutsideClick () {
      this.triggerDisabled = true
      this.show = false
      let timer = setTimeout(() => {
        this.triggerDisabled = false
        clearTimeout(timer)
      }, 100)
    },
    getButtonSize () {
      const screenWidth = this.htmlEl.offsetWidth
      const screenHeight = this.htmlEl.offsetHeight
      const bounding = this.el.getBoundingClientRect()
      this.bounding = {
        width: bounding.width,
        height: bounding.height,
        top: bounding.top,
        right: screenWidth - bounding.right,
        bottom: screenHeight - bounding.bottom,
        left: bounding.left
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-popover__wrapper {
  position: relative;

  .hl-popover__button {
    cursor: pointer;
  }
}

.hl-popover::v-deep {
  position: fixed;
  width: max-content;
  background-color: $subThemeColor;
  border-radius: $cardRadius;
  overflow: hidden;
  opacity: .8;
  z-index: $popoverIndex;

  &.hl-popover_top,
  &.hl-popover_bottom {
    transform: translateX(-50%);

    &.fade-enter-active {
      animation: popover-fade-in .2s ease-out;
    }

    &.fade-leave-active {
      animation: popover-fade-in .2s ease-out reverse;
    }
  }

  &.hl-popover_right,
  &.hl-popover_left {
    transform: translateY(-50%);

    &.pop-enter-active {
      animation: popover-pop-in .5s ease-out;
    }

    &.pop-leave-active {
      animation: popover-pop-in .5s ease-in-out reverse;
    }
  }

  .hl-button {
    color: $blockColor;

    &:not(.hl-button_disabled):active {
      color: $blockActiveColor;
    }
  }
}

@keyframes popover-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: .8;
  }
}

@keyframes popover-pop-in {
  from {
    max-width: 0;
  }
  to {
    max-width: $screenWidth;
  }
}
</style>
