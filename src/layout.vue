<template>
  <div class="hl-yjj">
    <hl-header
      v-if="hasHeader"
      :title="title"
      :back="headerBack"
    >
      <hl-popover
        v-if="headerButton && headerButton.menu"
        slot="button"
        direction="bottom"
        custom-class="hl-popover_header"
      >
        <hl-button slot="button">{{ headerButton.text }}</hl-button>
        <div class="hl-dropdown">
          <hl-button
            v-for="item in headerButton.menu"
            :key="item.key"
            :class="{'hl-button_active': item.key === headerButton.current }"
            @click="handleClick(item.event)"
          >
            <span>{{ item.text }}</span>
          </hl-button>
        </div>
      </hl-popover>
      <hl-button
        v-else-if="headerButton"
        slot="button"
        :class="{'hl-button_icon': headerButton.icon}"
        :disabled="headerButton.disabled"
        @click="handleClick()"
      >
        <i
          v-if="headerButton.icon"
          class="hl-icon"
          :class="headerButton.icon"
        />
        <span v-else>{{ headerButton.text }}</span>
      </hl-button>
    </hl-header>
    <transition :name="direction">
      <router-view
        ref="main"
        class="hl-main hl-dialog__lock"
        :class="{
          'hl-main_header': hasHeader,
          'hl-main_footer': hasFooter
        }"
        :style="mainStyle"
      />
    </transition>
    <hl-footer
      v-if="hasFooter"
      :options="footerOption"
    />
    <hl-dialog :show.sync="showUpdateExists" :mask-close="false">
      <h4 class="hl-dialog__title">发现新版本</h4>
      <p class="hl-dialog__description">请点击更新加载新版本应用</p>
      <template slot='footer'>
        <hl-button type="primary" @click="refreshApp">更新</hl-button>
      </template>
    </hl-dialog>
  </div>
</template>

<script>
import Bus, { EVENT } from 'common/bus'
import { mapState, mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import HlHeader from '@/components/header'
import HlFooter from '@/components/footer'
import HlDialog from '@/components/dialog'
import HlButton from '@/components/button'
import HlPopover from '@/components/popover'
export default {
  name: 'HlLayout',
  components: {
    HlHeader,
    HlFooter,
    HlDialog,
    HlButton,
    HlPopover
  },
  data () {
    return {
      registration: null,
      showUpdateExists: false,
      refreshing: false,
      footerOption: [{
        label: '产品推荐',
        to: 'productList',
        icon: 'hl-icon-recommend',
        activeIcon: 'hl-icon-recommend-fill'
      }, {
        label: '我的客户',
        to: 'customer',
        icon: 'hl-icon-customers',
        activeIcon: 'hl-icon-customers-fill'
      }, {
        label: '营销工具',
        to: 'marketing',
        icon: 'hl-icon-marketing',
        activeIcon: 'hl-icon-marketing-fill'
      }, {
        label: '个人中心',
        to: 'profile',
        icon: 'hl-icon-profile',
        activeIcon: 'hl-icon-profile-fill'
      }],
      direction: 'slide-right',
      touchSwipe: 0,
      htmlElement: null,
      keyboardShow: false
    }
  },
  computed: {
    ...mapState([
      'title',
      'background',
      'headerBack',
      'headerButton'
    ]),
    meta () {
      return this.$route.meta || {}
    },
    hasHeader () {
      return this.$route.meta.title !== void 0
    },
    hasFooter () {
      return this.footerRoutes.indexOf(this.$route.name) !== -1
    },
    footerRoutes () {
      return this.footerOption.map(item => item.to)
    },
    mainStyle () {
      return {
        backgroundColor: this.background
      }
    }
  },
  watch: {
    '$route': {
      handler (val, oldVal) {
        this.handleTouchScroll()
        this.handleRouteMeta(val, oldVal)
        this.handleRouteAnimation(val, oldVal)
      },
      immediate: true
    }
  },
  created () {
    this.handleTouchSwipe()
    this.initPwa()
  },
  mounted () {
    this.$root.Bus.$on(EVENT.LOGOUT, this.logout)
    this.$root.Bus.$on(EVENT.ROUTE_ANIMATION, this.setRouteAnimation)
    this.$root.Bus.$on(EVENT.INPUT_FOCUS, this.handleKeyboardUp)
    this.$root.Bus.$on(EVENT.INPUT_BLUR, this.handleKeyboardDown)
  },
  destroyed () {
    this.$root.Bus.$off(EVENT.LOGOUT)
    this.$root.Bus.$off(EVENT.ROUTE_ANIMATION)
    this.$root.Bus.$off(EVENT.INPUT_FOCUS)
    this.$root.Bus.$off(EVENT.INPUT_BLUR)
  },
  methods: {
    ...mapMutations({
      setTitle: STORE_TYPES.SET_TITLE,
      setBackground: STORE_TYPES.SET_BACKGROUND,
      setHeaderBack: STORE_TYPES.SET_HEADER_BACK,
      setHeaderButton: STORE_TYPES.SET_HEADER_BUTTON
    }),
    logout () {
      this.$router.replace({
        name: 'login'
      })
    },
    handleClick (event) {
      Bus.$emit(EVENT.HEADER_BUTTON_CLICK)
      if (event && typeof event === 'function') {
        event()
      } else {
        typeof this.headerButton.event === 'function' && this.headerButton.event()
      }
    },
    handleRouteMeta (val) {
      let title, defaultBackground, headerBackOption, headerButtonOption
      if (val) {
        title = val.meta.title || ''
        if (val.meta.back === false) {
          headerBackOption = null
        } else {
          headerBackOption = {}
          val.meta.back && (headerBackOption.to = val.meta.back)
          val.meta.icon && (headerBackOption.icon = val.meta.icon)
        }
        headerButtonOption = val.meta.button || null
        defaultBackground = val.meta.background || '#f5f6fa'
      }
      this.setTitle(title)
      this.setHeaderBack(headerBackOption)
      this.setHeaderButton(headerButtonOption)
      this.background !== defaultBackground && this.setBackground(defaultBackground)
    },
    setRouteAnimation (val) {
      this.direction = val
    },
    handleRouteAnimation (val, oldVal) {
      const toDepth = val ? val.meta.depth : 0
      const fromDepth = oldVal ? oldVal.meta.depth : 0
      const fromHasHeader = !oldVal || oldVal.meta.title !== void 0
      if (toDepth === fromDepth || (this.touchSwipe &&
        (this.touchSwipe === -1 || new Date().getTime() - this.touchSwipe < 600))) {
        this.touchSwipe = 0
        this.setRouteAnimation(null)
      } else {
        const animation = fromHasHeader ? 'slide-left' : 'index-slide-left'
        this.setRouteAnimation(toDepth < fromDepth ? 'slide-right' : animation)
      }
    },
    handleTouchSwipe () {
      this.htmlElement = document.getElementsByTagName('html')[0]
      const screenWidth = document.body.clientWidth
      const swipeBackWidth = screenWidth / 8
      const swipeForwardWidth = screenWidth - swipeBackWidth
      let swipeBackX = 0
      let swipeForwardX = 0
      let currentX = 0
      document.addEventListener('touchstart', e => {
        currentX = 0
        if (e.targetTouches.length > 1) {
          return
        }
        const pageX = e.targetTouches[0].pageX
        swipeBackX = pageX <= swipeBackWidth ? pageX : 0
        swipeForwardX = pageX >= swipeForwardWidth ? pageX : 0
        this.touchSwipe = -1
      })
      document.addEventListener('touchmove', e => {
        if (!this.keyboardShow) {
          document.body.scrollTop = 0
          this.htmlElement.scrollTop = 0
        }
        currentX = e.targetTouches[0].pageX
      })
      document.addEventListener('touchend', () => {
        if (currentX < 0) {
          currentX += screenWidth
        }
        if (currentX && swipeBackX) {
          this.touchSwipe = currentX - swipeBackX >= 25 ? new Date().getTime() : 0
        } else if (currentX && swipeForwardX) {
          this.touchSwipe = swipeForwardX - currentX >= 25 ? new Date().getTime() : 0
        } else {
          this.touchSwipe = 0
        }
      })
    },
    handleTouchScroll () {
      this.$nextTick(() => {
        const el = this.$refs.main.$el
        el.addEventListener('touchstart', () => {
          const top = el.scrollTop
          const totalScroll = el.scrollHeight
          const currentScroll = top + el.offsetHeight
          if (top === 0) {
            el.scrollTop = 1
          } else if (currentScroll === totalScroll) {
            el.scrollTop = top - 1
          }
        })
      })
    },
    handleKeyboardUp () {
      this.keyboardShow = true
    },
    handleKeyboardDown () {
      document.body.scrollTop = 0
      this.htmlElement.scrollTop = 0
      this.keyboardShow = false
    },
    initPwa () {
      document.addEventListener('swUpdated', this.showUpdateDialog, { once: true })
      navigator.serviceWorker && navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (this.refreshing) return
        this.refreshing = true
        window.location.reload()
      })
    },
    refreshApp () {
      this.showUpdateExists = false
      if (!this.registration || !this.registration.waiting) {
        return
      }
      this.registration.waiting.postMessage('skipWaiting')
    },
    showUpdateDialog (e) {
      this.registration = e.detail
      this.showUpdateExists = true
    }
  }
}
</script>

<style lang="scss">
.hl-popover.hl-popover_bottom.hl-popover_header {
  top: 75px !important;
  background-color: $blockColor;
  box-shadow: 0 0 20px 0 rgba(0,0,0,0.10);
  transform: translateX(-77%);
  overflow: visible;
  opacity: 1;
  z-index: 100;

  &::after {
    content: '';
    position: absolute;
    top: -18px;
    right: 30px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent $blockColor transparent;
  }

  .hl-dropdown {
    display: flex;
    flex-direction: column;

    .hl-button {
      min-width: 180px;
      height: 80px;
      font-size: $descriptionSize;
      color: $textColor;

      span {
        display: block;
        margin: 0 30px;
        line-height: 80px;
        border-bottom: $splitBorder;
      }
    }

    .hl-button:active {
      background-color: $blockActiveColor;
    }

    .hl-button.hl-button_active {
      color: $themeColor;
    }

    .hl-button:first-child {
      border-radius: $cardRadius $cardRadius 0 0;
    }

    .hl-button:last-child {
      border-radius: 0 0 $cardRadius $cardRadius;

      span {
        border-bottom: none;
      }
    }
  }
}
</style>
