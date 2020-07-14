<template>
  <div class="hl-content">
    <hl-calculator-card
      v-model="data"
      :options="options"
      :results="results"
      :init="initData"
      @submit="calculate"
    >
      <span v-if="type === 'capital'">等额本金还款计算器（每月偿还本金相同，月还款总额逐月递减），将帮助用户计算在不同的借款期限、不同的贷款利息下，采用等额本息还款方式时，需要支付的月供、利息总额和还款总额。</span>
      <span v-if="type === 'installmen'">等额本息还款计算器（每月还款额相同），将帮助用户计算在不同的借款期限、不同的贷款利息下，采用等额本息还款方式时，需要支付的月供、利息总额和还款总额。</span>
    </hl-calculator-card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import BS from 'common/bs'
import Utils from 'common/utils'
import HlCalculatorCard from './calculator-card'
import SETTING from '@/setting'
export default {
  name: 'calculatorRepaymentMode',
  components: {
    HlCalculatorCard
  },
  data () {
    return {
      type: 'mode',
      data: {
        loanAmount: '',
        loanPeriods: 240,
        loanBaseRate: 1,
        loanRate: ''
      },
      initData: {},
      results: [],
      baseRates: [],
      loanPeriodsOptions: [],
      loanBaseRateOptions: []
    }
  },
  computed: {
    options () {
      return [{
        key: 'loanAmount',
        label: '贷款金额',
        placeholder: '请输入贷款金额',
        validate: 'float',
        maxlength: 4,
        suffix: '万元'
      }, {
        key: 'loanPeriods',
        label: '贷款期限',
        placeholder: '请选择贷款期限',
        options: this.loanPeriodsOptions
      }, {
        key: 'loanBaseRate',
        label: '基准利率',
        placeholder: '请选择基准利率',
        options: this.loanBaseRateOptions,
        required: false
      }, {
        key: 'loanRate',
        label: '贷款利率',
        placeholder: '请输入贷款利率',
        validate: 'float',
        maxlength: 5,
        suffix: '%'
      }]
    }
  },
  watch: {
    'data.loanPeriods' (val) {
      this.data.loanRate = this.getLoanRate(this.data.loanBaseRate, val)
    },
    'data.loanBaseRate' (val) {
      this.data.loanRate = this.getLoanRate(val, this.data.loanPeriods)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations({
      setTitle: STORE_TYPES.SET_TITLE
    }),
    async init () {
      this.type = this.$route.query.type
      if (this.type === 'capital') {
        this.setTitle('等额本金')
        this.results = [
          [{ label: '贷款总额(元)', type: 'title' }, { label: '', type: 'money' }],
          [{ label: '还款月数', type: 'title' }, { label: '', type: 'month' }],
          [{ label: '首月还款(元)', type: 'title' }, { label: '', type: 'money' }],
          [{ label: '总支付利息(元)', type: 'title' }, { label: '', type: 'money' }],
          [{ label: '本息合计(元)', type: 'title' }, { label: '', type: 'money' }]
        ]
      } else if (this.type === 'installmen') {
        this.setTitle('等额本息')
        this.results = [
          [{ label: '贷款总额(元)', type: 'title' }, { label: '', type: 'money' }],
          [{ label: '还款月数', type: 'title' }, { label: '', type: 'month' }],
          [{ label: '每月还款(元)', type: 'title' }, { label: '', type: 'money' }],
          [{ label: '总支付利息(元)', type: 'title' }, { label: '', type: 'money' }],
          [{ label: '本息合计(元)', type: 'title' }, { label: '', type: 'money' }]
        ]
      } else {
        this.results = [
          [{ label: '还款方式', type: 'title' }, { label: '等额本金', type: 'title' }, { label: '等额本息', type: 'title' }],
          [{ label: '贷款总额(元)' }, { label: '', type: 'money' }, { label: '', type: 'money' }],
          [{ label: '首月还款(元)' }, { label: '', type: 'money' }, { label: '', type: 'money' }],
          [{ label: '总支付利息(元)' }, { label: '', type: 'money' }, { label: '', type: 'money' }],
          [{ label: '本息合计(元)' }, { label: '', type: 'money' }, { label: '', type: 'money' }]
        ]
      }
      this.baseRates = await this.getBaseRate()
      this.loanPeriodsOptions = await BS.getOptions(SETTING.BS_COUNTER_LOAN_PERIODS_KEY)
      this.loanBaseRateOptions = await BS.getOptions(SETTING.BS_COUNTER_LOAN_RATE_KEY)
      if (this.loanBaseRateOptions && this.loanBaseRateOptions.length) {
        this.data.loanBaseRate = this.loanBaseRateOptions[0].value
      }
      this.$nextTick(() => {
        this.initData = Utils.deepClone(this.data)
      })
    },
    calculate (data) {
      const results = Utils.deepClone(this.results)
      const loanAmount = data.loanAmount * 1000000
      const loanRate = Utils.percent2float(data.loanRate) / 12
      const loanPeriods = Number(data.loanPeriods)
      let initialPayment, interest, monthly, totalAmount
      if (this.type !== 'installmen') {
        initialPayment = loanAmount / loanPeriods + loanAmount * loanRate
        interest = (loanPeriods + 1) * loanAmount * loanRate / 2
      }
      if (this.type !== 'capital') {
        const t = (1 + loanRate) ** loanPeriods
        monthly = loanAmount * loanRate * t / (t - 1)
        totalAmount = loanPeriods * monthly
      }
      if (this.type === 'capital') {
        results[0][1].label = loanAmount
        results[1][1].label = loanPeriods
        results[2][1].label = initialPayment
        results[3][1].label = interest
        results[4][1].label = interest + loanAmount
      } else if (this.type === 'installmen') {
        results[0][1].label = loanAmount
        results[1][1].label = loanPeriods
        results[2][1].label = monthly
        results[3][1].label = totalAmount - loanAmount
        results[4][1].label = totalAmount
      } else {
        results[1][1].label = loanAmount
        results[2][1].label = initialPayment
        results[3][1].label = interest
        results[4][1].label = interest + loanAmount
        results[1][2].label = loanAmount
        results[2][2].label = monthly
        results[3][2].label = totalAmount - loanAmount
        results[4][2].label = totalAmount
      }
      this.results = results
    },
    async getBaseRate (mode = 0) {
      let baseRates = await BS.getOptions(SETTING.BS_COUNTER_BASE_RATE_KEY, { sn: mode === 2 ? 2 : 1 })
      return baseRates.map(item => {
        const arr = item.label.split('_')
        return {
          min: Number(arr[0]),
          max: Number(arr[1]),
          value: Number(item.value)
        }
      })
    },
    getLoanRate (rate, periods) {
      rate = Number(rate)
      periods = Number(periods)
      const baseRate = this.baseRates.find(item => periods >= item.min && periods <= item.max) || { value: 0 }
      return (baseRate.value * rate).toFixed(2)
    }
  }
}
</script>
