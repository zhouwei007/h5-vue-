<template>
  <div class="hl-content" v-if="hasRecentCustomer">
    <hl-scroll ref="scroll" @more="recentCustomerList">
      <div v-for="(sortList, sortIndex) in dataList" :key="sortIndex">
        <div class="hl-customer-card__sort">{{ sortIndex }}</div>
        <hl-customer-card
          v-for="(item, index) in sortList"
          :key="index"
          :data="item"
          @recommend="goRecommend"
          @click="goCustomerDetail(item.id)"
        />
      </div>
    </hl-scroll>
  </div>
  <hl-empty v-else>暂无最近添加记录</hl-empty>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Utils from 'common/utils'
import CustomerApi from 'common/api/customer'
import HlCustomerCard from '@/components/customer-card'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
export default {
  name: 'HlCustomerRecent',
  components: {
    HlScroll,
    HlCustomerCard,
    HlEmpty
  },
  data () {
    return {
      params: {
        pageNo: 0,
        pageSize: 10
      },
      dataList: {},
      total: 0,
      hasMore: true
    }
  },
  computed: {
    hasRecentCustomer () {
      return Object.keys(this.dataList).length || this.hasMore
    }
  },
  mounted () {
    this.setHeaderButton({
      icon: 'hl-icon-add',
      event: this.goCustomerDetail
    })
  },
  methods: {
    ...mapMutations({
      setHeaderButton: STORE_TYPES.SET_HEADER_BUTTON
    }),
    async recentCustomerList (state) {
      try {
        const response = await CustomerApi.recent(this.params)
        const dataList = response.list || []
        this.total = response.total
        this.dataList = dataList.reduce((result, item) => {
          const list = result[item.sort]
          result[item.sort] = list ? list.concat(item.sortList) : item.sortList
          return result
        }, Utils.deepClone(this.dataList))
        this.params.pageNo++
        this.hasMore = dataList.length && this.total > Object.values(this.dataList).reduce((sum, item) => sum + item.length, 0)
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'RECENT-CUSTOMER-LIST')
      } finally {
        this.hasMore ? state.loaded() : state.complete()
      }
    },
    goRecommend (id) {
      this.$router.push({
        name: 'recommend',
        query: { id }
      })
    },
    goCustomerDetail (id) {
      this.$router.push(id ? {
        name: 'customerDetail',
        query: { id }
      } : {
        name: 'customerAdd'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  padding-top: 20px;

  .hl-customer-card__sort {
    height: 30px;
    line-height: 30px;
    padding: 0 30px;
    font-size: $tinySize;
    color: $descriptionColor;
    background: $blockColor;
  }
}
</style>
