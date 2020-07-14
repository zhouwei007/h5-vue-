<template>
  <div class="hl-content">
    <div class="hl-banner">
      <p class="hl-banner__title">个人征信报告</p>
      <hl-upload
        v-model="data.creditPicture"
        type="avatar"
        @change="handleUpload"
      >
        <svg class="hl-pic"><use xlink:href="#hl-pic-ocr-credit"></use></svg>
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
      <hl-form-item label="未结清贷款余额" required>
        <hl-input
          v-model="data.balance"
          placeholder="请输入余额"
          validate="number"
          :maxlength="10"
          clearable
        >
          <span slot="suffix">元</span>
        </hl-input>
      </hl-form-item>
      <hl-form-item label="授信总额" required>
        <hl-input
          v-model="data.total"
          placeholder="请输入授信总额"
          validate="number"
          :maxlength="10"
          clearable
        >
          <span slot="suffix">元</span>
        </hl-input>
      </hl-form-item>
      <hl-form-item label="已用额度" required>
        <hl-input
          v-model="data.used"
          placeholder="请输入已用额度"
          validate="number"
          :maxlength="10"
          clearable
        >
          <span slot="suffix">元</span>
        </hl-input>
      </hl-form-item>
      <hl-form-item label="近六个月平均使用额度" required>
        <hl-input
          v-model="data.avg6"
          placeholder="请输入使用额度"
          validate="number"
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
      开始评估
    </hl-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Bus, { EVENT } from 'common/bus'
import Utils from 'common/utils'
import Validate from 'common/validate'
import OcrApi from 'common/api/ocr'
import UserApi from 'common/api/user'
import Toast from '@/components/toast'
import Model from '@/components/model'
import Loading from '@/components/loading'
import HlUpload from '@/components/upload'
import HlInput from '@/components/input'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlButton from '@/components/button'
import HlDescription from '@/components/description'
import HlCreditExample from './credit-example'
import SETTING from '@/setting'
export default {
  name: 'HlEstimateStep3',
  components: {
    HlUpload,
    HlInput,
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
        creditPicture: null,
        balance: '',
        total: '',
        used: '',
        avg6: '',
        ocrCreditTaskId: null
      },
      timer: null,
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
    init () {
      this.setHeaderBack({
        to: this.goPrev
      })
      this.data = { ...this.data, ...this.options }
    },
    async submit () {
      try {
        Loading.open({
          type: 'querying',
          message: '评估中，请稍后...'
        })
        const requestId = await UserApi.submitCreditInfo(this.data)
        if (requestId && this.data.houseStatus) {
          this.data.requestId = requestId
          this.query()
        } else {
          this.data.status = 2
          Loading.close()
          this.goNext()
        }
      } catch (err) {
        this.data.status = 2
        Utils.errorLog(err, 'SUBMIT-CREDIT-INFO', false)
        Loading.close()
        err.code !== 69 && this.goNext()
      }
    },
    async query () {
      try {
        const response = await UserApi.getResult(this.data.requestId)
        this.timer && clearTimeout(this.timer)
        this.data.status = response ? response.code : 2
        this.data.message = ''
        if (response) {
          this.data.num = response.num || 0
          this.data.message = response.msg || ''
          this.data.customerId = response.accountCustomerId || null
          if (response.code === 1) {
            this.timer = setTimeout(this.query, SETTING.QUERY_INTERVAL)
          }
        }
      } catch (err) {
        this.data.status = 4
        Utils.errorLog(err, 'GET-ESTIMATE-RESULT', true)
      } finally {
        if (this.data.status === 4) {
          Loading.close()
          Toast.show(this.data.message)
        } else if ([0, 2, 3].includes(this.data.status)) {
          Loading.close()
          this.goNext()
        }
      }
    },
    async handleUpload (file) {
      if (!file) {
        return
      }
      try {
        const response = await OcrApi.credit(file)
        this.data.ocrCreditTaskId = response.ocrCreditTaskId
        if (response.status === 2) {
          const result = response.ocrResult
          const data = {
            balance: Utils.safeGet(result, 'balance', ''),
            total: Utils.safeGet(result, 'total', ''),
            used: Utils.safeGet(result, 'used', ''),
            avg6: Utils.safeGet(result, 'avg6', '')
          }
          this.data = { ...this.data, ...data }
          this.isOcrFail = false
        } else {
          this.isOcrFail = true
        }
      } catch (err) {
        this.isOcrFail = true
        Utils.errorLog(err, 'CREDIT-OCR', false)
      }
    },
    handleError () {
      const validateResult = this.validateForm()
      !validateResult.result && Toast.show(validateResult.message)
    },
    handleShowExample () {
      Model.show({
        title: '征信报告样例',
        component: HlCreditExample
      })
    },
    validateForm () {
      return Validate.test(this.data, {
        balance: [{ message: '请输入未结清贷款余额' }],
        total: [{ message: '请输入授信总额' }],
        used: [{ message: '请输入已用额度' }],
        avg6: [{ message: '请输入最近6个月平均使用额度' }]
      })
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

  .hl-form .hl-form-item::v-deep {
    .hl-form-item__label {
      width: 320px !important;
    }
  }
}
</style>
