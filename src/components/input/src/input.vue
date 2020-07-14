<template>
  <div
    class="hl-input"
    :class="{
      'hl-input_clearable': clearable,
      'hl-input_suffix': $slots.suffix,
      'hl-input_focus': isFocus
    }"
  >
    <div
      class="hl-input__prefix"
      v-if="$slots.prefix"
    >
      <slot name="prefix" />
    </div>
    <template v-if="type !== 'label'">
      <input
        v-if="!autocomplete"
        type="password"
        class="hl-input__autocomplete_hide"
      >
      <input
        v-if="type !== 'textarea'"
        v-model="text"
        ref="input"
        class="hl-input__inner"
        :type="inputType"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :autocomplete="autocomplete ? null : 'new-password'"
        @focus="handleFocus"
        @blur="handleBlur"
        v-on="$listeners"
      >
      <textarea
        v-else
        v-model="text"
        ref="input"
        class="hl-input__inner hl-input__inner_textarea"
        :placeholder="placeholder"
        :maxlength="maxlength"
        @focus="handleFocus"
        @blur="handleBlur"
        v-on="$listeners"
      />
      <i
        v-if="showClearButton"
        class="hl-input__clear-button hl-icon hl-icon-round-close-fill"
        @touchend="handleClear"
        @mousedown="handleClear"
      />
    </template>
    <p v-else class="hl-input__label">{{ text || labelPlaceholder }}</p>
    <div v-if="$slots.suffix" class="hl-input__suffix">
      <slot name="suffix" />
    </div>
  </div>
</template>

<script>
import Bus, { EVENT } from 'common/bus'
import { validateReg } from 'common/validate'
export default {
  name: 'HlInput',
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      default: null
    },
    type: {
      type: String,
      default: 'text',
      validator (val) {
        return [
          'text',
          'textarea',
          'password',
          'tel',
          'label'
        ].indexOf(val) !== -1
      }
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    labelPlaceholder: {
      type: String,
      default: null
    },
    maxlength: {
      type: Number
    },
    clearable: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    uppercase: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: Boolean,
      default: true
    },
    validate: {
      type: String,
      default: null,
      validator (val) {
        return [
          'number',
          'float',
          'money',
          'name'
        ].indexOf(val) !== -1
      }
    }
  },
  data () {
    return {
      text: '',
      isFocus: false,
      watchFlag: true,
      regs: {
        number: validateReg.number,
        float: validateReg.float,
        money: validateReg.money,
        name: validateReg.name
      },
      isWeChat: false
    }
  },
  computed: {
    inputType () {
      if (this.type === 'label') {
        return this.type
      }
      return this.validate === 'number' ? 'tel' : this.type
    },
    showClearButton () {
      return this.clearable && this.isFocus && !['', null, undefined].includes(this.text)
    }
  },
  watch: {
    value: {
      handler (val) {
        this.text = val
      },
      immediate: true
    },
    text (val, oldVal) {
      if (this.validate) {
        if (!this.watchFlag) {
          this.watchFlag = true
          return
        }
        if (val !== '' && !this.regs[this.validate].test(val)) {
          this.text = oldVal
          this.watchFlag = false
          return
        }
      }
      if (this.uppercase && val && val.toUpperCase) {
        this.text = val.toUpperCase()
      }
      this.$emit('update:value', this.text)
    }
  },
  mounted () {
    this.autofocus && this.$refs.input.focus()
    this.isWeChat = /MicroMessenger/.test(navigator.userAgent)
  },
  methods: {
    focus () {
      this.$refs.input && this.$refs.input.focus()
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
    },
    handleClear (e) {
      e.preventDefault()
      this.text = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-input {
  position: relative;
  display: flex;
  align-items: center;

  .hl-input__inner {
    flex: auto;
    width: 0;
    padding: 0 30px;
    line-height: 40px;
    color: $textColor;
    border: none;
    @include label($textSize);
    @extend %text-overflow;

    &.hl-input__inner_textarea {
      white-space: normal;
      word-break: break-all;
      resize: none;
    }
  }

  .hl-input__autocomplete_hide {
    display: none;
  }

  .hl-input__clear-button {
    position: absolute;
    display: block;
    top: 50%;
    right: 0;
    font-size: 45px;
    color: $lightColor;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .hl-input__label {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 30px;
    color: $textColor;
    @include label($textSize);
    @extend %text-overflow;
  }

  &.hl-input_clearable {
    .hl-input__inner {
      padding-right: 80px;
    }
  }

  &.hl-input_suffix {
    .hl-input__clear-button {
      right: 80px;
    }
    .hl-icon-eye-close, .hl-icon-eye {
      font-size: 42px;
    }
  }
}
</style>
