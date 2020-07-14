<template>
  <div class="hl-content">
    <div class="hl-result">
      <div class="hl-result__body">
        <svg class="hl-pic"><use :xlink:href="`#${data.status === 0 ? 'hl-pic-success' : 'hl-pic-fail'}`"></use></svg>
        <div v-if="data.status === 0">
          <span>经评估该客户可贷款</span>
          <p class="hl-result__amount">{{ data.num }}</p>
        </div>
        <div v-else>
          <span>该客户的评估结果为</span>
          <p class="hl-result__info">{{ data.message || '您好，您的相关资质暂不符合审核标准' }}</p>
        </div>
      </div>
    </div>

    <hl-button-group v-if="data.status === 0">
      <hl-button @click="goBack">返回首页</hl-button>
      <hl-button type="primary" @click="goRecommend">推荐借款</hl-button>
    </hl-button-group>
    <hl-button v-else type="primary" @click="goBack">返回首页</hl-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Bus, { EVENT } from 'common/bus'
import HlButtonGroup from '@/components/button-group'
import HlButton from '@/components/button'
export default {
  name: 'HlEstimateStep4',
  components: {
    HlButtonGroup,
    HlButton
  },
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      data: {
        num: 0,
        status: 0,
        message: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations({
      setHeaderBack: STORE_TYPES.SET_HEADER_BACK
    }),
    init () {
      this.setHeaderBack({
        to: this.goPrev
      })
      this.data = { ...this.data, ...this.options }
    },
    goRecommend () {
      const id = this.data.customerId
      this.$router.replace({
        name: 'recommend',
        query: id ? { id } : {}
      })
    },
    goPrev () {
      Bus.$emit(EVENT.ROUTE_ANIMATION, 'slide-right')
      this.$emit('prev', this.data)
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-result {
    margin-bottom: 100px;
    background-color: $subThemeColor;
    overflow: hidden;

    .hl-result__body {
      position: relative;
      margin-top: 148px;
      text-align: center;
      color: $textColor;
      background-color: $blockColor;
      border-radius: 20px 20px 0 0;

      .hl-pic {
        position: absolute;
        top: -100px;
        left: 0;
        right: 0;
        width: 200px;
        height: 200px;
        margin: auto;
      }

      div {
        overflow: hidden;
      }

      span {
        display: block;
        margin-top: 125px;
        margin-bottom: 10px;
        font-size: $descriptionSize;
        line-height: 37px;
      }

      .hl-result__info {
        margin-top: 45px;
        margin-bottom: 34px;
        font-size: $titleSize;
        line-height: 48px;
      }

      .hl-result__amount {
        line-height: 117px;
        color: #444;
        @include number(100px);
      }
    }
  }
}
</style>
