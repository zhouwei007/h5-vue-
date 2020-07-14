<template>
  <div class="hl-calculator-card">
    <div class="hl-calculator-card__body">
      <hl-form>
        <template v-for="(item, index) in options">
          <hl-form-item
            v-if="item.show !== false"
            :key="index"
            :label="item.label"
            :required="item.required"
          >
            <hl-select
              v-if="item.options"
              v-model="data[item.key]"
              :options="item.options"
              :placeholder="item.placeholder"
            />
            <hl-datepicker
              v-else-if="item.begin"
              v-model="data[item.key]"
              :type="item.type"
              :begin="item.begin"
              :end="item.end"
              :default="item.default"
              :placeholder="item.placeholder"
            />
            <hl-input
              v-else
              v-model="data[item.key]"
              :placeholder="item.placeholder"
              :validate="item.validate"
              :maxlength="item.maxlength"
              clearable
            >
              <span v-if="item.suffix" slot="suffix">{{ item.suffix }}</span>
            </hl-input>
          </hl-form-item>
        </template>
      </hl-form>
      <hl-button-group>
        <hl-button @click="reset">重置</hl-button>
        <hl-button type="primary" @click="submit">计算</hl-button>
      </hl-button-group>
    </div>
    <div v-if="resultShow && show" class="hl-calculator-card__result">
      <p class="hl-calculator-card__title">计算结果</p>
      <table class="hl-calculator-card__table">
        <tbody>
          <tr
            v-for="(result, row) in results"
            :key="row"
          >
            <template
              v-for="(item, colume) in result"
            >
              <th v-if="item.type === 'title'" :key="colume">{{ item.label }}</th>
              <td v-else-if="item.type === 'money'" :key="colume">{{ item.label | money }}</td>
              <td v-else-if="item.type === 'month'" :key="colume">{{ item.label }}个月</td>
              <td v-else :key="colume">{{ item.label }}</td>
            </template>
          </tr>
        </tbody>
      </table>
      <slot></slot>
      <em class="hl-calculator-card__footer">*此结果仅供参考</em>
    </div>
  </div>
</template>

<script>
import Utils from 'common/utils'
import Validate from 'common/validate'
import Toast from '@/components/toast'
import HlInput from '@/components/input'
import HlSelect from '@/components/select'
import HlDatepicker from '@/components/datepicker'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlButton from '@/components/button'
import HlButtonGroup from '@/components/button-group'
export default {
  name: 'HlCalculatorCard',
  components: {
    HlInput,
    HlSelect,
    HlDatepicker,
    HlForm,
    HlFormItem,
    HlButton,
    HlButtonGroup
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    init: {
      type: Object,
      default () {
        return null
      }
    },
    options: {
      type: Array,
      default () {
        return []
      }
    },
    results: {
      type: Array,
      default () {
        return []
      }
    },
    resultShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      data: {},
      initData: {},
      show: false
    }
  },
  watch: {
    value: {
      handler (val) {
        this.data = val
      },
      immediate: true,
      deep: true
    },
    data: {
      handler (val) {
        this.$emit('update:value', val)
      },
      deep: true
    }
  },
  mounted () {
    this.initData = Utils.deepClone(this.data)
  },
  methods: {
    submit () {
      if (this.validate(this.data)) {
        this.show = true
        this.$emit('submit', this.data)
      }
    },
    reset () {
      this.data = Utils.deepClone(this.init || this.initData)
    },
    validate (data) {
      const validateResult = Validate.test(data, this.options.reduce((result, item) => {
        if (item.show !== false) {
          result[item.key] = [{ required: item.required, message: item.placeholder }]
        }
        return result
      }, {}))
      !validateResult.result && Toast.show(validateResult.message)
      return validateResult.result
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-calculator-card {
  margin: 30px;
  background-color: $blockColor;
  border-radius: $cardRadius;

  .hl-calculator-card__body {
    overflow: hidden;

    .hl-form {
      .hl-form-item::v-deep {
        padding-left: 40px;
        padding-right: 40px;

        .hl-form-item__content {
          padding-right: 0;
        }

        .hl-input .hl-input__suffix {
          margin: 0 8px;
          font-size: $descriptionSize;
          color: $descriptionColor;
        }
      }
    }

    .hl-button-group {
      margin: 60px 40px;

      .hl-button {
        height: 90px;
        line-height: 90px;
      }
    }
  }

  .hl-calculator-card__result {
    position: relative;
    margin: 0 40px;
    padding: 50px 0;
    border-top: 4px dotted $cardSplitBorderColor;

    &::before,
    &::after  {
      content: '';
      position: absolute;
      display: block;
      top: -18px;
      width: 32px;
      height: 32px;
      background-color: $mainColor;
      border-radius: 50%;
    }

    &::before {
      left: -56px;
    }

    &::after {
      right: -56px;
    }

    .hl-calculator-card__title {
      margin-top: 6px;
      margin-bottom: 40px;
      font-size: $titleSize;
      font-weight: 500;
      line-height: 48px;
      text-align: center;
      color: $textColor;
    }

    .hl-calculator-card__table {
      width: 100%;
      margin: 20px 0;
      border: $tableBorder;
      table-layout : fixed;

      thead tr,
      tbody tr {
        border-bottom: $tableBorder;

        th {
          background-color: $tableHeaderColor;
        }

        th, td {
          font-size: $descriptionSize;
          line-height: 75px;
          text-align: right;
          letter-spacing: 0;
          @extend %text-overflow;
        }

        th:first-child,
        td:first-child {
          padding-left: 20px;
          text-align: left;
        }

        th:last-child,
        td:last-child {
          padding-right: 20px;
        }
      }

      tbody tr:last-child {
        border-bottom: none;
      }
    }

    span {
      display: block;
      margin-top: 40px;
      margin-bottom: 20px;
      font-size: $quoteSize;
      line-height: 33px;
      color: $subTitleColor;
    }

    .hl-calculator-card__footer {
      font-size: $quoteSize;
      line-height: 33px;
      color: $placeholderColor;
    }
  }
}
</style>
