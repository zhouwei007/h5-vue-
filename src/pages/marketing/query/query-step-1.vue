<template>
  <div class="hl-content">
    <hl-form>
      <hl-form-item label="城市" required>
        <hl-select
          v-model="data.areaCode"
          :options="cityOptions"
          placeholder="请选择城市"
        />
      </hl-form-item>
      <hl-form-item label="小区名称" required>
        <hl-input
          v-model="data.villageName"
          placeholder="请输入小区名称"
          :maxlength="10"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="选择楼盘" required>
        <hl-select
          v-model="data.constructionId"
          placeholder="请选择楼盘"
          label-key="name"
          value-key="id"
          :options="constructionOptions"
          :before-open="validateOption.bind(this, 'construction')"
        />
      </hl-form-item>
      <hl-form-item label="所属楼栋" required>
        <hl-select
          v-model="data.buildingId"
          placeholder="请选择所属楼栋"
          label-key="name"
          value-key="id"
          :options="buildingOptions"
          :before-open="validateOption.bind(this, 'building')"
        />
      </hl-form-item>
      <hl-form-item label="房号" required>
        <hl-select
          v-model="data.houseId"
          placeholder="请选择房号"
          label-key="name"
          value-key="id"
          :options="houseOptions"
          :before-open="validateOption.bind(this, 'house')"
        />
      </hl-form-item>
      <hl-form-item label="建筑面积" required>
        <hl-input
          v-model="data.houseSize"
          placeholder="请输入建筑面积"
          validate="number"
          :maxlength="4"
          clearable
        >
          <span slot="suffix">平米</span>
        </hl-input>
      </hl-form-item>
    </hl-form>

    <hl-button
      type="primary"
      :disabled="submitDisabled"
      @click="submit"
      @error="handleError"
    >
      开始询值
    </hl-button>
  </div>
</template>

<script>
import BS from 'common/bs'
import Utils from 'common/utils'
import Validate from 'common/validate'
import QueryApi from 'common/api/query'
import Authenticate from '@/mixins/authenticate'
import Toast from '@/components/toast'
import Loading from '@/components/loading'
import HlInput from '@/components/input'
import HlSelect from '@/components/select'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlButton from '@/components/button'
import SETTING from '@/setting'
export default {
  name: 'HlQueryStep1',
  components: {
    HlInput,
    HlSelect,
    HlForm,
    HlFormItem,
    HlButton
  },
  mixins: [Authenticate],
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      data: {
        areaCode: '',
        villageName: '',
        constructionId: '',
        buildingId: '',
        houseId: '',
        houseSize: '',
        queryTimes: true
      },
      cityOptions: [],
      constructionOptions: [],
      buildingOptions: [],
      houseOptions: [],
      constructionPromise: null,
      buildingPromise: null,
      housePromise: null,
      queryTimesMessage: ''
    }
  },
  computed: {
    submitDisabled () {
      return !this.validateForm().result
    }
  },
  watch: {
    'data.areaCode' (val) {
      this.debounceClearForm(1)
      val && this.data.villageName && this.debounceGetConstructions()
    },
    'data.villageName' (val) {
      this.debounceClearForm(1)
      this.data.areaCode && val && this.debounceGetConstructions()
    },
    'data.constructionId' (val) {
      this.debounceClearForm(2)
      val && this.debounceGetBuilding()
    },
    'data.buildingId' (val) {
      this.debounceClearForm(3)
      val && this.debounceGetHouse()
    }
  },
  created () {
    const debounceTime = 500
    this.debounceClearForm = Utils.debounce(debounceTime, true, this.clearForm)
    this.debounceGetConstructions = Utils.debounce(debounceTime, true, this.getConstructionList)
    this.debounceGetBuilding = Utils.debounce(debounceTime, true, this.getBuildingList)
    this.debounceGetHouse = Utils.debounce(debounceTime, true, this.getHouseList)
  },
  mounted () {
    this.data = { ...this.data, ...this.options }
    this.init()
  },
  methods: {
    async init () {
      this.$hasAuthenticate && this.getQueryTimes()
      this.cityOptions = await BS.getOptions(SETTING.BS_HOUSE_CITY_KEY)
    },
    async submit () {
      if (!this.$handleAuthenticate()) {
        return
      }
      try {
        const params = this.formatData(this.data)
        const response = await QueryApi.query(params)
        this.data = response.code === 1 && response.data.averagePrice ? {
          ...params,
          totalPrice: Math.round(response.data.totalPrice / 1000000),
          averagePrice: response.data.averagePrice,
          status: response.code,
          requestId: ''
        } : {
          ...params,
          status: response.code === 0 ? 0 : 2,
          requestId: response.requestId
        }
        this.$emit('next', this.data)
      } catch (err) {
        Utils.errorLog(err, 'QUERY')
      }
    },
    handleError () {
      const validateResult = this.validateForm()
      !validateResult.result && Toast.show(validateResult.message)
    },
    async getQueryTimes () {
      try {
        await QueryApi.getQueryTimes()
      } catch (err) {
        this.data.queryTimes = false
        this.queryTimesMessage = err.message
        Toast.show(this.queryTimesMessage)
      }
    },
    getConstructionList () {
      this.constructionPromise = new Promise(async resolve => {
        try {
          this.constructionOptions = await QueryApi.getConstructionList(
            this.data.areaCode,
            this.data.villageName
          )
        } catch (err) {
          Utils.errorLog(err, 'GET-CONSTRUCTION-LIST')
        } finally {
          resolve()
        }
      })
    },
    getBuildingList () {
      this.buildingPromise = new Promise(async resolve => {
        try {
          this.buildingOptions = await QueryApi.getBuildingList(this.data.constructionId)
        } catch (err) {
          Utils.errorLog(err, 'GET-BUILDING-LIST')
        } finally {
          resolve()
        }
      })
    },
    getHouseList () {
      this.housePromise = new Promise(async resolve => {
        try {
          this.houseOptions = await QueryApi.getHouseList(this.data.buildingId)
        } catch (err) {
          Utils.errorLog(err, 'GET-HOUSE-LIST')
        } finally {
          resolve()
        }
      })
    },
    formatData (obj) {
      const data = Utils.deepClone(obj)
      for (const key of Object.keys(data)) {
        if (key.endsWith('Id')) {
          const nameKey = key.replace('Id', 'Name')
          const optionKey = key.replace('Id', 'Options')
          if (this[optionKey]) {
            const optionSelected = this[optionKey].find(item => String(item.id) === String(data[key]))
            data[nameKey] = optionSelected ? optionSelected.name : null
          }
        }
      }
      return data
    },
    validateForm () {
      return Validate.test(this.data, {
        queryTimes: [{ boolean: true, message: this.queryTimesMessage }],
        areaCode: [{ message: '请选择城市' }],
        villageName: [{ message: '请输入小区名称' }],
        constructionId: [{ message: '请选择楼盘' }],
        buildingId: [{ message: '请选择所属楼栋' }],
        houseId: [{ message: '请选择房号' }],
        houseSize: [{ message: '请输入建筑面积' }]
      })
    },
    async validateOption (type) {
      const optionPromise = this[`${type}Promise`]
      if (optionPromise) {
        Loading.open()
        await optionPromise
        Loading.close()
      }
      const option = this[`${type}Options`]
      if (option.length) {
        return true
      }
      const messageDict = {
        construction: this.data.areaCode
          ? (this.data.villageName ? '未查询到相关楼盘' : '请输入小区名称')
          : '请选择城市',
        building: this.data.constructionId ? '未查询到相关楼栋' : '请选择楼盘',
        house: this.data.buildingId ? '未查询到相关房号' : '请选择楼栋'
      }
      Toast.show(messageDict[type])
      return false
    },
    clearForm (step) {
      if (step < 2) {
        this.constructionOptions = []
        this.data.constructionId = ''
      }
      if (step < 3) {
        this.buildingOptions = []
        this.data.buildingId = ''
      }
      this.houseOptions = []
      this.data.houseId = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-form {
    .hl-input::v-deep .hl-input__suffix {
      margin: 0 8px;
      font-size: $descriptionSize;
      color: $descriptionColor;
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 60px;
  }
}
</style>
