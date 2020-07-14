<template>
  <div class="hl-collapse">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HlCollapse',
  props: {
    accordion: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    childEach (childId) {
      this.$children.forEach(child => {
        if (child._uid !== childId) {
          child.show = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-collapse {
  background: $blockColor;
  width: 100%;
}
</style>
