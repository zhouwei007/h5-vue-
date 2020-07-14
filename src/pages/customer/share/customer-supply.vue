<template>
  <div class="hl-content">
    <template v-if="status === 'edit'">
      <hl-form>
        <hl-form-item label="姓名">
          <hl-input v-model="data.name" type="label" />
        </hl-form-item>
        <hl-form-item label="手机号">
          <hl-input v-model="data.mobile" type="label" />
        </hl-form-item>
        <hl-form-item v-if="idCardStr" label="身份证">
          <hl-input v-model="idCardStr" type="label" />
        </hl-form-item>
        <hl-form-item v-else label="身份证">
          <hl-input
            v-model="data.idCardStr"
            :maxlength="18"
            placeholder="请输入身份证号"
            uppercase
          />
        </hl-form-item>
      </hl-form>

      <hl-form v-if="idCardShow">
        <hl-form-item label="身份证正面图片">
          <span>{{ data.idCard.length }}张</span>
          <hl-upload
            v-model="data.idCard"
            slot="suffix"
            :maxlength="1"
          />
        </hl-form-item>
      </hl-form>
      <hl-form v-if="properTyCertificateShow">
        <hl-form-item label="房产证图片">
          <span>{{ data.properTyCertificate.length }}张</span>
          <hl-upload
            v-model="data.properTyCertificate"
            slot="suffix"
            :maxlength="10"
          />
        </hl-form-item>
      </hl-form>
      <hl-form v-if="creditReportShow">
        <hl-form-item label="征信报告图片">
          <span>{{ data.creditReport.length }}张</span>
          <hl-upload
            v-model="data.creditReport"
            slot="suffix"
            :maxlength="30"
          />
        </hl-form-item>
      </hl-form>
      <hl-form v-if="otherShow">
        <hl-form-item label="其他">
          <span>{{ data.other.length }}张</span>
          <hl-upload
            v-model="data.other"
            slot="suffix"
            :maxlength="30"
          />
        </hl-form-item>
      </hl-form>

      <hl-button
        type="primary"
        :disabled="submitDisabled"
        @click="submit"
      >
        保存
      </hl-button>
    </template>

    <div v-else-if="status === 'success'" class="hl-result">
      <svg class="hl-pic"><use xlink:href="#hl-pic-finish"></use></svg>
      <p>保存成功</p>
    </div>
    <div v-else-if="status === 'expire'" class="hl-result">
      <svg class="hl-pic"><use xlink:href="#hl-pic-fail"></use></svg>
      <p>链接已失效</p>
    </div>
  </div>
</template>

<script>
import Utils from 'common/utils'
import Validate from 'common/validate'
import CustomerApi from 'common/api/customer'
import Toast from '@/components/toast'
import Confirm from '@/components/confirm'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlInput from '@/components/input'
import HlUpload from '@/components/upload'
import HlButton from '@/components/button'
export default {
  name: 'HlCustomerSupply',
  components: {
    HlForm,
    HlFormItem,
    HlInput,
    HlUpload,
    HlButton
  },
  data () {
    return {
      token: '',
      data: {
        name: '',
        mobile: '',
        idCardStr: null,
        idCard: [],
        properTyCertificate: [],
        creditReport: [],
        other: []
      },
      idCardStr: '',
      idCardShow: false,
      properTyCertificateShow: false,
      creditReportShow: false,
      otherShow: false,
      status: ''
    }
  },
  computed: {
    submitDisabled () {
      return !(this.data.idCardStr ||
        this.data.idCard.length ||
        this.data.properTyCertificate.length ||
        this.data.creditReport.length ||
        this.data.other.length)
    }
  },
  mounted () {
    this.token = this.$route.query.token || null
    this.init()
  },
  methods: {
    async init () {
      try {
        const response = await CustomerApi.getShareData(this.token)
        this.data.name = response.name
        this.data.mobile = response.mobile
        this.idCardStr = response.cardIdStr || ''
        this.idCardShow = response.canIdCard
        this.properTyCertificateShow = response.canProperTyCertificate
        this.creditReportShow = response.canCreditReport
        this.otherShow = response.canOther
        this.status = 'edit'
      } catch (err) {
        this.status = 'expire'
        Utils.errorLog(err, 'GET-SHARE-DATA', true)
      }
    },
    async submit () {
      const validateResult = this.validateForm()
      if (!validateResult.result) {
        Toast.show(validateResult.message)
        return
      }
      Confirm.show({
        title: '确认提交客户信息吗?',
        message: '提交后该链接将过期',
        cancel: true,
        submit: '确定',
        handleSubmit: this.save
      })
    },
    async save () {
      try {
        await CustomerApi.saveShareData(this.token, 1, this.data)
        this.status = 'success'
      } catch (err) {
        this.init()
        Utils.errorLog(err, 'SAVE-SHARE-DATA', false)
      }
    },
    validateForm () {
      return Validate.test(this.data, {
        idCardStr: [{ required: false, validator: 'idcard' }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-form-item::v-deep {
    .hl-form-item__inner .hl-form-item__label {
      width: 220px;
    }

    .hl-input .hl-input__inner {
      padding: 0;
      text-align: right;
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 60px;
  }

  .hl-result {
    text-align: center;

    .hl-pic {
      width: 200px;
      height: 200px;
      margin-top: 80px;
    }

    p {
      margin: 20px auto;
      font-size: $titleSize;
      font-weight: 600;
      line-height: 48px;
      color: $textColor;
    }
  }
}
</style>
