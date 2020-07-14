<template>
  <div class="hl-content">
    <hl-form>
      <hl-form-item label="新手机号">
        <hl-input
          v-model="data.mobile"
          placeholder="请输入新手机号"
          :maxlength="11"
          clearable
        />
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

    <hl-button type="primary" @click="submit">确认修改</hl-button>
  </div>
</template>

<script>
import Common from 'common/common'
import Utils from 'common/utils'
import Validate from 'common/validate'
import Passport from 'common/api/passport'
import Toast from '@/components/toast'
import HlInput from '@/components/input'
import HlSms from '@/components/sms'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlDescription from '@/components/description'
import HlButton from '@/components/button'
export default {
  name: 'HlUpdateMobileStep2',
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
        mobile: '',
        smscode: ''
      },
      t: '',
      errorMessage: ''
    }
  },
  mounted () {
    this.t = Utils.getCookie('puhui_jsid') || 0
  },
  methods: {
    submit () {
      const validateResult = Validate.test(this.data, {
        mobile: [{ message: '请输入新手机号' }, { validator: 'mobile' }],
        smscode: [{ message: '请输入短信验证码' }]
      })
      if (!validateResult.result) {
        this.errorMessage = validateResult.message
        return
      }
      Passport.resetMobile(
        this.t,
        this.data.smscode
      ).then(() => {
        Toast.show('手机号已修改')
        Common.getIdentity()
        this.errorMessage = ''
        this.$router.back()
      }).catch(err => {
        this.errorMessage = err.message
      })
    },
    getSms (state) {
      const validateResult = Validate.test(this.data, {
        mobile: [{ message: '请输入新手机号' }, { validator: 'mobile' }]
      })
      if (!validateResult.result) {
        this.errorMessage = validateResult.message
        return
      }
      this.sendSms(state)
    },
    sendSms (state) {
      Passport.sendChangeMobileNewSms(
        this.t,
        this.data.mobile
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
  .hl-input::v-deep {
    .hl-sms {
      border-left: $formBorder;
    }

    &.hl-sms-input .hl-input__clear-button {
      right: 200px;
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 63px;
  }
}
</style>
