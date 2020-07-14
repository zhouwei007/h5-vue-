<template>
  <div class="hl-header">
    <div class="hl-header__bg-1" />
    <div class="hl-header__bg-2" />
    <i
      v-if="back"
      class="hl-header__back hl-icon"
      :class="back.icon || 'hl-icon-arrow-left'"
      @click="goBack"
    />
    <div class="hl-header__title">
      <slot>{{ title }}</slot>
    </div>
    <div class="hl-header__button"
      v-if="$slots.button">
      <slot name="button" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HlHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    back: {
      type: [Object, Boolean],
      default () {
        return {
          to: null,
          icon: 'hl-icon-arrow-left'
        }
      }
    }
  },
  methods: {
    goBack () {
      this.$emit('back')
      if (typeof this.back.to === 'function') {
        this.back.to()
      } else {
        typeof this.back.to === 'string'
          ? this.$router.replace({
            name: this.back.to
          })
          : this.$router.back(-1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.hl-header {
  position: relative;
  height: $headerHeight;
  color: $blockColor;
  background-color: $subThemeColor;
  z-index: $headerIndex;
  overflow: hidden;

  .hl-header__bg-1 {
    position: absolute;
    top: 0;
    right: 137px;
    width: 408px;
    height: $headerHeight;
    background-image: linear-gradient(200deg, #2F304A 18%, rgba(30,31,50,0.00) 69%);
    transform: rotate(-45deg);
    z-index: -1;
  }

  .hl-header__bg-2 {
    position: absolute;
    top: 0;
    right: 25px;
    width: 388px;
    height: $headerHeight;
    background-image: linear-gradient(189deg, #33344F 19%, rgba(30,31,50,0.00) 56%);
    transform: rotate(-45deg);
    z-index: -1;
  }

  .hl-header__back {
    position: absolute;
    top: 0;
    left: 0;
    width: $headerHeight;
    height: $headerHeight;
    line-height: $headerHeight;
    font-size: 55px;
    text-align: center;
    cursor: pointer;

    &.hl-icon-close {
      font-size: 32px;
      font-weight: 600;
    }
  }

  .hl-header__title {
    flex: auto;
    width: 100%;
    font-size: $headerSize;
    line-height: $headerHeight;
    text-align: center;
  }

  .hl-header__button {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    right: 0;
    bottom: 0;
    max-width: 220px;
    padding-right: 30px;
    line-height: $headerHeight;
    text-align: right;
    cursor: pointer;
    @extend %text-overflow;

    .hl-button:not(.hl-button_icon) {
      width: 90px;
      height: 48px;
      font-size: $textSize;
      line-height: 48px;
      color: $subThemeColor;
      background-color: $blockColor;
      border-radius: 4px;

      &:not(.hl-button_disabled):active {
        transform: scale(.99);
      }

      &.hl-button_disabled {
        background-color: $subThemeDisabledColor;
      }
    }

    .hl-button.hl-button_icon {
      font-size: 54px;
      line-height: $headerHeight;
      color: $blockColor;

      &.hl-button_disabled {
        color: $subThemeDisabledColor;
      }

      ::v-deep .hl-icon {

        &.hl-icon-add {
          font-size: 38px;
        }

        &.hl-icon-refresh {
          font-size: 34px;
        }
      }

    }

    .hl-popover__wrapper::v-deep {
      .hl-popover__button {
        display: flex;
        align-items: center;

        .hl-button {
          color: $blockColor;
        }
      }
    }
  }
}
</style>
