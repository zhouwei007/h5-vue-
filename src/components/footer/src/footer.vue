<template>
  <ul class="hl-footer">
    <li v-for="option in options"
      :key="option.to"
      class="hl-footer__button"
      :class="{'hl-footer__button_active': current === option.to}"
      @click="handleClick(option.to)">
      <i class="hl-icon" :class="current === option.to ? option.activeIcon : option.icon" />
      <span class="hl-footer__label">
        {{ option.label }}
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'HlFooter',
  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    current () {
      return this.$route.name
    }
  },
  methods: {
    handleClick (name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="scss">
.hl-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: $footerHeight;
  background-color: $blockColor;
  box-shadow: 0 0 20px 0 rgba(0,0,0,0.03);

  .hl-footer__button {
    flex: 1;
    color: $subTitleColor;
    cursor: pointer;

    .hl-footer__label {
      display: block;
      font-size: 20px;
      line-height: 28px;
      text-align: center;
    }

    .hl-icon {
      display: block;
      width: 48px;
      height: 48px;
      line-height: 48px;
      margin: auto;
      margin-top: 10px;
      margin-bottom: 2px;
      font-size: 36px;
      color: $footerColor;
      background-size: cover;
      text-align: center;

    }

    &.hl-footer__button_active {
      color: $themeColor;

      .hl-icon {
        color: $themeColor;
      }
    }
  }
}
</style>
