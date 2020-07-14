<template>
  <div class="hl-content">
    <hl-form>
      <hl-form-item label="姓名">
        <hl-input
          v-model="data.name"
          placeholder="真实姓名"
          :maxlength="30"
          clearable
        />
      </hl-form-item>
      <hl-form-item label="身份证">
        <hl-input
          v-model="data.idcard"
          placeholder="大陆二代身份证号码"
          :maxlength="18"
          uppercase
          clearable
        />
      </hl-form-item>
    </hl-form>

    <hl-button
      class="hl-submit-button"
      type="primary"
      @click="submit"
    >
      确认并提交
    </hl-button>

    <hl-button class="hl-upload-button">
      <p>自动识别，<span>立即拍照</span></p>
      <input
        ref="upload"
        class="hl-upload"
        type="file"
        accept="image/*"
        @change="upload"
      >
    </hl-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OcrApi from 'common/api/ocr'
import Passport from 'common/api/passport'
import Common from 'common/common'
import Utils from 'common/utils'
import Validate from 'common/validate'
import Toast from '@/components/toast'
import HlButton from '@/components/button'
import HlInput from '@/components/input'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
export default {
  name: 'HlCertification',
  components: {
    HlButton,
    HlInput,
    HlForm,
    HlFormItem
  },
  data () {
    return {
      data: {
        name: '',
        idcard: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'mobile'
    ])
  },
  mounted () {
    if (navigator.userAgent.toLowerCase().match(/vivo/i) === 'vivo') {
      this.$refs.upload.setAttribute('capture', 'camera')
    }
  },
  methods: {
    submit () {
      this.validate(this.data) && this.auth(this.data)
    },
    auth (data) {
      Passport.authentication(
        data.name,
        data.idcard,
        this.mobile
      ).then(async () => {
        await Common.getIdentity()
        Toast.show('实名认证成功, 您可以推荐借款赚奖励了')
        this.goBack()
      }).catch(err => {
        Utils.errorLog(err, 'AUTHENTICATION', false)
      })
    },
    upload () {
      const el = this.$refs.upload
      OcrApi.idcard(el.files[0]).then(data => {
        this.data.name = data.name
        this.data.idcard = data.id
      }).catch(err => {
        Utils.errorLog(err, 'OCR-IDCARD', false)
      })
    },
    validate (data) {
      const validateResult = Validate.test(data, {
        name: [{ message: '请输入真实姓名' }],
        idcard: [{ message: '请输入身份证号码' }, { validator: 'idcard' }]
      })
      !validateResult.result && Toast.show(validateResult.message)
      return validateResult.result
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-button_primary.hl-submit-button {
    margin-top: 90px;
  }

  .hl-upload-button {
    position: relative;
    display: block;
    margin: 40px auto;

    span {
      color: $themeColor;
    }

    .hl-upload {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
}
</style>
