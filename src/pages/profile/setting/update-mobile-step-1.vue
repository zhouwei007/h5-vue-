<template>
  <div class="hl-content">
    <p class="hl-label">手机号：{{ mobile | encrypt(3, 4) }}</p>

    <hl-form>
      <template v-if="hasAuthenticate">
        <hl-form-item label="姓名">
          <hl-input
            v-model="data.realname"
            placeholder="请输入姓名"
            :maxlength="20"
            clearable
          />
        </hl-form-item>
        <hl-form-item label="身份证号">
          <hl-input
            v-model="data.id5"
            placeholder="请输入身份证号"
            :maxlength="18"
            uppercase
            clearable
          />
        </hl-form-item>
      </template>
      <hl-form-item v-else label="图形验证码">
        <hl-input
          v-model="data.kaptcha"
          class="hl-kaptcha-input"
          placeholder="请输入图形验证码"
          :maxlength="4"
          clearable
        >
          <img
            slot="suffix"
            class="hl-kaptcha"
            :src="kaptchaSrc"
            @click="getKaptcha"
          >
        </hl-input>
      </hl-form-item>
      <hl-form-item label="短信验证码">
        <hl-input
          v-model="data.smscode"
          class="hl-sms-input"
          placeholder="请输入短信验证码"
          :maxlength="6"
          clearable
        >
          <hl-sms ref="sms" slot="suffix" @get-sms="getSms" />
        </hl-input>
      </hl-form-item>
    </hl-form>
    <hl-description :error="errorMessage" />

    <hl-button type="primary" @click="next">下一步</hl-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Utils from 'common/utils'
import Validate from 'common/validate'
import Passport from 'common/api/passport'
import HlInput from '@/components/input'
import HlSms from '@/components/sms'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlDescription from '@/components/description'
import HlButton from '@/components/button'
export default {
  name: 'HlUpdateMobileStep1',
  components: {
    HlInput,
    HlSms,
    HlForm,
    HlFormItem,
    HlDescription,
    HlButton
  },
  data () {
    return {
      data: {
        realname: '',
        id5: '',
        kaptcha: '',
        smscode: ''
      },
      t: 0,
      kaptchaSrc: '',
      errorMessage: ''
    }
  },
  computed: {
    ...mapGetters([
      'mobile',
      'hasAuthenticate'
    ])
  },
  mounted () {
    this.getProcess()
  },
  destroyed () {
    this.kaptchaSrc && URL.revokeObjectURL(this.kaptchaSrc)
  },
  methods: {
    next () {
      const def = this.hasAuthenticate
        ? this.validateRealname(this.data)
        : this.validateKaptcha(this.data)
      def.then(this.validateSms.bind(this, this.data)).then(() => {
        this.errorMessage = ''
        this.$emit('next')
      }).catch(message => {
        this.errorMessage = message
      })
    },
    getProcess () {
      Passport.getChangeMobileProcess(this.t).then(data => {
        this.t = data.t
        const trace = data.process && data.process.trace
        if ([5, 6].includes(trace)) {
          this.$emit('next')
        }
        !this.hasAuthenticate && this.getKaptcha()
      }).catch(err => {
        Utils.errorLog(err, 'CHANGE-MOBILE-PROCESS')
      })
    },
    getKaptcha () {
      Passport.sendKaptcha(this.t).then(data => {
        this.data.kaptcha = ''
        this.kaptchaSrc && URL.revokeObjectURL(this.kaptchaSrc)
        this.kaptchaSrc = URL.createObjectURL(data)
      }).catch(err => {
        Utils.errorLog(err, 'KAPTCHA-GET', false)
      })
    },
    validateKaptcha (data) {
      return new Promise((resolve, reject) => {
        const validateResult = Validate.test(data, {
          kaptcha: [{ message: '请输入图形验证码' }]
        })
        if (!validateResult.result) {
          reject(validateResult.message)
          return
        }
        Passport.validateChangeMobileKaptcha(
          this.t,
          data.kaptcha
        ).then(() => resolve()).catch(err => {
          this.getKaptcha()
          this.data.smscode = ''
          reject(err.message)
        })
      })
    },
    validateRealname (data) {
      return new Promise((resolve, reject) => {
        const validateResult = Validate.test(data, {
          realname: [{ message: '请输入姓名' }],
          id5: [{ message: '请输入身份证号' }, { validator: 'idcard' }]
        })
        validateResult.result
          ? resolve()
          : reject(validateResult.message)
      })
    },
    validateSms (data) {
      return new Promise((resolve, reject) => {
        const validateResult = Validate.test(data, {
          smscode: [{ message: '请输入短信验证码' }]
        })
        if (!validateResult.result) {
          reject(validateResult.message)
          return
        }
        Passport.validateChangeMobileOldSms(
          this.t,
          data.smscode
        ).then(() => resolve()).catch(err => {
          reject(err.message)
        })
      })
    },
    getSms (state) {
      const def = this.hasAuthenticate
        ? this.validateRealname(this.data)
        : this.validateKaptcha(this.data)
      def.then(this.sendSms.bind(this, state)).catch(message => {
        this.errorMessage = message
      })
    },
    sendSms (state) {
      Passport.sendChangeMobileOldSms(
        this.t,
        this.hasAuthenticate ? this.data.realname : null,
        this.hasAuthenticate ? this.data.id5 : null
      ).then(() => {
        state.start()
        this.errorMessage = ''
        this.data.smscode = ''
      }).catch(err => {
        state.reset()
        this.errorMessage = err.message
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-label {
    margin-top: 40px;
    margin-bottom: 30px;
    text-align: center;
    color: $textColor;
    @include label($subTitleSize);
  }

  .hl-input::v-deep {
    .hl-kaptcha {
      display: block;
      height: 60px;
      cursor: pointer;
    }

    .hl-sms {
      border-left: $formBorder;
    }

    &.hl-kaptcha-input .hl-input__clear-button,
    &.hl-sms-input .hl-input__clear-button {
      right: 200px;
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 63px;
  }
}
</style>
