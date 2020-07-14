<template>
  <div class="hl-content">
    <template v-if="dataList.length || hasMore">
      <hl-label>共提交{{ total }}条评估记录</hl-label>
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
    <hl-empty v-else>暂无评估记录</hl-empty>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Utils from 'common/utils'
import CustomerApi from 'common/api/customer'
import HlLabel from '@/components/label'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
import HlCard from '@/components/card'
import OPTIONS from '@/common/options'
export default {
  name: 'HlCustomerEstimate',
  components: {
    HlLabel,
    HlScroll,
    HlEmpty,
    HlCard
  },
  data () {
    return {
      dataList: [],
      hasMore: true,
      total: 0,
      queryOption: {
        name: '',
        cardId: '',
        pageNo: 0,
        pageSize: 5
      }
    }
  },
  computed: {
    cardOptions () {
      return OPTIONS.ESTIMATE_CARD
    }
  },
  mounted () {
    this.queryOption.name = this.$route.query.name || ''
    this.queryOption.cardId = this.$route.query.cardId || ''
  },
  methods: {
    ...mapMutations({
      setEstimateRecord: STORE_TYPES.SET_ESTIMATE_RECORD
    }),
    async loadMore (state) {
      try {
        const response = await CustomerApi.getEstimateList(this.queryOption)
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
        Utils.errorLog(err, 'GET-CUSTOMER-ESTIMATE-LIST')
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
