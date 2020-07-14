<template>
  <div class="hl-content">
    <template v-if="dataList.length || hasMore">
      <hl-scroll ref="scroll" @more="loadMore">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          class="hl-message"
          :class="{'hl-message_dot': item.status === 0}"
          @click="goDetail(item)"
          @touchstart="touchstart"
        >
          <h4 class="hl-message__title">{{ item.msgTitle }}</h4>
          <span class="hl-message__date">{{ item.receiveTime | datetime }}</span>
          <div class="hl-message__content" v-html="item.msgContent" />
          <div class="hl-message__footer">
            <span>查看详情</span>
            <i class="hl-icon hl-icon-arrow-right" />
          </div>
        </div>
      </hl-scroll>
    </template>
    <hl-empty v-else>{{ emptyMessage }}</hl-empty>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Utils from 'common/utils'
import IdentityApi from 'common/api/identity'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
export default {
  name: 'HlMessage',
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
        status: 0,
        pageNo: 0,
        pageSize: 10
      }
    }
  },
  computed: {
    buttonOption () {
      return {
        text: '筛选',
        current: this.queryOption.status,
        menu: [{
          key: 0,
          text: '全部消息',
          event: this.handleFilter.bind(this, 0)
        }, {
          key: 1,
          text: '未读消息',
          event: this.handleFilter.bind(this, 1)
        }, {
          key: 2,
          text: '已读消息',
          event: this.handleFilter.bind(this, 2)
        }]
      }
    },
    emptyMessage () {
      const dict = {
        0: '暂无站内消息',
        1: '暂无未读消息',
        2: '暂无已读消息'
      }
      return dict[this.queryOption.status]
    }
  },
  watch: {
    '$route.query.type': {
      handler (val) {
        this.dataList = []
        this.hasMore = true
        this.queryOption.pageNo = 0
        this.queryOption.status = Number(val) || 0
        this.setHeaderButton(this.buttonOption)
        const el = this.$refs.scroll
        el && el.reset()
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      setHeaderButton: STORE_TYPES.SET_HEADER_BUTTON,
      setMessage: STORE_TYPES.SET_MESSAGE
    }),
    async loadMore (state) {
      try {
        const response = await IdentityApi.getMessageList(this.queryOption)
        const dataList = response.list || []
        this.total = response.count
        this.dataList = this.dataList.concat(dataList)
        this.queryOption.pageNo++
        this.hasMore = dataList.length && this.total > this.dataList.length
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'MESSAGE-LIST')
      } finally {
        this.hasMore ? state.loaded() : state.complete()
      }
    },
    handleFilter (val) {
      this.$router.replace({
        name: 'message',
        query: { type: val }
      })
    },
    goDetail (data) {
      this.setMessage(data)
      this.$router.push({
        name: 'messageDetail'
      })
    },
    touchstart () {
      // For mobile active style
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-message {
    margin: 20px 30px;
    padding: 0 30px;
    background-color: $blockColor;
    border-radius: $cardRadius;
    overflow: hidden;
    cursor: pointer;

    &:active {
      background-color: $blockActiveColor;
      transform: scale(.99);
    }

    .hl-message__title {
      position: relative;
      margin-top: 30px;
      margin-bottom: 8px;
      padding-right: 15px;
      font-size: $subTitleSize;
      font-weight: 600;
      line-height: 42px;
      color: $textColor;
      @extend %text-overflow;
    }

    .hl-message__date {
      display: block;
      margin-bottom: 20px;
      font-size: $quoteSize;
      line-height: 46px;
      color: $descriptionColor;
    }

    .hl-message__content::v-deep {
      height: 46px;
      margin-bottom: 30px;
      font-size: $descriptionSize;
      line-height: 46px;
      color: $subTitleColor;
      @extend %text-overflow;

      * {
        font-size: $descriptionSize;
        line-height: 46px;
        color: $subTitleColor;
        @extend %text-overflow;
      }
    }

    .hl-message__footer {
      display: flex;
      align-items: center;
      height: 100px;
      border-top: $splitBorder;

      span {
        flex: auto;
        font-size: $textSize;
        color: $textColor;
      }

      .hl-icon {
        margin-right: -18px;
        font-size: 52px;
        color: $iconColor;
      }
    }

    &.hl-message_dot .hl-message__title::after {
      content: '';
      position: absolute;
      display: block;
      top: 14px;
      right: 0;
      width: 14px;
      height: 14px;
      background-color: $themeColor;
      border-radius: 50%;
    }
  }
}
</style>
