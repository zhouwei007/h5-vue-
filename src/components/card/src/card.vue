<template>
  <div
    class="hl-card"
    :class="{
      'hl-card_success': cardType === 'success',
      'hl-card_failure': cardType === 'failure'
    }"
    v-on="$listeners"
  >
    <div class="hl-card__header">
      <span class="hl-card__icon" />
      <span class="hl-card__label">{{ options.header.label }}</span>
      <span
        class="hl-card__value"
        :class="{'hl-card__amount': options.header.type === 'amount'}"
      >
        {{ filter(data[options.header.value], options.header.filter) }}
      </span>
    </div>
    <div class="hl-card__body">
      <ul
        class="hl-card__list"
        :class="{'hl-card__list_footer': !options.footer}"
      >
        <li
          v-for="item in options.body"
          v-show="data[item.value] !== void 0"
          :key="item.label"
          class="hl-card__item"
        >
          <span class="hl-card__label">{{ item.label }} </span>
          <span
            class="hl-card__value"
            :class="{'hl-card__amount': item.type === 'amount'}">
            {{ filter(data[item.value], item.filter) }}
          </span>
        </li>
      </ul>
      <hl-collapse-transition v-if="options.detail">
        <ul v-show="data.collapse" class="hl-card__detail">
          <li
            v-for="item in options.detail"
            v-show="data[item.value] !== void 0"
            :key="item.label"
            class="hl-card__item"
          >
            <span class="hl-card__label">{{ item.label }} </span>
            <span
              class="hl-card__value"
              :class="{'hl-card__amount': item.type === 'amount'}"
            >
              {{ filter(data[item.value], item.filter) }}
            </span>
          </li>
        </ul>
      </hl-collapse-transition>
    </div>
    <div v-if="options.footer" class="hl-card__footer">
      <span>{{ options.footer.label }}{{ filter(data[options.footer.value], options.footer.filter) }}</span>
      <hl-button
        v-if="options.detail"
        @click="data.collapse = !data.collapse"
      >
        {{ data.collapse ? '收起' : '查看详情' }}
      </hl-button>
    </div>
  </div>
</template>

<script>
import Utils from 'common/utils'
import HlButton from '@/components/button'
import HlCollapseTransition from '@/components/collapse-transition'
export default {
  name: 'HlCard',
  components: {
    HlButton,
    HlCollapseTransition
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    options: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: String,
      default: null,
      validator (val) {
        return [
          'default',
          'success',
          'failure'
        ].includes(val)
      }
    }
  },
  computed: {
    cardType () {
      return this.type || this.options.type || 'default'
    }
  },
  methods: {
    filter (value, type) {
      const dict = {
        datetime: Utils.formatTime,
        money: Utils.formatMoney
      }
      return dict[type] ? dict[type].call(this, value) : Utils.formatNone(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-card {
  width: 690px;
  margin: 20px auto;
  background-color: $blockColor;
  border-radius: $cardRadius;

  .hl-card__label {
    display: block;
    width: 270px;
    padding-left: 30px;
    line-height: 37px;
    font-size: $descriptionSize;
    color: $subTitleColor;
  }

  .hl-card__value {
    line-height: 37px;
    color: $textColor;
    @include label($descriptionSize);
    @extend %text-overflow;

    &.hl-card__amount {
      font-family: Harabara;
      line-height: 40px;
      font-size: $titleSize;
      color: $textColor;
    }
  }

  .hl-card__header {
    display: flex;
    align-items: center;
    height: 80px;
    margin: 0 30px;
    border-bottom: 1px dashed #ccc;
    position: relative;

    .hl-card__label {
      padding-left: 0;
    }

    .hl-card__icon {
      position: absolute;
      width: 6px;
      height: 27px;
      background: $themeColor;
      left: -30px;
      top: 27px;
    }
  }

  .hl-card__body {
    margin-top: 10px;
    margin-bottom: 10px;

    .hl-card__list {
      height: 100%;
      width: 100%;

      &.hl-card__list_footer {
        padding-bottom: 10px;
      }
    }

    .hl-card__item {
      display: flex;
      align-items: center;
      height: 60px;
    }

    .hl-card__detail .hl-card__item:last-child {
      margin-bottom: 0;
    }

    .hl-card__value {
      font-weight: bold;

      &.hl-card__amount {
        font-weight: normal;
      }
    }
  }

  .hl-card__footer {
    display: flex;
    align-items: center;
    padding-left: 30px;
    height: 70px;
    background: $cardColor;
    border-radius: 0 0 $cardRadius $cardRadius;

    span {
      flex: auto;
      width: 0;
      font-size: $descriptionSize;
      color: $descriptionColor;
      @extend %text-overflow;
    }

    .hl-button {
      font-size: $quoteSize;
      color: $themeColor;
      padding-right: 30px;
    }
  }

  &.hl-card_success,
  &.hl-card_failure {
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      display: block;
      bottom: -26px;
      right: -26px;
      width: 124px;
      height: 124px;
      opacity: 0.3;
      border-radius: 50%;
    }

    &::after {
      position: absolute;
      display: block;
      bottom: -13px;
      right: -13px;
      width: 101px;
      height: 101px;
      line-height: 101px;
      font-size: $titleSize;
      text-align: center;
      opacity: 0.3;
      border-radius: 50%;
      transform: rotate(-45deg);
    }
  }

  &.hl-card_success {
    &::before {
      border: 3px solid $finishColor;
    }

    &::after {
      content: '成功';
      color: $finishColor;
      border: 1px dashed $finishColor;
    }
  }

  &.hl-card_failure {
    &::before {
      border: 3px solid $errorColor;
    }

    &::after {
      content: '未通过';
      font-size: $textSize;
      color: $errorColor;
      border: 1px dashed $errorColor;
    }
  }
}
</style>
