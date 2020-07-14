<template>
  <div class="hl-content">
    <template v-if="status === 'validate'">
      <template v-if="step === 0">
        <h1 class="hl-title">创建个人档案</h1>
        <hl-description>只有经过您授权的经纪人有权查看您的图片资料</hl-description>
        <hl-input
          v-if="data.encryptMobile"
          v-model="data.encryptMobile"
          type="label"
        />
        <hl-input
          v-else
          v-model="data.mobile"
          placeholder="请输入手机号"
          validate="number"
          :maxlength="11"
          clearable
        />
        <hl-input
          v-model="data.smsCode"
          class="hl-sms-input"
          placeholder="请输入短信验证码"
          :maxlength="4"
          clearable
        >
          <hl-sms ref="sms" slot="suffix" @get-sms="getSms" />
        </hl-input>
      </template>

      <template v-else>
        <h1 class="hl-title">创建授权码</h1>
        <hl-description>您需要提供授权码授权给经纪人查看您的图片资料</hl-description>
        <hl-input
          v-model="data.password"
          placeholder="请输入授权码"
          :type="showPassword ? 'text' : 'password'"
          :autocomplete="false"
          :maxlength="20"
          clearable
        >
          <i
            slot="suffix"
            class="hl-input_button hl-icon"
            :class="showPassword ? 'hl-icon-eye' : 'hl-icon-eye-close'"
            @click="showPassword = !showPassword"
          />
        </hl-input>
        <hl-input
          v-model="data.validatePassword"
          placeholder="请再次输入确认"
          :type="showValidatePassword ? 'text' : 'password'"
          :autocomplete="false"
          :maxlength="20"
          clearable
        >
          <i
            slot="suffix"
            class="hl-input_button hl-icon"
            :class="showValidatePassword ? 'hl-icon-eye' : 'hl-icon-eye-close'"
            @click="showValidatePassword = !showValidatePassword"
          />
        </hl-input>
      </template>

      <hl-description :error="errorMessage" />
      <hl-button type="primary" @click="submit">下一步</hl-button>
    </template>

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
import HlInput from '@/components/input'
import HlSms from '@/components/sms'
import HlButton from '@/components/button'
import HlDescription from '@/components/description'
export default {
  name: 'HlCustomerAuth',
  components: {
    HlInput,
    HlSms,
    HlButton,
    HlDescription
  },
  data () {
    return {
      step: 0,
      status: '',
      data: {
        token: '',
        mobile: '',
        encryptMobile: '',
        smsCode: '',
        password: '',
        validatePassword: ''
      },
      errorMessage: '',
      showPassword: false,
      showValidatePassword: false
    }
  },
  watch: {
    data: {
      handler () {
        this.clearErrorMessage()
      },
      deep: true
    }
  },
  mounted () {
    this.data.token = this.$route.query.token || null
    this.init()
  },
  methods: {
    async init () {
      try {
        const response = await CustomerApi.getEncryptShareInfo(this.data)
        this.status = 'validate'
        if (response.mobile) {
          this.data.encryptMobile = Utils.formatEncrypt(response.mobile, 3, 4)
          this.data.mobile = response.mobile
        }
      } catch (err) {
        this.status = 'expire'
        Utils.errorLog(err, 'GET-ENCRYPT-SHARE-INFO', true)
      }
    },
    submit () {
      const validateResult = this.validate()
      if (!validateResult.result) {
        this.errorMessage = validateResult.message
        return
      }
      this.step === 0
        ? this.validateSms(this.data)
        : this.save(this.data)
    },
    async save (data) {
      try {
        await CustomerApi.saveEncryptShareCode(data)
        this.goCustomerEncrypt()
      } catch (err) {
        this.handleErrorMessage(err)
      }
    },
    async getSms (state) {
      const validateResult = this.validate('mobile')
      if (!validateResult.result) {
        this.errorMessage = validateResult.message
        return
      }
      try {
        await CustomerApi.sendEncryptShareSms(this.data)
        state.start()
        this.errorMessage = ''
        this.data.smsCode = ''
      } catch (err) {
        state.reset()
        this.handleErrorMessage(err)
      }
    },
    async validateSms (data) {
      try {
        await CustomerApi.validateEncryptShareSms(data)
        if (this.data.encryptMobile) {
          this.goCustomerEncrypt()
        } else {
          this.step = 1
        }
      } catch (err) {
        this.handleErrorMessage(err)
      }
    },
    validate (type) {
      if (this.step === 0) {
        const rules = {
          mobile: [{ message: '请输入手机号' }, { validator: 'mobile' }]
        }
        type !== 'mobile' && (rules.smsCode = [{ message: '请输入短信验证码' }])
        return Validate.test(this.data, rules)
      } else {
        const rules = {
          password: [{ message: '请输入授权码' }, { validator: 'password' }],
          validatePassword: [{ message: '请再次输入授权码确认' }]
        }
        const validateResult = Validate.test(this.data, rules)
        return validateResult.result && this.data.password !== this.data.validatePassword
          ? { result: false, message: '两次输入的授权码不一致' }
          : validateResult
      }
    },
    goCustomerEncrypt () {
      this.$router.replace({
        name: 'customerEncrypt',
        query: {
          token: this.data.token
        }
      })
    },
    handleErrorMessage (err) {
      if (err.code === 20) {
        this.status = 'expire'
      } else {
        this.errorMessage = err.message
      }
    },
    clearErrorMessage () {
      this.errorMessage = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-title {
    width: 630px;
    margin: auto;
    margin-top: 148px;
    font-size: 54px;
    font-weight: 600;
    line-height: 75px;
    color: $textColor;
  }

  .hl-description {
    width: 630px;
    margin: 20px auto;
    margin-bottom: 90px;
  }

  .hl-input::v-deep {
    width: 630px;
    height: 110px;
    margin: auto;
    margin-top: 40px;
    line-height: 110px;
    border-bottom: $splitBorder;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      display: block;
      margin: auto;
      width: 0;
      height: 1px;
      background: transparent;
      transition: width .8s ease, background-color .8s ease;
    }

    .hl-input__inner,
    .hl-input__label {
      padding-left: 0;
      @include label($titleSize);
    }

    .hl-input_button {
      display: block;
      color: $themeColor;
      cursor: pointer;
    }

    &.hl-input_focus {
      &:after {
        width: 100%;
        background: $subTitleColor;
      }
    }

    &.hl-sms-input .hl-input__clear-button {
      right: 160px;
    }
  }

  .hl-button.hl-button_primary {
    margin-bottom: 40px;
    width: 630px;
  }

  .hl-result {
    text-align: center;

    .hl-pic {
      width: 200px;
      height: 200px;
      margin-top: 168px;
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
