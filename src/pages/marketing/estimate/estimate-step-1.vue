<template>
  <div class="hl-content">
    <div class="hl-banner">
      <p class="hl-banner__title">房产证信息</p>
      <hl-upload
        v-model="data.propertyPicture"
        type="avatar"
        @change="handleImageChange"
      >
        <svg class="hl-pic"><use xlink:href="#hl-pic-ocr-property"></use></svg>
        <p class="hl-upload__label">
          请确保图片端正清晰<hl-button @click.stop="handleShowExample">查看样例</hl-button>
        </p>
        <div
          v-if="isOcrFail"
          slot="label"
          class="hl-upload__error"
        >
          证件识别失败，请手动输入或<span>重新上传</span>
        </div>
      </hl-upload>
    </div>

    <hl-form>
      <hl-form-item label="城市" required>
        <hl-select
          v-model="data.cityId"
          :options="cityOptions"
          placeholder="请选择城市"
        />
      </hl-form-item>
      <hl-form-item label="区县" required>
        <hl-input
          v-model="data.countyName"
          placeholder="请输入区县名称"
          :maxlength="20"
          clearable
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
          v-model="data.area"
          placeholder="请输入建筑面积"
          validate="float"
          :maxlength="8"
          clearable
        >
          <span slot="suffix">平米</span>
        </hl-input>
      </hl-form-item>
      <hl-form-item label="所在层数" required>
        <hl-input
          v-model="data.floor"
          placeholder="请输入房屋所在层数"
          validate="number"
          :maxlength="3"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="房屋总层数" required>
        <hl-input
          v-model="data.totalFloor"
          placeholder="请输入房屋总层数"
          validate="number"
          :maxlength="3"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="建成年限" required>
        <hl-datepicker
          v-model="data.buildYear"
          placeholder="请选择房屋建成年限"
          type="year"
          :default="buildYearEnd"
          :begin="buildYearBegin"
          :end="buildYearEnd"
        />
      </hl-form-item>
      <hl-form-item label="购买形式" required>
        <hl-select
          v-model="data.payType"
          placeholder="请选择购买形式"
          :options="payTypeOptions"
        />
      </hl-form-item>
      <hl-form-item v-if="Number(data.payType) === 2" label="待还本金" required>
        <hl-input
          v-model="data.mortgageBalance"
          placeholder="请输入待还本金"
          validate="money"
          :maxlength="10"
          clearable
        >
          <span slot="suffix">元</span>
        </hl-input>
      </hl-form-item>
    </hl-form>
    <hl-description><i class="hl-icon hl-icon-safe" />我们注重信息保护，不授权不对外提供</hl-description>

    <hl-button
      type="primary"
      :disabled="submitDisabled"
      @click="submit"
      @error="handleError"
    >
      下一步
    </hl-button>

    <hl-dialog
      :show.sync="dialogShow"
      :mask-close="false"
    >
      <p slot="header">请选择房产证类型</p>
      <ul class="hl-choose">
        <li class="hl-choose__item" @click="handleChooseType(1)">
          <svg class="hl-pic"><use xlink:href="#hl-pic-property-1"></use></svg>
          <span>不动产权证</span>
          <hl-checkbox :value="propertyType === 1" />
        </li>
        <li class="hl-choose__item" @click="handleChooseType(2)">
          <svg class="hl-pic"><use xlink:href="#hl-pic-property-2"></use></svg>
          <span>房地证</span>
          <hl-checkbox :value="propertyType === 2" />
        </li>
      </ul>
    </hl-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Bus, { EVENT } from 'common/bus'
import BS from 'common/bs'
import Utils from 'common/utils'
import Validate from 'common/validate'
import OcrApi from 'common/api/ocr'
import UserApi from 'common/api/user'
import QueryApi from 'common/api/query'
import Authenticate from '@/mixins/authenticate'
import Toast from '@/components/toast'
import Loading from '@/components/loading'
import Model from '@/components/model'
import HlUpload from '@/components/upload'
import HlInput from '@/components/input'
import HlSelect from '@/components/select'
import HlDatepicker from '@/components/datepicker'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlDescription from '@/components/description'
import HlButton from '@/components/button'
import HlDialog from '@/components/dialog'
import HlCheckbox from '@/components/checkbox'
import HlPropertyExample from './property-example'
import SETTING from '@/setting'
export default {
  name: 'HlEstimateStep1',
  components: {
    HlUpload,
    HlInput,
    HlSelect,
    HlDatepicker,
    HlForm,
    HlFormItem,
    HlDescription,
    HlButton,
    HlDialog,
    HlCheckbox
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
    const buildYearBegin = new Date()
    buildYearBegin.setFullYear(new Date().getFullYear() - 60)
    return {
      data: {
        propertyPicture: null,
        cityId: '120000',
        countyName: '',
        villageName: '',
        constructionId: '',
        buildingId: '',
        houseId: '',
        area: '',
        floor: '',
        totalFloor: '',
        buildYear: null,
        payType: 1,
        mortgageBalance: '',
        position: '',
        houseType: '',
        houseNature: '',
        ocrTaskId: null,
        estimateTimes: true
      },
      cityOptions: [],
      constructionOptions: [],
      buildingOptions: [],
      houseOptions: [],
      payTypeOptions: [],
      constructionPromise: null,
      buildingPromise: null,
      housePromise: null,
      buildYearBegin,
      buildYearEnd: new Date(),
      isOcrFail: false,
      dialogShow: false,
      isClearForm: false,
      propertyType: 0
    }
  },
  computed: {
    submitDisabled () {
      return !this.validateForm().result
    }
  },
  watch: {
    'data.cityId' (val) {
      this.debounceClearForm(1)
      val && this.data.villageName && this.debounceGetConstructions()
    },
    'data.villageName' (val) {
      this.debounceClearForm(1)
      this.data.cityId && val && this.debounceGetConstructions()
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
    this.init()
  },
  methods: {
    ...mapMutations({
      setHeaderBack: STORE_TYPES.SET_HEADER_BACK
    }),
    async init () {
      this.setHeaderBack({
        to: 'marketing'
      })
      this.data = { ...this.data, ...this.options }
      this.$hasAuthenticate && this.getEstimateTimes()
      this.cityOptions = await BS.getOptions(SETTING.BS_HOUSE_CITY_KEY, { zhSpell: 'tianjin' })
      this.payTypeOptions = await BS.getOptions(SETTING.BS_HOUSE_PAY_TYPE_KEY)
      this.$nextTick(() => {
        this.isClearForm = true
      })
    },
    async submit () {
      if (!this.$handleAuthenticate()) {
        return
      }
      try {
        const params = this.formatData(this.data)
        const response = await UserApi.submitPropertyInfo(params)
        this.data = {
          ...this.data,
          houseStatus: [0, 1].includes(response.code),
          houseOcrId: response.houseOcrId
        }
        this.goNext()
      } catch (err) {
        Utils.errorLog(err, 'SUBMIT-PROPERTY-INFO', false)
      }
    },
    handleImageChange (file) {
      if (!file) {
        return
      }
      this.propertyType = 0
      this.dialogShow = true
    },
    async handleChooseType (type) {
      this.propertyType = type
      this.dialogShow = false
      try {
        this.data.position = ''
        this.data.houseType = ''
        this.data.houseNature = ''
        const response = await OcrApi.house(this.data.propertyPicture, type)
        this.data.ocrTaskId = response.ocrTaskId
        if (response.status === 2) {
          const result = response.ocrResult
          const city = result.cityName ? this.cityOptions.find(item => item.label.includes(result.cityName)) : null
          const data = {
            cityId: city ? city.value : '120000',
            countyName: result.countyName || '',
            area: Number(result.area) || '',
            floor: Number(result.floor) || '',
            totalFloor: Number(result.totalFloor) || '',
            position: result.position || '',
            houseType: result.houseType || '',
            houseNature: result.houseNature || ''
          }
          this.data = { ...this.data, ...data }
          this.isOcrFail = false
        } else {
          this.isOcrFail = true
        }
      } catch (err) {
        this.isOcrFail = true
        Utils.errorLog(err, 'HOUSE-OCR', false)
      }
    },
    async getEstimateTimes () {
      if (this.data.houseOcrId) {
        return
      }
      try {
        const response = await UserApi.getEstimateTimes()
        if (typeof response === 'boolean') {
          this.data.estimateTimes = response
          !response && Toast.show('今日评估次数已达上限')
        }
      } catch (err) {
        Utils.errorLog(err, 'GET-ESTIMATE-TIMES')
      }
    },
    handleError () {
      const validateResult = this.validateForm()
      !validateResult.result && Toast.show(validateResult.message)
    },
    handleShowExample () {
      Model.show({
        title: '房产证样例',
        component: HlPropertyExample
      })
    },
    getConstructionList () {
      this.constructionPromise = new Promise(async resolve => {
        try {
          this.constructionOptions = await QueryApi.getConstructionList(
            this.data.cityId,
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
            const optionSelected = this[optionKey].find(item => {
              return String(item.id) === String(data[key]) || String(item.value) === String(data[key])
            })
            data[nameKey] = optionSelected ? optionSelected.name || optionSelected.label : null
          }
        }
      }
      return data
    },
    validateForm () {
      const rules = {
        estimateTimes: [{ boolean: true, message: '今日评估次数已达上限' }],
        cityId: [{ message: '请选择城市' }],
        countyName: [{ message: '请输入区县名称' }],
        villageName: [{ message: '请输入小区名称' }],
        constructionId: [{ message: '请选择楼盘' }],
        buildingId: [{ message: '请选择所属楼栋' }],
        houseId: [{ message: '请选择房号' }],
        area: [{ message: '请输入建筑面积' }],
        floor: [{ message: '请输入房屋所在层数' }],
        totalFloor: [{ message: '请输入房屋总层数' }],
        buildYear: [{ message: '请选择房屋建成年限' }],
        payType: [{ message: '请选择购买形式' }]
      }
      if (Number(this.data.payType) === 2) {
        rules.mortgageBalance = [{ message: '请输入待还本金' }]
      }
      return Validate.test(this.data, rules)
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
        construction: this.data.cityId
          ? (this.data.villageName ? '未查询到相关楼盘' : '请输入小区名称')
          : '请选择城市',
        building: this.data.constructionId ? '未查询到相关楼栋' : '请选择楼盘',
        house: this.data.buildingId ? '未查询到相关房号' : '请选择楼栋'
      }
      Toast.show(messageDict[type])
      return false
    },
    clearForm (step) {
      if (!this.isClearForm) {
        return
      }
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
    },
    goNext () {
      Bus.$emit(EVENT.ROUTE_ANIMATION, 'slide-left')
      this.$emit('next', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-upload__wrapper::v-deep {
    .hl-upload .hl-upload__button .hl-upload__label {
      position: relative;
      line-height: inherit;
      color: $subTitleColor;
      z-index: 1;
    }
  }
}

.hl-dialog__wrapper::v-deep {
  .hl-dialog.hl-dialog_default {
    width: 630px;

    .hl-dialog__header {
      margin: 40px;
      line-height: 48px;
      @include label($titleSize);
    }

    .hl-dialog__body {
      padding: 0 0 45px 0;
    }
  }

  .hl-choose {
    display: flex;
    justify-content: center;

    .hl-choose__item {
      display: flex;
      flex-direction: column;
      margin: 0 45px;
      text-align: center;
      cursor: pointer;

      .hl-pic {
        width: 170px;
        height: 210px;
      }

      span {
        display: block;
        margin: 20px 0;
        font-size: $textSize;
        line-height: 40px;
        color: $textColor;
      }

      .hl-checkbox {
        margin: auto;

        .hl-checkbox__input {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
