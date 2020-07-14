<template>
  <li class="hl-customer-card" v-on="$listeners">
    <slot name="label">
      <div class="hl-customer-card__label">
        <img v-if="data.url" :src="thumbnailUrl" />
        <span v-else>{{ data.name && data.name.substr(0, 1).toUpperCase() }}</span>
      </div>
    </slot>
    <div class="hl-customer-card__body">
      <div class="hl-customer-card__content">
        <p class="hl-customer-card__title">{{ data.name }}</p>
        <p class="hl-customer-card__description">{{ data.groupName }}</p>
      </div>
      <div class="hl-customer-card__button">
        <slot>
          <hl-button v-if="showButton" @click.stop="handleRecommend">推荐</hl-button>
        </slot>
      </div>
    </div>
  </li>
</template>

<script>
import Utils from 'common/utils'
import HlButton from '@/components/button'
export default {
  name: 'HlCustomerCard',
  components: {
    HlButton
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    thumbnailUrl () {
      return Utils.formatUfileUrl(this.data.url, { type: 7, width: 60, height: 60 })
    }
  },
  methods: {
    handleRecommend () {
      this.$emit('recommend', this.data.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-customer-card {
  display: flex;
  align-items: center;
  height: 140px;
  padding-left: 30px;
  background-color: $blockColor;
  cursor: pointer;

  .hl-customer-card__label {
    width: 80px;
    height: 80px;
    font-size: 50px;
    font-weight: bold;
    line-height: 80px;
    text-align: center;
    color: $blockColor;
    background: $customerLabelColor;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .hl-customer-card__body {
    display: flex;
    flex: auto;
    align-items: center;
    height: 100%;
    padding: 0 30px;
    border-bottom: $splitBorder;
    box-sizing: border-box;

    .hl-customer-card__content {
      flex: auto;
      width: 0;

      .hl-customer-card__title {
        font-size: 32px;
        line-height: 45px;
        color: $textColor;
        @extend %text-overflow;
      }

      .hl-customer-card__description {
        padding-top: 5px;
        font-size: $descriptionSize;
        line-height: 37px;
        color: $descriptionColor;
        @extend %text-overflow;
      }
    }

    .hl-customer-card__button {
      .hl-button {
        height: 50px;
        padding: 0 20px;
        line-height: 48px;
        font-size: $textSize;
        color: $themeColor;
        background-color: $blockColor;
        border: 2px solid $themeColor;
        border-radius: 25px;

        &:active {
          background-color: $blockActiveColor;
          transition: background-color .2s;
          transform: scale(.99);
        }
      }
    }
  }

  &:last-child .hl-customer-card__body {
    border-bottom: none;
  }
}
</style>
