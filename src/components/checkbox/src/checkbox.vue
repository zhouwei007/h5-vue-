<template>
  <div class="hl-checkbox"
    :class="{
      'hl-checkbox_checked': value,
      'hl-checkbox_disabled': disabled
    }">
    <div class="hl-checkbox__input" @click="trigger">
      <i class="hl-icon"
        :class="value ? 'hl-icon-round-check-fill' : 'hl-icon-round'">
      </i>
      <input v-model="inputValue"
        type="radio"
        class="hl-checkbox__inner"/>
    </div>
    <div class="hl-checkbox__label"
      v-if="$slots.default || label">
      <slot>{{ label }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HlCheckbox',
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      inputValue: false
    }
  },
  watch: {
    value (val) {
      this.inputValue = val
      this.$emit('change')
    }
  },
  methods: {
    trigger () {
      if (this.disabled) {
        return
      }
      this.$emit('update:value', !this.value)
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-checkbox {
  .hl-checkbox__input {
    float: left;
    position: relative;
    display: block;
    width: 45px;
    height: 45px;
    margin-right: 10px;

    .hl-icon {
      font-size: 45px;
      color: $themeColor;
    }

    .hl-checkbox__inner {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      width: 45px;
      height: 45px;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }
  }

  .hl-checkbox__label {
    margin-left: 44px;
    padding: 5px 0;
    font-size: $quoteSize;
    line-height: 36px;
    color: $descriptionColor;

    span {
      color: $systemColor;
      cursor: pointer;
    }
  }

  &.hl-checkbox_disabled {
    .hl-icon {
      color: $iconColor;
    }

    .hl-checkbox__inner {
      cursor: not-allowed;
    }
  }
}
</style>
