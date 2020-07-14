<template>
  <div class="hl-content">
    <div class="hl-banner">
      <header class="hl-header">
        <div class="hl-header__bg-1" />
        <div class="hl-header__bg-2" />
        <i class="hl-avatar">
          <img v-if="headImgUrl" :src="headImgUrl"/>
          <svg v-else class="hl-pic"><use xlink:href="#hl-pic-avator"></use></svg>
        </i>
        <span class="hl-username">{{ username }}</span>
        <hl-button :class="{'hl-button_dot': messageStatus}" @click="goMessage">消息</hl-button>
      </header>
      <div class="hl-body">
        <div class="hl-body__bottom-line" />
        <div class="hl-body__right-line" />
        <div class="hl-body__top-line" />
        <div class="hl-body__left-line" />
        <div class="hl-body__content" v-if="hasAuthenticate">
          <div class="hl-body__item">
            <p class="hl-body__label">
              <span>我的客户</span>
            </p>
            <span class="hl-body__amount">
              {{ amount.total }}
            </span>
          </div>
          <ul class="hl-body__item hl-body__item_flex">
            <li class="hl-body__cell">
              <p class="hl-body__label">
                <span>本月新增客户</span>
              </p>
              <span class="hl-body__amount">
                {{ amount.add }}
              </span>
            </li>
            <li class="hl-body__cell">
              <p class="hl-body__label">
                <span>本月推荐客户</span>
              </p>
              <span class="hl-body__amount">
                {{ amount.recommend }}
              </span>
            </li>
          </ul>
        </div>
        <div v-else>
          <h4 class="hl-body__title">完成实名认证赚取奖励</h4>
          <hl-button @click="goCertification">立即认证</hl-button>
        </div>
      </div>
    </div>
    <ul class="hl-entrance">
      <li
        v-for="(item, index) in entranceOptions"
        :key="index"
        class="hl-entrance__item"
        @click="handleMenu(item.key, item.type)"
        @touchstart="touchstart"
      >
        <p :class="['hl-entrance__icon', item.key]">
          <svg v-if="item.svg" class="hl-pic"><use :xlink:href="`#${item.icon}`"></use></svg>
          <img v-else :src="item.icon">
        </p>
        <p class="hl-entrance__label">
          {{ item.label }}
        </p>
      </li>
    </ul>
    <section
      v-if="hasAuthenticate"
      class="hl-card"
    >
      <h4 class="hl-card__title">
        <span>我的推荐</span>
        <i
          class="hl-icon hl-icon-info"
          @click="handleHelp('myinvite_saas')"
        />
      </h4>
      <hl-menu>
        <hl-menu-item
          v-for="option in upvotesMenuOptions"
          :key="option.key"
          :label="option.label"
          :content="option.num === void 0 ? null : `${option.num}件`"
          @click="goLoan(option.key)"
        >
          <i slot="prefix" :class="`hl-icon ${option.icon}`" />
        </hl-menu-item>
      </hl-menu>
    </section>

    <section class="hl-card">
      <h4 class="hl-card__title">更多服务</h4>
      <hl-menu>
        <hl-menu-item
          label="银行卡"
          :content="`${ identity ? (identity.bankCardCount || 0) : 0 }张`"
          @click="handleMenu('bankcard')"
        >
          <i slot="prefix" class="hl-icon hl-icon-card" />
        </hl-menu-item>
        <hl-menu-item
          v-if="isSeller"
          label="邀请经纪人"
          @click="handleMenu('invite')"
        >
          <i slot="prefix" class="hl-icon hl-icon-user-add" />
        </hl-menu-item>
        <hl-menu-item
          v-if="isSeller"
          label="我的经纪人"
          :content="`${ identity ? (identity.myBrokerNum || 0) : 0 }个`"
          @click="handleMenu('broker')"
        >
          <i slot="prefix" class="hl-icon hl-icon-broker" />
        </hl-menu-item>
        <hl-menu-item
          v-if="seller.mobile"
          label="我的专属客服"
          :content="seller.name"
        >
          <template slot="prefix">
            <i class="hl-icon hl-icon-service" />
            <a class="hl-callphone" :href="`tel:${seller.mobile}`" />
          </template>
        </hl-menu-item>
        <hl-menu-item
          label="意见反馈"
          @click="handleMenu('feedback')"
        >
          <i slot="prefix" class="hl-icon hl-icon-mail" />
        </hl-menu-item>
        <hl-menu-item
          label="账户设置"
          @click="handleMenu('setting')"
        >
          <i slot="prefix" class="hl-icon hl-icon-setting" />
        </hl-menu-item>
      </hl-menu>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Common from 'common/common'
import Utils from 'common/utils'
import BS from 'common/bs'
import IdentityApi from 'common/api/identity'
import Confirm from '@/components/confirm'
import HlButton from '@/components/button'
import HlMenu from '@/components/menu'
import HlMenuItem from '@/components/menu-item'
import SETTING from '@/setting'
export default {
  name: 'HlProfile',
  components: {
    HlButton,
    HlMenu,
    HlMenuItem
  },
  data () {
    return {
      messageStatus: 0,
      entranceOptions: []
    }
  },
  computed: {
    ...mapState([
      'identity',
      'welcome'
    ]),
    ...mapGetters([
      'username',
      'headImgUrl',
      'hasAuthenticate',
      'isSeller'
    ]),
    amount () {
      return {
        total: Utils.safeGet(this.identity, 'totalCustomer', '0'),
        add: Utils.safeGet(this.identity, 'thisMonthNewCustomer', '0'),
        recommend: Utils.safeGet(this.identity, 'thisMonthCreateApply', '0')
      }
    },
    seller () {
      return {
        name: this.identity ? this.identity.saleName : '',
        mobile: this.identity ? this.identity.saleMobile : ''
      }
    },
    upvotesMenuOptions () {
      const menuOptions = [{
        key: 0,
        label: '审核中',
        icon: 'hl-icon-audit'
      }, {
        key: 1,
        label: '放款成功',
        icon: 'hl-icon-success'
      }, {
        key: 2,
        label: '未通过',
        icon: 'hl-icon-fail'
      }]
      const keys = ['waitApplyNum', 'successApplyNum', 'failApplyNum']
      if (this.identity && keys.some(key => this.identity[key] !== 0)) {
        return keys.map((key, index) => ({
          ...menuOptions[index],
          num: this.identity[key]
        }))
      }
      return menuOptions
    }
  },
  mounted () {
    Common.getIdentity()
    this.handleWelcome()
    this.getEntranceOptions()
    this.getMessageStatus()
  },
  methods: {
    ...mapMutations({
      setWelcome: STORE_TYPES.SET_WELCOME
    }),
    async getEntranceOptions () {
      try {
        const response = await IdentityApi.bs(SETTING.BS_PROFILE_BUTTON_KEY)
        this.entranceOptions = Object.values(response)
          .filter(item => item.status)
          .sort((a, b) => a.sn - b.sn)
          .map(item => {
            return {
              key: item.codeName2,
              label: item.codeValue,
              type: item.zhSpell || null,
              icon: item.codeName,
              svg: item.codeName && item.codeName.startsWith('hl-pic')
            }
          })
      } catch (err) {
        Utils.errorLog(err, 'GET-BS-VALUE', true)
      }
    },
    async getMessageStatus () {
      try {
        this.messageStatus = await IdentityApi.getMessageStatus()
      } catch (err) {
        Utils.errorLog(err, 'GET-MESSAGE-STATUS')
      }
    },
    async handleHelp (key) {
      Confirm.show({
        message: await BS.getValue(SETTING.BS_ERROR_MESSAGE_KEY, key)
      })
    },
    handleWelcome () {
      if (this.welcome) {
        Confirm.show({
          title: '恭喜您注册成功',
          message: '实名认证后即可推荐借款人借款',
          cancel: '暂不认证',
          submit: '立即认证',
          handleSubmit: this.goCertification
        })
        this.setWelcome(false)
      }
    },
    handleMenu (key, type = null) {
      if (type === 'wechat') {
        this.isWeChatFans(this.goHref.bind(this, key))
      } else if (key.startsWith('http')) {
        this.goHref(key)
      } else {
        this.$router.push({
          name: key
        })
      }
    },
    async isWeChatFans (cb) {
      try {
        const response = await IdentityApi.isFans()
        response.fansStatus === 1
          ? cb()
          : Confirm.show({
            title: '关注微信公众号',
            message: `请前往微信关注公众号"${SETTING.WECHAT_TITLE}"后进行登录领取`,
            submit: '知道了'
          })
      } catch (err) {
        Utils.errorLog(err, 'GET-FAN-STATUS')
      }
    },
    goHref (url) {
      location.href = url
    },
    goLoan (type) {
      this.$router.push({
        name: 'loan',
        query: { type }
      })
    },
    goMessage (type) {
      this.$router.push({
        name: 'message'
      })
    },
    goCertification () {
      this.$router.push({
        name: 'certification'
      })
    },
    touchstart () {
      // For mobile active style
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-banner {
    height: $headerHeight + 292px;
    color: $blockColor;
    background: $subThemeColor;

    .hl-header {
      position: relative;
      display: flex;
      align-items: center;
      height: $headerHeight + 12px;
      padding: 0 30px;
      font-size: $headerSize;

      .hl-header__bg-1 {
        position: absolute;
        top: 0;
        right: 137px;
        width: 408px;
        height: $headerHeight;
        background-image: linear-gradient(200deg, #2F304A 18%, rgba(30,31,50,0.00) 69%);
        transform: rotate(-45deg);
      }

      .hl-header__bg-2 {
        position: absolute;
        top: 0;
        right: 25px;
        width: 388px;
        height: $headerHeight;
        background-image: linear-gradient(189deg, #33344F 19%, rgba(30,31,50,0.00) 56%);
        transform: rotate(-45deg);
      }

      .hl-avatar {
        width: 44px;
        height: 44px;
        margin-right: 10px;
        background: $blockColor;
        border-radius: 50%;
        overflow: hidden;

        .hl-pic {
          width: 100%;
          height: 100%;
          color: $blockColor;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .hl-username {
        flex: auto;
      }

      .hl-button {
        position: relative;
        font-size: $textSize;
        color: $blockColor;

        &:active {
          color: $blockActiveColor;
          transform: scale(.99);
        }

        &.hl-button_dot::after {
          content: '';
          position: absolute;
          right: -14px;
          top: -10px;
          width: 14px;
          height: 14px;
          background-color: $errorColor;
          border-radius: 50%;
        }
      }
    }

    .hl-body {
      position: relative;
      height: 340px;
      margin: 0 30px;
      background-image: linear-gradient(269deg, #fc670f 0%, #f23d0a 100%);
      box-shadow: 0 10px 20px 0 rgba(202,54,15,0.30);
      border-radius: 20px;
      overflow: hidden;

      .hl-body__content {
        position: absolute;
        top: 50px;
        right: 0;
        left: 50px;
      }

      .hl-body__bottom-line {
        position: absolute;
        right: -112px;
        bottom: -80px;
        width: 212px;
        height: 242px;
        background-image: linear-gradient(-77deg, #ff7a12 23%, rgba(252,151,15,0.51) 38%, rgba(249,87,13,0.00) 100%);
        transform: rotate(-45deg);
      }

      .hl-body__right-line {
        position: absolute;
        right: -12px;
        bottom: -140px;
        width: 112px;
        height: 246px;
        background-image: linear-gradient(217deg, #ff9b00 0%, rgba(250,98,12,0.00) 60%);
        transform: rotate(45deg);
      }

      .hl-body__top-line {
        position: absolute;
        left: -40px;
        top: -70px;
        width: 144px;
        height: 126px;
        background-image: linear-gradient(127deg, rgba(248,86,10,0.00) 45%, #ff8227 100%);
        transform: rotate(-45deg);
      }

      .hl-body__left-line {
        position: absolute;
        left: -30px;
        top: -120px;
        width: 230px;
        height: 209px;
        background-image: linear-gradient(254deg, #FF5E00 24%, rgba(242,62,10,0.00) 100%);
        transform: rotate(-45deg);
      }

      .hl-body__label {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-size: $descriptionSize;
        line-height: 37px;

        .hl-icon {
          margin-left: 20px;
          font-size: 35px;
          cursor: pointer;
        }

        .hl-icon.hl-icon-eye-fine,
        .hl-icon.hl-icon-eye-close-fine {
          font-size: 36px;
        }
      }

      .hl-body__amount {
        line-height: 63px;
        @include number(54px);
      }

      .hl-body__item {
        margin-bottom: 30px;
      }

      .hl-body__item_flex {
        display: flex;
        justify-content: space-around;

        .hl-body__cell {
          flex: auto;
          width: 0;

          .hl-icon {
            margin-left: 10px;
            font-size: $textSize;

            &.hl-icon-info {
              font-size: 40px;
            }
          }

          .hl-body__amount {
            font-size: 48px;
            line-height: 42px;
          }
        }
      }

      .hl-body__title {
        margin-top: 96px;
        margin-bottom: 30px;
        font-size: $titleSize;
        text-align: center;
      }

      .hl-button {
        display: block;
        margin: auto;
        width: 240px;
        height: 70px;
        font-size: $descriptionSize;
        color: #f23d0a;
        border-radius: 35px;
        background-image: linear-gradient(180deg, #fff 0%, #ffbfad 100%);
        box-shadow: 0 10px 20px 0 #f23d0a;
        font-weight: 600;

        &:active {
          border-color: $blockActiveColor;
          transition: background-color .2s;
          transform: scale(.99);
        }
      }
    }
  }

  .hl-entrance {
    display: flex;
    justify-content: space-between;
    padding: 100px 54px 0px 54px;

    .hl-entrance__item {
      height: 140px;
      margin-bottom: 40px;
      text-align: center;
      cursor: pointer;

      &:active {
        transform: scale(.98);
      }

      .hl-entrance__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90px;
        height: 90px;
        margin: 0 auto;
        color: $blockColor;
        border-radius: 45px;

        svg {
          display: block;
          width: 46px;
          height: 46px;
        }

        img {
          width: 100%;
          height: 100%;
        }

        &.customer {
          background-image: linear-gradient(180deg, #5ade7c 0%, #00bd7a 99%);
        }

        &.brokerage {
          background-image: linear-gradient(180deg, #ffac36 0%, #f85d1b 100%);
        }

        &.estimateRecord {
          background-image: linear-gradient(180deg, #6a8dff 0%, #6d48f4 100%);
        }

        &.queryRecord {
          background-image: linear-gradient(180deg, #ff7b53 0%, #ff4141 100%);
        }
      }

      .hl-entrance__label {
        padding-top: 12px;
        font-size: $descriptionSize;
        line-height: 38px;
        font-weight: 600;
        color: $textColor;
      }
    }
  }

  .hl-card {
    width: 690px;
    margin: auto;
    margin-bottom: 20px;
    padding-bottom: 10px;
    background-color: $blockColor;
    border-radius: $cardRadius;

    .hl-card__title {
      display: flex;
      align-items: center;
      padding: 0 30px;
      font-size: $titleSize;
      font-weight: 500;
      line-height: 100px;
      border-bottom: $splitBorder;

      .hl-icon {
        margin-left: 10px;
        color: $iconColor;
        font-size: 45px;
        cursor: pointer;
      }
    }

    .hl-button.hl-button_primary {
      width: 450px;
      height: 80px;
      margin-top: 20px;
      margin-bottom: 10px;
      line-height: 80px;
    }

    .hl-menu {
      margin: 0;

      .hl-icon {
        display: block;
        width: 54px;
        height: 54px;
        margin-right: 10px;
        color: $themeColor;
        font-size: 48px;
      }

      .hl-menu-item::v-deep {
        position: relative;
        padding-right: 30px;

        .hl-icon-audit, .hl-icon-card, .hl-icon-setting {
          color: #3c67f7;
        }

        .hl-icon-success, .hl-icon-mail, .hl-icon-user-add {
          color: #0ec3b5;
        }

        .hl-icon-broker {
          margin-right: 8px;
          margin-left: 2px;
          font-size: 42px;
        }

        .hl-menu-item__inner {
          padding-right: 0;
          font-weight: 600;
        }
      }

      .hl-callphone {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }

  .hl-card:last-child {
    margin-bottom: 30px;
  }
}
</style>
