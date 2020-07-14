<template>
  <hl-dialog
    :show.sync="show"
    :mask-close="false"
    @after-close="destroy"
  >
    <h4
      v-if="title"
      class="hl-dialog__title"
    >
      {{ title }}
    </h4>
    <p class="hl-dialog__description">
      {{ message }}
    </p>
    <template slot="footer">
      <hl-button
        v-if="cancel"
        @click="handleCancelClick"
      >
        {{ cancel === true ? '取消' : cancel }}
      </hl-button>
      <hl-button
        v-if="submit"
        type="primary"
        @click="handleSubmitClick"
      >
        {{ submit === true ? '确定' : submit }}
      </hl-button>
    </template>
  </hl-dialog>
</template>

<script>
import HlDialog from '@/components/dialog'
import HlButton from '@/components/button'
export default {
  name: 'HlConfirm',
  components: {
    HlDialog,
    HlButton
  },
  data () {
    return {
      show: false,
      title: '',
      message: '',
      submit: true,
      handleSubmit: null,
      cancel: false,
      handleCancel: null
    }
  },
  mounted () {
    this.open()
  },
  methods: {
    open () {
      this.show = true
    },
    handleSubmitClick () {
      this.handleSubmit && this.handleSubmit()
      this.show = false
    },
    handleCancelClick () {
      this.handleCancel && this.handleCancel()
      this.show = false
    },
    destroy () {
      this.$destroy(true)
    }
  }
}
</script>
