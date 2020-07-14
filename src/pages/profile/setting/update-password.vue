<template>
  <div class="hl-content">
    <hl-form>
      <hl-form-item label="旧密码">
        <hl-input
          v-model="data.oldPassword"
          placeholder="请输入旧密码"
          :type="showOldPassword ? 'text' : 'password'"
          :maxlength="20"
          clearable
        >
          <i slot="suffix"
            class="hl-input_button hl-icon"
            :class="showOldPassword ? 'hl-icon-eye' : 'hl-icon-eye-close'"
            @click="showOldPassword = !showOldPassword"
          />
        </hl-input>
      </hl-form-item>
      <hl-form-item label="新密码">
        <hl-input
          v-model="data.newPassword"
          placeholder="设置新密码"
          :type="showPassword ? 'text' : 'password'"
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
      </hl-form-item>
    </hl-form>
    <hl-description :error="errorMessage">设置8-20位登录密码，包含数字和字母，区分大小写</hl-description>

    <hl-button type="primary" @click="submit">重置密码</hl-button>
  </div>
</template>

<script>
import Passport from 'common/api/passport'
import Validate from 'common/validate'
import Toast from '@/components/toast'
import HlInput from '@/components/input'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlDescription from '@/components/description'
import HlButton from '@/components/button'
export default {
  name: 'HlUpdatePassword',
  components: {
    HlInput,
    HlForm,
    HlFormItem,
    HlDescription,
    HlButton
  },
  data () {
    return {
      data: {
        oldPassword: '',
        newPassword: ''
      },
      showOldPassword: false,
      showPassword: false,
      errorMessage: ''
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
  methods: {
    submit () {
      this.validate(this.data) && this.changePassword(this.data)
    },
    async changePassword (data) {
      try {
        await Passport.changePassword(
          data.oldPassword,
          data.newPassword
        )
        Toast.show('登录密码修改成功')
        this.goBack()
      } catch (err) {
        this.errorMessage = err.message
      }
    },
    validate (data) {
      const validateResult = Validate.test(data, {
        oldPassword: [{ message: '请输入旧密码' }],
        newPassword: [{ message: '请输入新密码' }, { validator: 'password' }]
      })
      if (!validateResult.result) {
        this.errorMessage = validateResult.message
      }
      return validateResult.result
    },
    clearErrorMessage () {
      this.errorMessage = ''
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-button.hl-button_primary {
    margin-top: 120px;
  }

  .hl-input::v-deep .hl-input_button {
    display: block;
    color: $themeColor;
    cursor: pointer;
  }
}
</style>
