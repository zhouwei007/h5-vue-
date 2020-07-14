<template>
  <div class="hl-upload__wrapper">
    <ul
      class="hl-upload"
      :class="{'hl-upload_gallery': type === 'gallery'}"
    >
      <li
        v-if="editable"
        class="hl-upload__button"
        @touchstart="touchstart"
      >
        <slot v-if="type === 'gallery' || (!dataList.length && !hasEchoImage)">
          <i class="hl-icon hl-icon-camera" />
          <span class="hl-upload__label">选择图片</span>
        </slot>
        <div
          class="hl-upload__image"
          v-else-if="type === 'avatar'"
        >
          <img :src="dataList.length ? dataList[0].url : echoUrl[0].url">
          <slot v-if="showLabel" name="label">
            <i class="hl-icon hl-icon-trash" @click="handleDelete(0)" />
          </slot>
        </div>
        <slot name="footer" />
        <input
          ref="input"
          class="hl-upload__inner"
          type="file"
          :multiple="type === 'gallery' ? 'multiple' : false"
          :accept="accept"
          @change="handleChange"
        >
      </li>
      <template v-if="type === 'gallery'">
        <template v-if="hasEchoImage">
          <li
            v-for="(item, index) in echoUrl"
            :key="item.id"
            class="hl-upload__image hl-upload__image_gallery"
            @click="previewShow(index)"
          >
            <img :src="item.src">
            <i
              v-if="editable"
              class="hl-icon hl-icon-trash"
              @click.stop="handleEchoDelete(index)"
            />
          </li>
        </template>
        <li
          v-for="(item, index) in dataList"
          :key="index"
          class="hl-upload__image"
          :class="{[`hl-upload__image_rotate_${item.rotate}`]: item.rotate}"
          @click="previewShow(index, true)"
        >
          <img :src="item.url">
          <i
            v-if="editable"
            class="hl-icon hl-icon-trash"
            @click.stop="handleDelete(index)"
          />
        </li>
      </template>
    </ul>
    <hl-preview
      v-if="type === 'gallery'"
      ref="preview"
      :data="previewData"
    />
  </div>
</template>

<script>
import EXIF from 'exif-js'
import Utils from 'common/utils'
import Toast from '@/components/toast'
import HlPreview from '@/components/preview'
export default {
  name: 'HlUpload',
  components: {
    HlPreview
  },
  model: {
    value: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      default: null
    },
    type: {
      type: String,
      default: 'gallery',
      validator (val) {
        return [
          'gallery',
          'avatar'
        ].indexOf(val) !== -1
      }
    },
    maxlength: {
      type: [Number, Object],
      default: null
    },
    size: {
      type: [Number, Object],
      default: 20
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    url: {
      type: [String, Array, Object],
      default: ''
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dataList: [],
      echoUrl: null
    }
  },
  computed: {
    hasEchoImage () {
      return this.echoUrl && this.echoUrl.length
    },
    previewData () {
      let data = []
      if (this.echoUrl) {
        data = this.echoUrl.map(item => item.url)
      }
      return data.concat(this.dataList.map(item => item.url))
    }
  },
  watch: {
    value: {
      handler (val) {
        const data = []
        const files = Array.isArray(val) ? val : (val ? [val] : [])
        for (const file of files) {
          data.push(this.getImageData(file))
        }
        this.revokeDataList()
        this.dataList = data
      },
      immediate: true
    },
    url: {
      handler (val) {
        if (!val) {
          this.echoUrl = null
        } else if (typeof val === 'string') {
          this.echoUrl = [{
            id: Utils.randString(),
            src: this.getThumbnailUrl(val),
            url: val
          }]
        } else {
          const arr = Array.isArray(val) ? val : [val]
          this.echoUrl = arr.map(item => {
            return item.id !== void 0 ? {
              ...item,
              src: this.getThumbnailUrl(item.url)
            } : {
              ...item,
              id: Utils.randString(),
              src: this.getThumbnailUrl(item.url)
            }
          })
        }
      },
      immediate: true
    }
  },
  destroyed () {
    this.revokeDataList()
  },
  methods: {
    handleChange (e) {
      const data = []
      for (const file of e.target.files) {
        data.push(this.getImageData(file))
      }
      if (this.validate(data)) {
        if (this.type === 'gallery') {
          this.dataList = this.dataList.concat(data)
          this.emitEvent(this.dataList.map(item => item.file))
        } else {
          this.revokeDataList()
          this.dataList = data
          this.emitEvent(data[0].file)
        }
      }
      this.$refs.input.value = ''
    },
    handleDelete (index) {
      if (this.dataList.length) {
        const deleteArr = this.dataList.splice(index, 1)
        this.revokeDataList(deleteArr[0].url)
        this.emitEvent(this.type === 'gallery'
          ? this.dataList.map(item => item.file)
          : null
        )
      } else {
        this.handleEchoDelete(index)
      }
    },
    handleEchoDelete (index) {
      this.$emit('delete', this.echoUrl[index].id || this.echoUrl[index])
      this.echoUrl.splice(index, 1)
    },
    emitEvent (data = null) {
      this.$emit('update:value', data)
      this.$emit('change', data)
    },
    validate (data) {
      if (this.maxlength) {
        const length = this.dataList.length + (this.echoUrl ? this.echoUrl.length : 0) + data.length
        const lengthValidate = typeof this.maxlength === 'number' ? {
          length: this.maxlength,
          message: `最多上传${this.maxlength}张图片`
        } : this.maxlength
        if (length > lengthValidate.length) {
          Toast.show(lengthValidate.message)
          return false
        }
      }
      if (this.size) {
        const sizeValidate = typeof this.size === 'number' ? {
          size: this.size,
          message: `请上传${this.size}M以下的文件`
        } : this.size
        const size = sizeValidate.size * 1024 * 1024
        for (const item of data) {
          if (item.file.size > size) {
            Toast.show(sizeValidate.message)
            return false
          }
        }
      }
      return true
    },
    revokeDataList (url = null) {
      if (url) {
        URL.revokeObjectURL(url)
      } else {
        for (const item of this.dataList) {
          URL.revokeObjectURL(item.url)
        }
      }
    },
    getImageData (file) {
      const id = Utils.randString()
      const isWeChat = /MicroMessenger/.test(navigator.userAgent)
      const isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
      const needRotate = !(isIOS && isWeChat)
      const updateData = (index, deg) => {
        index >= 0 && this.$set(this.dataList, index, {
          ...this.dataList[index],
          rotate: 90
        })
      }
      needRotate && EXIF.getData(file, () => {
        const orientation = EXIF.getTag(file, 'Orientation')
        this.$nextTick(() => {
          const index = this.dataList.findIndex(item => item.id === id)
          switch (orientation) {
            case 6:
              updateData(index, 90)
              break
            case 3:
              updateData(index, 180)
              break
            case 8:
              updateData(index, 270)
              break
          }
        })
      })
      return { id, file, url: URL.createObjectURL(file) }
    },
    getThumbnailUrl (url) {
      return Utils.formatUfileUrl(url, { type: 6, width: 150, height: 150 })
    },
    getPreviewData () {
      let data = []
      if (this.echoUrl) {
        data = this.echoUrl.map(item => ({
          src: item.src || item.url,
          width: item.width,
          height: item.height
        }))
      }
      return data.concat(this.dataList.map(item => item.url))
    },
    previewShow (index, isNewData = false) {
      const el = this.$refs.preview
      el && el.show(isNewData && this.hasEchoImage
        ? this.echoUrl.length + index : index
      )
    },
    touchstart () {
      // For mobile active style
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-upload {
  display: flex;
  flex-wrap: wrap;

  .hl-upload__button {
    position: relative;
    width: 196px;
    height: 196px;
    margin: 10px;
    text-align: center;
    background-color: $blockColor;
    border: $uploadBorder;
    border-radius: $cardRadius;
    box-sizing: border-box;

    &:active {
      background-color: $blockActiveColor;
    }

    .hl-icon.hl-icon-camera {
      display: block;
      margin: auto;
      margin-top: 46px;
      font-size: 70px;
      color: $descriptionColor;
    }

    .hl-upload__inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .hl-upload__label {
      font-size: $subQuoteSize;
      color: $descriptionColor;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .hl-upload__image {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 196px;
    height: 196px;
    margin: 10px;
    background-color: $blockColor;
    border-radius: $cardRadius;
    overflow: hidden;

    &.hl-upload__image_rotate_90 img {
      transform: rotate(90deg);
    }

    &.hl-upload__image_rotate_180 img {
      transform: rotate(180deg);
    }

    &.hl-upload__image_rotate_270 img {
      transform: rotate(270deg);
    }

    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }

    .hl-icon {
      position: absolute;
      display: block;
      top: 0;
      right: 0;
      width: 42px;
      height: 42px;
      font-size: 36px;
      line-height: 42px;
      text-align: center;
      color: $blockColor;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 0 10px 0 20px;
      z-index: $itemOverIndex;
      cursor: pointer;
    }
  }

  &.hl-upload_gallery {
    margin: -10px;

    .hl-upload__image {
      background: $uploadBorderColor;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
