<template>
  <li class="hl-menu-item"
    :class="{'hl-menu-item_static': !showArrow}"
    v-on="$listeners"
    @touchstart="touchstart">
    <slot name="prefix"></slot>
    <div class="hl-menu-item__inner">
      <span class="hl-menu-item__label"
        v-if="label">
        {{ label }}
      </span>
      <span class="hl-menu-item__content"
        v-if="content">
        {{ content }}
      </span>
      <i class="hl-icon hl-icon-arrow-right"
        v-if="showArrow">
      </i>
    </div>
  </li>
</template>

<script>
export default {
  name: 'HlMenuItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    showArrow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    touchstart () {
      // For mobile active style
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-menu-item {
  display: flex;
  align-items: center;
  height: 110px;
  padding-left: 30px;
  background: $blockColor;
  cursor: pointer;

  .hl-menu-item__inner {
    display: flex;
    align-items: center;
    flex: auto;
    height: 100%;
    padding-right: 30px;
    box-sizing: border-box;
    border-bottom: $splitBorder;

    .hl-menu-item__label {
      flex: auto;
      font-size: $textSize;
      line-height: 110px;
      color: $textColor;
    }

    .hl-menu-item__content {
      font-size: $descriptionSize;
      color: $descriptionColor;
    }

    .hl-icon {
      margin-left: 10px;
      font-size: $titleSize;
      color: $iconColor;
    }
  }

  &:active {
    background-color: $blockActiveColor;
  }

  &.hl-menu-item_static {
    background: $blockColor;
    cursor: default;

    .hl-menu-item__inner {
      padding-right: 75px;
    }
  }
}
</style>
