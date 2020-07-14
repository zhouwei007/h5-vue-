<template>
  <div
    class="hl-code-input"
    @click="focus"
  >
    <div
      v-for="(item, index) in codes"
      :key="index"
      class="hl-code-input__code"
      :class="{
        'hl-code-input__code_focus': isFocus && text.length === index,
        'hl-code-input__code_error': isVerifyFail && text.length === bit
      }"
    >
      {{ item }}
    </div>
    <input
      ref="input"
      v-model="text"
      class="hl-code-input__input"
      tabindex="-1"
      @input="input"
      @keydown="cursorMove"
      @focus="handleFocus"
      @blur="handleBlur"
    >
  </div>
</template>

<script>
import Bus, { EVENT } from 'common/bus'
export default {
  name: 'HlCodeInput',
  model: {
    value: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    bit: {
      type: Number,
      default: 4
    },
    type: {
      type: Function,
      default: Number
    },
    isVerifyFail: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      text: '',
      isFocus: false,
      isWeChat: false
    }
  },
  computed: {
    codes () {
      let arr = Array(this.bit).fill('')
      arr = arr.map((item, index) => {
        return this.text[index] || item
      })
      return arr
    }
  },
  watch: {
    value (val) {
      this.text = val
    }
  },
  mounted () {
    this.isWeChat = /MicroMessenger/.test(navigator.userAgent)
  },
  methods: {
    input () {
      if (this.type === Number) {
        const reg = /[^\d]/g
        this.text = this.text.replace(reg, '').slice(0, this.bit)
      }
      this.$emit('update:value', this.text)
    },
    cursorMove (event) {
      if ([35, 36, 37, 38, 39, 40].includes(event.keyCode)) {
        event.preventDefault()
      }
    },
    focus () {
      this.$refs.input.focus()
    },
    handleFocus (e) {
      this.isFocus = true
      this.$emit('focus', e)
      Bus.$emit(EVENT.INPUT_FOCUS, e)
    },
    handleBlur (e) {
      this.isFocus = false
      if (this.isWeChat) {
        document.body.scrollTop = 0
        document.getElementsByTagName('html')[0].scrollTop = 0
      }
      this.$emit('blur', e)
      Bus.$emit(EVENT.INPUT_BLUR, e)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-code-input {
  position: relative;
  display: flex;
  justify-content: space-around;
  margin: auto;
  width: 460px;
  height: 110px;

  .hl-code-input__code {
    width: 80px;
    height: 110px;
    margin-right: 10px;
    line-height: 110px;
    text-align: center;
    color: $textColor;
    border-bottom: 2Px solid $formBorderColor;
    @include label(54px);

    &.hl-code-input__code_focus, &:focus {
      border-bottom: 2Px solid $subTitleColor;
    }

    &.hl-code-input__code_error {
      color: $errorColor;
      border-bottom: 2Px solid $errorColor;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .hl-code-input__input {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: scale(0);
    outline: none;
  }
}
</style>
