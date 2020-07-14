<template>
  <div class="hl-content">
    <template v-if="dataList.length || hasMore">
      <hl-scroll ref="scroll" @more="loadMore">
        <hl-card
          v-for="(item, index) in dataList"
          :key="index"
          :data="item"
          :options="cardOptions"
        />
      </hl-scroll>
    </template>
    <hl-empty v-else>暂无房产询值记录</hl-empty>
  </div>
</template>

<script>
import Utils from 'common/utils'
import QueryApi from 'common/api/query'
import Authenticate from '@/mixins/authenticate'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
import HlCard from '@/components/card'
export default {
  name: 'HlQueryRecord',
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
      },
      cardOptions: {
        header: {
          label: '询值时间',
          value: 'updateTime',
          filter: 'datetime'
        },
        body: [{
          label: '楼盘',
          value: 'building'
        }, {
          label: '房屋',
          value: 'house'
        }, {
          label: '询值结果',
          value: 'result'
        }]
      }
    }
  },
  methods: {
    async loadMore (state) {
      if (!this.$hasAuthenticate) {
        this.hasMore = false
        state.complete()
        return
      }
      try {
        const response = await QueryApi.getQueryList(this.queryOption)
        const dataList = response.list || []
        this.total = response.count
        this.dataList = this.dataList.concat(dataList.map(item => {
          item.building = `${item.cityName}-${item.villageName}`
          item.house = `${item.buildingName}-${item.houseName}`
          if (item.status === 0) {
            item.result = '询值中...'
          } else if (item.status === 1) {
            item.result = `总价${(item.valuationSys / 1000000).toFixed(2).replace('.00', '')}万元，${Utils.formatMoney(item.unitPrice, 2, 'cent', false)}元/平米`
          } else if (item.status === 2) {
            item.result = '询值失败'
          }
          return item
        }))
        this.queryOption.pageNo++
        this.hasMore = dataList.length && this.total > this.dataList.length
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'QUERY-LIST')
      } finally {
        this.hasMore ? state.loaded() : state.complete()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-card::v-deep {
    .hl-card__label {
      width: 125px;
    }
  }
}
</style>
