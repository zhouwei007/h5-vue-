<template>
  <div class="hl-content">
    <template v-if="dataList.length || hasMore">
      <hl-scroll ref="scroll" @more="loadMore">
        <div
          v-for="item in dataList"
          :key="item.accountId"
          class="hl-broker"
          @click="goDetail(item)"
          @touchstart="touchstart"
        >
          <div class="hl-broker__header">
            <div class="hl-broker__title">
              <h4 class="hl-broker__name">{{ item.name || item.mobile }}</h4>
              <span
                class="hl-broker__tag"
                :class="{'hl-broker__tag_error': !item.bindCard}"
              >
                {{ item.bindCard ? '已绑卡' : '未绑卡' }}
              </span>
              <span
                class="hl-broker__tag"
                :class="{'hl-broker__tag_error': !item.realName}"
              >
                {{ item.realName ? '已实名' : '未实名' }}
              </span>
            </div>
            <i class="hl-icon hl-icon-arrow-right" />
          </div>
          <ul class="hl-broker__body">
            <li
              v-for="option in options"
              v-show="item[option.value] !== void 0"
              :key="option.value"
              class="hl-broker__item"
            >
              <span class="hl-broker__label">{{ option.label }} </span>
              <span class="hl-broker__value">
                {{ filter(item[option.value], option.filter) }}
              </span>
            </li>
          </ul>
        </div>
      </hl-scroll>
    </template>
    <hl-empty v-else>暂无经纪人</hl-empty>
  </div>
</template>

<script>
import Utils from 'common/utils'
import IdentityApi from 'common/api/identity'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
export default {
  name: 'HlBroker',
  components: {
    HlScroll,
    HlEmpty
  },
  data () {
    return {
      dataList: [],
      hasMore: true,
      total: 0,
      queryOption: {
        pageNo: 0,
        pageSize: 10
      },
      options: [{
        label: '联系方式',
        value: 'mobile'
      }, {
        label: '加入时间',
        value: 'createTime'
      }, {
        label: '已推荐',
        value: 'recommendNum',
        filter: 'num'
      }]
    }
  },
  methods: {
    async loadMore (state) {
      try {
        const response = await IdentityApi.getBrokerList(this.queryOption)
        const dataList = response.list || []
        this.total = response.count
        this.dataList = this.dataList.concat(dataList)
        this.queryOption.pageNo++
        this.hasMore = dataList.length && this.total > this.dataList.length
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'BROKER-LIST')
      } finally {
        this.hasMore ? state.loaded() : state.complete()
      }
    },
    goDetail (data) {
      this.$router.push({
        name: 'brokerDetail',
        query: {
          id: data.accountId
        }
      })
    },
    filter (value, type = null) {
      if (type === 'num') {
        return value ? `${value}件` : '无'
      }
      return value
    },
    touchstart () {
      // For mobile active style
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-broker {
    margin: 20px 30px;
    padding: 10px 30px 20px 30px;
    background-color: $blockColor;
    border-radius: $cardRadius;
    overflow: hidden;
    cursor: pointer;

    &:active {
      background-color: $blockActiveColor;
      transform: scale(.99);
    }

    .hl-broker__header {
      display: flex;
      align-items: center;
      height: 80px;

      .hl-broker__title {
        display: flex;
        align-items: center;
        flex: auto;
      }

      .hl-broker__name {
        margin-right: 20px;
        font-size: $titleSize;
        font-weight: 600;
        color: $textColor;
      }

      .hl-broker__tag {
        display: block;
        margin-right: 10px;
        padding: 0 10px;
        font-size: $quoteSize;
        line-height: 40px;
        color: $finishColor;
        background-color: #e5faf7;

        &.hl-broker__tag_error {
          color: $errorColor;
          background-color: #feede6;
        }
      }

      .hl-icon {
        margin-right: -18px;
        font-size: 52px;
        color: $iconColor;
      }
    }

    .hl-broker__body {
      .hl-broker__item {
        display: flex;
        align-items: center;
        height: 60px;
        font-size: $descriptionSize;
      }

      .hl-broker__label {
        width: 250px;
        color: $subTitleColor;
      }

      .hl-broker__value {
        color: $textColor;
        @include label($textColor);
        @extend %text-overflow;
      }
    }
  }
}
</style>
