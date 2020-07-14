<template>
  <div class="hl-content">
    <template v-if="dataList.length || hasMore">
      <hl-label>共提交{{ total }}条借款申请</hl-label>
      <hl-scroll ref="scroll" @more="loadMore">
        <hl-card
          v-for="(item, index) in dataList"
          :key="index"
          :data="item"
          :options="getCardOptions(item)"
        />
      </hl-scroll>
    </template>
    <hl-empty v-else>暂无借款申请</hl-empty>
  </div>
</template>

<script>
import Utils from 'common/utils'
import CustomerApi from 'common/api/customer'
import HlLabel from '@/components/label'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
import HlCard from '@/components/card'
import OPTIONS from '@/common/options'
export default {
  name: 'HlCustomerLoan',
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
  mounted () {
    this.queryOption.name = this.$route.query.name || ''
    this.queryOption.cardId = this.$route.query.cardId || ''
  },
  methods: {
    async loadMore (state) {
      try {
        const response = await CustomerApi.getLoanList(this.queryOption)
        const dataList = response.list || []
        this.total = response.total
        this.dataList = this.dataList.concat(dataList)
        this.queryOption.pageNo++
        this.hasMore = dataList.length && this.total > this.dataList.length
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'GET-CUSTOMER-LOAD-LIST')
      } finally {
        this.hasMore ? state.loaded() : state.complete()
      }
    },
    getCardOptions (data) {
      if (data.status === 1) {
        return OPTIONS.LOAN_CARD_AUDIT
      } else if (data.status === 2) {
        return OPTIONS.LOAN_CARD_SUCCESS
      }
      return OPTIONS.LOAN_CARD_FAILURE
    }
  }
}
</script>
