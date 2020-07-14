<template>
  <components
    :is="pages[step]"
    :options="data"
    @next="next"
    @prev="prev"
  />
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import HlEstimateStep1 from './estimate-step-1'
import HlEstimateStep2 from './estimate-step-2'
import HlEstimateStep3 from './estimate-step-3'
import HlEstimateStep4 from './estimate-step-4'
export default {
  name: 'HlEstimate',
  components: {
    HlEstimateStep1,
    HlEstimateStep2,
    HlEstimateStep3,
    HlEstimateStep4
  },
  data () {
    return {
      step: 0,
      data: {},
      pages: [
        HlEstimateStep1, // 房产证信息
        HlEstimateStep2, // 个人基础信息
        HlEstimateStep3, // 征信报告信息
        HlEstimateStep4 // 评估结果
      ]
    }
  },
  watch: {
    step: {
      handler (val) {
        this.setBackground(val === 3 ? '#fff' : '#f5f6fa')
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      setBackground: STORE_TYPES.SET_BACKGROUND
    }),
    next (data) {
      this.data = { ...data }
      this.step++
    },
    prev (data) {
      this.data = { ...data }
      this.step--
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content::v-deep {
  .hl-banner {
    margin: 20px 0;
    background-color: $blockColor;

    .hl-banner__title {
      margin: 0 30px;
      font-size: $subTitleSize;
      font-weight: 600;
      line-height: 80px;
      color: $textColor;
    }
  }

  .hl-upload__wrapper .hl-upload {
    .hl-upload__button {
      width: 100%;
      height: 260px;
      margin: 0 auto;
      border: none;
      border-radius: 3px;

      .hl-upload__image {
        width: 100%;
        height: 100%;
        margin: 0;
        border-radius: 3px;

        img {
          border-radius: 3px;
        }

        .hl-icon.hl-icon-trash {
          border-top-right-radius: 3px;
        }
      }
    }

    .hl-pic {
      width: 240px;
      height: 140px;
      margin: auto;
      margin-top: 34px;
      margin-bottom: 12px;
      border-radius: $cardRadius;
    }

    .hl-upload__label {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $textSize;
      line-height: 40px;
      color: $themeColor;

      .hl-button {
        margin-left: 20px;
        color: $systemColor;
      }
    }

    .hl-upload__error {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 70px;
      font-size: $descriptionSize;
      line-height: 70px;
      text-align: center;
      color: $blockColor;
      background: rgba($color: #000000, $alpha: 0.3);

      span {
        text-decoration: underline
      }
    }
  }

  .hl-form {
    .hl-form-item {
      .hl-form-item__inner > .hl-form-item__label {
        width: 200px;
      }
    }

    .hl-input .hl-input__suffix {
      margin: 0 8px;
      font-size: $descriptionSize;
      color: $descriptionColor;
    }
  }

  .hl-button.hl-button_primary {
    margin-top: 60px;
    margin-bottom: 60px;
  }

  .hl-description {
    .hl-description__content {
      display: flex;
      align-items: center;
      font-size: $quoteSize;

      .hl-icon {
        margin-right: 5px;
        font-size: 30px;
      }
    }
  }
}
</style>
