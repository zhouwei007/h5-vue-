<template>
  <div class="hl-brokerage"
    :class="{'hl-brokerage_active': data.collapse}">
    <div class="hl-brokerage__header"
      @click="handleCollapse">
      <p class="hl-brokerage__date">{{ data.date }}</p>
      <span>已获奖励金：</span>
      <p class="hl-brokerage__amount">{{ data.amount | money }}</p>
      <transition name="icon-flip">
        <i v-if="data.collapse" class="hl-icon hl-icon-arrow-up"></i>
      </transition>
      <transition name="icon-flip-reverse">
        <i v-if="!data.collapse" class="hl-icon hl-icon-arrow-down"></i>
      </transition>
    </div>
    <hl-collapse-transition>
      <ul class="hl-brokerage__body" v-show="data.collapse">
        <li class="hl-brokerage__item"
          v-for="(row, index) in data.rows"
          :key="index">
          <div class="hl-brokerage__item-inner">
            <span class="hl-brokerage__date">{{ row.date }}</span>
            <span class="hl-brokerage__amount">{{ row.amount | money }}</span>
          </div>
        </li>
      </ul>
    </hl-collapse-transition>
  </div>
</template>

<script>
import HlCollapseTransition from '@/components/collapse-transition'
export default {
  name: 'HlBrokerageCard',
  components: {
    HlCollapseTransition
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    handleCollapse () {
      this.$emit('collapse', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-brokerage {
  position: relative;
  width: 690px;
  margin: auto;
  margin-bottom: 20px;
  background-color: $blockColor;
  border-radius: $cardRadius;
  z-index: 1;

  .hl-brokerage__header {
    display: flex;
    align-items: center;
    height: 100px;
    padding: 0 30px;
    background-color: $blockColor;
    border-radius: $cardRadius;
    transition: background-color .2s;

    .hl-brokerage__date {
      flex: auto;
      font-size: $textSize;
      font-weight: 600;
      color: $textColor;
    }

    span {
      font-size: $quoteSize;
      color: $descriptionColor;
    }

    .hl-brokerage__amount {
      color: $textColor;
      @include number($textSize);
    }

    .hl-icon {
      margin-left: 15px;
      font-size: 45px;
      color: $iconColor;
    }

    .icon-flip-enter-active {
      animation: flip .3s;
    }

    .icon-flip-reverse-enter-active {
      animation: flip-reverse .3s;
    }
  }

  &.hl-brokerage_active .hl-brokerage__header {
    background-color: $themeColor;
    transition: background-color .2s;

    .hl-brokerage__date,
    .hl-brokerage__amount,
    span {
      color: $blockColor;
    }
  }

  .hl-brokerage__body {
    padding-bottom: 10px;

    .hl-brokerage__item-inner {
      display: flex;
      align-items: center;
      height: 100px;
      margin-left: 30px;
      padding-right: 30px;
      color: $textColor;
      border-bottom: $splitBorder;

      .hl-brokerage__date {
        flex: auto;
        font-weight: 500;
        @include number($descriptionSize);
      }

      .hl-brokerage__amount {
        @include number($textSize);
      }
    }

    .hl-brokerage__item:last-child .hl-brokerage__item-inner {
      border-bottom: none;
    }
  }
}
</style>
