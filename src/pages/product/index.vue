<template>
  <div class="hl-content">
    <div class="hl-productCity__wraaper">
      <span class="hl-productCity-label">选择城市</span>
      <span class="hl-productCity-name" @click="dialogShow = true">
        <span>
          {{ cityArr[params.cityId] ? cityArr[params.cityId] : '请选择' }}
        </span>
        <i class="hl-icon hl-icon-triangle-up"/>
      </span>
    </div>
    <template v-if="dataList.length || hasMore">
      <hl-scroll ref="scroll" @more="getProduct">
        <ul class="hl-productCard__wrapper">
          <li
            class="hl-productcard"
            @click="goDetail(item.id, item)"
            v-for="(item, index) in dataList"
            :key="index"
          >
            <div class="hl-productcard__header">
              <div class="hl-productcard-title">
                <span class="hl-productcard-title__name">{{ item.productName || '--' }}</span>
                <span
                  class="hl-productcard-icon"
                  v-for="(itemLabel, index) in item.productLabel"
                  :key="index"
                >
                  <i
                    v-if="iconArr[Object.keys(itemLabel)[0]]"
                    :class="['hl-icon', iconArr[Object.keys(itemLabel)[0]]]"
                  />{{ Object.values(itemLabel)[0] }}
                </span>
              </div>
              <div class="hl-productcard-bank">
                <div
                  class="hl-productcard-bank__icon"
                  v-if="item.sourceIconShow === 1 && item.sourceName"
                >
                  <img :src="item.sourceIcon"/>
                </div>
                <span>{{ item.sourceName || '' }}</span>
              </div>
            </div>
            <div class="hl-productcard__body">
              <div class="hl-productcard-amount">
                <p class="hl-productcard-bold orange hl-productcard-num">
                  <span>{{ item.borrowQuota | creditMoneyBefore }}</span>{{ item.borrowQuota | creditMoney }}<span>{{ item.borrowQuota | creditUnit }}</span>
                </p>
                <p class="hl-productcard-desc">最高授信</p>
              </div>
              <div class="hl-productcard-rate">
                <p class="hl-productcard-bold">
                  {{ item.productRate || '--' }}
                </p>
                <p class="hl-productcard-desc">
                  {{ item.rateTypeName || '--' }}
                </p>
              </div>
              <div class="hl-productcard-trem">
                <p class="hl-productcard-bold">
                  {{ item.borrowPeriods || '--' }}
                </p>
                <p class="hl-productcard-desc">借款期限</p>
              </div>
            </div>
            <div class="hl-productcard__footer">
              <i class="hl-icon hl-icon-lend_normal"/>
              <span class="hl-productcard-reason">
                {{ item.productAdvantage || '--' }}
              </span>
            </div>
          </li>
        </ul>
      </hl-scroll>
    </template>
    <hl-empty v-else>暂无产品推荐</hl-empty>

    <hl-dialog
      :show.sync="dialogShow"
      :mask-close="false"
    >
      <div class="hl-dialog-header">
        选择城市
        <i
          class="hl-icon hl-icon-close"
          @click="dialogShow = false"
        />
      </div>
      <div class="hl-dialog-content">
        <div
          class="item"
          v-for="(value, key, index) in cityArr"
          :key="index"
        >
          <hl-button
            type="primary"
            @click="selectCity(key)"
            :class="{'active': params.cityId == key}"
          >
            {{ value }}
          </hl-button>
        </div>
      </div>
    </hl-dialog>
  </div>
</template>

<script>
import sensors from '@/common/sensors'
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import BS from 'common/bs'
import SETTING from '@/setting'
import Utils from 'common/utils'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
import HlDialog from '@/components/dialog'
import HlButton from '@/components/button'
import ProductApi from 'common/api/product'
export default {
  name: 'HlProduct',
  components: {
    HlScroll,
    HlEmpty,
    HlDialog,
    HlButton
  },
  data () {
    return {
      params: {
        cityId: '',
        clientId: '',
        index: 1,
        pageSize: 5
      },
      hasMore: true,
      total: 0,
      dataList: [],
      dialogShow: false,
      iconArr: {
        hot: 'hl-icon-product-gift',
        fire: 'hl-icon-product-hot',
        new: 'hl-icon-product-star'
      },
      cityArr: []
    }
  },
  mounted () {
    this.setHeaderButton({
      icon: 'hl-icon-refresh',
      event: this.resetList
    })
    this._city()
  },
  watch: {
    'params.cityId' (val) {
      this.resetList()
    }
  },
  methods: {
    ...mapMutations({
      setHeaderButton: STORE_TYPES.SET_HEADER_BUTTON
    }),
    async getProduct (state) {
      if (!this.params.cityId) {
        this.hasMore = false
        state.complete()
        return
      }
      try {
        const response = await ProductApi.list(this.params)
        const dataList = response.list || []
        this.total = response.total
        this.dataList = this.dataList.concat(dataList.map(item => {
          item.productLabel = item.productLabel && JSON.parse(item.productLabel)
          return item
        }))
        this.params.index++
        this.hasMore = dataList.length && this.total > this.dataList.length
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'PRODUCT-LIST')
      } finally {
        this.hasMore ? state.loaded() : state.complete()
      }
    },
    goDetail (id, item) {
      sensors.track('ViewProduct', {
        ViewTime: new Date(),
        ViewProductName: item.productName
      })
      this.$router.push({
        name: 'productDetail',
        query: {
          id: id
        }
      })
    },
    selectCity (id) {
      localStorage.productCity = id
      this.params.cityId = id
      this.dialogShow = false
      this.resetList()
    },
    resetList () {
      this.params.index = 1
      this.dataList = []
      this.hasMore = true
      const el = this.$refs.scroll
      el && el.reset()
    },
    async _city () {
      this.cityArr = await BS.getValue(SETTING.BS_PRODUCT_CITY_KEY)
      const cityId = localStorage.getItem('productCity')
      this.dialogShow = !cityId
      this.params.cityId = cityId || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  padding-top: 20px;

  .hl-productCity__wraaper {
    width: 280px;
    margin: 0 auto 20px;
    background: $blockColor;
    height: 60px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    font-size: $descriptionSize;

    span {
      display: inline-block;
      line-height: 32px;
    }

    .hl-productCity-label {
      color: $descriptionColor;
      width: 150px;
      border-right: solid 1px $mainColor;
      text-align: center;
    }

    .hl-productCity-name {
      color: $textColor;
      text-align: center;
      width: 130px;

      .hl-icon-triangle-up {
        transform: rotate(180deg);
        display: inline-block;
        padding-right: 6px;
        font-size: 16px;
      }
    }
  }

  .hl-productCard__wrapper {
    .hl-productcard {
      padding: 0 30px;
      background: $blockColor;
      margin: 20px 30px 0;
      border-radius: 5px;
      overflow-y: auto;
      overflow-x: hidden;
      cursor: pointer;

      .hl-productcard__header {
        height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          display: inline-block;
        }

        .hl-productcard-title {
          display: flex;
          align-items: center;
          max-width: 520px;

          .hl-productcard-title__name {
            font-weight: bold;
            font-size: $titleSize;
            color: $textColor;
            max-width: 240px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .hl-productcard-icon {
            margin-left: 12px;
            background: rgba(245, 74, 11, .05);
            border: 1px solid rgba(245, 74, 11, .2);
            border-radius: 100px 100px 100px 0;
            height: 40px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            font-size: $quoteSize;
            color: $errorColor;
            text-align: center;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;

            i {
              padding-right: 8px;
              font-size: $subQuoteSize;
            }
          }
        }

        .hl-productcard-bank {
          display: flex;
          align-items: center;

          .hl-productcard-bank__icon {
            width: 44px;
            height: 44px;
            min-width: 44px;
            margin-right: 8px;
            border-radius: 50%;
            overflow: hidden;

            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          span {
            color: $descriptionColor;
            font-size: $quoteSize;
            max-width: 170px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .hl-productcard__body {
        display: flex;
        justify-content: center;
        padding-bottom: 12px;
        padding-top: 4px;

        .hl-productcard-desc {
          color: $descriptionColor;
          font-size: $quoteSize;
          line-height: 34px;
          margin-top: 8px;
          overflow: hidden;
        }

        .hl-productcard-bold {
          font-size: 32px;
          color: $textColor;
          height: 62px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 62px;

          &.orange {
            color: $themeColor;
          }
        }

        .hl-productcard-num {
          font-family: 'Harabara';
          font-size: 60px;
          color: $themeColor;
          line-height: 60px;

          span {
            font-size: 32px;
            vertical-align: middle;
          }
        }

        div {
          height: 120px;
          width: 200px;

          &.hl-productcard-amount {
            width: 190px;
          }

          &.hl-productcard-rate {
            width: 270px;
          }
        }
      }

      .hl-productcard__footer {
        height: 60px;
        display: flex;
        align-items: center;
        background: rgba(248,83,13, 0.05);
        border-radius: 35px;
        margin: 30px 0;

        .hl-productcard-reason {
          font-size: $descriptionSize;
          color: $errorColor;
          padding-left: 8px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .hl-icon-lend_normal {
          font-size: $descriptionSize;
          color: $themeColor;
          margin-left: 26px;
        }
      }
    }
  }
}

.hl-dialog__wrapper::v-deep .hl-dialog.hl-dialog_default {
  width: 630px;

  .hl-dialog__body {
    padding: 0;
    border-radius: $dialogRadius;
    overflow: hidden;

    .hl-dialog-header {
      height: 160px;
      position: relative;
      text-align: center;
      line-height: 160px;
      font-size: 44px;
      color: $blockColor;
      font-weight: bold;
      margin-top: -4px;

      &:after {
        width: 110%;
        height: 160px;
        position: absolute;
        left: -5%;
        top: 0;
        z-index: -1;
        content: '';
        border-radius: 0 0 50% 50%;
        background-image: linear-gradient(0deg, #f8750d 0%, #f8530d 29%);
      }

      i {
        position: absolute;
        right: 30px;
        top: 30px;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 40px;
        opacity: .6;
      }
    }

    .hl-dialog-content {
      margin-top: 20px;
      min-height: 480px;
      background: url(~images/product_dialog_bg.png) center bottom no-repeat;
      background-size: contain;
      display: flex;
      flex-wrap: wrap;
      padding: 0 40px;
      align-content: flex-start;

      .item {
        width: 33.33%;
        height: 70px;
        margin-top: 20px;

        .hl-button {
          width: 170px;
          line-height: 70px;
          height: 70px;
          margin: 0;
          border-radius: 35px;
          font-size: $descriptionSize;
          color: $textColor;
          background: $mainColor;
          box-shadow: none;

          &.active {
            background: #feece6;
            color: $themeColor;
            border: solid 1px $themeColor;
          }
        }
      }
    }
  }
}
</style>
