<template>
  <div class="hl-content">
    <ul class="hl-bankcard__wrapper">
      <li is="hl-bank-card"
        v-for="item in dataList"
        :key="item.id"
        :data="item"
        @detail="detail">
      </li>

      <li class="hl-bankcard hl-bankcard_add-button"
        @click="add">
        <i class="hl-icon hl-icon-plus"></i>
        <p>添加银行卡</p>
      </li>
    </ul>
  </div>
</template>

<script>
import Utils from 'common/utils'
import Bankcard from 'common/api/bankcard'
import HlBankCard from '@/components/bank-card'
export default {
  name: 'HlBankcard',
  components: {
    HlBankCard
  },
  data () {
    return {
      dataList: []
    }
  },
  mounted () {
    this.getBankcardList()
  },
  methods: {
    async getBankcardList () {
      try {
        this.dataList = await Bankcard.list()
      } catch (err) {
        Utils.errorLog(err, 'BANKCARD-LIST')
      }
    },
    add () {
      this.$router.push({
        name: 'bankcardAdd'
      })
    },
    detail (data) {
      this.$router.push({
        name: 'bankcardDetail',
        query: {
          id: data.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-bankcard__wrapper {
    .hl-bankcard.hl-bankcard_add-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 690px;
      height: 280px;
      margin: 20px auto;
      font-size: $textSize;
      font-weight: 600;
      color: $themeColor;
      background-color: $blockColor;
      border-radius: $cardRadius;
      cursor: pointer;

      .hl-icon {
        margin-right: 10px;
        font-size: 38px;
      }

      &:active {
        background-color: $blockActiveColor;
      }
    }
  }
}
</style>
