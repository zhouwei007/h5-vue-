<template>
  <div class="hl-select__wrapper">
    <div class="hl-select"
      v-if="type !== 'label'"
      @click="open">
      <span :class="label ? 'hl-select__label' : 'hl-select__placeholder'">
        {{ label || placeholder }}
      </span>
      <i class="hl-icon hl-icon-arrow-right"></i>
    </div>
    <p class="hl-select__text" v-else>{{ label }}</p>

    <hl-dialog
      class="hl-select__poper"
      :show.sync="selectShow"
      type="bottom"
      animation="bounce"
      @submit="updateSelect">
      <template slot="header">{{ title }}</template>
      <hl-picker v-model="selected"
        :options="pickerOptions">
      </hl-picker>
    </hl-dialog>
  </div>
</template>

<script>
import HlDialog from '@/components/dialog'
import HlPicker from '@/components/picker'
export default {
  name: 'HlSelect',
  components: {
    HlDialog,
    HlPicker
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    options: {
      type: Array,
      default () {
        return []
      }
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    title: {
      type: String,
      default: '请选择'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    type: {
      type: String,
      default: 'text',
      validator (val) {
        return [
          'text',
          'label'
        ].indexOf(val) !== -1
      }
    },
    beforeOpen: {
      type: Function,
      default: null
    },
    customLabel: {
      type: String,
      default: null
    },
    customClose: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      label: '',
      selected: null,
      selectShow: false
    }
  },
  computed: {
    pickerOptions () {
      return [{
        key: this.labelKey,
        values: this.options
      }]
    }
  },
  watch: {
    value: {
      handler (val) {
        this.selected = this.options.find(item => (
          this.isObject(item)
            ? String(item[this.valueKey]) === String(this.value)
            : String(item) === String(this.value)
        ))
        if (!this.customLabel) {
          if (this.isObject(this.selected)) {
            this.label = String(this.selected[this.valueKey]) === String(val) ? this.selected[this.labelKey] : ''
          } else {
            this.label = String(this.selected) === String(val) ? this.selected : ''
          }
        }
      },
      immediate: true
    },
    options (val) {
      this.selected = val.find(item => (
        this.isObject(item)
          ? String(item[this.valueKey]) === String(this.value)
          : String(item) === String(this.value)
      ))
      if (!this.customLabel) {
        this.label = this.isObject(this.selected)
          ? this.selected[this.labelKey]
          : this.selected
      }
    },
    customLabel (val) {
      this.label = val
    },
    selectShow (val) {
      this.$emit(val ? 'open' : 'close')
    }
  },
  methods: {
    async open () {
      if (this.beforeOpen && !(await this.beforeOpen())) {
        return
      }
      this.selected = this.options.find(item => (
        this.isObject(item)
          ? String(item[this.valueKey]) === String(this.value)
          : String(item) === String(this.value)
      ))
      if (!this.selected && this.options.length) {
        this.selected = this.options[0]
      }
      this.selectShow = true
    },
    close () {
      this.selectShow = false
    },
    updateSelect () {
      const val = typeof this.selected === 'object' && this.selected
        ? this.selected[this.valueKey]
        : this.selected
      this.$emit('update:value', val)
      this.$emit('change', val)
    },
    isObject (obj) {
      return obj && typeof obj === 'object'
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-select__wrapper {
  .hl-select {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 30px;
    cursor: pointer;

    .hl-select__label {
      flex: auto;
      display: flex;
      align-items: center;
      width: 0;
      height: 100%;
      color: $textColor;
      @include label($textSize);
      @extend %text-overflow;
    }

    .hl-select__placeholder {
      flex: auto;
      display: flex;
      align-items: center;
      width: 0;
      height: 100%;
      color: $placeholderColor;
      @include label($textSize);
      @extend %text-overflow;
    }

    .hl-icon {
      font-size: 45px;
      color: $iconColor;
    }
  }

  .hl-select__text {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 30px;
    color: $textColor;
    box-sizing: border-box;
    @include label($textSize);
    @extend %text-overflow;
  }
}

.hl-select__poper::v-deep .hl-dialog__body {
  padding: 30px !important;
}
</style>
