<template>
  <ul class="hl-menu">
    <slot></slot>
  </ul>
</template>

<script>
export default {
  name: 'HlMenu'
}
</script>

<style lang="scss" scoped>
.hl-menu::v-deep {
  margin: 20px 0;

  .hl-menu-item:last-child {
    .hl-menu-item__inner {
      border-bottom: none;
    }
  }
}
</style>
