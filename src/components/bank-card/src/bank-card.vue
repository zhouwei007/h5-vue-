<template>
  <div class="hl-bankcard"
    :class="cardStyle">
    <span class="hl-bankcard__background"></span>
    <span class="hl-bankcard__background"></span>
    <div class="hl-bankcard__body">
      <div class="hl-bankcard__header">
        <hl-bank-icon background="white" :code="data.bank_code"></hl-bank-icon>
        <span class="hl-bankcard__title">{{ data.bank_name }}</span>
        <hl-button @click="handleClick">查看</hl-button>
      </div>
      <div class="hl-bankcard__code">
        <span>{{ data.bank_card_number | bankcard('prefix') }}</span>
        <span class="hl-bankcard__dot">····</span>
        <span class="hl-bankcard__dot">····</span>
        <span>{{ data.bank_card_number | bankcard('suffix') }}</span>
      </div>
      <div class="hl-bankcard__description">
        <p>户名：<span>{{ data.name | encrypt(1, null, 2) }}</span><span>{{ data.mobile | encrypt(3, 4) }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import HlBankIcon from '@/components/bank-icon'
import HlButton from '@/components/button'
export default {
  name: 'HlBankCard',
  components: {
    HlBankIcon,
    HlButton
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  filters: {
    bankcard (val, type) {
      if (type === 'suffix') {
        return val ? val.slice(-4) : ''
      } else if (type === 'prefix') {
        return val ? val.substring(0, 4) : ''
      } else {
        return val ? val.replace(/(\d{4})(?=\d)/g, '$1 ') : ''
      }
    }
  },
  computed: {
    cardStyle () {
      const styleDict = {
        ABC: 'green',
        BOC: 'red',
        CCB: 'blue',
        CEB: 'blue',
        CIB: 'blue',
        CITIC: 'red',
        GDB: 'red',
        ICBC: 'red',
        PSBC: 'green',
        SPDB: 'blue',
        HXB: 'red',
        CMB: 'red',
        CMBC: 'green',
        COMM: 'blue',
        SZPAB: 'red',
        BCOM: 'blue',
        PAB: 'red',
        BOB: 'red',
        BOS: 'blue'
      }
      return `hl-bankcard_${styleDict[this.data.bank_code.toUpperCase()] || 'red'}`
    }
  },
  methods: {
    handleClick () {
      this.$emit('detail', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-bankcard {
  position: relative;
  width: 690px;
  height: 280px;
  margin: 20px auto;
  border-radius: $cardRadius;

  .hl-bankcard__background {
    position: absolute;
    display: block;
    right: 0;
    z-index: 1;

    &:nth-child(1) {
      top: 0;
      width: 281px;
      height: 235px;
      border-top-right-radius: $cardRadius;
      border-bottom-left-radius: 80%;
    }

    &:nth-child(2) {
      bottom: 0;
      width: 217px;
      height: 155px;
      border-bottom-right-radius: $cardRadius;
      border-top-left-radius: 100%;
      opacity: .5;
    }
  }

  &.hl-bankcard_red {
    background-color: #fc4258;

    .hl-bankcard__background {
      &:nth-child(1) {
        background-image: linear-gradient(70deg, #FA6879 6%, #FC4258 67%);
      }

      &:nth-child(2) {
        background-image: linear-gradient(62deg, #FA6475 0%, #FC4258 65%);
      }
    }
  }

  &.hl-bankcard_blue {
    background-color: #305cf9;

    .hl-bankcard__background {
      &:nth-child(1) {
        background-image: linear-gradient(62deg, #446CFA 0%, #305CF9 65%);
      }

      &:nth-child(2) {
        background-image: linear-gradient(70deg, #486EF7 6%, #305CF9 67%);
      }
    }
  }

  &.hl-bankcard_green {
    background-color: #00ceb2;

    .hl-bankcard__background {
      &:nth-child(1) {
        background-image: linear-gradient(62deg, #0DDABE 0%, #00CEB2 65%);
      }

      &:nth-child(2) {
        background-image: linear-gradient(70deg, #0BDEC1 6%, #00CEB2 67%);
      }
    }
  }

  .hl-bankcard__body {
    position: relative;
    z-index: 2;
  }

  .hl-bankcard__header {
    display: flex;
    align-items: center;
    padding: 0 30px;
    height: 100px;
  }

  .hl-bank-icon {
    margin-right: 20px;
  }

  .hl-bankcard__title {
    flex: auto;
    width: 0;
    font-size: 32px;
    font-weight: 600;
    color: $blockColor;
    @extend %text-overflow;
  }

  .hl-button {
    font-size: $descriptionSize;
    color: $blockColor;
  }

  .hl-bankcard__code {
    padding-left: 100px;
    line-height: 80px;
    letter-spacing: 0;
    color: $blockColor;
    @include number(54px);

    span {
      margin-right: 25px;
    }

    .hl-bankcard__dot {
      font-size: 72px;
      font-weight: bold;
      letter-spacing: 8px;
      line-height: 48px;
    }
   }

  .hl-bankcard__description {
    margin-top: 30px;
    margin-left: 100px;
    font-size: $descriptionSize;
    color: $blockColor;
    opacity: .8;

    span {
      margin: 0 10px;
    }
  }
}
</style>
