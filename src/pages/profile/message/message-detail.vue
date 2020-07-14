<template>
  <div class="hl-content">
    <div v-if="data" class="hl-title">
      <h4>{{ data.msgTitle }}</h4>
      <span>{{ data.receiveTime | datetime }}</span>
    </div>
    <div class="hl-content" v-html="data.msgContent" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Utils from 'common/utils'
import IdentityApi from 'common/api/identity'
export default {
  name: 'HlMessageDetail',
  computed: {
    ...mapState([
      'message'
    ]),
    data () {
      return this.message || {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      !this.message && this.$router.back()
      if (this.data.status !== 0) {
        return
      }
      try {
        await IdentityApi.updateMessage(this.data.id)
      } catch (err) {
        Utils.errorLog(err, 'UPDATE-MESSAGE')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-title {
    margin: 30px;
    margin-bottom: 20px;
    border-bottom: $splitBorder;
    overflow: hidden;

    h4 {
      margin-bottom: 10px;
      font-size: $titleSize;
      font-weight: 600;
      line-height: 48px;
      color: $textColor;
    }

    span {
      display: block;
      margin-bottom: 20px;
      font-size: $quoteSize;
      line-height: 33px;
      color: $descriptionColor;
    }
  }

  .hl-content {
    margin: 30px;
    margin-top: 20px;
    font-size: $textSize;
    line-height: 50px;
    color: $subTitleColor;
  }
}
</style>
