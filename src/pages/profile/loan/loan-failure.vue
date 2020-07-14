<template>
  <div class="hl-container">
    <template v-if="dataList.length || hasMore">
      <hl-label>共{{ total }}个未通过的推荐借款</hl-label>
      <hl-scroll ref="scroll" @more="loadMore">
        <hl-card
          v-for="(item, index) in dataList"
          :key="index"
          :data="item"
          :options="cardOptions"
        />
      </hl-scroll>
    </template>
    <hl-empty v-else>没有未通过的推荐借款</hl-empty>
  </div>
</template>

<script>
import Utils from 'common/utils'
import ApplyApi from 'common/api/apply'
import HlLabel from '@/components/label'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
import HlCard from '@/components/card'
import OPTIONS from '@/common/options'
export default {
  name: 'HlLoanFailure',
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
        pageNo: 0,
        pageSize: 5,
        status: 3
      }
    }
  },
  computed: {
    cardOptions () {
      return OPTIONS.LOAN_CARD_FAILURE
    }
  },
  methods: {
    async loadMore (state) {
      try {
        const response = await ApplyApi.list(this.queryOption)
        const dataList = response.list || []
        this.total = response.total
        this.dataList = this.dataList.concat(dataList)
        this.queryOption.pageNo++
        this.hasMore = dataList.length && this.total > this.dataList.length
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'APPLY-LIST')
      } finally {
        this.hasMore ? state.loaded() : state.complete()
      }
    }
  }
}
</script>
