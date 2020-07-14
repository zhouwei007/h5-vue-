<template>
  <div class="hl-content">
    <div class="hl-banner">
      <p>营销工具</p>
      <span>您的私人信贷帮手</span>
    </div>

    <ul class="hl-entrance">
      <li
        v-for="item in entranceOptions"
        :key="item.key"
        class="hl-entrance__item"
        :class="`hl-entrance__item_${item.key}`"
        @click="handleEntrance(item.key, item.type)"
        @touchstart="touchstart"
      >
        <i /><p>{{ item.label }}</p>
      </li>
    </ul>

    <ul class="hl-menu">
      <li
        v-for="(option, index) in menuOptions"
        :key="index"
        class="hl-menu__item"
      >
        <p class="hl-menu__label">{{ option.label }}</p>
        <ul class="hl-menu__body">
          <li
            v-for="(item, i) in option.children"
            :key="i"
            class="hl-menu__button"
            @click="handleMenu(item)"
            @touchstart="touchstart"
          >
            <i
              class="hl-icon"
              :class="item.icon"
              :style="{ color: item.color }"
            />
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HlMarketing',
  data () {
    return {
      entranceOptions: [{
        key: 'estimate',
        label: '客户评估'
      }, {
        key: 'productList',
        label: '产品推荐',
        type: 'back'
      }, {
        key: 'business',
        label: '展业工具'
      }, {
        key: 'query',
        label: '房产询值'
      }],
      menuOptions: [{
        label: '常用计算器',
        children: [{
          key: 'calculatorHouseLoan',
          type: 'house',
          label: '房贷',
          icon: 'hl-icon-apartment',
          color: '#6074ff'
        }, {
          key: 'calculatorRepaymentMode',
          type: 'capital',
          label: '等额本金',
          icon: 'hl-icon-capital',
          color: '#ffa311'
        }, {
          key: 'calculatorRepaymentMode',
          type: 'installmen',
          label: '等额本息',
          icon: 'hl-icon-interest',
          color: '#1dc59b'
        }, {
          key: 'calculatorRepaymentMode',
          type: 'mode',
          label: '还款方式比较',
          icon: 'hl-icon-method',
          color: '#ff6a3f'
        }, {
          key: 'calculatorPrepay',
          label: '提前还款',
          icon: 'hl-icon-repay',
          color: '#ffa311'
        }]
      }, {
        label: '房贷计算器',
        children: [{
          key: 'calculatorHouseLoan',
          type: 'house',
          label: '房贷',
          icon: 'hl-icon-apartment',
          color: '#6074ff'
        }, {
          key: 'calculatorHouseLoan',
          type: 'second',
          label: '二手房贷款',
          icon: 'hl-icon-exchange',
          color: '#1dc59b'
        }, {
          key: 'calculatorHouseLoan',
          type: 'fund',
          label: '公积金贷款',
          icon: 'hl-icon-house',
          color: '#ffa311'
        }, {
          key: 'calculatorHouseLoan',
          type: 'commercial',
          label: '商业贷款',
          icon: 'hl-icon-store',
          color: '#ff6a3f'
        }, {
          key: 'calculatorCombinedLoan',
          label: '组合贷款',
          icon: 'hl-icon-combine',
          color: '#ffa311'
        }, {
          key: 'calculatorHouseTax',
          label: '房产税',
          icon: 'hl-icon-tax',
          color: '#6074ff'
        }]
      }]
    }
  },
  methods: {
    handleEntrance (name, type) {
      this.$router.push({
        name,
        query: type ? {
          type: type
        } : {}
      })
    },
    handleMenu (item) {
      this.$router.push({
        name: item.key,
        query: item.type ? {
          type: item.type
        } : {}
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
  .hl-banner {
    width: $screenWidth;
    height: 280px;
    margin-bottom: -60px;
    text-align: center;
    color: $blockColor;
    background: url(~images/marketing-bg.png) center/cover no-repeat;
    overflow: hidden;

    p {
      margin: 60px 0 10px 0;
      font-size: $headerSize;
      font-weight: 600;
      line-height: 50px;
    }

    span {
      font-size: $descriptionSize;
      line-height: 37px;
    }
  }

  .hl-entrance {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 30px;

    .hl-entrance__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 47.83%;
      max-width: 330px;
      height: 180px;
      margin-bottom: 30px;
      color: $blockColor;
      border-radius: 20px;
      cursor: pointer;

      i {
        display: block;
        margin-bottom: 15px;
      }

      &.hl-entrance__item_estimate {
        background-image: linear-gradient(270deg, #6579ff 0%, #4f66ff 100%);
        box-shadow: 0 6px 20px 0 rgba(79,102,255,0.30);

        i {
          width: 58px;
          height: 59px;
          background: url(~images/estimate.png) center/cover no-repeat;
        }
      }

      &.hl-entrance__item_productList {
        background-image: linear-gradient(270deg, #35d9b0 0%, #1dc59b 100%);
        box-shadow: 0 6px 20px 0 rgba(29,197,155,0.30);

        i {
          width: 67px;
          height: 59px;
          background: url(~images/introduce.png) center/cover no-repeat;
        }
      }

      &.hl-entrance__item_business {
        background-image: linear-gradient(270deg, #ffa81e 0%, #ff9d00 100%);
        box-shadow: 0 6px 20px 0 rgba(255,157,0,0.30);

        i {
          width: 64px;
          height: 58px;
          background: url(~images/business.png) center/cover no-repeat;
        }
      }

      &.hl-entrance__item_query {
        background-image: linear-gradient(270deg, #ff8137 1%, #ff6c16 100%);
        box-shadow: 0 6px 20px 0 rgba(255,108,22,0.30);

        i {
          width: 58px;
          height: 58px;
          background: url(~images/query.png) center/cover no-repeat;
        }
      }

      p {
        font-size: $textSize;
        font-weight: 600;
        text-align: center;
      }

      &:active {
        transform: scale(.97);
      }
    }
  }

  .hl-menu {
    .hl-menu__item {
      margin: 30px;
      margin-top: 0;
      background-color: $blockColor;
      border-radius: 20px;
      overflow: hidden;

      .hl-menu__label {
        margin: 25px 40px;
        font-size: $subTitleSize;
        font-weight: 600;
        color: $textColor;
      }

      .hl-menu__body {
        display: flex;
        flex-wrap: wrap;
        margin: 0 15px 20px 15px;

        .hl-menu__button {
          width: 25%;
          margin-bottom: 20px;
          text-align: center;
          cursor: pointer;

          .hl-icon {
            display: block;
            margin: 8px;
            font-size: 68px;
          }

          span {
            font-size: $descriptionSize;
            line-height: 37px;
            color: $subTitleColor
          }

          &:active {
            transform: scale(.97);
          }
        }
      }
    }
  }
}
</style>
