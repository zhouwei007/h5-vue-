import MenuItem from './src/menu-item'

MenuItem.install = Vue => {
  Vue.component(MenuItem.name, MenuItem)
}

export default MenuItem
