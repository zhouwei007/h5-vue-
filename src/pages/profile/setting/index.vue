<template>
  <div class="hl-content">
    <hl-menu>
      <hl-menu-item v-for="option in menuOptions"
        :key="option.key"
        :label="option.label"
        :content="option.content"
        :show-arrow="option.showArrow !== false"
        @click="handleMenu(option.key)">
        <i slot="prefix" :class="`hl-icon ${option.icon}`"></i>
      </hl-menu-item>
    </hl-menu>

    <hl-button type="bottom" @click="handleLogoutConfirm">
      退出登录
    </hl-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Passport from 'common/api/passport'
import Common from 'common/common'
import Utils from 'common/utils'
import HlButton from '@/components/button'
import HlMenu from '@/components/menu'
import HlMenuItem from '@/components/menu-item'
import Confirm from '@/components/confirm'
export default {
  name: 'HlSetting',
  components: {
    HlButton,
    HlMenu,
    HlMenuItem
  },
  computed: {
    ...mapGetters([
      'username',
      'hasAuthenticate'
    ]),
    menuOptions () {
      return [this.hasAuthenticate ? {
        key: 'name',
        label: '真实姓名',
        content: this.username,
        icon: 'hl-icon-certificate',
        showArrow: false
      } : {
        key: 'certification',
        label: '实名认证',
        content: '立即认证',
        icon: 'hl-icon-certificate'
      }, {
        key: 'updatePassword',
        label: '登录密码',
        content: '修改',
        icon: 'hl-icon-lock'
      }, {
        key: 'updateMobile',
        label: '手机号',
        content: '修改',
        icon: 'hl-icon-phone'
      }]
    }
  },
  methods: {
    handleLogoutConfirm () {
      Confirm.show({
        title: '确认退出登录吗？',
        cancel: true,
        handleSubmit: this.logout
      })
    },
    async logout () {
      try {
        await Passport.logout()
        Common.clearIdentity()
        this.goLogin()
      } catch (err) {
        Utils.errorLog(err, 'LOGOUT', false)
      }
    },
    handleMenu (type) {
      if (type === 'name') {
        return
      }
      this.$router.push({
        name: type
      })
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
  .hl-menu {
    .hl-icon {
      margin-right: 10px;
      font-size: 54px;
      color: $themeColor;
    }
  }

  .hl-button.hl-button_bottom {
    color: $textColor;
    background-image: none;
    background-color: $blockColor;

    &:not(.hl-button_disabled):active {
      background-image: none;
      background-color: $blockActiveColor;
    }
  }
}
</style>
