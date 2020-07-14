export default {
  data () {
    return {
      dpr: 1,
      times: 2,
      canvas: null,
      canvasWidth: 0,
      canvasHeight: 0
    }
  },
  computed: {
    realWidth () {
      return this.canvasWidth / this.times
    },
    realHeight () {
      return this.canvasHeight / this.times
    },
    canvasStyle () {
      return {
        width: `${this.realWidth}px`,
        height: `${this.realHeight}px`
      }
    }
  },
  methods: {
    drawImage (background, qrcode, size, top, left, drawText = true) {
      const ctx = this.canvas.getContext('2d')
      ctx.drawImage(background, 0, 0, this.getSize(750), this.getSize(1334))
      qrcode && ctx.drawImage(qrcode, this.getSize(left), this.getSize(top), this.getSize(size), this.getSize(size))
      if (drawText) {
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.font = `bold ${this.getSize(50)}px Semibold`
        ctx.fillText('专属邀请码', this.getSize(301), this.getSize(top + 65))
        ctx.font = `bold ${this.getSize(60)}px Semibold`
        ctx.fillText(this.code, this.getSize(301), this.getSize(top + 130))
      }
      return this.canvas.toDataURL('image/png')
    },
    resize () {
      this.dpr = parseFloat(document.documentElement.style.fontSize) / 75
      this.canvasWidth = this.getSize(750)
      this.canvasHeight = this.getSize(1334)
    },
    getSize (size) {
      return size * this.dpr * this.times
    }
  }
}
