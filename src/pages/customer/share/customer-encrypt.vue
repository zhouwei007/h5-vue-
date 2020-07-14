<template>
  <div class="hl-content">
    <template v-if="status === 'edit'">
      <hl-form>
        <hl-form-item label="身份证正面图片">
          <span>{{ data.idCard.length }}张</span>
          <hl-upload
            v-model="data.idCard"
            slot="suffix"
            :maxlength="1"
          />
        </hl-form-item>
      </hl-form>
      <hl-form>
        <hl-form-item label="房产证图片">
          <span>{{ data.properTyCertificate.length }}张</span>
          <hl-upload
            v-model="data.properTyCertificate"
            slot="suffix"
            :maxlength="10"
          />
        </hl-form-item>
      </hl-form>
      <hl-form>
        <hl-form-item label="征信报告图片">
          <span>{{ data.creditReport.length }}张</span>
          <hl-upload
            v-model="data.creditReport"
            slot="suffix"
            :maxlength="30"
          />
        </hl-form-item>
      </hl-form>
      <hl-form>
        <hl-form-item label="其他">
          <span>{{ data.other.length }}张</span>
          <hl-upload
            v-model="data.other"
            slot="suffix"
            :maxlength="30"
          />
        </hl-form-item>
      </hl-form>

      <hl-button
        type="primary"
        :disabled="submitDisabled"
        @click="save"
      >
        提交并加密
      </hl-button>
    </template>
    <div v-else-if="status === 'success'" class="hl-result">
      <svg class="hl-pic"><use xlink:href="#hl-pic-finish"></use></svg>
      <p>保存成功</p>
    </div>
    <div v-else-if="status === 'expire'" class="hl-result">
      <svg class="hl-pic"><use xlink:href="#hl-pic-fail"></use></svg>
      <p>链接已失效</p>
    </div>

    <hl-dialog
      class="hl-process"
      :show.sync="processShow"
      :mask-close="false"
    >
      <template slot="header">个人档案加密</template>
      <div class="hl-process__body">
        <div
          class="hl-process__content"
          :style="{'top': processTop}"
        >
          <p v-for="(item, index) in processHistoryArr" :key="index">{{ item }}</p>
          <p :class="`hl-process__info_${activeProcessStatus}`">{{ activeProcessText }}</p>
        </div>
        <div class="hl-process__mask"/>
      </div>
      <template slot="footer">
        <hl-button
          :disabled="processDisabled || uploadDisabled"
          @click="handleProcessClose"
        >
          确认
        </hl-button>
      </template>
    </hl-dialog>
  </div>
</template>

<script>
import Utils from 'common/utils'
import CustomerApi from 'common/api/customer'
import HlForm from '@/components/form'
import HlFormItem from '@/components/form-item'
import HlUpload from '@/components/upload'
import HlButton from '@/components/button'
import HlDialog from '@/components/dialog'
export default {
  name: 'HlCustomerEncrypt',
  components: {
    HlForm,
    HlFormItem,
    HlUpload,
    HlButton,
    HlDialog
  },
  data () {
    return {
      token: '',
      data: {
        idCard: [],
        properTyCertificate: [],
        creditReport: [],
        other: []
      },
      status: '',
      uploadDisabled: true,
      processDisabled: true,
      processShow: false,
      processTextArr: [],
      processHistoryArr: [],
      activeProcessText: '',
      activeProcessStatus: 'pending',
      errorMessage: ''
    }
  },
  computed: {
    submitDisabled () {
      return !(this.data.idCard.length ||
        this.data.properTyCertificate.length ||
        this.data.creditReport.length ||
        this.data.other.length)
    },
    processTop () {
      return `${-(this.processHistoryArr.length * 70 - 160) / 75}rem`
    }
  },
  mounted () {
    this.token = this.$route.query.token || null
    this.init()
  },
  methods: {
    async init () {
      this.uploadDisabled = true
      this.processDisabled = true
      this.processHistoryArr = []
      this.activeProcessText = ''
      this.activeProcessStatus = 'pending'
      this.errorMessage = ''
      try {
        await CustomerApi.getEncryptShareInfo({
          token: this.token
        })
        this.status = 'edit'
      } catch (err) {
        this.status = 'expire'
        Utils.errorLog(err, 'GET-ENCRYPT-SHARE-INFO', true)
      }
    },
    async save () {
      try {
        this.handleProcessOpen()
        await CustomerApi.saveShareData(this.token, 2, this.data)
      } catch (err) {
        this.errorMessage = err.message
      } finally {
        this.uploadDisabled = false
        !this.processDisabled && this.handleProcessFinish()
      }
    },
    handleProcessOpen () {
      const arr = []
      function formatText (str) {
        return [`${str} Hash 计算加密中...`, `${str} Hash 计算创建档案中...`]
      }
      this.data.idCard.length && arr.push(...formatText('身份证明'))
      this.data.properTyCertificate.length && arr.push(...formatText('房产证明'))
      this.data.creditReport.length && arr.push(...formatText('个人征信证明'))
      this.data.other.length && arr.push(...formatText('其他证明'))
      this.processTextArr = arr
      this.processShow = true
      this.handleNextProcess()
    },
    async handleProcessClose () {
      if (this.errorMessage) {
        await this.init()
        this.processShow = false
      } else {
        this.status = 'success'
        this.processShow = false
      }
    },
    handleNextProcess () {
      if (this.errorMessage || !this.processTextArr.length) {
        this.processDisabled = false
        !this.uploadDisabled && this.handleProcessFinish()
      } else {
        this.handleCurrentProcess(this.processTextArr.shift())
      }
    },
    handleProcessFinish () {
      this.activeProcessText && this.processHistoryArr.push(this.activeProcessText)
      this.activeProcessStatus = this.errorMessage ? 'error' : 'success'
      this.activeProcessText = this.errorMessage || '创建完成!'
    },
    handleCurrentProcess (current) {
      this.activeProcessText && this.processHistoryArr.push(this.activeProcessText)
      this.activeProcessText = current[0]
      let i = 0
      let currentTimer = setInterval(() => {
        i++
        if (i < current.length) {
          this.activeProcessText += current[i]
        } else {
          clearInterval(currentTimer)
          currentTimer = null
          this.handleNextProcess()
        }
      }, 50)
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

  .hl-result {
    text-align: center;

    .hl-pic {
      width: 200px;
      height: 200px;
      margin-top: 80px;
    }

    p {
      margin: 20px auto;
      font-size: $titleSize;
      font-weight: 600;
      line-height: 48px;
      color: $textColor;
    }
  }
}

.hl-dialog__wrapper.hl-process::v-deep .hl-dialog.hl-dialog_default {
  .hl-dialog__header {
    padding-top: 37px;
    padding-bottom: 24px;
    font-size: 42px;
    font-weight: 600;
    line-height: 59px;
    color: $textColor;
  }

  .hl-dialog__body {
    padding: 0 0 60px 0;

    .hl-process__body {
      position: relative;
      height: 300px;
      overflow: hidden;

      .hl-process__content {
        position: absolute;
        left: 0;
        padding-left: 60px;
        line-height: 70px;
        text-align: left;
        color: $subTitleColor;
        transition: top .5s ease-in-out;

        .hl-process__info_success {
          color: $finishColor;
        }

        .hl-process__info_error {
          color: $errorColor;
        }
      }

      .hl-process__mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 180px;
        background: linear-gradient(rgba(255, 255, 255, 1),rgba(255, 255, 255, 0));
      }
    }
  }

  .hl-dialog__footer {
    border-top: none;

    .hl-button.hl-button_default {
      height: 120px;
      color: $textColor;
      font-weight: 500;

      &.hl-button_disabled {
        color: $descriptionColor;
      }
    }
  }
}
</style>
