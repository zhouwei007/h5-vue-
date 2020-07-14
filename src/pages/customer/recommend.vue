<template>
  <div class="hl-content">
    <hl-form>
      <hl-upload
        v-model="data.idCardPicture"
        class="hl-idcard"
        type="avatar"
        @change="handleUpload"
      >
        <svg class="hl-pic"><use xlink:href="#hl-pic-ocr"></use></svg>
        <p class="hl-upload__label">
          上传借款人身份证正面照片<span>必填</span>
        </p>
        <div
          v-if="isOcrFail"
          slot="label"
          class="hl-upload__error"
        >
          证件识别失败，请手动输入或<span>重新上传</span>
        </div>
      </hl-upload>
      <hl-form-item v-if="hasOcr" label="借款人姓名" required>
        <hl-input
          v-model="data.borrowerName"
          placeholder="请输入借款人姓名"
          :maxlength="20"
          clearable
        />
      </hl-form-item>
      <hl-form-item v-if="hasOcr" label="身份证号码" required>
        <hl-input
          v-model="data.cardId"
          :maxlength="18"
          placeholder="请输入借款人身份证号码"
          uppercase
          clearable
        />
      </hl-form-item>
    </hl-form>
    <hl-form>
      <hl-form-item label="房产证" required>
        <span>{{ data.propertyCertificate.length + propertyList.length }}张</span>
        <hl-upload slot="suffix"
          v-model="data.propertyCertificate"
          :maxlength="10"
          :url="propertyList"
          @delete="handleDeleteProperty"
        />
      </hl-form-item>
      <hl-form-item label="借款人手机号" required>
        <hl-input
          v-model="data.borrowerMobile"
          type="label"
          placeholder="请输入借款人联系手机"
          validate="number"
          :maxlength="11"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="申请借款金额" required>
        <hl-input
          v-model="data.expectedAmount"
          placeholder="请输入申请借款金额"
          validate="number"
          :maxlength="8"
          clearable
        >
          <span slot="suffix">元</span>
        </hl-input>
      </hl-form-item>
      <hl-form-item label="申请借款期限" required>
        <hl-select
          v-model="data.expectedPeriods"
          :options="expectedPeriodsOptions"
          placeholder="请选择借款期限"
        />
      </hl-form-item>
      <hl-form-item label="所属城市" required>
        <hl-select
          v-model="data.comeCityId"
          :options="comeCityOptions"
          placeholder="请选择进件所属城市"
        />
      </hl-form-item>
    </hl-form>

    <hl-button
      type="primary"
      :disabled="submitDisabled"
      @click="submit"
    >
      确认推荐
    </hl-button>
  </div>
</template>

<script>
import Utils from 'common/utils'
import { mapGetters } from 'vuex'
import ApplyApi from 'common/api/apply'
import CustomerApi, { Customer } from 'common/api/customer'
import OcrApi from 'common/api/ocr'
import Validate from 'common/validate'
import BS from 'common/bs'
import Authenticate from '@/mixins/authenticate'
import Toast from '@/components/toast'
import Confirm from '@/components/confirm'
import HlUpload from '@/components/upload'
import HlInput from '@/components/input'
import HlSelect from '@/components/select'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlButton from '@/components/button'
import SETTING from '@/setting'
export default {
  name: 'HlRecommend',
  components: {
    HlUpload,
    HlInput,
    HlSelect,
    HlForm,
    HlFormItem,
    HlButton
  },
  mixins: [Authenticate],
  data () {
    return {
      data: {
        customerId: null,
        idCardPicture: null,
        borrowerName: '',
        cardId: '',
        propertyCertificate: [],
        borrowerMobile: '',
        expectedAmount: '',
        expectedPeriods: null,
        comeCityId: ''
      },
      idcardFileId: null,
      propertyList: [],
      expectedPeriodsOptions: [],
      comeCityOptions: [],
      hasOcr: false,
      isOcrFail: false,
      $authenticateOption: {
        title: '请进行实名认证',
        message: '实名认证后即可推荐借款人借款',
        cancel: '暂不认证'
      }
    }
  },
  computed: {
    ...mapGetters([
      'bankCardCount'
    ]),
    submitDisabled () {
      return !this.validateForm(1).result
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.data.customerId = this.$route.query.id || null
      this.data.customerId && this.handleCustomerRecommend(this.data.customerId)
      this.expectedPeriodsOptions = await BS.getOptions(SETTING.BS_LOAN_PERIODS_KEY)
      this.comeCityOptions = await BS.getOptions(SETTING.BS_RECOMMEND_CITY_KEY)
    },
    async submit () {
      if (!this.$handleAuthenticate()) {
        return
      }
      const validateResult = this.validateForm()
      if (!validateResult.result) {
        Toast.show(validateResult.message)
        return
      }
      try {
        await ApplyApi.save(this.data, this.idcardFileId, this.propertyList)
        if (this.bankCardCount) {
          Toast.show('推荐借款人成功，请等待资料审核！')
          this.goBack()
        } else {
          Confirm.show({
            title: '推荐成功，请等待资料审核！',
            message: '请及时绑定银行卡以便放款成功后及时收到奖励',
            cancel: '暂不绑卡',
            submit: '立即绑卡',
            handleSubmit: this.goBankcardAdd,
            handleCancel: this.goBack
          })
        }
        this.clearForm()
      } catch (err) {
        Utils.errorLog(err, 'APPLY-SAVE', false)
      }
    },
    async handleCustomerRecommend (customerId) {
      try {
        const customerDetailPromise = CustomerApi.detail(customerId)
        const response = await CustomerApi.getRecommendImages(customerId)
        let idCardPromise = null
        for (const item of response) {
          if (item.fileType === Customer.FILE_TYPE.IDCARD && item.list.length) {
            this.idcardFileId = item.list[0].fileId
            idCardPromise = Utils.url2file(item.list[0].url)
          } else if (item.fileType === Customer.FILE_TYPE.PROPERTY_CERTIFICATE && item.list.length) {
            this.propertyList = item.list.map(image => ({
              id: image.fileId,
              url: image.url
            }))
          }
        }
        const customer = await customerDetailPromise
        this.data.borrowerMobile = customer.mobile
        if (idCardPromise) {
          this.data.idCardPicture = await idCardPromise
          this.handleUpload(this.data.idCardPicture, false)
        }
      } catch (err) {
        Utils.errorLog(err, 'GET-RECOMMEND-CUSTOMER')
      }
    },
    async handleUpload (file, clear = true) {
      if (!file) {
        return
      }
      if (clear) {
        this.idcardFileId = null
      }
      try {
        const response = await OcrApi.idcard(file)
        this.data.borrowerName = response.name
        this.data.cardId = response.id
        this.isOcrFail = false
      } catch (err) {
        this.isOcrFail = true
        Utils.errorLog(err, 'IDCARD-OCR', false)
      } finally {
        this.hasOcr = true
      }
    },
    handleDeleteProperty (id) {
      const index = this.propertyList.findIndex(item => item.id === id)
      index !== -1 && this.propertyList.splice(index, 1)
    },
    validateForm (type) {
      const rules = {
        idCardPicture: [{ message: '借款人身份证照片不能为空' }],
        borrowerName: [{ message: '借款人姓名不能为空' }],
        cardId: [{ message: '身份证号码不能为空' }, { validator: type ? null : 'idcard' }],
        borrowerMobile: [{ message: '借款人手机号不能为空' }, { validator: type ? null : 'mobile' }],
        expectedAmount: [{ message: '申请借款金额不能为空' }],
        expectedPeriods: [{ message: '申请借款期限不能为空' }],
        comeCityId: [{ message: '所属城市不能为空' }]
      }
      if (!this.propertyList.length) {
        rules.propertyCertificate = [{ min: 1, message: '房产证照片不能为空' }]
      }
      return Validate.test(this.data, rules)
    },
    clearForm () {
      this.data = {
        idCardPicture: null,
        borrowerName: '',
        cardId: '',
        propertyCertificate: [],
        borrowerMobile: '',
        expectedAmount: '',
        expectedPeriods: null,
        comeCityId: ''
      }
      this.hasOcr = false
    },
    goBankcardAdd () {
      this.$router.replace({
        name: 'bankcardAdd'
      })
    },
    goBack () {
      this.$router.back()
    },
    touchstart () {
      // For mobile active style
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-idcard.hl-upload__wrapper::v-deep {
    margin: 20px auto 0;
    border-bottom: $splitBorder;

    .hl-upload__button {
      width: 100%;
      height: 260px;
      margin: 0 auto;
      border: none;
      border-radius: 3px;

      .hl-upload__image {
        width: 100%;
        height: 100%;
        margin: 0;
        border-radius: 3px;

        img {
          border-radius: 3px;
        }

        .hl-icon.hl-icon-trash {
          border-top-right-radius: 3px;
        }
      }
    }

    .hl-pic {
      width: 240px;
      height: 140px;
      margin: auto;
      margin-top: 34px;
      margin-bottom: 12px;
      border-radius: $cardRadius;
    }

    .hl-upload__label {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $textSize;
      color: $subTitleColor;

      span {
        display: inline-block;
        width: 68px;
        height: 36px;
        margin-left: 10px;
        font-size: $subQuoteSize;
        line-height: 36px;
        text-align: center;
        color: $blockColor;
        background: $themeColor;
        border-radius: $dialogRadius;
      }
    }

    .hl-upload__error {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 70px;
      font-size: $descriptionSize;
      line-height: 70px;
      text-align: center;
      color: $blockColor;
      background: rgba($color: #000000, $alpha: 0.3);

      span {
        text-decoration: underline
      }
    }
  }

  .hl-form {
    .hl-form-item::v-deep {
      .hl-form-item__inner>.hl-form-item__label {
        width: 200px;
      }
    }

    .hl-form-item_custom {
      padding-bottom: 40px;
      border-bottom: $splitBorder;
    }

    .hl-input::v-deep {
      .hl-input__label {
        text-align: left !important;
      }

      .hl-input__suffix {
        margin: 0 8px;
        font-size: $descriptionSize;
        color: $descriptionColor;
      }
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 60px;
    margin-bottom: 60px;
  }
}
</style>
