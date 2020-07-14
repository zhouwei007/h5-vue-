<template>
  <div class="hl-description">
    <p class="hl-description__error"
      v-if="error">
      {{ error }}
    </p>
    <p class="hl-description__content"
      v-else-if="content.length"
      v-for="item of content"
      :key="item">
      {{ item }}
    </p>
    <p class="hl-description__content"
      v-else>
      <slot>&nbsp;</slot>
    </p>
  </div>
</template>

<script>
export default {
  name: 'HlDescription',
  props: {
    content: {
      type: Array,
      default () {
        return []
      }
    },
    error: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-description {
  margin: 20px 30px;

  .hl-description__content {
    font-size: $descriptionSize;
    line-height: 37px;
    color: $descriptionColor;
  }

  .hl-description__error {
    font-size: $descriptionSize;
    line-height: 37px;
    color: $themeColor;
  }
}
</style>
