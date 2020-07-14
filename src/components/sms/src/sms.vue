<template>
  <span class="hl-sms"
    :class="[{
      'hl-sms_cold': isCold,
      'hl-sms_reset': text === `重新发送`
    }]"
    @click="getSms"
    @touchstart="touchstart">
    {{ text }}
  </span>
</template>

<script>
export default {
  name: 'HlSms',
  props: {
    interval: {
      type: Number,
      default: 120
    },
    label: {
      type: String,
      default: '获取验证码'
    },
    immediate: {
      type: Boolean,
      default: false
    },
    timeSuffix: {
      type: String,
      default: 'S'
    }
  },
  data () {
    return {
      text: this.label,
      timer: null,
      time: 0
    }
  },
  computed: {
    isCold () {
      return this.time > 0
    }
  },
  mounted () {
    this.immediate && this.getSms()
  },
  methods: {
    start (val) {
      this.time = val || this.interval
      this.text = `${this.time}${this.timeSuffix}`
      this.handlerTimer()
    },
    reset () {
      this.time = 0
      this.text = '重新发送'
      clearTimeout(this.timer)
    },
    state () {
      return !this.isCold
    },
    handlerTimer () {
      this.timer = setTimeout(() => {
        this.time--
        if (this.time <= 0) {
          this.reset()
        } else {
          this.text = `${this.time}${this.timeSuffix}`
          this.handlerTimer()
        }
      }, 1000)
    },
    getSms () {
      !this.isCold && this.$emit('get-sms', this)
    },
    touchstart () {
      // For mobile active style
    }
  }
}
</script>

<style lang="scss" scoped>
.hl-sms {
  display: inline-block;
  height: 50px;
  padding-left: 30px;
  line-height: 50px;
  font-size: $descriptionSize;
  color: $systemColor;
  user-select: none;
  cursor: pointer;

  &:active {
    color: $systemActiveColor;
  }

  &.hl-sms_cold {
    padding-left: 0;
    min-width: 160px;
    text-align: center;
    color: $descriptionColor;
    cursor: default;
  }
}
</style>
