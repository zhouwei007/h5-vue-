<template>
  <li
    class="hl-form-item"
    :class="{'hl-form-item_custom': $slots.suffix}"
    v-on="$listeners"
  >
    <slot name="prefix" />
    <div class="hl-form-item__inner">
      <span v-if="label" class="hl-form-item__label">
        <slot name="label">
          <i v-if="required" class="hl-form-item__required hl-icon hl-icon-asterisk" />{{ label }}
        </slot>
      </span>
      <div class="hl-form-item__content">
        <slot />
      </div>
    </div>
    <slot name="suffix" />
  </li>
</template>

<script>
export default {
  name: 'HlFormItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-form-item {
  display: flex;
  align-items: center;
  height: 110px;
  padding-left: 30px;
  background: $blockColor;

  .hl-form-item__inner {
    display: flex;
    align-items: center;
    flex: auto;
    height: 100%;
    box-sizing: border-box;
    border-bottom: $splitBorder;

    .hl-form-item__label {
      flex: none;
      width: 180px;
      font-size: $textSize;
      line-height: 110px;
      color: $subTitleColor;
      @extend %text-overflow;

      .hl-form-item__required {
        margin-right: -3px;
        font-size: 24px;
        line-height: 40px;
        color: $themeColor;
      }
    }

    .hl-form-item__content {
      flex: auto;
      width: 0;
      height: 100%;
      padding-right: 30px;

      .hl-input,
      .hl-select__wrapper,
      .hl-datepicker__wrapper {
        height: 100%;
      }

      .hl-input::v-deep .hl-input__label,
      .hl-select__wrapper::v-deep .hl-select__label,
      .hl-select__wrapper::v-deep .hl-select__text {
        display: block;
        width: 100%;
        line-height: 110px;
      }

      .hl-input::v-deep .hl-input__label,
      .hl-select__wrapper::v-deep .hl-select__text {
        text-align: right;
      }
    }
  }

  &.hl-form-item_custom {
    display: block;
    height: auto;
    padding-bottom: 20px;

    .hl-form-item__inner {
      border-bottom: none;

      .hl-form-item__label {
        line-height: 80px;
      }

      .hl-form-item__content {
        font-size: $descriptionSize;
        text-align: right;
        color: $descriptionColor;
      }
    }
  }
}
</style>
