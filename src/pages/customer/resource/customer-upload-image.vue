<template>
  <div class="hl-content">
    <hl-form>
      <hl-form-item label="身份证正面图片">
        <span>{{ idCardLength }}张</span>
        <hl-upload
          v-model="params.idcardPicture"
          slot="suffix"
          :maxlength="1"
          :url="idcardList"
          @delete="handleDeleteIdcard"
        />
      </hl-form-item>
    </hl-form>
    <hl-form>
      <hl-form-item label="房产证图片">
        <span>{{ propertyLength }}张</span>
        <hl-upload
          v-model="params.propertyPicture"
          slot="suffix"
          :maxlength="10"
          :url="propertyList"
          @delete="handleDeleteProperty"
        />
      </hl-form-item>
    </hl-form>
    <hl-form>
      <hl-form-item label="征信报告图片">
        <span>{{ creditLength }}张</span>
        <hl-upload
          v-model="params.creditPicture"
          slot="suffix"
          :maxlength="30"
          :url="creditList"
          @delete="handleDeleteCredit"
        />
      </hl-form-item>
    </hl-form>
    <hl-form>
      <hl-form-item label="其他">
        <span>{{ otherLength }}张</span>
        <hl-upload
          v-model="params.otherPicture"
          slot="suffix"
          :maxlength="30"
          :url="otherList"
          @delete="handleDeleteOther"
        />
      </hl-form-item>
    </hl-form>

    <hl-button type="primary" @click="submit">
      {{ customerId ? '保存' : '确认' }}
    </hl-button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Utils from 'common/utils'
import CustomerApi, { Customer } from 'common/api/customer'
import Toast from '@/components/toast'
import Loading from '@/components/loading'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlUpload from '@/components/upload'
import HlButton from '@/components/button'
export default {
  name: 'HlCustomerUploadImage',
  components: {
    HlForm,
    HlFormItem,
    HlUpload,
    HlButton
  },
  data () {
    return {
      customerId: null,
      params: {
        idcardPicture: [],
        propertyPicture: [],
        creditPicture: [],
        otherPicture: []
      },
      idcardDeleteIds: [],
      propertyDeleteIds: [],
      creditDeleteIds: [],
      otherDeleteIds: [],
      idcardList: [],
      propertyList: [],
      creditList: [],
      otherList: []
    }
  },
  computed: {
    ...mapGetters([
      'customerCreateImages'
    ]),
    idCardLength () {
      return this.params.idcardPicture.length + this.idcardList.length - this.idcardDeleteIds.length
    },
    propertyLength () {
      return this.params.propertyPicture.length + this.propertyList.length - this.propertyDeleteIds.length
    },
    creditLength () {
      return this.params.creditPicture.length + this.creditList.length - this.creditDeleteIds.length
    },
    otherLength () {
      return this.params.otherPicture.length + this.otherList.length - this.otherDeleteIds.length
    }
  },
  mounted () {
    this.customerId = this.$route.query.id || null
    this.customerId && this.init()
    if (!this.customerId && this.customerCreateImages) {
      this.params = this.customerCreateImages
    }
  },
  methods: {
    ...mapMutations({
      setHeaderButton: STORE_TYPES.SET_HEADER_BUTTON,
      setCustomerInfo: STORE_TYPES.SET_CUSTOMER_INFO
    }),
    init () {
      const keys = ['idcardList', 'propertyList', 'creditList', 'otherList']
      keys.forEach(key => this.getImageList(key))
      this.idcardDeleteIds = []
      this.propertyDeleteIds = []
      this.creditDeleteIds = []
      this.otherDeleteIds = []
      this.setHeaderButton({
        text: '分享',
        event: this.handleShare
      })
    },
    async submit () {
      if (!this.customerId) {
        this.setCustomerInfo({ imageList: this.params })
        this.$router.back()
        return
      }
      try {
        const { idcardPicture, propertyPicture, creditPicture, otherPicture } = this.params
        const { idcardDeleteIds, propertyDeleteIds, creditDeleteIds, otherDeleteIds } = this
        Loading.open()
        await Promise.all([
          this.upload(idcardPicture, Customer.FILE_TYPE.IDCARD, idcardDeleteIds),
          this.upload(propertyPicture, Customer.FILE_TYPE.PROPERTY_CERTIFICATE, propertyDeleteIds),
          this.upload(creditPicture, Customer.FILE_TYPE.CREDIT_REPORT, creditDeleteIds),
          this.upload(otherPicture, Customer.FILE_TYPE.OTHER, otherDeleteIds)
        ])
        this.$router.back()
      } catch (err) {
        Toast.show(err.code === 413 ? '单次上传图片过多，请减少数量重试' : err.message)
      } finally {
        Loading.close()
      }
    },
    handleShare () {
      this.$router.push({
        name: 'customerShare',
        query: {
          id: this.customerId
        }
      })
    },
    handleDeleteIdcard (data) {
      this.idcardDeleteIds.push(data)
    },
    handleDeleteProperty (data) {
      this.propertyDeleteIds.push(data)
    },
    handleDeleteCredit (data) {
      this.creditDeleteIds.push(data)
    },
    handleDeleteOther (data) {
      this.otherDeleteIds.push(data)
    },
    upload (file, fileType, id) {
      return CustomerApi.upload({
        customerId: this.customerId,
        file,
        fileType,
        id
      })
    },
    async getImageList (type) {
      const dict = {
        idcardList: Customer.FILE_TYPE.IDCARD,
        propertyList: Customer.FILE_TYPE.PROPERTY_CERTIFICATE,
        creditList: Customer.FILE_TYPE.CREDIT_REPORT,
        otherList: Customer.FILE_TYPE.OTHER
      }
      try {
        const response = await CustomerApi.getImageList({
          customerId: this.customerId,
          fileType: dict[type]
        })
        this[type] = response.list || []
      } catch (err) {
        Utils.errorLog(err, 'GET-IMAGE-LIST')
      }
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
  }

  .hl-button.hl-button_primary {
    margin-top: 60px;
  }
}
</style>
