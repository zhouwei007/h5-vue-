<template>
  <div class="hl-content">
    <template v-if="dataList.length || hasMore">
      <hl-scroll ref="scroll" @more="loadMore">
        <hl-card
          v-for="(item, index) in dataList"
          :key="index"
          :data="item"
          :options="getCardOptions(item)"
        />
      </hl-scroll>
    </template>
    <hl-empty v-else>暂无推荐借款</hl-empty>
  </div>
</template>

<script>
import Utils from 'common/utils'
import IdentityApi from 'common/api/identity'
import HlScroll from '@/components/scroll'
import HlCard from '@/components/card'
import HlEmpty from '@/components/empty'
import OPTIONS from '@/common/options'
export default {
  name: 'HlBrokerDetail',
  components: {
    HlScroll,
    HlCard,
    HlEmpty
  },
  data () {
    return {
      id: '',
      dataList: [],
      hasMore: true,
      total: 0,
      queryOption: {
        pageNo: 0,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.id = this.$route.query.id
    !this.id && this.$router.back()
  },
  methods: {
    async loadMore (state) {
      try {
        const response = await IdentityApi.getBrokerDetail(this.id, this.queryOption)
        const dataList = response.list || []
        this.total = response.total
        this.dataList = this.dataList.concat(dataList)
        this.queryOption.pageNo++
        this.hasMore = dataList.length && this.total > this.dataList.length
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'BROKER-DETAIL')
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
