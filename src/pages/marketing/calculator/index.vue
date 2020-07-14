<template>
  <div class="hl-content">
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
  name: 'HlCalculator',
  data () {
    return {
      menuOptions: [{
        label: '常用工具',
        children: [{
          key: 'calculatorHouseLoan',
          type: 'house',
          label: '房贷',
          icon: 'hl-icon-apartment',
          color: '#6075ff'
        }, {
          key: 'calculatorRepaymentMode',
          type: 'capital',
          label: '等额本金',
          icon: 'hl-icon-capital',
          color: '#ffa411'
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
          color: '#2dc49b'
        }, {
          key: 'calculatorPrepay',
          label: '提前还款',
          icon: 'hl-icon-repay',
          color: '#ffa411'
        }]
      }, {
        label: '房贷工具',
        children: [{
          key: 'calculatorHouseLoan',
          type: 'house',
          label: '房贷',
          icon: 'hl-icon-apartment',
          color: '#6075ff'
        }, {
          key: 'calculatorHouseLoan',
          type: 'second',
          label: '二手房贷款',
          icon: 'hl-icon-exchange',
          color: '#fea32e'
        }, {
          key: 'calculatorHouseLoan',
          type: 'fund',
          label: '公积金贷款',
          icon: 'hl-icon-house',
          color: '#ff5e1d'
        }, {
          key: 'calculatorHouseLoan',
          type: 'commercial',
          label: '商业贷款',
          icon: 'hl-icon-store',
          color: '#6075ff'
        }, {
          key: 'calculatorCombinedLoan',
          label: '组合贷款',
          icon: 'hl-icon-method',
          color: '#fea32e'
        }, {
          key: 'calculatorHouseTax',
          label: '房产税',
          icon: 'hl-icon-interest',
          color: '#2dc49b'
        }]
      }
      // {
      //   label: '车贷工具',
      //   children: [{
      //     key: 'calculatorCarLoan',
      //     label: '车贷',
      //     icon: 'hl-icon-car',
      //     color: '#ff6a3f'
      //   }]
      // }
      ]
    }
  },
  methods: {
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
  .hl-menu {
    margin: 30px;

    .hl-menu__label {
      margin-bottom: 20px;
      font-size: $subTitleSize;
      font-weight: 500;
      color: $textColor;
    }

    .hl-menu__body {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 50px;

      .hl-menu__button {
        width: 25%;
        margin-bottom: 30px;
        padding-top: 20px;
        text-align: center;
        cursor: pointer;

        .hl-icon {
          display: block;
          font-size: 84px;
        }

        span {
          font-size: $descriptionSize;
          line-height: 37px;
          color: $subTitleColor
        }

        &:active {
          transform: scale(.98);
        }
      }
    }
  }
}
</style>
