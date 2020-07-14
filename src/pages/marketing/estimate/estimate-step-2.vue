<template>
  <div class="hl-content">
    <div class="hl-banner">
      <p class="hl-banner__title">个人基本信息</p>
      <hl-upload
        v-model="data.cardIdPicture"
        type="avatar"
        @change="handleUpload"
      >
        <svg class="hl-pic"><use xlink:href="#hl-pic-ocr"></use></svg>
        <p class="hl-upload__label">
          请上传身份证照片
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
      <hl-form-item label="姓名" required>
        <hl-input
          v-model="data.name"
          placeholder="请输入姓名"
          validate="name"
          :maxlength="20"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="身份证号" required>
        <hl-input
          v-model="data.cardId"
          :maxlength="18"
          placeholder="请输入身份证号"
          uppercase
          clearable
        />
      </hl-form-item>
      <hl-form-item label="手机号码" required>
        <hl-input
          v-model="data.mobile"
          placeholder="请输入手机号码"
          validate="number"
          :maxlength="11"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="婚姻状况" required>
        <hl-select
          v-model="data.marStatus"
          :options="marriageOptions"
          placeholder="请选择婚姻状况"
        />
      </hl-form-item>
      <hl-form-item v-if="Number(data.marStatus) === 1" label="配偶姓名" required>
        <hl-input
          v-model="data.spouseName"
          placeholder="请输入配偶姓名"
          :maxlength="20"
          clearable
        />
      </hl-form-item>
      <hl-form-item v-if="Number(data.marStatus) === 1" label="配偶身份证号" required>
        <hl-input
          v-model="data.spouseCardId"
          :maxlength="18"
          placeholder="请输入配偶身份证号"
          uppercase
          clearable
        />
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
import Toast from '@/components/toast'
import HlUpload from '@/components/upload'
import HlInput from '@/components/input'
import HlSelect from '@/components/select'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlDescription from '@/components/description'
import HlButton from '@/components/button'
import SETTING from '@/setting'
export default {
  name: 'HlEstimateStep2',
  components: {
    HlUpload,
    HlInput,
    HlSelect,
    HlForm,
    HlFormItem,
    HlDescription,
    HlButton
  },
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
        cardIdPicture: null,
        name: '',
        cardId: '',
        mobile: '',
        marStatus: '',
        spouseName: null,
        spouseCardId: null
      },
      marriageOptions: [],
      isOcrFail: false
    }
  },
  computed: {
    submitDisabled () {
      return !this.validateForm().result
    }
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
        to: this.goPrev
      })
      this.data = { ...this.data, ...this.options }
      this.marriageOptions = await BS.getOptions(SETTING.BS_MARRIAGE_KEY)
    },
    async submit () {
      if (!this.data.houseStatus) {
        this.goNext()
        return
      }
      try {
        if (Number(this.data.marStatus) !== 1) {
          this.data.spouseName = null
          this.data.spouseCardId = null
        }
        const response = await UserApi.submitPersonalInfo(this.data)
        this.data = {
          ...this.data,
          userOcrId: response
        }
        this.goNext()
      } catch (err) {
        Utils.errorLog(err, 'SUBMIT-PROPERTY-INFO', false)
      }
    },
    async handleUpload (file) {
      if (!file) {
        return
      }
      try {
        const response = await OcrApi.idcard(file, true)
        if (response.status === 99) {
          this.isOcrFail = true
        } else {
          this.data.name = response.name
          this.data.cardId = response.id
          this.isOcrFail = false
        }
      } catch (err) {
        this.isOcrFail = true
        Utils.errorLog(err, 'IDCARD-OCR', false)
      }
    },
    handleError () {
      const validateResult = this.validateForm()
      !validateResult.result && Toast.show(validateResult.message)
    },
    validateForm () {
      const rules = {
        name: [{ message: '请输入姓名' }, { validator: 'name' }],
        cardId: [{ message: '请输入身份证号' }, { validator: 'idcard' }],
        mobile: [{ message: '请输入手机号码' }, { validator: 'mobile' }],
        marStatus: [{ message: '请选择婚姻状况' }]
      }
      if (Number(this.data.marStatus) === 1) {
        rules.spouseName = [{ message: '请输入配偶姓名' }]
        rules.spouseCardId = [{ message: '请输入配偶身份证号' }, { validator: 'idcard' }]
      }
      return Validate.test(this.data, rules)
    },
    goNext () {
      Bus.$emit(EVENT.ROUTE_ANIMATION, 'slide-left')
      this.$emit('next', this.data)
    },
    goPrev () {
      Bus.$emit(EVENT.ROUTE_ANIMATION, 'slide-right')
      this.$emit('prev', this.data)
    }
  }
}
</script>
