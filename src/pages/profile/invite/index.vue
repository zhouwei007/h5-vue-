<template>
  <div class="hl-content">
    <hl-swiper
      :index.sync="swiperIndex"
      @slide-change="handleSwipe"
    >
      <hl-swiper-slide
        v-for="(item, index) in images"
        :key="index"
      >
        <div
          class="hl-invite"
          :class="`hl-invite_${index}`"
        >
          <img
            v-show="item.src"
            :src="item.src"
          >
        </div>
      </hl-swiper-slide>
    </hl-swiper>
    <canvas
      ref="canvas"
      class="hl-canvas"
      :style="canvasStyle"
      :width="canvasWidth"
      :height="canvasHeight"
    />
  </div>
</template>

<script>
import Utils from 'common/utils'
import Share from 'common/share'
import Passport from 'common/api/passport'
import Canvas from './canvas'
import { HlSwiper, HlSwiperSlide } from '@/components/swiper'
import SETTING from '@/setting'
export default {
  name: 'HlInvite',
  components: {
    HlSwiper,
    HlSwiperSlide
  },
  mixins: [Canvas],
  data () {
    return {
      code: '',
      qrcode: '',
      images: [],
      swiperIndex: 0
    }
  },
  created () {
    const hasReload = localStorage.getItem(SETTING.LS_INVITE_RELOAD_KEY)
    if (!hasReload && Share.isWeChat && Share.isIOS) {
      localStorage.setItem(SETTING.LS_INVITE_RELOAD_KEY, 1)
      location.reload()
    } else if (hasReload) {
      localStorage.removeItem(SETTING.LS_INVITE_RELOAD_KEY)
    }
  },
  mounted () {
    this.init()
    this.debounceInit = Utils.debounce(300, this.init)
    window.addEventListener('resize', this.debounceInit)
  },
  destroyed () {
    window.removeEventListener('resize', this.debounceInit)
  },
  methods: {
    async init () {
      this.canvas = this.$refs.canvas
      await this.getInviteCode()
      const arr = []
      for (let i = 1; i <= 6; i++) {
        arr.push({
          url: require(`images/invite-${i}.jpg`),
          src: null,
          size: 155,
          top: i < 4 ? 955 : 975,
          left: 445,
          drawText: true
        })
      }
      this.images = arr
      this.resize()
      this.handleSwipe()
    },
    async draw (data) {
      const background = await Utils.imageOnload(data.url)
      return this.drawImage(background, this.qrcode, data.size, data.top, data.left, data.drawText)
    },
    async getInviteCode () {
      try {
        const response = await Passport.inviteCode()
        this.code = response.code
        this.followUrl = response.jumpUrl
        this.qrcodeUrl = Utils.formatQrcodeUrl(response.wxurl)
        this.qrcode = await Utils.imageOnload(this.qrcodeUrl)
        this.handleShare()
      } catch (err) {
        Utils.errorLog(err, 'INVITE-CODE')
      }
    },
    handleShare () {
      const ticket = Utils.utf8ToBase64(JSON.stringify({
        index: this.swiperIndex,
        code: this.code,
        followUrl: this.followUrl,
        qrcodeUrl: this.qrcodeUrl
      }))
      return new Share({
        title: SETTING.WECHAT_TITLE,
        description: SETTING.WECHAT_DESCRIPTION,
        url: `${location.origin}${process.env.BASE_URL}share?ticket=${ticket}`
      })
    },
    handleSwipe () {
      this.handleShare()
      this.getCanvasUrl(this.swiperIndex)
      this.getCanvasUrl(this.swiperIndex - 1)
      this.getCanvasUrl(this.swiperIndex + 1)
    },
    async getCanvasUrl (index) {
      if (!this.images[index] || this.images[index].src) {
        return
      }
      const url = await this.draw(this.images[index])
      this.$set(this.images[index], 'src', url)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-canvas {
    display: none;
  }
  .hl-swiper {
    height: 100%;
    width: 100%;

    .swiper-slide {
      width: 100% !important;
    }

    .hl-invite {
      height: 100%;

      &.hl-invite_0 {
        background-color: #070000;
      }

      &.hl-invite_1 {
        background-color: #310449;
      }

      &.hl-invite_2 {
        background-color: #0c0700;
      }

      &.hl-invite_3 {
        background-color: #060c34;
      }

      &.hl-invite_4 {
        background-color: #130d0b;
      }

      &.hl-invite_5 {
        background-color: #141515;
      }

      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
      }
    }
  }
}
</style>
