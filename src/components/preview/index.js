import Preview from './src/preview'

Preview.install = Vue => {
  Vue.component(Preview.name, Preview)
}

export default Preview
