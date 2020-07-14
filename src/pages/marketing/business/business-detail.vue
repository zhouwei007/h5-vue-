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
        <img
          class="hl-image"
          :width="realWidth"
          :height="realHeight"
          :style="canvasStyle"
          :src="item.src"
        >
        <p class="hl-info">长按图片进行保存</p>
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
import { mapGetters } from 'vuex'
import Utils from 'common/utils'
import CmsApi from 'common/api/cms'
import { HlSwiper, HlSwiperSlide } from '@/components/swiper'
export default {
  name: 'HlBusinessDetail',
  components: {
    HlSwiper,
    HlSwiperSlide
  },
  data () {
    return {
      images: [],
      swiperIndex: 0,
      dpr: 1,
      times: 1.854,
      canvas: null,
      canvasWidth: 0,
      canvasHeight: 0,
      imageHeight: 0
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'mobile'
    ]),
    realWidth () {
      return this.canvasWidth / this.times
    },
    realHeight () {
      return this.canvasHeight / this.times
    },
    canvasStyle () {
      return {
        width: `${this.realWidth}px`,
        height: `${this.realHeight}px`
      }
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
      this.images = await this.getBusinessImages(this.$route.query.type)
      this.swiperIndex = Number(this.$route.query.index || 0)
      this.resize()
      this.handleSwipe()
    },
    async getBusinessImages (type = 0) {
      try {
        const response = await CmsApi.getBusinessImages()
        let dataList = { 0: [] }
        for (const item of response) {
          const value = Number(item.link)
          if (!value) {
            continue
          }
          dataList[item.link] = Object.keys(item).reduce((arr, key) => {
            key.startsWith('picture') && arr.push(item[key])
            return arr
          }, [])
          dataList[0] = dataList[item.link].concat(dataList[0])
        }
        return dataList[type].map(url => ({
          url,
          src: null
        }))
      } catch (err) {
        Utils.errorLog(err, 'GET-BUSINESS-IMAGES', true)
        return []
      }
    },
    handleSwipe () {
      this.getCanvasUrl(this.swiperIndex)
      this.getCanvasUrl(this.swiperIndex - 1)
      this.getCanvasUrl(this.swiperIndex + 1)
    },
    async getCanvasUrl (index) {
      if (!this.images[index] || this.images[index].src) {
        return
      }
      const url = await this.draw(this.images[index].url)
      this.$set(this.images[index], 'src', url)
    },
    async draw (src) {
      // const vcard = `${escape('BEGIN:VCARD\r\nN:')}${Utils.utf16ToUtf8(this.username)}${escape(`\r\nTEL:${this.mobile}\r\nEND:VCARD`)}`
      // const [background, qrcode] = await Promise.all([
      //   Utils.imageOnload(src),
      //   Utils.imageOnload(Utils.formatQrcodeUrl(vcard))
      // ])
      const background = await Utils.imageOnload(src)
      const ctx = this.canvas.getContext('2d')
      // const radius = this.getSize(26)
      // ctx.fillStyle = '#fff'
      // this.drawRoundRect(ctx, 0, 0, this.canvasWidth, this.canvasHeight, 0)
      this.drawRoundImage(ctx, background, 0, 0, this.canvasWidth, this.imageHeight, 0)
      // this.drawAvatar(ctx)
      // this.drawText(ctx)
      // qrcode && ctx.drawImage(qrcode, this.getSize(480), this.getSize(800), this.getSize(180), this.getSize(180))
      return this.canvas.toDataURL('image/png')
    },
    drawAvatar (ctx) {
      ctx.fillStyle = '#c4c4c4'
      this.drawRoundRect(ctx, this.getSize(40), this.getSize(838), this.getSize(100), this.getSize(100), this.getSize(50))
      ctx.font = `${this.getSize(50)}px Semibold`
      ctx.fillStyle = '#fff'
      ctx.fillText(this.username.substr(0, 1).toUpperCase(), this.getSize(65), this.getSize(906))
    },
    drawText (ctx) {
      ctx.fillStyle = '#333'
      ctx.font = `${this.getSize(36)}px Semibold`
      ctx.fillText(this.username, this.getSize(160), this.getSize(865))
      ctx.font = `${this.getSize(30)}px hl-icon`
      ctx.fillText('\ue10b', this.getSize(155), this.getSize(910))
      ctx.font = `${this.getSize(24)}px Semibold`
      ctx.fillText(this.mobile, this.getSize(188), this.getSize(904))
      ctx.fillStyle = '#999'
      ctx.fillText('长按识别二维码', this.getSize(157), this.getSize(940))
    },
    drawRoundRect (ctx, x, y, width, height, r, fill = true, stroke = false) {
      if (typeof r === 'number') {
        r = [r, r, r, r]
      }
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x + r[0], y)
      ctx.arcTo(x + width, y, x + width, y + r[0], r[0])
      ctx.arcTo(x + width, y + height, x + width - r[2], y + height, r[2])
      ctx.arcTo(x, y + height, x, y + height - r[3], r[3])
      ctx.arcTo(x, y, x + r[1], y, r[1])
      fill && ctx.fill()
      stroke && ctx.stroke()
      ctx.restore()
    },
    drawRoundImage (ctx, image, x, y, width, height, r) {
      ctx.save()
      this.drawRoundRect(ctx, x, y, width, height, r)
      ctx.clip()
      image && ctx.drawImage(image, x, y, width, height)
      ctx.restore()
    },
    resize () {
      this.dpr = parseFloat(document.documentElement.style.fontSize) / 75
      this.canvasWidth = this.getSize(670)
      this.canvasHeight = this.getSize(792) // this.getSize(984)
      this.imageHeight = this.getSize(792)
    },
    getSize (size) {
      return size * this.dpr * this.times
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-canvas {
    display: none;
  }

  .hl-image {
    display: block;
    margin: 40px auto;
    border-radius: 26px;
    box-shadow: 0 0 30px 0 rgba(0,0,0,0.15);
  }

  .hl-info {
    margin: 30px 0;
    text-align: center;
    color: $descriptionColor;
    @include label($textSize);
  }
}
</style>
