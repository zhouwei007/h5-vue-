<template>
  <div class="hl-content">
    <hl-form>
      <hl-form-item label="姓名">
        <hl-input
          v-model="data.name"
          :type="inputType"
          :maxlength="30"
          placeholder="请输入银行卡用户姓名"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="身份证号码">
        <hl-input
          v-model="data.id5"
          :type="inputType"
          :maxlength="18"
          placeholder="请输入银行卡用户身份证号码"
          uppercase
          clearable>
        </hl-input>
      </hl-form-item>
      <hl-form-item label="银行名称">
        <hl-select
          v-model="data.bankCode"
          :options="bankOptions"
          :type="inputType"
          placeholder="请选择银行"
        />
      </hl-form-item>
      <hl-form-item label="借记卡卡号">
        <hl-input
          v-model="data.bankCardNumber"
          :type="inputType"
          :maxlength="22"
          placeholder="请输入借记卡卡号"
          validate="number"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="开户支行">
        <hl-input
          v-model="data.branchBankName"
          :type="inputType"
          :maxlength="30"
          placeholder="请输入开户支行名称"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="预留手机号">
        <hl-input
          v-model="data.mobile"
          :type="inputType"
          :maxlength="11"
          placeholder="请输入银行卡预留手机号"
          validate="number"
          clearable
        />
      </hl-form-item>
    </hl-form>
    <hl-description :error="errorMessage" />

    <hl-button
      v-if="type === 'add'"
      class="hl-submit-button"
      type="primary"
      @click="submit('bind')"
    >
      确认添加
    </hl-button>

    <hl-button
      v-if="type === 'update'"
      class="hl-submit-button"
      type="primary"
      @click="submit('update')"
    >
      确认修改
    </hl-button>

    <hl-button-group v-if="type === 'detail'">
      <hl-button @click="handleConfirm">删除</hl-button>
      <hl-button type="primary" @click="goUpdate">修改</hl-button>
    </hl-button-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BS from 'common/bs'
import Utils from 'common/utils'
import Common from 'common/common'
import Validate from 'common/validate'
import Bankcard from 'common/api/bankcard'
import Passport from 'common/api/passport'
import Toast from '@/components/toast'
import Confirm from '@/components/confirm'
import HlInput from '@/components/input'
import HlSelect from '@/components/select'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlDescription from '@/components/description'
import HlButton from '@/components/button'
import HlButtonGroup from '@/components/button-group'
import SETTING from '@/setting'
export default {
  name: 'HlBankcardAdd',
  components: {
    HlInput,
    HlSelect,
    HlForm,
    HlFormItem,
    HlDescription,
    HlButton,
    HlButtonGroup
  },
  data () {
    return {
      data: {
        name: '',
        id5: '',
        bankName: '',
        bankCode: '',
        bankCardNumber: '',
        branchBankName: '',
        mobile: ''
      },
      bankOptions: [],
      errorMessage: ''
    }
  },
  computed: {
    ...mapGetters([
      'hasAuthenticate'
    ]),
    id () {
      return this.$route.query.id || null
    },
    type () {
      return this.$route.name.replace('bankcard', '').toLocaleLowerCase()
    },
    inputType () {
      return this.type === 'detail' ? 'label' : 'text'
    }
  },
  watch: {
    data: {
      handler () {
        this.clearErrorMessage()
      },
      deep: true
    },
    'data.bankCode' (val) {
      this.data.bankName = this.bankOptions.find(item => item.value === val).label
    },
    '$route' () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.bankOptions = await BS.getOptions(SETTING.BS_BANK_KEY)
      if (this.type === 'detail' || this.type === 'update') {
        this.id && this.getBankcard(this.id)
      } else if (this.hasAuthenticate) {
        this.getBankcardLength()
      }
    },
    submit (type) {
      const dict = {
        bind: this.bindBankcard,
        update: this.updateBankcard
      }
      this.validate(this.data) && dict[type]()
    },
    async getBankcard (id) {
      try {
        const response = await Bankcard.get(id)
        this.data = {
          name: response.name,
          id5: response.id5,
          bankName: response.bank_name,
          bankCode: response.bank_code,
          bankCardNumber: response.bank_card_number,
          branchBankName: response.branch_bank_number,
          mobile: response.mobile
        }
      } catch (err) {
        Utils.errorLog(err, 'BANKCARD-DETAIL')
      }
    },
    async bindBankcard () {
      try {
        await Bankcard.bind(this.data)
        Toast.show('银行卡添加成功')
        this.goBankcard()
      } catch (err) {
        this.errorMessage = err.message
      }
    },
    async updateBankcard () {
      try {
        await Bankcard.update(this.id, this.data)
        Toast.show('银行卡修改成功')
        this.goBankcard()
      } catch (err) {
        this.errorMessage = err.message
      }
    },
    async unbindBankcard () {
      try {
        await Bankcard.unbind(this.id)
        Toast.show('银行卡删除成功')
        this.goBankcard()
      } catch (err) {
        this.errorMessage = err.message
      }
    },
    async getBankcardLength () {
      try {
        const response = await Common.getIdentity()
        response.bankCardCount === 0 && this.getAuthenticateInfo()
      } catch (err) {
        Utils.errorLog(err, 'IDENTITY-INFO')
      }
    },
    async getAuthenticateInfo () {
      try {
        const response = await Passport.getAuthenticate()
        this.data.name = response.name
        this.data.id5 = response.id5
      } catch (err) {
        Utils.errorLog(err, 'GET-AUTHENTICATE')
      }
    },
    validate (data) {
      const validateResult = Validate.test(data, {
        name: [{ message: '请输入银行卡用户姓名' }],
        id5: [{ message: '请输入银行卡用户身份证号码' }, { validator: 'idcard' }],
        bankCode: [{ message: '请选择银行名称' }],
        bankCardNumber: [{ message: '请输入借记卡卡号' }, { validator: 'bankcard' }],
        branchBankName: [{ message: '请输入开户支行名称' }],
        mobile: [{ message: '请输入银行卡预留手机号' }, { validator: 'mobile' }]
      })
      if (!validateResult.result) {
        this.errorMessage = validateResult.message
      }
      return validateResult.result
    },
    clearErrorMessage () {
      this.errorMessage = ''
    },
    handleConfirm () {
      Confirm.show({
        title: '确认删除该银行卡吗？',
        message: '该操作无法恢复',
        submit: '暂不',
        cancel: '确认删除',
        handleCancel: this.unbindBankcard
      })
    },
    goUpdate () {
      this.$router.replace({
        name: 'bankcardUpdate',
        query: {
          id: this.id
        }
      })
    },
    goBankcard () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-submit-button,
  .hl-button-group {
    margin-top: 90px;
  }
}
</style>
