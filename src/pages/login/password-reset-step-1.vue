<template>
  <div class="hl-content">
    <hl-form>
      <hl-form-item label="手机号">
        <hl-input
          v-model="data.mobile"
          placeholder="请输入您的手机号"
          validate="number"
          :maxlength="11"
          clearable
        />
      </hl-form-item>
    </hl-form>

    <hl-button type="primary" @click="next">下一步</hl-button>

    <hl-dialog
      :show.sync="dialogShow"
      :mask-close="false"
      :top="dialogTop"
    >
      <div v-if="isShowImgCode">
        <h4 class="hl-dialog__title">
          请输入图片验证码
        </h4>
        <p class="hl-dialog__des">
          <img
            class="hl-dialog__kaptcha"
            :src="kaptcha"
            @click="getKaptcha"
          >
        </p>
        <hl-code-input
          v-model="data.kaptchaCode"
          :bit="4"
          :is-verify-fail="isVerifyFail"
          :type="String"
        />
      </div>
      <div v-else>
        <h4 class="hl-dialog__title">
          输入6位短信验证码
        </h4>
        <p class="hl-dialog__des">短信验证码已发送至{{ data.mobile }}</p>
        <hl-sms
          ref="sms"
          :immediate="true"
          timeSuffix="S后重试"
          @get-sms="getSms"
        />
        <hl-code-input
          v-model="data.smscode"
          :bit="6"
          :isVerifyFail="isVerifyFail"
        />
      </div>
      <p class="hl-dialog__verify-fail">
        {{ isVerifyFail ? verifyFailReason : '' }}
      </p>
    </hl-dialog>
  </div>
</template>

<script>
import Utils from 'common/utils'
import Passport from 'common/api/passport'
import Validate from 'common/validate'
import DialogTop from '@/mixins/dialog-top'
import Toast from '@/components/toast'
import HlInput from '@/components/input'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlButton from '@/components/button'
import HlDialog from '@/components/dialog'
import HlSms from '@/components/sms'
import HlCodeInput from '@/components/code-input'
export default {
  name: 'HlPasswordResetStep1',
  components: {
    HlSms,
    HlInput,
    HlDialog,
    HlForm,
    HlFormItem,
    HlButton,
    HlCodeInput
  },
  mixins: [DialogTop],
  data () {
    return {
      data: {
        mobile: '',
        kaptchaCode: '',
        hasAuthenticate: true,
        smscode: '',
        t: ''
      },
      kaptcha: '',
      verifyFailReason: '',
      isVerifyFail: false,
      isShowImgCode: true,
      dialogShow: false
    }
  },
  mounted () {
    this.getProcess()
  },
  destroyed () {
    this.kaptcha && URL.revokeObjectURL(this.kaptcha)
  },
  watch: {
    'data.kaptchaCode' (val) {
      if (val.length === 4) {
        this.validateKaptcha(this.data.mobile, val)
      } else {
        this.isVerifyFail = false
      }
    },
    'data.smscode' (val) {
      if (val.length === 6) {
        this.validateFindPasswordSms(val)
      } else {
        this.isVerifyFail = false
      }
    }
  },
  methods: {
    async next () {
      try {
        const data = await this.validate(this.data)
        this.data.hasAuthenticate = data
        this.$emit('next', this.data)
      } catch (message) {
        Toast.show(message)
      }
    },
    async getKaptcha () {
      try {
        const response = await Passport.sendKaptcha(this.data.t)
        this.data.kaptchaCode = ''
        this.kaptcha && URL.revokeObjectURL(this.kaptcha)
        this.kaptcha = URL.createObjectURL(response)
        this.isVerifyFail = false
      } catch (err) {
        Utils.errorLog(err, 'KAPTCHA-GET', false)
      }
    },
    async getProcess () {
      try {
        const response = await Passport.getFindPasswordProcess('0')
        this.data.t = response.t
      } catch (err) {
        Utils.errorLog(err, 'GET-PROCESS')
      }
    },
    validate (data) {
      return new Promise(async (resolve, reject) => {
        const validateResult = Validate.test(data, {
          mobile: [{ message: '请输入手机号' }, { validator: 'mobile' }]
        })
        if (!validateResult.result) {
          Toast.show(validateResult.message)
          reject(validateResult.message)
          return
        }
        try {
          await Passport.validateFindPasswordMobile(data.mobile, data.t)
          this.dialogShow = true
          this.isShowImgCode = true
          this.getKaptcha()
        } catch (err) {
          reject(err.message)
        }
      })
    },
    async validateKaptcha (mobile, val) {
      try {
        await Passport.validateFindPasswordKaptcha(mobile, val, this.data.t)
        this.isVerifyFail = false
        this.isShowImgCode = false
      } catch (err) {
        this.isVerifyFail = true
        this.verifyFailReason = err.message || '验证码错误'
      }
    },
    async getSms (state) {
      try {
        await Passport.sendFindPasswordSms(this.data.mobile, this.data.t)
        state.start()
        this.data.smscode = ''
        this.isVerifyFail = false
      } catch (err) {
        state.reset()
        this.isVerifyFail = true
        this.verifyFailReason = err.message || '系统繁忙'
      }
    },
    async validateFindPasswordSms (val) {
      try {
        await Passport.validateFindPasswordSms(this.data.mobile, this.data.t, val)
        this.isVerifyFail = false
        this.$emit('next', this.data)
      } catch (err) {
        this.isVerifyFail = true
        this.verifyFailReason = err.message
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-input::v-deep {
    .hl-kaptcha {
      display: block;
      height: 60px;
      cursor: pointer;
    }

    &.hl-kaptcha-input .hl-input__clear-button {
      right: 200px;
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 90px;
  }
}

.hl-dialog__wrapper::v-deep {
  .hl-dialog.hl-dialog_default {
    .hl-dialog__body {
      padding-bottom: 25px;
    }
  }

  .hl-sms {
    display: inline-block;
    height: 60px;
    width: 180px;
    margin-bottom: 50px;
    padding: 0;
    line-height: 60px;
    font-size: $quoteSize;
    color: $placeholderColor;
    border: 1px solid $lineBorderColor;
    border-radius: 30px;
    user-select: none;
    cursor: pointer;

    &:not(.hl-sms_cold, .hl-sms_reset):active {
      color: $themeActiveColor;
    }

    &.hl-sms_reset {
      color: $blockColor;
      background-color: $themeColor;
      border-color: $themeColor;
    }

    &.hl-sms_reset:active {
      background-color: $themeActiveColor;
      border-color: $themeActiveColor;
    }
  }

  .hl-dialog__kaptcha {
    width: 272.5px;
    height: 120px;
  }

  .hl-dialog__verify-fail {
    height: 33px;
    margin-top: 24px;
    line-height: 33px;
    font-size: $quoteSize;
    text-align: center;
    color: $errorColor;
  }
}
</style>
