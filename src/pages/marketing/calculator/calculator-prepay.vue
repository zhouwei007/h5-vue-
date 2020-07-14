<template>
  <div class="hl-content">
    <hl-calculator-card
      v-model="data"
      :options="options"
      :results="results"
      :result-show="resultShow"
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
import Toast from '@/components/toast'
import HlCalculatorCard from './calculator-card'
import SETTING from '@/setting'
export default {
  name: 'calculatorPrepay',
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
        loanRate: '',
        firstRepayTime: null,
        prepayTime: null,
        prepayMode: 1,
        prepayAmount: '',
        disposition: 0
      },
      resultShow: false,
      initData: {},
      results: [
        [{ label: '原月还款额(元)', type: 'title' }, { label: '', type: 'money' }],
        [{ label: '原最后还款日期', type: 'title' }, { label: '' }],
        [{ label: '已还款总额(元)', type: 'title' }, { label: '', type: 'money' }],
        [{ label: '已还利息额(元)', type: 'title' }, { label: '', type: 'money' }],
        [{ label: '该月一次还款额(元)', type: 'title' }, { label: '', type: 'money' }],
        [{ label: '下月起月还款额(元)', type: 'title' }, { label: '', type: 'money' }],
        [{ label: '节省利息支出(元)', type: 'title' }, { label: '', type: 'money' }],
        [{ label: '新最后还款日期', type: 'title' }, { label: '' }]
      ],
      baseRates: [],
      loanPeriodsOptions: [],
      loanBaseRateOptions: []
    }
  },
  computed: {
    options () {
      const begin = new Date('2000-01-01')
      const end = new Date('2060-12-01')
      const now = new Date()
      const isPrepayAll = this.data.prepayMode === 0
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
      }, {
        key: 'firstRepayTime',
        label: '首次还款时间',
        placeholder: '请选择首次还款时间',
        type: 'month',
        begin,
        end: now
      }, {
        key: 'prepayTime',
        label: '提前还款时间',
        placeholder: '请选择提前还款时间',
        type: 'month',
        begin,
        end
      }, {
        key: 'prepayMode',
        label: '提前还款方式',
        placeholder: '请选择提前还款方式',
        options: [
          { label: '一次性还清', value: 0 },
          { label: '部分提前还款', value: 1 }
        ]
      }, {
        key: 'prepayAmount',
        label: '提前还款金额',
        placeholder: '请输入提前还款金额',
        validate: 'float',
        maxlength: 4,
        suffix: '万元',
        show: !isPrepayAll
      }, {
        key: 'disposition',
        label: '处理方式',
        placeholder: '请选择处理方式',
        options: [
          { label: '月供基本不变', value: 0 },
          { label: '还款期限不变', value: 1 }
        ],
        show: !isPrepayAll
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
      const loanPeriods = Number(data.loanPeriods)
      const loanRate = Utils.percent2float(data.loanRate) / 12
      const startMonth = data.firstRepayTime.getFullYear() * 12 + data.firstRepayTime.getMonth() + 1
      const prepayMonth = data.prepayTime.getFullYear() * 12 + data.prepayTime.getMonth() + 1
      const paidPeriods = prepayMonth - startMonth
      if (paidPeriods < 0 || paidPeriods > loanPeriods) {
        Toast.show('请输入正确的首次还款时间与提前还款时间')
        return
      }
      const t = (1 + loanRate) ** loanPeriods
      const monthly = loanAmount * loanRate * t / (t - 1)
      const paidAmount = paidPeriods * monthly
      const originalEndTime = `${Math.floor((startMonth + loanPeriods - 2) / 12)}年${(startMonth + loanPeriods - 2) % 12 + 1}月`
      let paidInterest = 0
      let paidCapital = 0
      let repayAmountMonth, currentPeriods, currentMonthly, currentEndTime, savingInterest
      for (let i = 0; i < paidPeriods; i++) {
        const interest = (loanAmount - paidCapital) * loanRate
        paidInterest += interest
        paidCapital += monthly - interest
      }
      let isPrepayAll = false
      if (data.prepayMode === 1) {
        const prepayAmount = data.prepayAmount * 1000000
        if (prepayAmount + monthly >= (loanAmount - paidCapital) * (1 + loanRate)) {
          isPrepayAll = true
          Toast.show('提前还款额已足够还清所欠贷款')
        } else {
          paidCapital += monthly
          repayAmountMonth = monthly + prepayAmount
          if (data.disposition === 0) {
            let temp = paidCapital + prepayAmount
            for (currentPeriods = 0; temp <= loanAmount; currentPeriods++) {
              temp += monthly - (loanAmount - temp) * loanRate
            }
            currentPeriods--
            const currentT = (1 + loanRate) ** currentPeriods
            currentMonthly = (loanAmount - paidCapital - prepayAmount) * loanRate * currentT / (currentT - 1)
            savingInterest = monthly * loanPeriods - paidAmount - repayAmountMonth - currentMonthly * currentPeriods
            currentEndTime = `${Math.floor((prepayMonth + currentPeriods - 2) / 12)}年${(prepayMonth + currentPeriods - 2) % 12 + 1}月`
          } else {
            const currentT = (1 + loanRate) ** (loanPeriods - paidPeriods)
            currentMonthly = (loanAmount - paidCapital - prepayAmount) * loanRate * currentT / (currentT - 1)
            savingInterest = monthly * loanPeriods - paidAmount - repayAmountMonth - currentMonthly * (loanPeriods - paidPeriods)
            currentEndTime = originalEndTime
          }
        }
      }
      if (data.prepayMode === 0 || isPrepayAll) {
        repayAmountMonth = (loanAmount - paidCapital) * (1 + loanRate)
        currentMonthly = 0
        savingInterest = monthly * loanPeriods - paidAmount - repayAmountMonth
        currentEndTime = `${data.prepayTime.getFullYear()}年${data.prepayTime.getMonth() + 1}月`
      }
      results[0][1].label = monthly
      results[1][1].label = originalEndTime
      results[2][1].label = paidAmount
      results[3][1].label = paidInterest
      results[4][1].label = repayAmountMonth
      results[5][1].label = currentMonthly
      results[6][1].label = savingInterest
      results[7][1].label = currentEndTime
      this.resultShow = true
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
