<template>
  <div class="hl-content">
    <template v-if="hasImage">
      <hl-form v-if="data.idCard.length">
        <hl-form-item label="身份证正面图片">
          <span>{{ data.idCard.length }}张</span>
          <hl-upload
            v-model="data.idCard"
            slot="suffix"
            :maxlength="1"
            :editable="false"
          />
        </hl-form-item>
      </hl-form>
      <hl-form v-if="data.properTyCertificate.length">
        <hl-form-item label="房产证图片">
          <span>{{ data.properTyCertificate.length }}张</span>
          <hl-upload
            v-model="data.properTyCertificate"
            slot="suffix"
            :maxlength="10"
            :editable="false"
          />
        </hl-form-item>
      </hl-form>
      <hl-form v-if="data.creditReport.length">
        <hl-form-item label="征信报告图片">
          <span>{{ data.creditReport.length }}张</span>
          <hl-upload
            v-model="data.creditReport"
            slot="suffix"
            :maxlength="30"
            :editable="false"
          />
        </hl-form-item>
      </hl-form>
      <hl-form v-if="data.other.length">
        <hl-form-item label="其他">
          <span>{{ data.other.length }}张</span>
          <hl-upload
            v-model="data.other"
            slot="suffix"
            :maxlength="30"
            :editable="false"
          />
        </hl-form-item>
      </hl-form>

      <hl-button
        type="primary"
        @click="download"
      >
        资料打包下载
      </hl-button>
    </template>
    <hl-empty v-else>暂无加密图片资料</hl-empty>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Utils from 'common/utils'
import CustomerApi from 'common/api/customer'
import Confirm from '@/components/confirm'
import Loading from '@/components/loading'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlUpload from '@/components/upload'
import HlButton from '@/components/button'
import HlEmpty from '@/components/empty'
export default {
  name: 'HlCustomerEncryptImage',
  components: {
    HlForm,
    HlFormItem,
    HlUpload,
    HlButton,
    HlEmpty
  },
  data () {
    return {
      customerId: null,
      isEncryptExist: false,
      data: {
        idCard: [],
        properTyCertificate: [],
        creditReport: [],
        other: []
      }
    }
  },
  computed: {
    hasImage () {
      return this.isEncryptExist && (
        this.data.idCard.length ||
        this.data.properTyCertificate.length ||
        this.data.creditReport.length ||
        this.data.other.length
      )
    }
  },
  mounted () {
    this.isEncryptExist = Boolean(Number(this.$route.query.exist) || 0)
    this.customerId = this.$route.query.id || null
    this.customerId && this.init()
  },
  methods: {
    ...mapMutations({
      setHeaderButton: STORE_TYPES.SET_HEADER_BUTTON
    }),
    init () {
      this.isEncryptExist && this.getImagePath()
      this.setHeaderButton({
        text: '分享',
        event: this.handleShare
      })
    },
    async download () {
      if (/MicroMessenger/.test(navigator.userAgent)) {
        Confirm.show({
          title: '请在浏览器中登录后下载'
        })
        return
      }
      CustomerApi.downloadEncryptFile(this.customerId)
    },
    async getImagePath () {
      try {
        Loading.open()
        const response = await CustomerApi.getEncryptImages(this.customerId)
        if (response) {
          const def = Object.keys(response).map(key => this.getImageList(response, key))
          await Promise.all(def)
        }
      } catch (err) {
        Utils.errorLog(err, 'GET-ENCRYPT-IMAGES', true)
      } finally {
        Loading.close()
      }
    },
    getImageList (paths, key) {
      return new Promise(resolve => {
        const def = paths[key].map(path => this.getImageFile(path))
        Promise.all(def).then(data => {
          this.data[key] = data.reduce((res, item) => {
            item instanceof File && res.push(item)
            return res
          }, [])
        }).finally(resolve)
      })
    },
    async getImageFile (path) {
      try {
        const response = await CustomerApi.getEncryptImage(path)
        return response ? new File([response], 'file') : null
      } catch (err) {
        Utils.errorLog(err, 'GET-ENCRYPT-IMAGE')
      }
    },
    handleShare () {
      this.$router.push({
        name: 'customerShare',
        query: {
          id: this.customerId,
          type: 1
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-form-item::v-deep {
    .hl-form-item__inner .hl-form-item__label {
      width: 220px;
    }

    .hl-input .hl-input__inner {
      padding: 0;
      text-align: right;
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 60px;
  }
}
</style>
