<template>
  <div class="hl-content">
    <hl-calculator-card
      v-model="data"
      :options="options"
      :results="results"
      @submit="calculate"
    />
  </div>
</template>

<script>
import Utils from 'common/utils'
import HlCalculatorCard from './calculator-card'
export default {
  name: 'calculatorHouseTax',
  components: {
    HlCalculatorCard
  },
  data () {
    return {
      data: {
        unitPrice: '',
        buildingArea: '',
        elevator: 1
      },
      results: [
        [{ label: '房款总价(元)' }, { label: '', type: 'money' }],
        [{ label: '契税(元)' }, { label: '', type: 'money' }],
        [{ label: '合同印花税(元)' }, { label: '', type: 'money' }],
        [{ label: '权属登记费(元)' }, { label: '', type: 'money' }],
        [{ label: '大修基金(元)' }, { label: '', type: 'money' }]
      ]
    }
  },
  computed: {
    options () {
      return [{
        key: 'unitPrice',
        label: '房屋单价',
        placeholder: '请输入房屋单价',
        validate: 'number',
        maxlength: 6,
        suffix: '元/平'
      }, {
        key: 'buildingArea',
        label: '房屋面积',
        placeholder: '请输入房屋面积',
        validate: 'number',
        maxlength: 4,
        suffix: '平米'
      }, {
        key: 'elevator',
        label: '是否含电梯',
        placeholder: '请选择是否含电梯',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ]
      }]
    }
  },
  methods: {
    calculate (data) {
      const results = Utils.deepClone(this.results)
      const buildingArea = Number(data.buildingArea)
      const houseAmount = data.unitPrice * 100 * buildingArea
      let rate
      if (buildingArea > 144) {
        rate = 0.03
      } else if (buildingArea < 90) {
        rate = 0.01
      } else {
        rate = 0.015
      }
      const repairRate = data.elevator === 1 ? 0.03 : 0.02
      results[0][1].label = houseAmount
      results[1][1].label = houseAmount * rate
      results[2][1].label = houseAmount * 0.0005
      results[3][1].label = 8000
      results[4][1].label = houseAmount * repairRate
      this.results = results
    }
  }
}
</script>
