<template>
  <div class="hl-content">
    <svg class="hl-logo hl-pic"><use xlink:href="#hl-pic-logo"></use></svg>

    <hl-input
      v-model="data.mobile"
      placeholder="请输入您的手机号"
      :class="{'hl-input_content': data.mobile}"
      :maxlength="30"
      clearable
    >
      <i slot="prefix" class="hl-input__title">手机号</i>
    </hl-input>
    <hl-input
      v-model="data.password"
      placeholder="请输入密码"
      :class="{'hl-input_content': data.password}"
      :type="showPassword ? 'text' : 'password'"
      :maxlength="20"
      clearable
    >
      <i slot="prefix" class="hl-input__title">密码</i>
      <i
        slot="suffix"
        class="hl-input_button hl-icon"
        :class="showPassword ? 'hl-icon-eye' : 'hl-icon-eye-close'"
        @click="showPassword = !showPassword"
      />
    </hl-input>
    <hl-description :error="errorMessage" />
    <hl-button type="primary" @click="submit">
      登录
    </hl-button>
    <div class="hl-bottom-box">
      <hl-button @click="goPasswordReset">忘记密码？</hl-button>
      <hl-button
        class="hl-regist-button"
        @click="goRegister"
      >
        新朋友，<span>立即注册</span>
      </hl-button>
    </div>
  </div>
</template>

<script>
import Common from 'common/common'
import Validate from 'common/validate'
import Passport from 'common/api/passport'
import HlInput from '@/components/input'
import Toast from '@/components/toast'
import HlButton from '@/components/button'
import HlDescription from '@/components/description'
export default {
  name: 'HlLogin',
  components: {
    HlInput,
    HlButton,
    HlDescription
  },
  data () {
    return {
      data: {
        mobile: '',
        password: ''
      },
      errorMessage: '',
      showPassword: false
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
      this.validate(this.data) && this.login(this.data)
    },
    async login (data) {
      try {
        await Passport.login(data.mobile, data.password)
        Common.clearIdentity()
        Toast.show('登录成功')
        this.goHtml()
      } catch (err) {
        this.errorMessage = err.message
      }
    },
    validate (data) {
      const validateResult = Validate.test(data, {
        mobile: [{ message: '请输入手机号或用户名' }],
        password: [{ message: '请输入登录密码' }]
      })
      if (!validateResult.result) {
        this.errorMessage = validateResult.message
      }
      return validateResult.result
    },
    clearErrorMessage () {
      this.errorMessage = ''
    },
    goPasswordReset () {
      this.$router.push({
        name: 'passwordReset'
      })
    },
    goRegister () {
      this.$router.replace({
        name: 'register'
      })
    },
    goHtml () {
      const { backurl, backurlhtml } = this.$route.query
      if (backurl) {
        this.$router.replace({
          path: `/${backurl}`,
          query: {
            t: Math.random()
          }
        })
      } else if (backurlhtml) {
        location.href = backurlhtml.replace('_', '#')
      } else {
        this.$router.replace({
          name: 'profile'
        })
      }
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
    border-bottom: $lineBorder;

    &:after {
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
      font-size: $titleSize;
      font-weight: bold;
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

    .hl-input_button {
      display: block;
      color: $themeColor;
      cursor: pointer;
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

  .hl-description {
    width: 630px;
    margin: 20px auto;
    margin-left: 60px;
  }

  .hl-button.hl-button_primary {
    margin-top: 23px;
    margin-bottom: 40px;
    width: 630px;
  }

  .hl-button.hl-button_default {
    display: block;
    margin: auto;
    font-size: $descriptionSize;
    color: $subTitleColor;
  }

  .hl-bottom-box {
    display: flex;
    justify-content: space-between;
    padding: 0 60px;

    .hl-button.hl-button_default {
      margin: 0;
    }

    .hl-regist-button.hl-button.hl-button_default {
      color: $textColor;

      span {
        color: $systemColor;
      }
    }
  }
}
</style>
