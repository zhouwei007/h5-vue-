<template>
  <div class="hl-content">
    <hl-calculator-card
      v-model="data"
      :options="options"
      :results="results"
      :init="initData"
      @submit="calculate"
    />
  </div>
</template>

<script>
import BS from 'common/bs'
import Utils from 'common/utils'
import HlCalculatorCard from './calculator-card'
import SETTING from '@/setting'
export default {
  name: 'calculatorCombinedLoan',
  components: {
    HlCalculatorCard
  },
  data () {
    return {
      data: {
        loanPeriods: 240,
        fundLoanAmount: '',
        fundLoanRate: '',
        loanAmount: '',
        loanBaseRate: 1,
        loanRate: ''
      },
      initData: {},
      results: [
        [{ label: '还款方式', type: 'title' }, { label: '每月等额还款', type: 'title' }, { label: '逐月递减还款', type: 'title' }],
        [{ label: '贷款总额(元)' }, { label: '', type: 'money' }, { label: '', type: 'money' }],
        [{ label: '首月还款(元)' }, { label: '', type: 'money' }, { label: '', type: 'money' }],
        [{ label: '总支付利息(元)' }, { label: '', type: 'money' }, { label: '', type: 'money' }],
        [{ label: '本息合计(元)' }, { label: '', type: 'money' }, { label: '', type: 'money' }]
      ],
      baseRates: [],
      fundBaseRates: [],
      loanPeriodsOptions: [],
      loanBaseRateOptions: []
    }
  },
  computed: {
    options () {
      return [{
        key: 'loanPeriods',
        label: '贷款期限',
        placeholder: '请选择贷款期限',
        options: this.loanPeriodsOptions
      }, {
        key: 'fundLoanAmount',
        label: '公积金贷金额',
        placeholder: '请输入公积金贷金额',
        validate: 'float',
        maxlength: 4,
        suffix: '万元'
      }, {
        key: 'fundLoanRate',
        label: '公积金贷利率',
        placeholder: '请输入公积金贷利率',
        validate: 'float',
        maxlength: 5,
        suffix: '%'
      }, {
        key: 'loanAmount',
        label: '商业贷款金额',
        placeholder: '请输入商业贷款金额',
        validate: 'float',
        maxlength: 4,
        suffix: '万元'
      }, {
        key: 'loanBaseRate',
        label: '商贷基准利率',
        placeholder: '请选择商贷基准利率',
        options: this.loanBaseRateOptions,
        required: false
      }, {
        key: 'loanRate',
        label: '商业贷款利率',
        placeholder: '请输入商业贷款利率',
        validate: 'float',
        maxlength: 5,
        suffix: '%'
      }]
    }
  },
  watch: {
    'data.loanPeriods' (val) {
      this.data.loanRate = this.getLoanRate(0, this.data.loanBaseRate, val)
      this.data.fundLoanRate = this.getLoanRate(2, this.data.loanBaseRate, val)
    },
    'data.loanBaseRate' (val) {
      this.data.loanRate = this.getLoanRate(0, val, this.data.loanPeriods)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.baseRates = await this.getBaseRate(0)
      this.fundBaseRates = await this.getBaseRate(2)
      this.loanPeriodsOptions = await BS.getOptions(SETTING.BS_COUNTER_LOAN_PERIODS_KEY)
      this.loanBaseRateOptions = await BS.getOptions(SETTING.BS_COUNTER_LOAN_RATE_KEY)
      if (this.loanBaseRateOptions && this.loanBaseRateOptions.length) {
        this.data.loanBaseRate = this.loanBaseRateOptions[0].value
      }
      this.data.fundLoanRate = this.getLoanRate(2, this.data.loanBaseRate, this.data.loanPeriods)
      this.$nextTick(() => {
        this.initData = Utils.deepClone(this.data)
      })
    },
    calculate (data) {
      const results = Utils.deepClone(this.results)
      const loanPeriods = Number(data.loanPeriods)
      const fundLoanAmount = data.fundLoanAmount * 1000000
      const fundLoanRate = Utils.percent2float(data.fundLoanRate) / 12
      const fundT = (1 + fundLoanRate) ** loanPeriods
      const fundMonthly = fundLoanAmount * fundLoanRate * fundT / (fundT - 1)
      const fundTotalAmount = loanPeriods * fundMonthly
      const loanAmount = data.loanAmount * 1000000
      const loanRate = Utils.percent2float(data.loanRate) / 12
      const t = (1 + loanRate) ** loanPeriods
      const monthly = loanAmount * loanRate * t / (t - 1)
      const totalAmount = loanPeriods * monthly
      results[1][1].label = loanAmount + fundLoanAmount
      results[2][1].label = monthly + fundMonthly
      results[3][1].label = totalAmount - loanAmount + fundTotalAmount - fundLoanAmount
      results[4][1].label = totalAmount + fundTotalAmount
      const fundInitialPayment = fundLoanAmount / loanPeriods + fundLoanAmount * fundLoanRate
      const fundInterest = (loanPeriods + 1) * fundLoanAmount * fundLoanRate / 2
      const initialPayment = loanAmount / loanPeriods + loanAmount * loanRate
      const interest = (loanPeriods + 1) * loanAmount * loanRate / 2
      results[1][2].label = loanAmount + fundLoanAmount
      results[2][2].label = initialPayment + fundInitialPayment
      results[3][2].label = interest + fundInterest
      results[4][2].label = interest + loanAmount + fundInterest + fundLoanAmount
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
    getLoanRate (mode, rate, periods) {
      rate = Number(mode === 2 ? 1 : rate) + (mode === 1 ? 0.1 : 0)
      periods = Number(periods)
      const baseRates = mode === 2 ? this.fundBaseRates : this.baseRates
      const baseRate = baseRates.find(item => periods >= item.min && periods <= item.max) || { value: 0 }
      return (baseRate.value * rate).toFixed(2)
    }
  }
}
</script>
