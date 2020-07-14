<template>
  <div class="hl-button-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HlButtonGroup'
}
</script>

<style lang="scss" scoped>
.hl-button-group::v-deep {
  display: flex;
  margin: 30px;

  .hl-button {
    margin-right: 30px;
  }

  .hl-button:last-child {
    margin-right: 0;
  }

  .hl-button_default {
    flex: auto;
    display: block;
    height: 100px;
    font-size: $titleSize;
    line-height: 100px;
    color: $themeColor;
    border: 1px solid $themeColor;
    border-radius: 2px;
    transition: background-color .2s;

    &:not(.hl-button_disabled):active {
      transition: background-color .2s;
      transform: scale(.99);
    }
  }

  .hl-button_primary {
    flex: auto;
    width: auto !important;
    margin: 0 !important;
    background-color: $themeColor;
    background-image: none;
    box-shadow: none;

    &:not(.hl-button_disabled):active {
      background-color: $themeActiveColor;
      transition: background-color .2s;
      transform: scale(.99);
    }
  }
}
</style>
