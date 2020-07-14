<template>
  <div class="hl-content">
    <div class="hl-avatar">
      <div v-if="isDetail" class="hl-avatar__image">
        <img v-if="params.url" :src="thumbnailUrl" />
        <svg v-else class="hl-pic"><use xlink:href="#hl-pic-avator"></use></svg>
      </div>
      <hl-upload
        v-else
        v-model="params.file"
        type="avatar"
        :show-label="false"
        :url="params.url"
      >
        <svg class="hl-pic"><use xlink:href="#hl-pic-avator"></use></svg>
        <p slot="footer" class="hl-upload__footer">
          {{ (params.file || params.url) ? '修改' : '添加头像' }}
        </p>
      </hl-upload>
    </div>

    <hl-form>
      <hl-form-item label="姓名" :required="inputType === 'text'">
        <hl-input
          v-model="params.name"
          :type="inputType"
          :maxlength="30"
          placeholder="请输入客户姓名"
          validate="name"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="手机号" :required="inputType === 'text'">
        <hl-input
          v-model="params.mobile"
          :type="inputType"
          :maxlength="11"
          placeholder="请输入客户手机号"
          validate="number"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="身份证">
        <hl-input
          v-model="params.cardId"
          :maxlength="18"
          :type="inputType"
          placeholder="请输入客户身份证"
          label-placeholder="未填写"
          uppercase
          clearable
        />
      </hl-form-item>
      <hl-form-item label="分组">
        <hl-select
          v-model="params.groupCode"
          :options="groupOptions"
          :type="inputType"
          placeholder="请选择客户分组"
        />
      </hl-form-item>
    </hl-form>

    <hl-form v-if="isDetail">
      <hl-form-item label="公司" v-if="params.company">
        <hl-input v-model="params.company" type="label" />
      </hl-form-item>
      <hl-form-item label="行业" v-if="params.industry">
        <hl-input v-model="params.industry" type="label" />
      </hl-form-item>
      <hl-form-item label="地址" v-if="params.address">
        <hl-input v-model="params.address" type="label" />
      </hl-form-item>
      <hl-form-item label="邮箱" v-if="params.email">
        <hl-input v-model="params.email" type="label" />
      </hl-form-item>
    </hl-form>
    <hl-form v-else>
      <hl-form-item
        v-for="(item, index) in typeList"
        :key="index"
        class="hl-form-item_optional"
        label="其他项目"
      >
        <template slot="label">
          <i class="hl-icon hl-icon-round-minus-fill" @click.stop="deleteType(index)" />
          <hl-select v-model="item.key" :options="typeOptions[index]" />
        </template>
        <hl-input
          v-model="item.value"
          :maxlength="30"
          placeholder="请输入"
          clearable
        />
      </hl-form-item>
      <hl-form-item
        v-if="typeList.length < 4"
        label="添加项目"
        class="hl-form-item_optional hl-form-item_add"
        @click="addType"
        @touchstart="touchstart"
      >
        <template slot="label">
          <i class="hl-icon hl-icon-round-plus-fill" />
          <span>添加其他项目</span>
        </template>
      </hl-form-item>
    </hl-form>

    <hl-menu>
      <hl-menu-item
        label="访问记录"
        :content="`${recordCount}条`"
        @click="goRecord"
      />
      <hl-menu-item
        label="图片资料"
        :content="`${mediaCount}张`"
        @click="goUploadImage"
      />
      <hl-menu-item
        v-if="isDetail && isEncryptUser"
        label="加密图片资料"
        @click="goEncryotImage"
      />
    </hl-menu>

    <div v-if="isDetail" class="hl-section__wrapper">
      <div class="hl-section__header">
        <span class="hl-section__title">借款申请</span>
        <hl-button
          v-if="loanData && loanData.total > 1"
          @click="goCustomerLoan"
        >
          查看更多
        </hl-button>
      </div>
      <hl-card
        v-if="loanData"
        :data="loanData"
        :options="loanCardOptions"
      />
      <hl-empty v-else :type="params.cardId ? 'default' : 'lock'">
        <p v-if="params.cardId">暂无借款申请</p>
        <template v-else>
          <p>填写客户身份证信息</p>
          <p>查看借款申请记录</p>
        </template>
      </hl-empty>
    </div>

    <div v-if="isDetail" class="hl-section__wrapper">
      <div class="hl-section__header">
        <span class="hl-section__title">评估记录</span>
        <hl-button
          v-if="estimateData && estimateData.total > 1"
          @click="goCustomerEstimate"
        >
          查看更多
        </hl-button>
      </div>
      <hl-card
        v-if="estimateData"
        class="hl-card_estimate"
        :data="estimateData"
        :type="estimateData.type"
        :options="estimateCardOptions"
        @click="goEstimateDetail"
        @touchstart="touchstart"
      />
      <hl-empty v-else :type="params.cardId ? 'default' : 'lock'">
        <p v-if="params.cardId">暂无评估记录</p>
        <template v-else>
          <p>填写客户身份证信息</p>
          <p>查看客户评估记录</p>
        </template>
      </hl-empty>
    </div>

    <hl-button
      v-if="isEdit"
      class="hl-button_form"
      @click="handleDelete"
    >
      删除客户
    </hl-button>

    <hl-button
      v-if="!customerId"
      type="primary"
      :disabled="submitDisabled"
      @click="saveCustomer"
    >
      保存
    </hl-button>

    <hl-dialog
      class="hl-encrypt"
      :top="dialogTop"
      :show.sync="dialogShow"
    >
      <i class="hl-icon hl-icon-lock-fill" />
      <hl-input
        v-model="password"
        class="hl-encrypt__input"
        type="password"
        placeholder="请输入授权码"
        :autocomplete="false"
        :maxlength="64"
      >
        <hl-button slot="suffix" @click="handleValidateEncrypt">
          <i class="hl-icon hl-icon-arrow-right" />
        </hl-button>
      </hl-input>
      <hl-description :error="errorMessage">请联系客户索取授权码进行解密</hl-description>
    </hl-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import BS from 'common/bs'
import Utils from 'common/utils'
import Validate from 'common/validate'
import { ResponseError } from 'common/error'
import CustomerApi, { Customer } from 'common/api/customer'
import RecordApi from 'common/api/record'
import DialogTop from '@/mixins/dialog-top'
import Toast from '@/components/toast'
import Loading from '@/components/loading'
import Confirm from '@/components/confirm'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlInput from '@/components/input'
import HlSelect from '@/components/select'
import HlUpload from '@/components/upload'
import HlMenu from '@/components/menu'
import HlMenuItem from '@/components/menu-item'
import HlButton from '@/components/button'
import HlEmpty from '@/components/empty'
import HlCard from '@/components/card'
import HlDialog from '@/components/dialog'
import HlDescription from '@/components/description'
import OPTIONS from '@/common/options'
import SETTING from '@/setting'
export default {
  name: 'HlCustomerAdd',
  components: {
    HlForm,
    HlFormItem,
    HlInput,
    HlSelect,
    HlUpload,
    HlMenu,
    HlMenuItem,
    HlButton,
    HlCard,
    HlEmpty,
    HlDialog,
    HlDescription
  },
  mixins: [DialogTop],
  data () {
    return {
      isEdit: false,
      customerId: null,
      params: {},
      typeList: [],
      groupOptions: [],
      recordCount: 0,
      mediaCount: 0,
      loanData: null,
      estimateData: null,
      isEncryptUser: false,
      isEncryptExist: false,
      password: '',
      errorMessage: '',
      dialogShow: false,
      dialogTop: '35%'
    }
  },
  computed: {
    ...mapState([
      'isUploadCustomerImageErrorRecent'
    ]),
    ...mapGetters([
      'accountId',
      'customerCreateBased',
      'customerCreateImages',
      'customerCreateRecord'
    ]),
    thumbnailUrl () {
      return Utils.formatUfileUrl(this.params.url, { type: 7, width: 130, height: 130 })
    },
    isDetail () {
      return this.customerId && !this.isEdit
    },
    inputType () {
      return this.isDetail ? 'label' : 'text'
    },
    submitDisabled () {
      return !this.validateForm(1).result
    },
    typeOptions () {
      const options = [
        { label: '公司', value: 0 },
        { label: '行业', value: 1 },
        { label: '地址', value: 2 },
        { label: '邮箱', value: 3 }
      ]
      const set = new Set(this.typeList.map(item => item.key))
      const subset = []
      for (let i = 0; i < 4; i++) {
        !set.has(i) && subset.push(options[i])
      }
      return this.typeList.map(item => subset.concat([options[item.key]]).sort((a, b) => a.value - b.value))
    },
    loanCardOptions () {
      if (this.loanData.status === 1) {
        return OPTIONS.LOAN_CARD_AUDIT
      } else if (this.loanData.status === 2) {
        return OPTIONS.LOAN_CARD_SUCCESS
      }
      return OPTIONS.LOAN_CARD_FAILURE
    },
    estimateCardOptions () {
      return OPTIONS.ESTIMATE_CARD
    }
  },
  watch: {
    '$route': {
      handler (val) {
        this.customerId = val.query.id || null
        if (val.name === 'customerAdd') {
          this.isEdit = Boolean(this.customerId)
          this.setTitle(this.isEdit ? '编辑客户档案' : '新建客户档案')
          this.setHeaderBtn(this.isEdit ? {
            text: '完成',
            event: this.saveCustomer
          } : null)
        } else {
          this.isEdit = false
          this.setTitle('客户信息')
          this.setHeaderBtn({
            text: '编辑',
            event: this.editCustomer
          })
          if (this.isUploadCustomerImageErrorRecent) {
            this.setUploadCustomerImageErrorRecent(false)
            this.goUploadImage()
          }
        }
        this.resetForm()
        this.getCustomerDetail()
      },
      immediate: true
    },
    typeList: {
      handler (val) {
        ['company', 'industry', 'address', 'email'].forEach((key, index) => {
          const obj = val.find(item => item.key === index)
          this.params[key] = obj ? obj.value : ''
        })
      },
      deep: true
    },
    password () {
      this.errorMessage = ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations({
      setTitle: STORE_TYPES.SET_TITLE,
      setHeaderBtn: STORE_TYPES.SET_HEADER_BUTTON,
      setCustomerInfo: STORE_TYPES.SET_CUSTOMER_INFO,
      setEstimateRecord: STORE_TYPES.SET_ESTIMATE_RECORD,
      setUploadCustomerImageErrorRecent: STORE_TYPES.SET_UPLOAD_CUSTOMER_IMAGE_ERROR_RECENT
    }),
    async init () {
      this.groupOptions = await BS.getOptions(SETTING.BS_CUSTOMER_TYPE_KEY)
      if (!this.params.groupCode && this.groupOptions.length) {
        this.params.groupCode = this.groupOptions[0].value
      }
    },
    async getCustomerDetail () {
      if (!this.customerId) {
        if (this.customerCreateBased) {
          this.params = this.customerCreateBased
          this.typeList = this.getTypeList(this.params)
          this.recordCount = this.customerCreateRecord ? 1 : 0
          this.mediaCount = this.customerCreateImages
            ? Object.values(this.customerCreateImages).flat(1).length
            : 0
        }
        return
      }
      try {
        const response = await CustomerApi.detail(this.customerId)
        this.params = Utils.getSubObject(response, this.params)
        this.typeList = this.getTypeList(this.params)
        this.mediaCount = response.mediaCount || 0
        this.recordCount = response.accessRecordCount || 0
        this.isEncryptUser = response.isWhiteAccountId
        this.getLoanData()
        this.getEstimateData()
      } catch (err) {
        Utils.errorLog(err, 'CUSTOMER-DETAIL')
      }
    },
    getTypeList (params) {
      const arr = []
      const data = [ params.company, params.industry, params.address, params.email ]
      data.forEach((value, key) => {
        if (value && !this.typeList.find(item => item.key === key)) {
          arr.push({ key, value })
        }
      })
      return arr
    },
    async getLoanData () {
      if (!this.isDetail || !this.params.cardId) {
        return
      }
      try {
        const response = await CustomerApi.getLoanList({
          name: this.params.name,
          cardId: this.params.cardId,
          pageNo: 0,
          pageSize: 1
        })
        if (response.list && response.list.length) {
          const data = response.list[0]
          data.total = response.total
          this.loanData = data
        }
      } catch (err) {
        Utils.errorLog(err, 'GET-CUSTOMER-LOAD-LIST')
      }
    },
    async getEstimateData () {
      if (!this.isDetail || !this.params.cardId) {
        return
      }
      try {
        const response = await CustomerApi.getEstimateList({
          name: this.params.name,
          cardId: this.params.cardId,
          pageNo: 0,
          pageSize: 1
        })
        if (response.list && response.list.length) {
          const data = response.list[0]
          if (data.assessResultCode === 1) {
            data.result = `${Utils.formatMoney(data.assessAmount, 0)}元`
            data.type = 'success'
          } else {
            data.result = '您的相关资质暂不符合审核标准'
            data.type = 'failure'
          }
          data.total = response.total
          this.estimateData = data
        }
      } catch (err) {
        Utils.errorLog(err, 'GET-CUSTOMER-ESTIMATE-LIST')
      }
    },
    async saveCustomer () {
      const validateResult = this.validateForm()
      if (!validateResult.result) {
        Toast.show(validateResult.message)
        return
      }
      let customerId = null
      try {
        Loading.open('档案保存中...')
        customerId = await CustomerApi.save({
          ...this.params,
          id: this.customerId
        })
        if (!this.isEdit) {
          await this.saveRecord(customerId)
          await this.saveImages(customerId)
        }
        Toast.show('客户档案保存成功')
        this.isEdit ? this.$router.back() : this.goCustomerDetail(customerId)
      } catch (err) {
        if (err.code === 409 && customerId) {
          Toast.show('客户档案图片资料上传失败，请重新上传')
          this.setUploadCustomerImageErrorRecent(true)
          this.goCustomerDetail(customerId)
        } else {
          Utils.errorLog(err, 'CUSTOMER-SAVE', false)
        }
      } finally {
        Loading.close()
      }
    },
    async deleteCustomer () {
      try {
        await CustomerApi.delete(this.customerId)
        Toast.show('删除客户成功')
        this.$router.go(-2)
      } catch (err) {
        Utils.errorLog(err, 'CUSTOMER-DELETE', false)
      }
    },
    async saveRecord (customerId) {
      if (!this.customerCreateRecord) {
        return
      }
      try {
        await RecordApi.create({ ...this.customerCreateRecord, customerId }, { loading: false })
      } catch (err) {
        Utils.errorLog(err, 'CUSTOMER-SAVE', false)
      }
    },
    async saveImages (customerId) {
      if (!this.customerCreateImages) {
        return
      }
      try {
        const {
          idcardPicture = [],
          propertyPicture = [],
          creditPicture = [],
          otherPicture = []
        } = this.customerCreateImages
        await Promise.all([
          this.upload(customerId, idcardPicture, Customer.FILE_TYPE.IDCARD),
          this.upload(customerId, propertyPicture, Customer.FILE_TYPE.PROPERTY_CERTIFICATE),
          this.upload(customerId, creditPicture, Customer.FILE_TYPE.CREDIT_REPORT),
          this.upload(customerId, otherPicture, Customer.FILE_TYPE.OTHER)
        ])
      } catch (err) {
        Utils.errorLog(err, 'CUSTOMER-UPLOAD-IMAGE', true)
        throw new ResponseError(409, err.message)
      }
    },
    upload (customerId, file, fileType) {
      return CustomerApi.upload({
        customerId,
        file,
        fileType
      })
    },
    addType () {
      const set = new Set(this.typeList.map(item => item.key))
      const subset = []
      for (let i = 0; i < 4; i++) {
        !set.has(i) && subset.push(i)
      }
      this.typeList.push({ key: subset[0], value: '' })
    },
    deleteType (index) {
      this.typeList.splice(index, 1)
    },
    validateForm (type) {
      return Validate.test(this.params, {
        name: [{ message: '姓名不能为空' }, { validator: type ? null : 'name' }],
        mobile: [{ message: '手机号不能为空' }, { validator: type ? null : 'mobile' }],
        cardId: [{ required: false, validator: type ? null : 'idcard' }]
      })
    },
    resetForm () {
      this.params = {
        file: null,
        url: '',
        name: '',
        mobile: '',
        cardId: '',
        groupCode: '',
        company: '',
        industry: '',
        address: '',
        email: ''
      }
      this.typeList = []
      this.loanData = null
      this.estimateData = null
    },
    goCustomerDetail (id) {
      this.$router.replace({
        name: 'customerDetail',
        query: { id }
      })
    },
    goRecord () {
      if (this.customerId) {
        this.$router.push({
          name: 'customerRecord',
          query: { id: this.customerId }
        })
      } else {
        this.setCustomerInfo({ based: this.params })
        this.$router.push({
          name: 'customerRecordAdd',
          query: {
            recordId: -1
          }
        })
      }
    },
    goUploadImage () {
      if (this.customerId) {
        this.$router.push({
          name: 'customerUploadImage',
          query: { id: this.customerId }
        })
      } else {
        this.setCustomerInfo({ based: this.params })
        this.$router.push({ name: 'customerUploadImage' })
      }
    },
    goCustomerLoan () {
      this.$router.push({
        name: 'customerLoan',
        query: {
          name: this.params.name,
          cardId: this.params.cardId
        }
      })
    },
    goCustomerEstimate () {
      this.$router.push({
        name: 'customerEstimate',
        query: {
          name: this.params.name,
          cardId: this.params.cardId
        }
      })
    },
    goEstimateDetail () {
      this.setEstimateRecord(this.estimateData)
      this.$router.push({
        name: 'estimateDetail'
      })
    },
    goEncryptImage () {
      this.$router.push({
        name: 'customerEncryptImage',
        query: {
          id: this.customerId,
          exist: this.isEncryptExist ? 1 : 0
        }
      })
    },
    async goEncryotImage () {
      try {
        const response = await CustomerApi.detail(this.customerId)
        this.isEncryptExist = response.isExistAuth
        if (!this.isEncryptExist || response.isExistBrokerAuth) {
          this.goEncryptImage()
        } else {
          this.password = ''
          this.dialogShow = true
        }
      } catch (err) {
        Utils.errorLog(err, 'CUSTOMER-DETAIL')
      }
    },
    async handleValidateEncrypt () {
      if (!this.password) {
        this.errorMessage = '请输入授权码'
        return
      }
      try {
        await CustomerApi.validateEncryptShareCode(this.customerId, this.password)
        this.goEncryptImage()
      } catch (err) {
        this.errorMessage = err.message
      }
    },
    handleDelete () {
      Confirm.show({
        title: '确认删除该客户档案吗？',
        message: '该操作无法恢复',
        cancel: true,
        submit: '确认',
        handleSubmit: this.deleteCustomer
      })
    },
    editCustomer () {
      this.$router.push({
        name: 'customerAdd',
        query: { id: this.customerId }
      })
    },
    touchstart () {
      // For mobile active style
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-form {
    margin-top: 0;
  }

  .hl-avatar {
    padding: 30px;
    padding-bottom: 40px;
    background: $blockColor;

    .hl-avatar__image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180px;
      height: 180px;
      margin: auto;
      background-color: $uploadBorderColor;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .hl-upload__wrapper::v-deep {
      .hl-upload {
        margin: 0;
      }

      .hl-upload__button {
        width: 180px;
        height: auto;
        margin: auto;
        background-color: $blockColor;
        border: none;

        .hl-upload__image {
          width: 180px;
          height: 180px;
          margin: 0;
          background-color: $uploadBorderColor;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .hl-upload__footer {
          margin-top: 15px;
          font-size: $textSize;
          color: $systemColor;
        }
      }
    }

    .hl-pic {
      font-size: 180px;
      background-color: $blockColor;
    }
  }

  .hl-form-item_optional::v-deep {
    .hl-form-item__inner .hl-form-item__label {
      display: flex;
      width: 186px;

      .hl-icon-round-minus-fill {
        width: 30px;
        height: 30px;
        color: $deleteColor;
        cursor: pointer;
      }

      .hl-icon-round-plus-fill {
        color: $systemColor;
        margin-right: 20px;
      }

      .hl-select {
        width: 140px;

        .hl-icon-arrow-right {
          padding: 0 25px 0 0
        }

        .hl-select__placeholder, .hl-select__label {
          color: $systemColor;
        }
      }
    }

    .hl-form-item__content .hl-input__inner {
      line-height: 40px;
      border-left: $cardSplitBorder;
      border-radius: 0;
    }

    &.hl-form-item_add {
      .hl-form-item__inner .hl-form-item__label {
        width: 100%;
        color: $systemColor;
        cursor: pointer;
      }

      &:active {
        background-color: $blockActiveColor;
      }
    }
  }

  .hl-menu .hl-menu-item::v-deep {
    .hl-menu-item__label {
      color: $subTitleColor;
    }

    .hl-icon-arrow-right {
      font-size: 44px;
    }
  }

  .hl-button.hl-button_form {
    display: block;
    width: 100%;
    height: 110px;
    margin: 20px 0;
    padding: 0 30px;
    font-size: $textSize;
    line-height: 110px;
    text-align: left;
    color: $deleteColor;
    background-color: $blockColor;

    &:active {
      background-color: $blockActiveColor;
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 60px;
  }

  .hl-section__wrapper {
    margin: 20px 0;
    background-color: $blockColor;
    overflow: hidden;

    .hl-section__header {
      display: flex;
      align-items: center;
      height: 80px;
      margin: 0 30px;

      .hl-section__title {
        flex: auto;
        font-size: $subTitleSize;
        font-weight: 600;
        color: $textColor;
      }

      .hl-button {
        font-size: $descriptionSize;
        color: $descriptionColor;

        &:active {
          color: $subTitleColor;
        }
      }
    }

    .hl-card {
      margin-top: 0;
      margin-bottom: 30px;
      border: $splitBorder;
    }

    .hl-card_estimate::v-deep {
      cursor: pointer;

      &:active {
        transform: scale(.99);
      }

      .hl-card__label {
        width: 180px;
      }
    }

    .hl-empty::v-deep {
      margin-top: 0;
      padding-top: 0;
      padding-bottom: 60px;

      .hl-empty__icon {
        width: 359px;
        height: 180px;
      }
    }
  }
}

.hl-dialog__wrapper.hl-encrypt::v-deep {
  .hl-dialog {
    background-color: transparent;

    .hl-dialog__body {
      padding: 0;
    }

    .hl-icon.hl-icon-lock-fill {
      display: block;
      margin-bottom: 88px;
      font-size: 110px;
      color: #a5a5a5;
    }

    .hl-input {
      width: 560px;
      height: 100px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 55px;
      @include placeholder($blockColor);

      .hl-input__inner {
        margin-left: 40px;
        padding: 0;
        font-size: $titleSize;
        color: $blockColor;
        background-color: transparent;
      }

      .hl-input__suffix {
        .hl-button {
          width: 80px;
          height: 80px;
          margin: 10px;
          background-color: $blockColor;
          border-radius: 50%;

          .hl-icon {
            margin-left: 5px;
            line-height: 80px;
            font-size: 46px;
            color: $themeColor;
          }

          &:active {
            background-color: $blockActiveColor;
            transform: scale(.96);
          }
        }
      }
    }
  }
}
</style>
