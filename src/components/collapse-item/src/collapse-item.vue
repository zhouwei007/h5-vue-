<template>
  <div class="hl-collapse-item" v-on="$listeners">
    <div
      :class="['hl-collapse-title', { 'hl-collapse-title-border' : show }]"
      @click="changeCollapse">
      {{ title }}
      <transition name="icon-flip">
        <i :class="['hl-icon hl-icon-arrow-down', { 'hl-icon-animation': !show }]"></i>
      </transition>
    </div>
    <hl-collapse-transition>
      <div v-show="show" class="hl-collapse-body">
        <slot></slot>
      </div>
    </hl-collapse-transition>
  </div>
</template>

<script>
import HlCollapseTransition from '@/components/collapse-transition'
export default {
  name: 'HlCollapseItem',
  components: {
    HlCollapseTransition
  },
  props: {
    title: {
      type: String,
      default: 'Title'
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    changeCollapse () {
      this.$parent.childEach(this._uid)
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-collapse-item {
  width: 720px;
  margin-left: 30px;
  padding-right: 30px;
  border-bottom: $splitBorder;
  &:last-child {
    border-bottom: none;
  }

  .hl-collapse-title {
    height: 110px;
    line-height: 110px;
    font-size: $subTitleSize;
    color: $textColor;
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding-right: 30px;

    &.hl-collapse-title-border {
      border-bottom: $splitBorder;
    }

    .hl-icon {
      transform: rotate(180deg);
      transition-duration: 0.3s;
      color: $customerLabelColor;
    }

    .hl-icon-animation {
      transform: rotate(0deg);
    }
  }

  .hl-collapse-body {
    flex: 1;
  }
}
</style>
