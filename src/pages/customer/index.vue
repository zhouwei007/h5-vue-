<template>
  <div class="hl-content">
    <hl-input
      v-model="params.name"
      ref="search"
      class="hl-search"
      :class="isSearch ? 'hl-search_focus' : 'hl-search_blur'"
      :placeholder="isSearch ? '搜索' : ''"
      @focus="handleSearchFocus"
    >
      <div
        slot="prefix"
        class="hl-search__prefix"
        @click="handleSearchFocus"
      >
        <i class="hl-icon hl-icon-search" />
        <span v-if="!isSearch">搜索</span>
      </div>
      <hl-button
        v-if="isSearch"
        slot="suffix"
        @click="handleSearchBlur"
      >
        取消
      </hl-button>
    </hl-input>

    <template v-if="hasCustomer">
      <hl-menu v-if="!isSearch">
        <hl-menu-item
          label="最近添加"
          @click="goHtml('customerRecent')"
        >
          <i slot="prefix"  class="hl-icon hl-icon-recent" />
        </hl-menu-item>
        <hl-menu-item
          label="我的分组"
          @click="goHtml('customerGroup')"
        >
          <i slot="prefix"  class="hl-icon hl-icon-group" />
        </hl-menu-item>
      </hl-menu>

      <hl-scroll ref="scroll" @more="getCustomerList">
        <div v-for="(sortList, sortIndex) in dataList" :key="sortIndex">
          <div class="hl-customer-card__sort">{{ sortIndex }}</div>
          <hl-customer-card
            v-for="(item, index) in sortList"
            :key="index"
            :data="item"
            @recommend="goRecommend"
            @click="goCustomerDetail(item.id)"
          />
        </div>
      </hl-scroll>
    </template>
    <hl-empty v-else>暂无客户</hl-empty>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import STORE_TYPES from '@/store/types'
import Utils from 'common/utils'
import CustomerApi from 'common/api/customer'
import Authenticate from '@/mixins/authenticate'
import HlInput from '@/components/input'
import HlButton from '@/components/button'
import HlMenu from '@/components/menu'
import HlMenuItem from '@/components/menu-item'
import HlScroll from '@/components/scroll'
import HlCustomerCard from '@/components/customer-card'
import HlEmpty from '@/components/empty'
export default {
  name: 'HlCustomer',
  components: {
    HlInput,
    HlButton,
    HlMenu,
    HlMenuItem,
    HlScroll,
    HlCustomerCard,
    HlEmpty
  },
  mixins: [Authenticate],
  data () {
    return {
      isSearch: false,
      dataList: {},
      params: {
        pageNo: 0,
        pageSize: 10,
        name: ''
      },
      hasMore: true,
      total: 0
    }
  },
  computed: {
    hasCustomer () {
      return Object.keys(this.dataList).length || this.hasMore
    }
  },
  watch: {
    'params.name' () {
      this.debouncedSearch()
    }
  },
  created () {
    this.debouncedSearch = Utils.debounce(300, this.handleSearch)
  },
  mounted () {
    this.setHeaderButton({
      icon: 'hl-icon-add',
      event: this.goCustomerDetail
    })
    this.setCustomerInfo()
  },
  methods: {
    ...mapMutations({
      setHeaderButton: STORE_TYPES.SET_HEADER_BUTTON,
      setCustomerInfo: STORE_TYPES.SET_CUSTOMER_INFO
    }),
    async getCustomerList (state) {
      try {
        const response = await CustomerApi.list(this.params)
        const dataList = response.list || []
        this.total = response.total
        this.dataList = dataList.reduce((result, item) => {
          const list = result[item.sort]
          result[item.sort] = list ? list.concat(item.sortList) : item.sortList
          return result
        }, Utils.deepClone(this.dataList))
        this.params.pageNo++
        this.hasMore = dataList.length && this.total > Object.values(this.dataList).reduce((sum, item) => sum + item.length, 0)
      } catch (err) {
        this.hasMore = false
        Utils.errorLog(err, 'CUSTOMER-LIST')
      } finally {
        this.hasMore ? state.loaded() : state.complete()
      }
    },
    handleSearchFocus () {
      const el = this.$refs.search
      el && el.focus()
      this.isSearch = true
    },
    handleSearchBlur () {
      this.isSearch = false
      this.params.name = ''
    },
    handleSearch () {
      this.dataList = {}
      this.hasMore = true
      this.params.pageNo = 0
      const el = this.$refs.scroll
      el && el.reset()
    },
    goHtml (name) {
      this.$router.push({ name })
    },
    goRecommend (id) {
      this.$router.push({
        name: 'recommend',
        query: { id }
      })
    },
    goCustomerDetail (id) {
      this.$handleAuthenticate() && this.$router.push(id ? {
        name: 'customerDetail',
        query: { id }
      } : {
        name: 'customerAdd'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  .hl-input.hl-search::v-deep {
    display: block;
    height: 100px;
    background-color: $blockColor;
    @include placeholder($searchPlaceholderColor);

    .hl-input__prefix {
      position: absolute;
      top: 0;
      bottom: 0;

      .hl-search__prefix {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: $searchPlaceholderColor;
        font-size: $textSize;
      }

      .hl-icon.hl-icon-search {
        font-size: 38px;
      }
    }

    .hl-input__suffix {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;

      .hl-button {
        margin-right: 30px;
        font-size: $textSize;
        line-height: 100px;
        color: $systemColor;
        white-space: nowrap;
        animation: fade-in .2s ease-in-out;
      }
    }

    .hl-input__inner {
      float: left;
      height: 64px;
      width: 690px;
      margin: 18px 30px;
      line-height: 64px;
      background-color: $mainColor;
      border-radius: 35px;
      box-sizing: border-box;
      transition: width .2s ease-in-out;
    }

    &.hl-search_focus {
      .hl-input__prefix {
        left: 70px;
      }

      .hl-input__inner {
        width: 600px;
        padding-left: 85px;
        transition: width .2s ease-in-out;
      }
    }

    &.hl-search_blur .hl-input__prefix {
      left: 30px;
      right: 30px;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: .8;
    }
  }

  .hl-menu-item::v-deep {
    .hl-icon {
      margin-left: -10px;
      margin-right: 20px;
      font-size: 84px;
      color: #22243B;
    }

    .hl-menu-item__label {
      font-size: $subTitleSize;
    }

    .hl-icon-arrow-right {
      display: none;
    }
  }

  .hl-scroll {
    margin: 20px 0;

    .hl-customer-card__sort {
      height: 30px;
      line-height: 30px;
      padding: 0 30px;
      font-size: $tinySize;
      color: $descriptionColor;
      background: $blockColor;
    }
  }
}
</style>
