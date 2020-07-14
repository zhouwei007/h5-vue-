<template>
  <div class="hl-content">
    <hl-tab
      v-model="current"
      :options="tabOptions"
      direction="vertical"
      @select="handleSelect"
    />
    <ul ref="main" class="hl-content__inner hl-dialog__lock">
      <li
        v-for="(url, index) in dataList[current]"
        :key="url"
        class="hl-image"
        @click="goDetail(index)"
      >
        <img :src="url">
      </li>
      <li v-if="!dataList[current] || !dataList[current].length" is="hl-empty">暂无图片</li>
    </ul>
  </div>
</template>

<script>
import Utils from 'common/utils'
import CmsApi from 'common/api/cms'
import TouchScroll from '@/mixins/touch-scroll'
import HlTab from '@/components/tab'
import HlEmpty from '@/components/empty'
export default {
  name: 'HlBusiness',
  components: {
    HlTab,
    HlEmpty
  },
  mixins: [TouchScroll],
  data () {
    return {
      current: 0,
      tabOptions: [{
        label: '全部',
        value: 0
      }],
      dataList: {
        0: []
      }
    }
  },
  mounted () {
    this.current = this.$route.query.type || 0
    this.getBusinessImages()
  },
  methods: {
    async getBusinessImages () {
      try {
        const response = await CmsApi.getBusinessImages()
        let tabOptions = []
        for (const item of response) {
          const value = Number(item.link)
          if (!value) {
            continue
          }
          tabOptions.unshift({
            label: item.title,
            value
          })
          this.dataList[item.link] = Object.keys(item).reduce((arr, key) => {
            key.startsWith('picture') && arr.push(item[key])
            return arr
          }, [])
          this.dataList[0] = this.dataList[item.link].concat(this.dataList[0])
        }
        this.tabOptions = this.tabOptions.concat(tabOptions)
      } catch (err) {
        Utils.errorLog(err, 'GET-BUSINESS-IMAGES', true)
      }
    },
    handleSelect (type) {
      this.$router.replace({
        name: 'business',
        query: { type }
      })
    },
    goDetail (index) {
      this.$router.push({
        name: 'businessDetail',
        query: {
          type: this.current,
          index
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-content {
  display: flex;

  .hl-content__inner {
    flex: auto;
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
    flex-wrap: wrap;
    width: 0;
    height: 100%;
    padding: 30px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .hl-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48.04%;
      max-width: 245px;
      height: 290px;
      margin-bottom: 20px;
      background-color: $uploadBorderColor;
      border-radius: $cardRadius;
      overflow: hidden;
      cursor: pointer;

      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }

    .hl-empty {
      margin: auto;
      margin-top: 120px;
    }
  }
}
</style>
