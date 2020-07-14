<template>
  <div class="hl-content">
    <hl-form>
      <template v-if="data.hasAuthenticate">
        <hl-form-item label="姓名">
          <hl-input
            v-model="data.name"
            placeholder="请输入姓名"
            :maxlength="20"
            clearable
          />
        </hl-form-item>
        <hl-form-item label="身份证号">
          <hl-input
            v-model="data.idcard"
            placeholder="请输入身份证号"
            :maxlength="18"
            uppercase
            clearable
          />
        </hl-form-item>
      </template>
      <hl-form-item v-else label="新密码">
        <hl-input
          v-model="data.password"
          :type="showPassword ? 'text' : 'password'"
          :maxlength="20"
          :autocomplete="false"
          placeholder="设置新密码"
          clearable
        >
          <i
            slot="suffix"
            class="hl-input_button hl-icon"
            :class="showPassword ? 'hl-icon-eye' : 'hl-icon-eye-close'"
            @click="showPassword = !showPassword"
          />
        </hl-input>
      </hl-form-item>
    </hl-form>
    <hl-description v-if="!data.hasAuthenticate">设置8-20位登录密码，包含数字和字母，区分大小写</hl-description>
    <hl-button
      v-if="data.hasAuthenticate"
      type="primary"
      @click="validateRealname"
    >
      下一步
    </hl-button>
    <hl-button
      v-else
      type="primary"
      @click="submit"
    >
      重置密码
    </hl-button>
  </div>
</template>

<script>
import Passport from 'common/api/passport'
import Utils from 'common/utils'
import Validate from 'common/validate'
import Toast from '@/components/toast'
import HlInput from '@/components/input'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlDescription from '@/components/description'
import HlButton from '@/components/button'
export default {
  name: 'HlPasswordResetStep2',
  components: {
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
        mobile: '',
        name: '',
        idcard: '',
        password: '',
        hasAuthenticate: true,
        t: ''
      },
      showPassword: false,
      rules: {
        name: [{ message: '请输入姓名' }],
        idcard: [{ message: '请输入身份证号' }, { validator: 'idcard' }]
      }
    }
  },
  mounted () {
    this.data = { ...this.data, ...this.options }
    this.getProcess()
  },
  methods: {
    submit () {
      const validateResult = Validate.test(this.data, {
        password: [{ message: '请输入新密码' }, { validator: 'password' }]
      })
      if (!validateResult.result) {
        Toast.show(validateResult.message)
        return
      }
      this.resetPassword(this.data)
    },
    async resetPassword (data) {
      try {
        await Passport.resetPassword(data.mobile, data.password, data.t)
        Toast.show('登录密码已重置')
        this.goLogin()
      } catch (err) {
        Utils.errorLog(err, 'RESET-PASSWORD', false)
      }
    },
    async validateRealname () {
      const validateResult = Validate.test(this.data, this.rules)
      if (!validateResult.result) {
        Toast.show(validateResult.message)
        return
      }
      const { name, mobile, idcard, t } = this.data
      try {
        await Passport.validateAuthenticate(name, mobile, idcard, t)
        this.data.hasAuthenticate = false
      } catch (err) {
        Utils.errorLog(err, 'VALIDATE-AUTHENTICATE', false)
      }
    },
    async getProcess () {
      try {
        const response = await Passport.getFindPasswordProcess(this.data.t)
        let trace = response.process && response.process.trace
        let status = response.process && response.process.status
        this.data.hasAuthenticate = status === 7
        if (trace < 3) {
          await Passport.getFindPasswordProcess('0')
          this.$emit('prev')
        }
      } catch (err) {
        Utils.errorLog(err, 'GET-FIND-PASSWORD-PROCESS', true)
      }
    },
    goLogin () {
      this.$router.replace({
        name: 'login'
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
    font-size: $subTitleSize;
    text-align: center;
    color: $textColor;
  }

  .hl-input::v-deep {
    .hl-sms {
      border-left: $formBorder;
    }

    &.hl-sms-input .hl-input__clear-button {
      right: 200px;
    }

    .hl-input_button {
      display: block;
      color: $themeColor;
      cursor: pointer;
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 90px;
  }
}
</style>
