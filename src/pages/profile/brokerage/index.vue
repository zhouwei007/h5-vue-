<template>
  <div class="hl-content">
    <div class="hl-content__inner">
      <div class="hl-banner">
        <p class="hl-banner__label">已获奖励金(元)</p>
        <span class="hl-banner__amount">{{ amount | money }}</span>
      </div>

      <hl-scroll
        v-if="hasAuthenticate && hasBrokerage"
        ref="scroll"
        class="hl-brokerage__wrapper"
        @more="loadMore"
      >
        <hl-brokerage-card
          v-for="item in data"
          :key="item.date"
          :data="item"
          @collapse="collapse"
        />
      </hl-scroll>
      <div v-else class="hl-brokerage__empty">
        <hl-empty :text="hasAuthenticate ? '您还没有推荐借款人' : '您还没有完成实名认证'" />
        <hl-button @click="goHtml">
          {{ hasAuthenticate ? '立即推荐' : '立即认证' }}
        </hl-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Utils from 'common/utils'
import Award from 'common/api/award'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
import HlButton from '@/components/button'
import HlBrokerageCard from './brokerage-card'
export default {
  name: 'HlBrokerage',
  components: {
    HlScroll,
    HlEmpty,
    HlButton,
    HlBrokerageCard
  },
  data () {
    return {
      amount: 0,
      data: [],
      queryOption: {
        date: new Date(),
        month: 10
      },
      hasBrokerage: true
    }
  },
  computed: {
    ...mapGetters([
      'hasAuthenticate'
    ])
  },
  methods: {
    async loadMore (state) {
      try {
        const response = await Award.list(this.queryOption.date, this.queryOption.month)
        this.amount = response.receiptAwardAmount
        this.hasBrokerage = response.receiptAwardAmount !== 0
        this.data = this.data.concat(this.formatAwardList(response.list))
        this.datePagenate()
        response.receiptAwardAmount <= this.data.reduce((res, item) => res + item.amount, 0)
          ? state.complete()
          : state.loaded()
      } catch (err) {
        state.complete()
        Utils.errorLog(err, 'AWARD-LIST')
      }
    },
    formatAwardList (data) {
      const res = []
      const arr = data.map(item => Object.entries(item)[0]).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      for (const [key, value] of arr) {
        const date = new Date(key)
        const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月`
        const obj = res.find(r => r.date === dateStr)
        const item = {
          date: Utils.formatTime(date, 'yyyy-MM-dd'),
          amount: value
        }
        if (obj) {
          obj.rows.push(item)
          obj.amount += value
        } else {
          res.push({
            date: dateStr,
            amount: value,
            collapse: this.data.length === 0 && res.length === 0,
            rows: [item]
          })
        }
      }
      return res
    },
    datePagenate () {
      const { date, month } = this.queryOption
      this.queryOption.date = new Date(date.getFullYear(), date.getMonth() - month, 1)
    },
    collapse (data) {
      const state = data.collapse
      for (const item of this.data) {
        item.collapse = false
      }
      data.collapse = !state
    },
    goHtml () {
      this.$router.push({
        name: this.hasAuthenticate ? 'customer' : 'certification'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-content__inner {
    min-height: 100.1%;
    overflow: hidden;
  }

  .hl-banner {
    position: relative;
    width: 690px;
    height: 300px;
    margin: 20px auto;
    margin-bottom: 40px;
    color: $blockColor;
    background: url(~images/brokerage-bg.png) center/contain no-repeat;;
    border-radius: $cardRadius;
    overflow: hidden;
    z-index: 1;

    .hl-banner__label {
      margin-top: 80px;
      margin-bottom: 10px;
      font-size: $descriptionSize;
      line-height: 37px;
      text-align: center;
    }

    .hl-banner__amount {
      display: block;
      line-height: 84px;
      text-align: center;
      @include number(72px);
    }
  }

  .hl-brokerage__wrapper::v-deep {
    .infinite-status-prompt {
      display: none;
    }

    &::before {
      content: '';
      position: fixed;
      display: block;
      top: $headerHeight + 20px;
      bottom: 0;
      left: 60px;
      border-left: $lineBorder;
    }
  }

  .hl-brokerage__empty {
    position: relative;
    width: 690px;
    margin: 20px auto;
    padding-top: 60px;
    padding-bottom: 170px;
    background-color: $blockColor;
    border-radius: $cardRadius;
    z-index: 1;

    .hl-empty {
      margin-top: 0;
    }

    .hl-button {
      display: block;
      margin: auto;
      margin-top: 30px;
      width: 220px;
      height: 70px;
      font-size: $descriptionSize;
      color: #F8461D;
      border: 1px solid #F8461D;
      border-radius: 2px;

      &:active {
        transition: background-color .2s;
        transform: scale(.99);
      }
    }
  }
}
</style>
