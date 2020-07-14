<template>
  <div class="hl-content">
    <div class="hl-content__inner" ref="main">
      <div class="hl-productDetail">
        <div class="hl-productDetail__banner">
          <div class="hl-productDetail-title">
            <span class="hl-productDetail-title__text">
              {{ resultData.productName || '--' }}
            </span>
            <span
              class="hl-productDetail-icon"
              v-for="(itemLabel, index) in resultData.productLabel"
              :key="index"
            >
              <i
                v-if="iconArr[Object.keys(itemLabel)[0]]"
                :class="['hl-icon', iconArr[Object.keys(itemLabel)[0]]]"
              />
              {{ Object.values(itemLabel)[0] }}
            </span>
          </div>
          <div class="hl-productDetail-rate">
            <div class="hl-product__header-money">
              <p class="hl-productcard-desc">
                最高授信
              </p>
              <p class="hl-productcard-num">
                {{ resultData.borrowQuota || '--' }}
              </p>
            </div>
            <div class="hl-product__header-rate">
              <p class="hl-productcard-desc">
                {{ resultData.rateTypeName || '--' }}
              </p>
              <p class="hl-productcard-num">
                {{ resultData.productRate || '--' }}
              </p>
            </div>
            <div class="hl-product__header-periods">
              <p class="hl-productcard-desc">
                借款期限
              </p>
              <p class="hl-productcard-desc__p">
                {{ resultData.borrowPeriods || '--' }}
              </p>
            </div>
          </div>
        </div>

        <div class="hl-productDetail__instruct" v-if="false">
          <div class="hl-productDetail__text">
            <p>还款方式</p>
            <p>{{ resultData.repayMethodName || '--' }}</p>
          </div>
          <div class="hl-productDetail__text">
            <p>放款周期</p>
            <p>{{ resultData.loanCycle || '--' }}</p>
          </div>
          <div class="hl-productDetail__text">
            <p>产品归属</p>
            <p>{{ resultData.productAffiliation || '--' }}</p>
          </div>
          <div class="hl-productDetail__text">
            <p>产品分类</p>
            <p>{{ resultData.productClassifyName || '--' }}</p>
          </div>
        </div>

        <div
          class="hl-productDetail__condition"
          :class="{'haveContent': !isShow}"
        >
          <div
            class="hl-productDetail__text"
            v-if="resultData.borrowPurpose"
          >
            <p>产品介绍</p>
            <p v-html="resultData.borrowPurpose"/>
          </div>
          <div
            class="hl-productDetail__text"
            v-if="resultData.applyConditions"
          >
            <p>申请条件</p>
            <p v-html="resultData.applyConditions"/>
          </div>
          <div
            class="hl-productDetail__text"
            v-if="false"
          >
            <p>借款成数</p>
            <p v-html="resultData.borrowPercentage"/>
          </div>
        </div>
      </div>
    </div>

    <div
      class="hl-productDetail__footer"
      v-if="seller.mobile || !this.identity"
    >
      <hl-button
        type="primary"
        @click="advisory"
      >
        立即咨询 了解更多
      </hl-button>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import STORE_TYPES from '@/store/types'
import { mapState } from 'vuex'
import Utils from 'common/utils'
import TouchScroll from '@/mixins/touch-scroll'
import ProductApi from 'common/api/product'
import IdentityApi from 'common/api/identity'
import HlButton from '@/components/button'
export default {
  name: 'HlProductDetail',
  components: {
    HlButton
  },
  mixins: [TouchScroll],
  data () {
    return {
      resultData: {},
      iconArr: {
        hot: 'hl-icon-product-gift',
        fire: 'hl-icon-product-hot',
        new: 'hl-icon-product-star'
      },
      sellMobile: ''
    }
  },
  computed: {
    ...mapState([
      'identity'
    ]),
    productId () {
      return this.$route.query.id
    },
    seller () {
      return {
        mobile: this.identity ? this.identity.saleMobile : ''
      }
    },
    isShow () {
      const { applyConditions, borrowPurpose, borrowPercentage } = this.resultData
      return applyConditions || borrowPurpose || borrowPercentage
    }
  },
  mounted () {
    this.getProductList()
    this.getIndeity()
  },
  methods: {
    async getProductList () {
      if (!this.productId) {
        this.$router.replace({
          name: 'productList'
        })
        return
      }
      try {
        this.resultData = await ProductApi.detail(this.productId)
        const productLabel = this.resultData.productLabel
        this.resultData.productLabel = productLabel && JSON.parse(productLabel)
      } catch (err) {
        Utils.errorLog(err, 'PRODUCT-DETAIL')
      }
    },
    async getIndeity () {
      try {
        const identity = await IdentityApi.user(false)
        store.commit(STORE_TYPES.SET_IDENTITY, identity)
      } catch (err) {
        Utils.errorLog(err, 'USER_NOLOGIN', true)
      }
    },
    advisory () {
      if (!this.identity) {
        this.$router.replace({
          name: `login`,
          query: {
            backurl: this.$route.fullPath.substring(1)
          }
        })
      } else {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = `tel:${this.seller.mobile}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-content__inner {
    position: fixed;
    top: $headerHeight;
    right: 0;
    bottom: 140px;
    left: 0;
    width: $screenWidth;
    margin: auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .hl-productDetail {
    overflow: hidden;
    min-height: 100.1%;

    .hl-productDetail__banner {
      height: 528px;
      background-image: linear-gradient(0deg, #f8750d 0%, #f8530d 100%);
      border-radius: 0 0 40px 40px;
      overflow: hidden;
      padding: 20px 30px;

      .hl-productDetail-title {
        height: 60px;
        display: flex;
        align-items: center;

        .hl-productDetail-title__text {
          font-size: 44px;
          color: $blockColor;
          font-weight: bold;
          font-family: 'Semibold'
        }

        .hl-productDetail-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 16px;
          border-radius: 80px 100px 100px 0;
          border: 1px solid rgba(255, 255, 255, .6);
          height: 40px;
          padding: 0 12px;
          min-width: 60px;
          font-size: $quoteSize;
          color: $blockColor;
          text-align: center;

          i {
            padding-right: 8px;
            font-size: 16px;
          }
        }
      }

      .hl-productDetail-rate {
        margin-top: 16px;
        height: 138px;

        .hl-productcard-desc {
          font-size: $descriptionSize;
          color: $blockColor;
          opacity: .6;
          line-height: 36px;
        }

        .hl-productcard-num {
          font-size: 42px;
          color: $blockColor;
          display: flex;
          align-items: center;
          height: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: bold;

          span {
            font-size: 44px;
            padding-left: 4px;
            padding-top: 8px;
            font-weight: bold
          }
        }
        div {
          float: left;
          margin-top: 20px;
          font-size: 42px;
          color: #fff;

          &.hl-product__header-money {
            width: 42%;
          }

          &.hl-product__header-rate {
            width: 58%;
          }

          &.hl-product__header-periods {
            width: 100%;

            .hl-productcard-desc__p {
              line-height: 62px;
              margin-top: 12px;
              font-weight: bold;
            }
          }
        }
      }
    }

    .hl-productDetail__instruct {
      background: #fff;
      border-radius: $cardRadius;
      margin: -136px 30px 0;
      padding: 40px;

      .hl-productDetail__text {

        &:not(:first-child) {
          margin-top: 40px;
        }

        p:nth-child(1) {
          font-size: $titleSize;
          color: $textColor;
          line-height: 48px;
          font-weight: bold;
        }

        p:nth-child(2) {
          color: $subTitleColor;
          font-size: $descriptionSize;
          line-height: 36px;
          margin-top: 8px;
        }
      }
    }

    .hl-productDetail__condition {
      background: #fff;
      border-radius: $cardRadius;
      // padding: 30px 40px 40px;
      // margin: 20px 30px 40px;
      padding: 40px;
      margin: -136px 30px 40px;

      &.haveContent {
        padding: 0;
      }

      .hl-productDetail__text {

        &:not(:first-child) {
          margin-top: 40px;
        }

        p:nth-child(1) {
          font-size: $titleSize;
          color: $textColor;
          line-height: 48px;
          font-weight: bold;
        }

        p:nth-child(2) {
          color: $subTitleColor;
          font-size: $descriptionSize;
          line-height: 36px;
          margin-top: 8px;
        }
      }
    }
  }
  .hl-productDetail__footer {
    height: 140px;
    background: $blockColor;
    padding-top: 20px;
    position: fixed;
    bottom: 0;
    width: $screenWidth;

    .hl-button {
      margin-top: 0;
    }
  }
}
</style>
