<template>
  <ul class="hl-form">
    <li v-if="label" class="hl-form__label">
      {{ label }}
    </li>
    <slot></slot>
  </ul>
</template>

<script>
export default {
  name: 'HlForm',
  props: {
    label: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-form::v-deep {
  margin: 20px auto;

  .hl-form__label {
    padding: 0 30px;
    font-size: $subTitleSize;
    font-weight: 600;
    line-height: 80px;
    color: $textColor;
  }

  .hl-form-item:last-child {
    .hl-form-item__inner {
      border-bottom: none;
    }
  }
}
</style>
