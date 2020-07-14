<template>
  <div class="hl-label">
    <div class="hl-label__inner">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HlLabel',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-label {
  margin: 20px auto;
  text-align: center;

  .hl-label__inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    padding: 0 30px;
    font-size: $descriptionSize;
    color: $descriptionColor;
    background-color: $blockColor;
    border-radius: 35px;
  }
}
</style>
