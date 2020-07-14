import './src/collapse.scss'

const addClass = (el, cls) => {
  if (!el) return
  let curClass = el.className
  let classes = (cls || '').split(' ')
  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i]
    if (!clsName) continue
    if (el.classList) {
      el.classList.add(clsName)
    } else if (!this.hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

const removeClass = (el, cls) => {
  if (!el || !cls) return
  let classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '
  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i]
    if (!clsName) continue
    if (el.classList) {
      el.classList.remove(clsName)
    } else if (this.hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = this.trim(curClass)
  }
}

const Transition = {
  beforeEnter (el) {
    addClass(el, 'hl-collapse-transition')
    if (!el.dataset) el.dataset = {}
    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom
    el.style.height = '0'
    el.style.paddingTop = 0
    el.style.paddingBottom = 0
  },
  enter (el) {
    el.dataset.oldOverflow = el.style.overflow
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px'
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    } else {
      el.style.height = ''
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    }
    el.style.overflow = 'hidden'
  },
  afterEnter (el) {
    removeClass(el, 'hl-collapse-transition')
    el.style.height = ''
    el.style.overflow = el.dataset.oldOverflow
  },
  beforeLeave (el) {
    if (!el.dataset) el.dataset = {}
    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom
    el.dataset.oldOverflow = el.style.overflow
    el.style.height = el.scrollHeight + 'px'
    el.style.overflow = 'hidden'
  },
  leave (el) {
    if (el.scrollHeight !== 0) {
      addClass(el, 'hl-collapse-transition')
      el.style.height = 0
      el.style.paddingTop = 0
      el.style.paddingBottom = 0
    }
  },
  afterLeave (el) {
    removeClass(el, 'hl-collapse-transition')
    el.style.height = ''
    el.style.overflow = el.dataset.oldOverflow
    el.style.paddingTop = el.dataset.oldPaddingTop
    el.style.paddingBottom = el.dataset.oldPaddingBottom
  }
}

export default {
  name: 'HlCollapseTransition',
  functional: true,
  render (h, { children }) {
    const data = {
      on: Transition
    }
    return h('transition', data, children)
  }
}
