<template>
  <transition :name="transitionName" @after-leave="afterClose">
    <div v-if="show" class="hl-dialog__wrapper">
      <div class="hl-dialog__mask" @click="close(true)" />
      <div
        class="hl-dialog"
        :class="[customClass, {
          'hl-dialog_bottom': type === 'bottom',
          'hl-dialog_default': !customClass
        }]"
        :style="dialogStyle"
      >
        <div v-if="showHeader" class="hl-dialog__header">
          <span
            v-if="type === 'bottom' && closeButton"
            class="hl-button"
            @click="close"
          >
            取消
          </span>
          <slot name="header" />
          <span
            v-if="type === 'bottom' && submitButton"
            class="hl-button hl-button_primary"
            @click="submit"
          >
            确定
          </span>
        </div>
        <div class="hl-dialog__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="hl-dialog__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'HlDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'center',
      validator (val) {
        return [
          'center',
          'bottom'
        ].indexOf(val) !== -1
      }
    },
    customClass: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '45%'
    },
    animation: {
      type: String,
      default: 'fade',
      validator (val) {
        return [
          'fade',
          'bounce'
        ].indexOf(val) !== -1
      }
    },
    maskClose: {
      type: Boolean,
      default: true
    },
    closeButton: {
      type: Boolean,
      default: true
    },
    submitButton: {
      type: Boolean,
      default: true
    },
    customClose: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      elements: []
    }
  },
  computed: {
    transitionName () {
      if (this.type === 'center') {
        return `dialog-${this.animation}`
      } else {
        return this.animation === 'fade'
          ? 'dialog-fade' : 'dialog-slide'
      }
    },
    showHeader () {
      return this.$slots.header || (this.type === 'bottom' && (this.closeButton || this.submitButton))
    },
    dialogStyle () {
      return {
        top: this.top
      }
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.handleLock(true)
        document.body.appendChild(this.$el)
        this.$emit('open')
      } else {
        this.handleLock(false)
        this.$emit('close')
      }
    }
  },
  mounted () {
    this.elements = document.querySelectorAll('.hl-dialog__lock')
  },
  destroyed () {
    this.handleLock(false)
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    submit () {
      this.$emit('submit')
      !this.customClose && this.$emit('update:show', false)
    },
    close (isMaskClose) {
      if (isMaskClose && !this.maskClose) {
        return
      }
      this.$emit('update:show', false)
    },
    afterClose () {
      this.$emit('after-close')
    },
    handleLock (lock) {
      document.body.style.overflowY = lock ? 'hidden' : 'auto'
      for (const element of this.elements) {
        element.style.overflowY = lock ? 'hidden' : 'auto'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $dialogIndex;

  .hl-dialog {
    position: absolute;
    left: 50%;
    background-size: cover;
    transform: translate(-50%, -50%);

    &.hl-dialog_default {
      width: 560px;
      background-color: $blockColor;
      border-radius: $dialogRadius;

      .hl-dialog__header {
        font-size: $titleSize;
        line-height: 90px;
        text-align: center;
        color: $textColor;
        user-select: none;
      }

      .hl-dialog__body::v-deep {
        padding: 50px;
        text-align: center;
        font-size: $textSize;
        color: $textColor;

        .hl-dialog__title {
          margin-bottom: 20px;
          font-size: $titleSize;
          font-weight: 600;
          line-height: 48px;
          margin-top: 10px;
        }

        .hl-dialog__des{
          font-size: $textSize;
          color: $descriptionColor;
          text-align: center;
          line-height: 40px;
          margin: 30px auto 40px;
        }

        .hl-dialog__description {
          font-size: $descriptionSize;
          line-height: 37px;
        }
      }

      .hl-dialog__footer::v-deep {
        display: flex;
        width: 100%;
        height: 94px;
        line-height: 94px;
        border-top: 1px solid #ececec;

        .hl-button {
          flex: auto;
          width: 0;
          height: auto;
          margin: 0;
          font-size: $titleSize;
          color: $themeColor;
          background-color: $blockColor;
          border: none;
          border-right: $splitBorder;
          user-select: none;
          outline: none;
          cursor: pointer;
        }

        .hl-button_primary {
          font-weight: 600;
          line-height: auto;
          background-image: none;
          box-shadow: none;
        }

        .hl-button:active {
          background-color: $blockActiveColor;
          transform: none;
        }

        .hl-button.hl-button_disabled {
          color: $descriptionColor;
          background-color: $blockColor;
          cursor: not-allowed;
        }

        .hl-button:first-child {
          border-bottom-left-radius: $dialogRadius;
        }

        .hl-button:last-child {
          border-right: none;
          border-bottom-right-radius: $dialogRadius;
        }
      }
    }

    &.hl-dialog_bottom {
      position: absolute;
      top: auto !important;
      bottom: 0;
      left: 0;
      right: 0;
      width: $screenWidth;
      margin: auto;
      border-radius: 0;
      transform: none;
    }

    &.hl-dialog_default.hl-dialog_bottom {
      .hl-dialog__header {
        .hl-button {
          float: left;
          display: block;
          padding: 0 30px;
          color: $descriptionColor;
          user-select: none;
          cursor: pointer;
        }

        .hl-button.hl-button_primary {
          float: right;
          color: $themeColor;
        }
      }

      .hl-dialog__body::v-deep {
        padding: 0;

        .hl-dialog__menu {
          padding-bottom: 20px;
          background-color: $systemDialogColor;

          .hl-dialog__menu-item {
            height: 100px;
            line-height: 100px;
            font-size: $textSize;
            color: $textColor;
            background-color: $blockColor;
            border-bottom: 1px solid rgba(0, 0, 0, .5);
            cursor: pointer;
          }

          .hl-dialog__menu-item:active {
            background-color: $blockActiveColor;
          }

          .hl-dialog__menu-item:last-child {
            border-bottom: none;
          }
        }
      }

      .hl-dialog__footer::v-deep {
        border: none;

        .hl-button {
          font-size: $textSize;
          color: $textColor;
        }
      }
    }
  }

  .hl-dialog__mask {
    position: absolute;
    top: -3000px;
    right: -3000px;
    bottom: -3000px;
    left: -3000px;
    background-color: rgba(0, 0, 0, .7);
  }

  &.dialog-fade-enter-active {
    animation: dialog-fade-in .15s;
  }

  &.dialog-fade-leave-active {
    animation: dialog-fade-in .1s reverse;
  }

  &.dialog-bounce-enter-active {
    animation: dialog-bounce-in .55s ease;
  }

  &.dialog-bounce-leave-active {
    animation: dialog-bounce-out .3s ease;
  }

  &.dialog-slide-enter-active {
    animation: dialog-slide-in .4s ease;
  }

  &.dialog-slide-leave-active {
    animation: dialog-slide-in .3s ease reverse;
  }
}

@keyframes dialog-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes dialog-bounce-in {
  from {
    opacity: 0;
    transform: translateY(-3000px);
  }
  70% {
    opacity: 1;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dialog-bounce-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
    transform: translateY(20px);
  }
  to {
    opacity: 0;
    transform: translateY(-1000px);
  }
}

@keyframes dialog-slide-in {
  from {
    opacity: 0;
    transform: translateY(1000px);
  }
  70% {
    opacity: 1;
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
