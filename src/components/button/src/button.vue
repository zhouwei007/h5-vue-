<template>
  <button
    class="hl-button"
    :class="[`hl-button_${type}`, {
      'hl-button_disabled': disabled
    }]"
    @click="handleClick"
    @touchstart="touchstart"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
import Utils from 'common/utils'
export default {
  name: 'HlButton',
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default',
      validator (val) {
        return [
          'default',
          'primary',
          'bottom'
        ].indexOf(val) !== -1
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    debounce: {
      type: Number,
      default: 500
    }
  },
  created () {
    this.debounceClick = Utils.debounce(this.debounce, true, this.$emit.bind(this, 'click'))
  },
  methods: {
    handleClick (event) {
      this.disabled
        ? this.$emit('error', event)
        : this.debounceClick(event)
    },
    touchstart () {
      // For mobile active style
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-button {
  display: inline-block;
  padding: 0;
  font-size: $textSize;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  outline-style: none;
  user-select: none;
  cursor: pointer;

  &.hl-button_primary {
    display: block;
    width: 690px;
    height: 100px;
    margin: 30px auto;
    font-size: $titleSize;
    line-height: 100px;
    color: $blockColor;
    background-image: linear-gradient(269deg, #fc670f 0%, #f23d0a 100%);
    box-shadow: 0 10px 20px 0 rgba(202,54,15,0.30);
    border-radius: 2px;

    &:not(.hl-button_disabled):active {
      transform: scale(.99);
    }

    &.hl-button_disabled {
      background-image: linear-gradient(90deg, #f8b19b 0%, #fbc09c 100%);
      box-shadow: 0 10px 20px 0 rgba(248,83,13,0.10);
      transform: none;
    }
  }

  &.hl-button_bottom {
    position: fixed;
    bottom: 0;
    width: $screenWidth;
    height: 100px;
    font-size: $titleSize;
    color: $blockColor;
    background-image: linear-gradient(269deg, #fc670f 0%, #f23d0a 100%);
    box-shadow: 0 0 20px -12px rgba(202,54,15,0.30);

    @media only screen and (-webkit-device-pixel-ratio: 3) {
      bottom: constant(safe-area-inset-bottom);
      bottom: env(safe-area-inset-bottom);
    }

    &:not(.hl-button_disabled):active {
      background-image: linear-gradient(269deg, #ec6718 0%, #d83d12 100%);
    }

    &.hl-button_disabled {
      background-image: linear-gradient(90deg, #f8b19b 0%, #fbc09c 100%);
      box-shadow: 0 0 20px -12px rgba(248,83,13,0.10);
    }
  }

  &.hl-button_disabled {
    cursor: not-allowed;
  }
}
</style>
