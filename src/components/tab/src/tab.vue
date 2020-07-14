<template>
  <div
    class="hl-tab"
    :class="{'hl-tab_vertical': direction === 'vertical'}"
  >
    <ul class="hl-tab__container" ref="tab">
      <li
        v-for="option in options"
        :key="option.value"
        class="hl-tab__item"
        :class="{'hl-tab__item_active': String(option.value) === String(value)}"
        @click="select(option)"
      >
        <span>{{ option.label }}</span>
      </li>
      <li v-if="direction === 'horizontal'" class="hl-tab__bar" ref="bar"/>
    </ul>
  </div>
</template>

<script>
import Utils from 'common/utils'
export default {
  name: 'HlTab',
  model: {
    prop: 'value',
    event: 'select'
  },
  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      default: null
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator (val) {
        return [
          'horizontal',
          'vertical'
        ].includes(val)
      }
    }
  },
  data () {
    return {
      tab: null,
      bar: null,
      tabWidth: 0,
      dpr: 1
    }
  },
  watch: {
    value () {
      this.setActiveBar()
    }
  },
  mounted () {
    this.tab = this.$refs.tab
    this.bar = this.$refs.bar
    this.resize()
    this.debounceResize = Utils.debounce(300, this.resize)
    window.addEventListener('resize', this.debounceResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.debounceResize)
  },
  methods: {
    select (option) {
      this.$emit('select', option.value)
    },
    setActiveBar () {
      if (!this.bar) {
        return
      }
      const index = this.options.findIndex(item => String(item.value) === String(this.value))
      this.bar.style.left = `${this.tabWidth * index + this.tabWidth / 2 - 20 * this.dpr}px`
    },
    resize () {
      this.dpr = parseFloat(document.documentElement.style.fontSize) / 75
      this.tabWidth = this.tab.offsetWidth / this.options.length
      this.setActiveBar()
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-tab {
  width: $screenWidth;
  height: 100px;
  padding: 0 150px;
  background-color: $blockColor;
  box-sizing: border-box;

  .hl-tab__container {
    position: relative;
    display: flex;
    height: 100%;

    .hl-tab__item {
      flex: auto;
      width: 0;
      font-size: $titleSize;
      font-weight: 600;
      line-height: 100px;
      text-align: center;
      color: $subTitleColor;
      opacity: 0.5;
      user-select: none;
      cursor: pointer;

      &.hl-tab__item_active {
        color: $themeColor;
        opacity: 1;
      }
    }

    .hl-tab__bar {
      position: absolute;
      bottom: 0;
      width: 40px;
      height: 6px;
      margin: auto;
      background-color: $themeColor;
      transition: left .3s ease-in-out;
    }
  }

  &.hl-tab_vertical {
    width: 180px;
    height: 100%;
    padding: 30px 0;

    .hl-tab__container {
      flex-direction: column;

      .hl-tab__item {
        flex: none;
        width: 100%;
        height: 80px;
        margin-bottom: 10px;
        font-size: $descriptionSize;
        line-height: 80px;
        color: $textColor;
        opacity: 1;

        &.hl-tab__item_active {
          background-color: $mainColor;
          color: $themeColor;
        }
      }
    }
  }
}
</style>
