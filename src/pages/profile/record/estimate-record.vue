<template>
  <div class="hl-content">
    <template v-if="dataList.length || hasMore">
      <hl-scroll ref="scroll" @more="loadMore">
        <hl-card
          v-for="(item, index) in dataList"
          :key="index"
          :data="item"
          :type="item.type"
          :options="cardOptions"
          @click="goDetail(item)"
          @touchstart="touchstart"
        />
      </hl-scroll>
    </template>
    <hl-empty v-else>暂无客户评估记录</hl-empty>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Utils from 'common/utils'
import UserApi from 'common/api/user'
import Authenticate from '@/mixins/authenticate'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
import HlCard from '@/components/card'
import OPTIONS from '@/common/options'
export default {
  name: 'HlEstimateRecord',
  components: {
    HlScroll,
    HlEmpty,
    HlCard
  },
  mixins: [Authenticate],
  data () {
    return {
      dataList: [],
      hasMore: true,
      total: 0,
      queryOption: {
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    cardOptions () {
      return OPTIONS.ESTIMATE_CARD
    }
  },
  methods: {
    ...mapMutations({
      setEstimateRecord: STORE_TYPES.SET_ESTIMATE_RECORD
    }),
    async loadMore (state) {
      if (!this.$hasAuthenticate) {
        this.hasMore = false
        state.complete()
        return
      }
      try {
        const response = await UserApi.getEstimateList(this.queryOption)
        const dataList = response.list || []
        this.total = response.total
        this.dataList = this.dataList.concat(dataList.map(item => {
          if (item.assessResultCode === 1) {
            item.result = `${Utils.formatMoney(item.assessAmount, 0)}元`
            item.type = 'success'
          } else {
            item.result = '您的相关资质暂不符合审核标准'
            item.type = 'failure'
          }
          return item
        }))
        this.queryOption.pageNo++
        this.hasMore = dataList.length && this.total > this.dataList.length
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'ESTIMATE-LIST')
      } finally {
        this.hasMore ? state.loaded() : state.complete()
      }
    },
    goDetail (data) {
      this.setEstimateRecord(data)
      this.$router.push({
        name: 'estimateDetail'
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
  .hl-card::v-deep {
    cursor: pointer;

    &:active {
      transform: scale(.99);
    }

    .hl-card__label {
      width: 180px;
    }
  }
}
</style>
