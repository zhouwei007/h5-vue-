<template>
  <div class="hl-content">
    <div class="hl-query">
      <div
        class="hl-query__header"
        :class="['hl-query__header_querying', 'hl-query__header_success', 'hl-query__header_failure'][data.status]"
      >
        <i
          class="hl-icon"
          :class="['hl-icon-search-more-fill', 'hl-icon-round-check-fill', 'hl-icon-round-warning-fill'][data.status]"
        />
        {{ ['询值中', '询值成功', '询值未成功'][data.status] }}
      </div>
      <div class="hl-query__body">
        <div class="hl-query__title">
          <svg class="hl-pic"><use xlink:href="#hl-pic-house"></use></svg>
          <p>{{ data.constructionName }} - {{ data.houseSize }}㎡  {{ data.buildingName }}/{{ data.houseName }}</p>
        </div>
        <div v-if="data.status === 1" class="hl-query__result">
          <p class="hl-query__amount"><span>{{ data.totalPrice }}</span>万元</p>
          <p>{{ data.averagePrice | money(0) }} 元/平米</p>
        </div>
        <p v-else-if="data.status === 0" class="hl-query__info">正在询值中，询值过程可能需要120s时间，请稍后...</p>
        <p v-else class="hl-query__info">很遗憾，暂未查询到该房屋信息。请确认信息后重试</p>
      </div>
    </div>

    <hl-button-group v-if="data.status !== 0">
      <hl-button @click="goBack">返回首页</hl-button>
      <hl-button type="primary" @click="goPrev">重新询值</hl-button>
    </hl-button-group>
  </div>
</template>

<script>
import Utils from 'common/utils'
import QueryApi from 'common/api/query'
import HlButtonGroup from '@/components/button-group'
import HlButton from '@/components/button'
import SETTING from '@/setting'
export default {
  name: 'HlQueryStep2',
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
        areaCode: '',
        villageName: '',
        constructionId: '',
        constructionName: '',
        buildingId: '',
        buildingName: '',
        houseId: '',
        houseName: '',
        houseSize: '',
        totalPrice: 0,
        averagePrice: 0,
        status: 0
      },
      timer: null
    }
  },
  mounted () {
    this.data = { ...this.data, ...this.options }
    this.data.requestId && this.query()
  },
  methods: {
    async query () {
      try {
        const response = await QueryApi.getResult(this.data.requestId)
        this.timer && clearTimeout(this.timer)
        if (response.code === 0) {
          this.timer = setTimeout(this.query, SETTING.QUERY_INTERVAL)
        } else if (response.code === 1 && response.averagePrice) {
          this.data = {
            ...this.data,
            totalPrice: Math.round(response.totalPrice / 1000000),
            averagePrice: response.averagePrice,
            status: response.code
          }
        } else {
          this.data.status = 2
        }
      } catch (err) {
        this.data.status = 2
        Utils.errorLog(err, 'GET-QUERY-RESULT')
      }
    },
    goPrev () {
      this.$emit('prev', {})
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-query {
    width: 690px;
    margin: 30px auto;
    background-color: $blockColor;
    border-radius: $cardRadius;

    .hl-query__header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120px;
      margin: 0 50px;
      font-size: 38px;
      font-weight: bold;
      border-bottom: $splitBorder;
      border-radius: $cardRadius $cardRadius 0 0;

      &.hl-query__header_querying {
        color: $systemColor;
      }

      &.hl-query__header_success {
        color: $successColor;
      }

      &.hl-query__header_failure {
        color: $themeColor;
      }

      .hl-icon {
        margin-right: 5px;
        font-size: 70px;
        font-weight: normal;
      }
    }

    .hl-query__body {
      padding: 40px 50px;

      .hl-query__title {
        display: flex;
        align-items: center;
        margin-bottom: 5px;

        .hl-pic {
          width: 54px;
          height: 54px;
          margin-left: -10px;
        }

        p {
          font-size: $quoteSize;
          color: $textColor;
        }
      }

      .hl-query__result {
        display: flex;
        align-items: baseline;
        margin-bottom: 3px;
        font-size: $textSize;
        color: $textColor;

        .hl-query__amount {
          flex: auto;
          width: 0;
          @extend %text-overflow;

          span {
            margin-right: 10px;
            line-height: 104px;
            color: $themeColor;
            @include number(90px);
          }
        }
      }

      .hl-query__info {
        margin-top: 40px;
        margin-bottom: 3px;
        font-size: $subTitleSize;
        line-height: 42px;
        color: $textColor;
      }

      .hl-button {
        width: 100%;
        height: 100px;
        font-size: 32px;
        line-height: 100px;
        color: $themeColor;
        border-top: $splitBorder;

        &:not(.hl-button_disabled):active {
          color: $themeActiveColor;
        }

        &.hl-button_disabled {
          color: $themeDisabledColor;
        }
      }
    }
  }

  .hl-button-group {
    margin-top: 60px;
  }
}
</style>
