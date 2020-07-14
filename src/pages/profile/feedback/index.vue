<template>
  <div class="hl-content">
    <template v-if="!isSuccess">
      <div class="hl-body">
        <hl-input
          v-model="data.description"
          type="textarea"
          placeholder="请写下您的建议，如功能需求，产品吐槽等，我们会努力改进"
          :maxlength="200"
        >
          <span slot="suffix">{{ data.description.length }}/200</span>
        </hl-input>
        <hl-upload
          v-model="data.images"
          :maxlength="3"
        />
        <span class="hl-info">最多上传3张图片</span>
      </div>

      <hl-button
        type="primary"
        :disabled="submitDisabled"
        @click="submit"
      >
        提交
      </hl-button>
    </template>
    <div v-else class="hl-result">
      <svg class="hl-pic"><use xlink:href="#hl-pic-finish"></use></svg>
      <p>反馈成功，感谢您的反馈！</p>
      <span>我们会尽快对您提出相关的反馈进行处理，谢谢。</span>
      <hl-button @click="goBack">返回首页</hl-button>
    </div>
  </div>
</template>

<script>
import Utils from 'common/utils'
import IdentityApi from 'common/api/identity'
import HlInput from '@/components/input'
import HlUpload from '@/components/upload'
import HlButton from '@/components/button'
export default {
  name: 'HlFeedback',
  components: {
    HlInput,
    HlUpload,
    HlButton
  },
  data () {
    return {
      data: {
        description: '',
        images: []
      },
      isSuccess: false
    }
  },
  computed: {
    submitDisabled () {
      return !this.data.description
    }
  },
  methods: {
    async submit () {
      try {
        await IdentityApi.feedback(this.data)
        this.isSuccess = true
      } catch (err) {
        Utils.errorLog(err, 'SUBMIT-FEEDBACK', false)
      }
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-body {
    padding: 40px 30px;
    background-color: $blockColor;

    .hl-input::v-deep {
      flex-direction: column;
      margin-bottom: 20px;

      .hl-input__inner {
        width: 100%;
        height: 260px;
        padding: 0 10px;
        font-size: $subTitleSize;
        line-height: 42px;
      }

      .hl-input__suffix {
        width: 100%;
        text-align: right;

        span {
          font-size: $descriptionSize;
          line-height: 37px;
          color: $descriptionColor;
        }
      }
    }

    .hl-info {
      display: block;
      margin-top: 10px;
      font-size: $descriptionSize;
      line-height: 37px;
      color: $descriptionColor;
    }
  }

  .hl-result {
    text-align: center;

    .hl-pic {
      width: 200px;
      height: 200px;
      margin-top: 80px;
    }

    p {
      margin: 20px 0;
      font-size: $titleSize;
      line-height: 48px;
      color: $textColor;
    }

    span {
      display: block;
      font-size: $descriptionSize;
      line-height: 37px;
      color: $descriptionColor;
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 60px;
  }

  .hl-button.hl-button_default {
    width: 330px;
    height: 100px;
    margin-top: 60px;
    font-size: $titleSize;
    color: $themeColor;
    border: 1px solid $themeColor;

    &:active {
      color: $themeActiveColor;
      border-color: $themeActiveColor;
      transform: scale(.99);
    }
  }
}
</style>
