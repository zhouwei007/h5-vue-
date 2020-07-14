<template>
  <div class="hl-content">
    <div class="hl-content__inner">
      <template v-if="dataList.length">
        <collapse>
          <collapse-item
            :title="`${groupItem.groupName}（${groupItem.count || 0}）`"
            v-for="(groupItem, groupIndex) in dataList"
            :key="groupIndex"
            @click.stop="getGroupList(groupItem.groupCode, groupIndex)"
          >
            <hl-customer-card
              v-for="(item, index) in groupItem.innerList"
              :key="index"
              :data="item"
              @recommend="goRecommend"
              @click="goCustomerDetail(item.id)"
            />
          </collapse-item>
        </collapse>
      </template>
      <hl-empty v-else>暂无分组列表</hl-empty>
    </div>
  </div>
</template>

<script>
import Utils from 'common/utils'
import CustomerApi from 'common/api/customer'
import Collapse from '@/components/collapse'
import CollapseItem from '@/components/collapse-item'
import HlCustomerCard from '@/components/customer-card'
import HlEmpty from '@/components/empty'

export default {
  name: 'HlCustomerGroup',
  components: {
    Collapse,
    CollapseItem,
    HlCustomerCard,
    HlEmpty
  },
  data () {
    return {
      params: {
        name: '',
        groupCode: null,
        pageNo: 0,
        pageSize: 9999
      },
      dataList: []
    }
  },
  mounted () {
    this.getGroup()
  },
  methods: {
    getGroup () {
      CustomerApi.group().then(data => {
        this.dataList = data
      }).catch(err => {
        Utils.errorLog(err, 'CUSTOMER_GROUP')
      })
    },
    getGroupList (code, index) {
      this.params.groupCode = code
      CustomerApi.list(this.params).then(data => {
        this.dataList[index].innerList = data.list || []
        this.$set(this.dataList[index])
      }).catch(err => {
        Utils.errorLog(err, 'CUSTOMER_GROUP_LIST')
      })
    },
    goRecommend (id) {
      this.$router.push({
        name: 'recommend',
        query: { id }
      })
    },
    goCustomerDetail (id) {
      this.$router.push({
        name: 'customerDetail',
        query: { id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-content__inner {
    min-height: 100.1%;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>
