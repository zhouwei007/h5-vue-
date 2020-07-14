<template>
  <div class="hl-empty"
    :class="`hl-empty_${type}`">
    <slot name="icon">
      <div class="hl-empty__icon" />
    </slot>
    <div class="hl-empty__text">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HlEmpty',
  props: {
    text: {
      type: String,
      default: '暂无数据'
    },
    type: {
      type: String,
      default: 'default',
      validator (val) {
        return [
          'default',
          'network',
          'service',
          'lock'
        ].indexOf(val) !== -1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-empty {
  margin-top: 120px;
  padding: 30px;
  text-align: center;

  .hl-empty__icon {
    display: block;
    width: 400px;
    height: 230px;
    margin: auto;
    background-size: cover;
    background-repeat: no-repeat;
  }

  &.hl-empty_default .hl-empty__icon {
    background-image: url(~images/empty-default.png);
  }

  &.hl-empty_network .hl-empty__icon {
    background-image: url(~images/empty-network.png);
  }

  &.hl-empty_service .hl-empty__icon {
    background-image: url(~images/empty-service.png);
  }

  &.hl-empty_lock .hl-empty__icon {
    background-image: url(~images/empty-lock.png);
  }

  .hl-empty__text {
    margin-top: 6px;
    font-size: $textSize;
    line-height: 37px;
    color: $descriptionColor;
  }
}
</style>
