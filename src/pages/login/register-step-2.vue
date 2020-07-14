<template>
  <div class="hl-content">
    <i
      class="hl-back-button hl-icon hl-icon-arrow-left"
      @click="back"
    />

    <h1 class="hl-title">设置登录密码</h1>
    <hl-input
      v-model="data.password"
      placeholder="请输入登录密码"
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
    <hl-description :error="errorMessage">
      设置8-20位登录密码，包含数字和字母，区分大小写
    </hl-description>

    <hl-button type="primary" @click="submit">注册</hl-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Passport from 'common/api/passport'
import Validate from 'common/validate'
import HlInput from '@/components/input'
import HlButton from '@/components/button'
import HlDescription from '@/components/description'
export default {
  name: 'HlRegisterStep2',
  components: {
    HlInput,
    HlButton,
    HlDescription
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
        password: ''
      },
      errorMessage: '',
      showPassword: false
    }
  },
  mounted () {
    this.data = { ...this.data, ...this.options }
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
    ...mapMutations({
      setWelcome: STORE_TYPES.SET_WELCOME
    }),
    submit () {
      this.validate(this.data).then(() => {
        this.regist(this.data)
      }).catch(message => {
        this.errorMessage = message
      })
    },
    regist (data) {
      Passport.regist(
        data.mobile,
        data.password,
        data.inviteCode,
        data.code
      ).then(() => {
        this.login(data)
      }).catch(err => {
        this.errorMessage = err.message
      })
    },
    login (data) {
      Passport.login(
        data.mobile,
        data.password
      ).then(() => {
        this.setWelcome(true)
        this.goProfile()
      }).catch(err => {
        this.errorMessage = err.message
      })
    },
    validate (data) {
      return new Promise((resolve, reject) => {
        const validateResult = Validate.test(data, {
          password: [{ message: '请输入登录密码' }, { validator: 'password' }]
        })
        if (!validateResult.result) {
          reject(validateResult.message)
          return
        }
        resolve()
      })
    },
    clearErrorMessage () {
      this.errorMessage = ''
    },
    goProfile () {
      this.$router.replace({
        name: 'profile'
      })
    },
    back () {
      this.$emit('prev')
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-back-button {
    position: fixed;
    top: 0;
    left: 0;
    width: $headerHeight;
    height: $headerHeight;
    line-height: $headerHeight;
    font-size: 55px;
    text-align: center;
    color: $subTitleColor;
    cursor: pointer;
  }

  .hl-title {
    width: 630px;
    margin: auto;
    margin-top: 148px;
    margin-bottom: 100px;
    font-size: 62px;
    font-weight: 600;
    color: $textColor;
  }

  .hl-input::v-deep {
    width: 630px;
    height: 110px;
    margin: auto;
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
  }

  .hl-description {
    width: 630px;
    margin: 20px auto;
  }

  .hl-button.hl-button_primary {
    margin-top: 100px;
    margin-bottom: 40px;
    width: 630px;
  }
}
</style>
