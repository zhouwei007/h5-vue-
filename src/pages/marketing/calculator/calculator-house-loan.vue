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
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import BS from 'common/bs'
import Utils from 'common/utils'
import HlCalculatorCard from './calculator-card'
import SETTING from '@/setting'
export default {
  name: 'calculatorHouseLoan',
  components: {
    HlCalculatorCard
  },
  data () {
    return {
      data: {
        loanMode: 0,
        calculateMode: 0,
        loanAmount: '',
        unitPrice: '',
        buildingArea: '',
        loanRatio: '',
        loanPeriods: 240,
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
      loanPeriodsOptions: [],
      loanBaseRateOptions: []
    }
  },
  computed: {
    options () {
      const showAmount = this.data.calculateMode !== 1
      const showBaseRate = this.data.loanMode !== 2
      return [{
        key: 'loanMode',
        label: '贷款类型',
        placeholder: '请选择贷款类型',
        options: [
          { label: '商业贷款', value: 0 },
          { label: '二手房贷款', value: 1 },
          { label: '公积金贷款', value: 2 }
        ]
      }, {
        key: 'calculateMode',
        label: '计算方式',
        placeholder: '请选择计算方式',
        options: [
          { label: '按贷款额度', value: 0 },
          { label: '按面积、单价计算', value: 1 }
        ]
      }, {
        key: 'loanAmount',
        label: '贷款金额',
        placeholder: '请输入贷款金额',
        validate: 'float',
        maxlength: 4,
        suffix: '万元',
        show: showAmount
      }, {
        key: 'unitPrice',
        label: '房屋单价',
        placeholder: '请输入房屋单价',
        validate: 'number',
        maxlength: 15,
        suffix: '元/平',
        show: !showAmount
      }, {
        key: 'buildingArea',
        label: '房屋面积',
        placeholder: '请输入房屋面积',
        validate: 'number',
        maxlength: 4,
        suffix: '平米',
        show: !showAmount
      }, {
        key: 'loanRatio',
        label: '按揭成数',
        placeholder: '请选择计算方式',
        options: [
          { label: '8成', value: 0.8 },
          { label: '7成', value: 0.7 },
          { label: '6成', value: 0.6 },
          { label: '5成', value: 0.5 },
          { label: '4成', value: 0.4 },
          { label: '3成', value: 0.3 },
          { label: '2成', value: 0.2 }
        ],
        show: !showAmount
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
        required: false,
        show: showBaseRate
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
    async 'data.loanMode' (val) {
      this.baseRates = await this.getBaseRate(val)
      this.data.loanRate = this.getLoanRate(val, this.data.loanBaseRate, this.data.loanPeriods)
    },
    'data.loanPeriods' (val) {
      this.data.loanRate = this.getLoanRate(this.data.loanMode, this.data.loanBaseRate, val)
    },
    'data.loanBaseRate' (val) {
      this.data.loanRate = this.getLoanRate(this.data.loanMode, val, this.data.loanPeriods)
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
      const type = this.$route.query.type
      if (type === 'house') {
        this.data.calculateMode = 1
      } else if (type === 'second') {
        this.setTitle('二手房贷款')
        this.data.loanMode = 1
      } else if (type === 'fund') {
        this.setTitle('公积金贷款')
        this.data.loanMode = 2
      } else if (type === 'commercial') {
        this.setTitle('商业贷款')
      }
      this.baseRates = await this.getBaseRate(this.data.loanMode)
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
      const loanAmount = data.calculateMode === 0
        ? data.loanAmount * 1000000
        : Number((data.unitPrice * 100 * data.buildingArea * data.loanRatio).toFixed(2))
      const loanRate = Utils.percent2float(data.loanRate) / 12
      const loanPeriods = Number(data.loanPeriods)
      const t = (1 + loanRate) ** loanPeriods
      const monthly = loanAmount * loanRate * t / (t - 1)
      const totalAmount = loanPeriods * monthly
      results[1][1].label = loanAmount
      results[2][1].label = monthly
      results[3][1].label = totalAmount - loanAmount
      results[4][1].label = totalAmount
      const initialPayment = loanAmount / loanPeriods + loanAmount * loanRate
      const interest = (loanPeriods + 1) * loanAmount * loanRate / 2
      results[1][2].label = loanAmount
      results[2][2].label = initialPayment
      results[3][2].label = interest
      results[4][2].label = interest + loanAmount
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
      const baseRate = this.baseRates.find(item => periods >= item.min && periods <= item.max) || { value: 0 }
      return (baseRate.value * rate).toFixed(2)
    }
  }
}
</script>
