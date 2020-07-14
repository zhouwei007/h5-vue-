<template>
  <div ref="preview" class="hl-preview pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg" />
    <div class="pswp__scroll-wrap">
      <div class="pswp__container">
        <div class="pswp__item" />
        <div class="pswp__item" />
        <div class="pswp__item" />
      </div>
      <div class="pswp__ui pswp__ui--hidden">
        <div class="pswp__top-bar">
          <div class="pswp__counter" />
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut" />
              </div>
            </div>
          </div>
        </div>
        <div class="pswp__caption">
          <div class="pswp__caption__center" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EXIF from 'exif-js'
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeDefault from 'photoswipe/dist/photoswipe-ui-default'
import Utils from 'common/utils'
import Loading from '@/components/loading'
export default {
  name: 'HlPreview',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      el: null,
      photoSwipe: null,
      needRotate: false,
      images: []
    }
  },
  watch: {
    data: {
      handler (val, oldVal) {
        this.revokeImages(oldVal)
        this.images = val.map(item => {
          if (item instanceof File) {
            return {
              src: URL.createObjectURL(item),
              w: 0,
              h: 0
            }
          }
          return typeof item === 'string' ? {
            src: item,
            w: 0,
            h: 0
          } : {
            src: item.src instanceof File ? URL.createObjectURL(item.src) : item.src,
            w: item.width,
            h: item.height
          }
        })
      },
      immediate: true
    }
  },
  mounted () {
    const isWeChat = /MicroMessenger/.test(navigator.userAgent)
    const isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
    this.needRotate = !(isIOS && isWeChat)
    this.el = this.$refs.preview
    document.body.appendChild(this.$el)
  },
  destroyed () {
    this.revokeImages(this.images)
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    async show (index) {
      if (!this.images[index].w || !this.images[index].h) {
        try {
          Loading.open('图片加载中...')
          const image = await this.handleOrientation(this.images[index].src)
          this.images[index] = { ...this.images[index], ...image }
          this.photoSwipeInit(index)
        } catch (err) {
          Utils.errorLog(err, 'PREVIEW-SHOW', true)
        } finally {
          Loading.close()
        }
      } else {
        this.photoSwipeInit(index)
      }
    },
    close () {
      this.photoSwipe.close()
    },
    photoSwipeInit (index) {
      this.photoSwipe = new PhotoSwipe(this.$el, PhotoSwipeDefault, this.images, {
        history: false,
        shareEl: false,
        tapToClose: true,
        bgOpacity: 0.8,
        errorMsg: '<div class="pswp__error-msg">图片加载失败</div>',
        index,
        ...this.options
      })
      this.photoSwipe.listen('gettingData', async (index, item) => {
        if (!item.loading && (!item.w || !item.h)) {
          const { src, w, h } = await this.handleOrientation(item.src)
          item.src = src
          item.w = w
          item.h = h
          this.photoSwipe.updateSize()
        }
      })
      this.photoSwipe.init()
    },
    handleOrientation (src) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.setAttribute('crossOrigin', 'Anonymous')
        image.onload = () => {
          const width = image.naturalWidth
          const height = image.naturalHeight
          EXIF.getData(image, () => {
            const orientation = EXIF.getTag(image, 'Orientation')
            if (this.needRotate && [3, 6, 8].includes(orientation)) {
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              switch (orientation) {
                case 6:
                  canvas.width = height
                  canvas.height = width
                  ctx.rotate(Math.PI / 2)
                  ctx.drawImage(image, 0, -height, width, height)
                  break
                case 3:
                  ctx.rotate(Math.PI)
                  ctx.drawImage(image, -width, -height, width, height)
                  break
                case 8:
                  canvas.width = height
                  canvas.height = width
                  ctx.rotate(3 * Math.PI / 2)
                  ctx.drawImage(image, -width, 0, width, height)
                  break
              }
              resolve({
                src: canvas.toDataURL('image/jpeg'),
                w: canvas.width,
                h: canvas.height
              })
            } else {
              const isRotate = [6, 8].includes(orientation)
              resolve({
                src,
                w: isRotate ? height : width,
                h: isRotate ? width : height
              })
            }
          })
        }
        image.onerror = err => reject(err)
        image.src = src
      })
    },
    revokeImages (images) {
      if (!images) {
        return
      }
      for (const item of images) {
        if (item.src && item.src.startsWith('blob:')) {
          URL.revokeObjectURL(item.src)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~photoswipe/dist/photoswipe.css';
@import '~photoswipe/dist/default-skin/default-skin.css';

.hl-preview {
  .pswp__ui {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;

    .pswp__top-bar {
      height: 100%;
      background-color: transparent;

      .pswp__counter {
        width: 100%;
        text-align: center;
        @include number($descriptionSize);
      }
    }

    .pswp__preloader {
      position: relative;
      left: auto;
      top: auto;
      margin: 0;
      float: right;
    }
  }
}
</style>
