<template>
  <div class="hl-content">
    <div class="hl-card">
      <img class="hl-card__image" :src="qrcodeUrl">
      <p class="hl-card__info">长按二维码发送给朋友</p>
      <hl-button
        v-clipboard:copy="shareUrl"
        v-clipboard:success="handleCopySuccess"
        v-clipboard:error="handleCopyError"
      >
        {{ type === 0 ? '复制链接' : '复制加密链接' }}
      </hl-button>
    </div>
  </div>
</template>

<script>
import Utils from 'common/utils'
import CustomerApi from 'common/api/customer'
import Toast from '@/components/toast'
import HlButton from '@/components/button'
export default {
  name: 'HlCustomerShare',
  components: {
    HlButton
  },
  data () {
    return {
      type: 0,
      qrcodeUrl: '',
      shareUrl: ''
    }
  },
  async mounted () {
    const id = this.$route.query.id
    this.type = Number(this.$route.query.type || 0)
    this.type === 0
      ? this.getShareToken(id)
      : this.getEncryptShareToken(id)
  },
  methods: {
    async getShareToken (customerId) {
      try {
        const response = await CustomerApi.getShareToken(customerId)
        this.shareUrl = `${location.origin}${process.env.BASE_URL}customer/supply?token=${response}`
        this.qrcodeUrl = Utils.formatQrcodeUrl(this.shareUrl)
      } catch (err) {
        Utils.errorLog(err, 'GET-SHARE-TOKEN', false)
        this.$router.back()
      }
    },
    async getEncryptShareToken (customerId) {
      try {
        const response = await CustomerApi.getEncryptShareToken(customerId)
        this.shareUrl = `${location.origin}/customer/static/home?token=${response}`
        this.qrcodeUrl = Utils.formatQrcodeUrl(this.shareUrl)
      } catch (err) {
        Utils.errorLog(err, 'GET-SHARE-TOKEN', true)
      }
    },
    handleCopySuccess () {
      Toast.show('已复制分享链接到剪贴板')
    },
    handleCopyError () {
      Toast.show('复制失败，请长按二维码发送给朋友')
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-card {
    width: 650px;
    margin: 30px auto;
    text-align: center;
    background-color: $blockColor;
    border-radius: $cardRadius;
    overflow: hidden;

    .hl-card__image {
      display: block;
      width: 360px;
      height: 360px;
      margin: 30px auto 10px auto;
    }

    .hl-card__info {
      margin: auto;
      font-size: $subTitleSize;
      color: $subTitleColor;
    }

    .hl-button {
      width: 240px;
      height: 80px;
      margin: 70px auto;
      font-size: $subTitleSize;
      color: $themeColor;
      border: 1px solid $themeColor;
      border-radius: 40px;
    }

    .hl-button:active {
      background-color: $blockActiveColor;
      transition: background-color .2s;
      transform: scale(.99);
    }
  }
}
</style>
