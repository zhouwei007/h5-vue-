<template>
  <div class="hl-content">
    <svg class="hl-logo hl-pic"><use xlink:href="#hl-pic-logo"></use></svg>

    <hl-input
      v-model="data.mobile"
      placeholder="请输入手机号"
      validate="number"
      :class="{'hl-input_content': data.mobile}"
      :maxlength="11"
      clearable
    >
      <i slot="prefix" class="hl-input__title">手机号</i>
    </hl-input>
    <hl-input
      v-model="data.inviteCode"
      placeholder="经纪人邀请码（选填）"
      :class="{'hl-input_content': data.inviteCode}"
      :maxlength="30"
      uppercase
      clearable
    >
      <i slot="prefix" class="hl-input__title">邀请码</i>
    </hl-input>

    <hl-checkbox v-model="data.isAgree">
      <p>
        注册即视为您已阅读并同意
        <span @click="handleAgreement('register')">《维客易注册服务协议》</span><br>
        <span @click="handleAgreement('prohibit')">《维客易禁止性行为》</span>
        <span @click="handleAgreement('privacy')">《维客易隐私政策》</span>
      </p>
    </hl-checkbox>

    <hl-button
      type="primary"
      :disabled="submitDisabled"
      @click="next"
    >
      下一步
    </hl-button>
    <hl-button class="hl-login-button"
      @click="login">
      已有账号，<span>立即登录</span>
    </hl-button>

    <div class="hl-introduction">
      <div class="hl-introduction__title">
        <span>注册经纪人赚奖励金</span>
      </div>
      <ul>
        <li>
          <i class="hl-icon hl-icon-partner"></i>
          <span>成为经纪人</span>
          <i class="hl-icon hl-icon-arrow-right"></i>
        </li>
        <li>
          <i class="hl-icon hl-icon-commend"></i>
          <span>推荐借款人</span>
          <i class="hl-icon hl-icon-arrow-right"></i>
        </li>
        <li>
          <i class="hl-icon hl-icon-wallet"></i>
          <span>获得推荐奖励</span>
        </li>
      </ul>
    </div>

    <hl-dialog
      :show.sync="dialogShow"
      :mask-close="false"
      :top="dialogTop"
    >
      <h4 class="hl-dialog__title">
        输入4位短信验证码
      </h4>
      <p class="hl-dialog__des">短信验证码已发送至{{data.mobile}}</p>
      <hl-sms
        ref="sms"
        :immediate="true"
        timeSuffix="S后重试"
        @get-sms="getSms"
      />
      <hl-code-input
        ref="codeInput"
        v-model="data.code"
        :bit="4"
        :isVerifyFail="isVerifyFail"
      />
      <p class="hl-dialog__verify-fail">{{isVerifyFail ? verifyFailReason : ``}}</p>
    </hl-dialog>
  </div>
</template>

<script>
import Passport from 'common/api/passport'
import Validate from 'common/validate'
import Utils from 'common/utils'
import DialogTop from '@/mixins/dialog-top'
import Toast from '@/components/toast'
import Model from '@/components/model'
import HlInput from '@/components/input'
import HlButton from '@/components/button'
import HlCheckbox from '@/components/checkbox'
import HlAgreementRegister from '@/pages/agreements/register'
import HlAgreementProhibit from '@/pages/agreements/prohibit'
import HlAgreementPrivacy from '@/pages/agreements/privacy'
import HlDialog from '@/components/dialog'
import HlSms from '@/components/sms'
import HlCodeInput from '@/components/code-input'
export default {
  name: 'HlRegisterStep1',
  components: {
    HlSms,
    HlInput,
    HlDialog,
    HlButton,
    HlCheckbox,
    HlCodeInput
  },
  mixins: [DialogTop],
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
        mobile: '',
        inviteCode: '',
        isAgree: false,
        code: ''
      },
      queryCode: '',
      verifyFailReason: '验证码错误，请重新获取',
      isVerifyFail: false,
      dialogShow: false
    }
  },
  computed: {
    submitDisabled () {
      return !this.validateForm(1).result
    }
  },
  mounted () {
    this.data = { ...this.data, ...this.options }
    this.queryCode = this.$route.query.inviteCode
    if (this.queryCode) {
      this.data.inviteCode = this.queryCode
    }
  },
  watch: {
    'data.code' (val) {
      if (val.length === 4) {
        this.validateCode(this.data.mobile, val)
      }
    }
  },
  methods: {
    next () {
      const validateResult = this.validateForm()
      if (!validateResult.result) {
        Toast.show(validateResult.message)
        return
      }
      Passport.validateRegistMobile(
        this.data.mobile,
        this.data.inviteCode
      ).then(() => {
        this.dialogShow = true
      }).catch(err => {
        Utils.errorLog(err, 'VALIDATE-REGIST-MOBILE', false)
      })
    },
    validateForm (type) {
      return Validate.test(this.data, {
        mobile: [{ message: '请输入手机号' }, { validator: type ? null : 'mobile' }],
        // inviteCode: [{ message: '请输入经纪人邀请码' }],
        isAgree: [type ? {} : { boolean: true, message: '请阅读并勾选同意《狐狸普惠用户注册协议》' }]
      })
    },
    validateCode (mobile, code) {
      Passport.validateRegistSms(mobile, code).then(() => {
        this.isVerifyFail = false
        this.$emit('next', this.data)
      }).catch(err => {
        this.verifyFailReason = err.message
        this.isVerifyFail = true
      })
    },
    handleAgreement (type) {
      const options = {
        register: {
          title: '注册服务协议',
          component: HlAgreementRegister
        },
        prohibit: {
          title: '用户禁止性行为规则',
          component: HlAgreementProhibit
        },
        privacy: {
          title: '隐私政策',
          component: HlAgreementPrivacy
        }
      }
      Model.show(options[type])
    },
    login () {
      this.$router.replace({
        name: 'login'
      })
    },
    getSms (state) {
      Passport.sendRegistSms(
        this.data.mobile,
        this.data.inviteCode
      ).then(data => {
        state.start(data.needWaitTime || 120)
        this.data.code = ''
        this.isVerifyFail = false
      }).catch(err => {
        let msg = err.message || '系统繁忙'
        state.reset()
        if (this.dialogShow) {
          this.isVerifyFail = true
          this.verifyFailReason = msg
        } else {
          Toast.show(msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-logo {
    display: block;
    width: 360px;
    height: 120px;
    margin: auto;
    margin-top: 60px + $headerHeight;
    margin-bottom: 70px;
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

    .hl-input__inner {
      padding-left: 0;
      font-weight: bold;
      @include label($titleSize);
    }

    .hl-input__title {
      position: absolute;
      display: none;
      top: -20px;
      left: 0;
      height: 40px;
      line-height: 40px;
      font-family: 'Semibold';
      color: $descriptionColor;
      animation: slide-up .4s ease-out forwards;
    }

    &.hl-input_focus {
      @include placeholder(transparent);

      &:after {
        width: 100%;
        background: $subTitleColor;
      }
    }

    &.hl-input_focus,
    &.hl-input_content {
      .hl-input__title {
        display: inline;
      }
    }

    @keyframes slide-up {
      from {
        opacity: 0;
        top: 30px;
        font-size: $titleSize;
      }
      to {
        opacity: 1;
        top: -20px;
        font-size: $quoteSize;
      }
    }
  }

  .hl-checkbox {
    margin-left: 60px;
    margin-top: 30px;
  }

  .hl-button.hl-button_primary {
    margin-top: 60px;
    margin-bottom: 40px;
    width: 630px;
  }

  .hl-login-button.hl-button.hl-button_default {
    display: block;
    margin: auto;
    margin-bottom: 60px;
    font-size: $descriptionSize;
    color: $textColor;

    span {
      color: $systemColor;
    }
  }

  .hl-introduction {
    position: relative;
    width: 690px;
    height: 230px;
    margin: auto;
    margin-top: 84px;
    margin-bottom: 30px;
    border: $splitBorder;

    .hl-introduction__title {
      position: absolute;
      display: inline-block;
      top: -18px;
      right: 0;
      left: 0;
      text-align: center;

      span {
        padding: 0 24px;
        font-size: $titleSize;
        color: $textColor;
        background-color: $blockColor;
      }
    }

    ul {
      display: flex;
      margin: 0 30px;
      margin-top: 60px;

      li {
        position: relative;
        flex: auto;
        width: 0;
        text-align: center;

        .hl-icon {
          display: block;
          width: 80px;
          height: 80px;
          margin: auto;
          margin-bottom: 13px;
          font-size: 60px;
          line-height: 80px;
          color: $subTitleColor;
          border: $splitBorder;
          border-radius: 100%;
        }

        span {
          font-size: $quoteSize;
          color: $subTitleColor;
        }

        .hl-icon.hl-icon-arrow-right {
          position: absolute;
          display: block;
          top: 0;
          right: -40px;
          font-size: 45px;
          color: $splitBorderColor;
          border: none;
        }
      }
    }
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
