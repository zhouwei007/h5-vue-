<template>
  <div class="hl-content">
    <div class="hl-content__inner">
      <img
        v-if="imageSrc"
        class="hl-image"
        :width="realWidth"
        :height="realHeight"
        :style="canvasStyle"
        :src="imageSrc"
      >
      <canvas
        v-show="!imageSrc"
        ref="canvas"
        class="hl-canvas"
        :style="canvasStyle"
        :width="canvasWidth"
        :height="canvasHeight"
      />
    </div>

    <hl-button
      type="bottom"
      @click="submit"
    >
      赚取奖励金
    </hl-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Utils from 'common/utils'
import Share from 'common/share'
import Canvas from './canvas'
import TouchScroll from '@/mixins/touch-scroll'
import HlButton from '@/components/button'
import SETTING from '@/setting'
export default {
  name: 'HlInviteShare',
  components: {
    HlButton
  },
  mixins: [
    Canvas,
    TouchScroll
  ],
  data () {
    return {
      index: 0,
      code: '',
      followUrl: '',
      qrcodeUrl: '',
      imageSrc: ''
    }
  },
  mounted () {
    this.init()
    this.debounceDraw = Utils.debounce(300, this.draw)
    window.addEventListener('resize', this.debounceDraw)
  },
  destroyed () {
    window.removeEventListener('resize', this.debounceDraw)
  },
  methods: {
    ...mapMutations({
      setBackground: STORE_TYPES.SET_BACKGROUND
    }),
    init () {
      this.canvas = this.$refs.canvas
      this.getInviteCode()
      this.draw()
      this.handleShare()
    },
    submit () {
      location.replace(this.followUrl)
    },
    async draw () {
      this.resize()
      const [background, qrcode] = await Promise.all([
        Utils.imageOnload(require(`images/invite-${this.index + 1}.jpg`)),
        Utils.imageOnload(this.qrcodeUrl)
      ])
      const size = 155
      const top = this.index < 3 ? 955 : 975
      const left = 445
      const drawText = true
      this.imageSrc = this.drawImage(background, qrcode, size, top, left, drawText)
    },
    getInviteCode () {
      const bg = ['#070000', '#310449', '#0c0700', '#060c34', '#130d0b', '#141515']
      try {
        const ticket = JSON.parse(Utils.base64ToUtf8(this.$route.query.ticket))
        this.index = Number(ticket.index)
        this.code = ticket.code
        this.followUrl = ticket.followUrl
        this.qrcodeUrl = ticket.qrcodeUrl
        this.setBackground(bg[this.index])
      } catch {
        this.$router.replace({
          name: 'profile'
        })
      }
    },
    handleShare () {
      return new Share({
        title: SETTING.WECHAT_TITLE,
        description: SETTING.WECHAT_DESCRIPTION,
        url: location.href
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-content__inner {
    position: fixed;
    top: 0;
    right: 0;
    bottom: $footerHeight;
    left: 0;
    width: $screenWidth;
    margin: auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
