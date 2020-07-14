<template>
  <div class="hl-content">
    <div class="hl-content__inner">
      <div v-if="dataList.length || hasMore" ref="main" class="hl-card__wrapper">
        <hl-scroll ref="scroll" @more="loadMore">
          <div
            v-for="item in dataList"
            :key="item.recordId"
            class="hl-card"
          >
            <p
              v-if="item.recordDesc"
              class="hl-card__title"
            >
              {{ item.recordDesc }}
            </p>
            <template v-if="item.imageRecordList && item.imageRecordList.length">
              <ul
                class="hl-card__body"
                :class="{'hl-card__body_flex': item.imageRecordList.length > 1}"
              >
                <li
                  v-for="(image, index) in item.imageRecordList"
                  :key="image.customerFileId"
                  class="hl-card__image"
                  @click="previewShow(item.recordId, index)"
                >
                  <img :src="getThumbnailUrl(image.url, item.imageRecordList.length > 1)">
                </li>
              </ul>
              <hl-preview
                :ref="`preview-${item.recordId}`"
                :data="item.imageRecordList.map(item => item.url)"
              />
            </template>
            <div class="hl-card__footer">
              <span>{{ item.operationTime | datetime }}</span>
              <hl-popover direction="left">
                <i slot="button" class="hl-icon hl-icon-more"/>
                <div class="hl-tips">
                  <hl-button @click="handleAdd(item)">
                    <i class="hl-icon hl-icon-brush" />编辑
                  </hl-button>
                  <hl-button @click="handleDelete(item)">
                    <i class="hl-icon hl-icon-trash" />删除
                  </hl-button>
                </div>
              </hl-popover>
            </div>
          </div>
        </hl-scroll>
      </div>
      <hl-empty v-else>暂无访问记录</hl-empty>
    </div>

    <hl-button
      type="bottom"
      @click="handleAdd"
    >
      新增
    </hl-button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Utils from 'common/utils'
import RecordApi from 'common/api/record'
import TouchScroll from '@/mixins/touch-scroll'
import Toast from '@/components/toast'
import Confirm from '@/components/confirm'
import HlScroll from '@/components/scroll'
import HlEmpty from '@/components/empty'
import HlPopover from '@/components/popover'
import HlPreview from '@/components/preview'
import HlButton from '@/components/button'
export default {
  name: 'HlCustomerRecord',
  components: {
    HlScroll,
    HlEmpty,
    HlPopover,
    HlPreview,
    HlButton
  },
  mixins: [TouchScroll],
  data () {
    return {
      dataList: [],
      hasMore: true,
      total: 0,
      queryOption: {
        customerId: '',
        pageNo: 0,
        pageSize: 5
      }
    }
  },
  computed: {
    ...mapState([
      'isAddCustomerRecordRecent'
    ])
  },
  mounted () {
    this.queryOption.customerId = this.$route.query.id
  },
  methods: {
    ...mapMutations({
      setCustomerRecord: STORE_TYPES.SET_CUSTOMER_RECORD,
      setAddCustomerRecordRecent: STORE_TYPES.SET_ADD_CUSTOMER_RECORD_RECENT
    }),
    init () {
      this.dataList = []
      this.hasMore = true
      this.queryOption.pageNo = 0
      this.$refs.scroll.reset()
    },
    async loadMore (state) {
      try {
        const response = await RecordApi.list(this.queryOption, this.isAddCustomerRecordRecent)
        const dataList = response.data || []
        this.total = response.count
        this.dataList = this.dataList.concat(dataList)
        this.queryOption.pageNo++
        this.hasMore = dataList.length && this.total > this.dataList.length
        this.setAddCustomerRecordRecent(false)
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'CUSTOMER-RECORD-LIST')
      } finally {
        this.hasMore ? state.loaded() : state.complete()
      }
    },
    async deleteCustomerRecord (item) {
      try {
        await RecordApi.delete(item)
        Toast.show('访问记录删除成功')
        this.init()
      } catch (err) {
        Utils.errorLog(err, 'CUSTOMER-RECORD-DELETE', false)
      }
    },
    handleAdd (item) {
      const query = {
        id: this.queryOption.customerId
      }
      if (item) {
        query.recordId = item.recordId
        this.setCustomerRecord(item)
      }
      this.$router.push({
        name: 'customerRecordAdd',
        query
      })
    },
    handleDelete (item) {
      Confirm.show({
        title: '确认删除该访问记录吗？',
        message: '该操作无法恢复',
        submit: '暂不',
        cancel: '确认删除',
        handleCancel: this.deleteCustomerRecord.bind(this, item)
      })
    },
    getThumbnailUrl (url, isGrid) {
      return isGrid
        ? Utils.formatUfileUrl(url, { type: 6, width: 165, height: 165 })
        : Utils.formatUfileUrl(url, { type: 6, width: 500, height: 260 })
    },
    previewShow (recordId, index) {
      const el = this.$refs[`preview-${recordId}`][0]
      el && el.show(index)
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
    bottom: $footerHeight;
    left: 0;
    width: $screenWidth;
    margin: auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .hl-card__wrapper {
    min-height: 100.1%;
    overflow: hidden;
  }

  .hl-card {
    margin: 20px 0;
    padding: 30px;
    background-color: $blockColor;

    .hl-card__title {
      margin-bottom: 20px;
      font-size: $subTitleSize;
      line-height: 42px;
      color: $textColor;
    }

    .hl-card__body {
      .hl-card__image {
        display: inline-flex;
        align-items: center;

        img {
          width: auto;
          height: auto;
          max-width: 690px;
          max-height: 360px;
        }
      }

      &.hl-card__body_flex {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;

        .hl-card__image {
          width: 223px;
          height: 223px;
          justify-content: center;

          img {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
          }
        }
      }
    }

    .hl-card__footer {
      display: flex;
      align-items: center;
      margin-top: 40px;

      span {
        flex: auto;
        font-size: $quoteSize;
        line-height: 33px;
        color: $descriptionColor;
      }

      .hl-popover__wrapper::v-deep {
        .hl-icon-more {
          display: block;
          font-size: 42px;
          color: $textColor;
        }
      }
    }
  }
}

.hl-popover .hl-tips {
  width: max-content;
  padding: 10px 0;

  .hl-button {
    display: inline-flex;
    align-content: center;
    justify-content: center;
    width: 150px;
    height: 40px;
    font-size: $descriptionSize;
    border-right: 1px solid $textColor;

    .hl-icon {
      margin-right: 5px;
      font-size: 32px;
    }
  }

  .hl-button:last-child {
    border-right: none;
  }
}
</style>
