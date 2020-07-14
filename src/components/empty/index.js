import Empty from './src/empty'

Empty.install = Vue => {
  Vue.component(Empty.name, Empty)
}

export default Empty
