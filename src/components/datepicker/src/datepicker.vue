<template>
  <div class="hl-datepicker__wrapper">
    <div class="hl-datepicker" @click="open">
      <span :class="label ? 'hl-datepicker__label' : 'hl-datepicker__placeholder'">
        {{ label || placeholder }}
      </span>
      <i class="hl-icon hl-icon-arrow-right" />
    </div>

    <hl-dialog
      class="hl-datepicker__poper"
      :show.sync="selectShow"
      type="bottom"
      animation="bounce"
      @submit="updateSelect"
    >
      <template slot="header">
        {{ title }}
      </template>
      <hl-picker
        v-model="selected"
        :options="options"
        @change="setMaxDate"
      />
    </hl-dialog>
  </div>
</template>

<script>
import Utils from 'common/utils'
import HlDialog from '@/components/dialog'
import HlPicker from '@/components/picker'
export default {
  name: 'HlDatepicker',
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
      type: Date,
      default: null
    },
    type: {
      type: String,
      default: 'date',
      validator (val) {
        return [
          'date',
          'month',
          'year'
        ].includes(val)
      }
    },
    begin: {
      type: Date,
      default () {
        return new Date()
      }
    },
    end: {
      type: Date,
      default () {
        const date = new Date()
        date.setFullYear(new Date().getFullYear() + 40)
        return date
      }
    },
    default: {
      type: Date,
      default: null
    },
    title: {
      type: String,
      default: '请选择'
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data () {
    return {
      selected: null,
      selectShow: false,
      options: []
    }
  },
  computed: {
    label () {
      if (this.value instanceof Date) {
        const arr = ['yyyy年', 'yyyy年MM月', 'yyyy-MM-dd']
        return Utils.date2String(this.value, arr[this.typeLength - 1])
      }
      return ''
    },
    typeLength () {
      return ['year', 'month', 'date'].indexOf(this.type) + 1
    }
  },
  created () {
    const options = [{
      width: '38%',
      key: 'label',
      values: this.getYearOption(this.begin, this.end)
    }, {
      width: '31%',
      key: 'label',
      values: this.getMonthOption()
    }, {
      width: '31%',
      key: 'label',
      maxLength: 31,
      values: this.getDateOption()
    }]
    const selected = [
      options[0].values[0],
      options[1].values[0],
      options[2].values[0]
    ]
    this.options = options.slice(0, this.typeLength)
    this.selected = selected.slice(0, this.typeLength)
  },
  methods: {
    open () {
      this.selectShow = true
      const date = this.value || this.default
      if (date instanceof Date) {
        this.$set(this.selected, 0, {
          label: `${date.getFullYear()}年`,
          value: date.getFullYear()
        })
        this.typeLength > 1 && this.$set(this.selected, 1, {
          label: `${date.getMonth() + 1}月`,
          value: date.getMonth() + 1
        })
        this.typeLength > 2 && this.$set(this.selected, 2, {
          label: `${date.getDate()}日`,
          value: date.getDate()
        })
      }
    },
    getYearOption (begin, end) {
      const m = begin.getFullYear()
      const n = end.getFullYear()
      const result = []
      for (let i = m; i <= n; i++) {
        result.push({
          value: i,
          label: `${i}年`
        })
      }
      return result
    },
    getMonthOption () {
      const result = []
      for (let i = 1; i <= 12; i++) {
        result.push({
          value: i,
          label: `${i}月`
        })
      }
      return result
    },
    getDateOption () {
      const result = []
      for (let i = 1; i <= 31; i++) {
        result.push({
          value: i,
          label: `${i}日`
        })
      }
      return result
    },
    setMaxDate (val) {
      if (this.typeLength > 2) {
        this.options[2].maxLength = val
          ? new Date(new Date(val[0].value, val[1].value, 1) - 1).getDate()
          : 31
      }
    },
    updateSelect () {
      if (this.selected) {
        const date = new Date(0)
        const selected = this.selected.length ? this.selected[0] : this.selected
        date.setFullYear(selected.value)
        this.typeLength > 1 && date.setMonth(this.selected[1].value - 1)
        this.typeLength > 2 && date.setDate(this.selected[2].value)
        this.$emit('update:value', date)
        this.selectShow = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-datepicker__wrapper {
  .hl-datepicker {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 30px;
    cursor: pointer;

    .hl-datepicker__label {
      flex: auto;
      display: flex;
      align-items: center;
      width: 0;
      height: 100%;
      color: $textColor;
      @include label($textSize);
      @extend %text-overflow;
    }

    .hl-datepicker__placeholder {
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
}

.hl-datepicker__poper::v-deep .hl-dialog__body {
  padding: 30px !important;
}
</style>
