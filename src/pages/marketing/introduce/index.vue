<template>
  <div class="hl-content">
    <hl-swiper :options="options">
      <hl-swiper-slide
        v-for="(src, index) in images"
        :key="index"
      >
        <img class="hl-introduce" :src="src">
      </hl-swiper-slide>
    </hl-swiper>
  </div>
</template>

<script>
import Utils from 'common/utils'
import { HlSwiper, HlSwiperSlide } from '@/components/swiper'
export default {
  name: 'HlIntroduce',
  components: {
    HlSwiper,
    HlSwiperSlide
  },
  data () {
    return {
      options: {},
      images: [
        require('images/introduce-1.png'),
        require('images/introduce-2.png'),
        require('images/introduce-3.png')
      ]
    }
  },
  mounted () {
    this.getOptions()
    this.debounceOptions = Utils.debounce(300, this.getOptions)
    window.addEventListener('resize', this.debounceOptions)
  },
  destroyed () {
    window.removeEventListener('resize', this.debounceOptions)
  },
  methods: {
    getOptions () {
      const dpr = parseFloat(document.documentElement.style.fontSize) / 75
      this.options = {
        width: 570 * dpr,
        spaceBetween: 20 * dpr,
        slidesOffsetBefore: 90 * dpr,
        slidesOffsetAfter: 90 * dpr,
        centeredSlides: true,
        grabCursor: true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-swiper {
    height: 100%;
    width: 100%;

    .swiper-slide {
      height: 100%;
      padding: 30px 0;
      box-sizing: border-box;

      .hl-introduce {
        display: block;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        border-radius: $cardRadius;
        transform: scale(.9);
        transition: transform .3s ease-in-out;
      }

      &.swiper-slide-active .hl-introduce {
        transform: scale(1);
        transition: transform .3s ease-in-out;
      }
    }
  }
}
</style>
