<template>
  <div class="hl-content">
    <hl-tab
      v-model="current"
      :options="tabOptions"
    />
    <div class="hl-content__inner">
      <hl-swiper :index.sync="current">
        <hl-swiper-slide
          v-for="item in tabOptions"
          :key="item.value"
          ref="main"
          class="hl-dialog__lock"
        >
          <components :is="pages[item.value]" />
        </hl-swiper-slide>
      </hl-swiper>
    </div>
  </div>
</template>

<script>
import TouchScroll from '@/mixins/touch-scroll'
import Authenticate from '@/mixins/authenticate'
import HlTab from '@/components/tab'
import { HlSwiper, HlSwiperSlide } from '@/components/swiper'
import HlLoanAudit from './loan-audit'
import HlLoanSuccess from './loan-success'
import HlLoanFailure from './loan-failure'
export default {
  name: 'HlLoan',
  components: {
    HlTab,
    HlSwiper,
    HlSwiperSlide,
    HlLoanAudit,
    HlLoanSuccess,
    HlLoanFailure
  },
  mixins: [
    TouchScroll,
    Authenticate
  ],
  data () {
    return {
      current: 0,
      tabOptions: [{
        label: '审核中',
        value: 0
      }, {
        label: '放款成功',
        value: 1
      }, {
        label: '未通过',
        value: 2
      }],
      pages: [
        HlLoanAudit,
        HlLoanSuccess,
        HlLoanFailure
      ]
    }
  },
  mounted () {
    this.current = Number(this.$route.query.type || 0)
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-content__inner {
    position: absolute;
    top: 100px;
    right: 0;
    bottom: 0;
    left: 0;

    .hl-swiper {
      height: 100%;

      .swiper-slide {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
  }
}
</style>
