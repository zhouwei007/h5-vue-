<template>
  <div class="hl-content">
    <hl-input
      v-model="data.description"
      type="textarea"
      placeholder="输入备注......"
      :maxlength="255"
    />
    <hl-upload
      v-model="data.images"
      :url="echoUrl"
      :maxlength="9"
      @delete="handleImageDelete"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Utils from 'common/utils'
import RecordApi from 'common/api/record'
import Toast from '@/components/toast'
import HlInput from '@/components/input'
import HlUpload from '@/components/upload'
export default {
  name: 'HlCustomerRecordAdd',
  components: {
    HlInput,
    HlUpload
  },
  data () {
    return {
      data: {
        customerId: '',
        recordId: '',
        description: '',
        images: [],
        imageIndexs: []
      },
      buttonOption: {
        text: '完成',
        event: this.submit,
        disabled: true
      }
    }
  },
  computed: {
    ...mapState([
      'customerRecord'
    ]),
    ...mapGetters([
      'customerCreateRecord'
    ]),
    echoUrl () {
      return this.data.recordId && this.customerRecord && this.customerRecord.imageRecordList
        ? this.customerRecord.imageRecordList.map(item => ({
          id: item.customerFileId,
          url: item.url
        }))
        : null
    }
  },
  watch: {
    data: {
      handler (val) {
        // const disabled = Boolean(!val.description && !val.images.length && (!this.echoUrl || !this.echoUrl.length))
        const disabled = Boolean(!val.description && !val.images.length)
        this.buttonOption.disabled !== disabled && this.setButton(disabled)
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations({
      setTitle: STORE_TYPES.SET_TITLE,
      setHeaderButton: STORE_TYPES.SET_HEADER_BUTTON,
      setCustomerInfo: STORE_TYPES.SET_CUSTOMER_INFO,
      setCustomerRecord: STORE_TYPES.SET_CUSTOMER_RECORD,
      setAddCustomerRecordRecent: STORE_TYPES.SET_ADD_CUSTOMER_RECORD_RECENT
    }),
    async init () {
      this.data.customerId = Number(this.$route.query.id)
      this.data.recordId = Number(this.$route.query.recordId) || null
      if (!this.data.customerId && this.data.recordId !== -1) {
        this.goBack()
      }
      if (this.data.recordId === -1 && this.customerCreateRecord) {
        this.data.description = this.customerCreateRecord.description
        this.data.images = this.customerCreateRecord.images
      } else if (this.data.recordId && this.data.recordId !== -1) {
        this.setTitle('编辑访问记录')
        !this.customerRecord && await this.getCustomerRecord(this.data.customerId, this.data.recordId)
        this.data.description = this.customerRecord.recordDesc
        this.data.imageIndexs = this.customerRecord.imageRecordList
          ? this.customerRecord.imageRecordList.map(item => item.customerFileId)
          : []
      }
      this.setButton()
    },
    submit () {
      if (this.data.recordId === -1) {
        this.setCustomerInfo({
          record: {
            description: this.data.description,
            images: this.data.images
          }
        })
        this.$router.back()
      } else {
        this.createCustomerRecord()
      }
    },
    async createCustomerRecord () {
      try {
        this.data.recordId
          ? await RecordApi.update(this.data)
          : await RecordApi.create(this.data)
        Toast.show('访问记录保存成功')
        this.setAddCustomerRecordRecent(true)
        this.goBack()
      } catch (err) {
        Toast.show(err.code === 413 ? '单次上传图片过多，请减少数量重试' : err.message)
      }
    },
    async getCustomerRecord (customerId, recordId) {
      try {
        const response = await RecordApi.list({
          customerId,
          pageNo: 0,
          pageSize: 100000
        })
        const dataList = response.data || []
        this.setCustomerRecord(dataList.find(item => item.recordId === recordId))
      } catch (err) {
        Utils.errorLog(err, 'CUSTOMER-RECORD-LIST')
      }
    },
    setButton (disabled = false) {
      this.buttonOption.disabled = disabled
      this.setHeaderButton(this.buttonOption)
    },
    handleImageDelete (id) {
      const index = this.data.imageIndexs.findIndex(item => item === id)
      this.data.imageIndexs.splice(index, 1)
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  padding: 40px 30px;

  .hl-input::v-deep {
    margin-bottom: 20px;

    .hl-input__inner {
      height: 250px;
      padding: 0 10px;
      font-size: $subTitleSize;
      line-height: 42px;
    }
  }
}
</style>
