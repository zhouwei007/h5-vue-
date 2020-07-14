export default {
  base: '/',
  routes: [{
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login'),
    meta: {
      depth: 0,
      auth: false,
      background: '#fff'
    }
  }, {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/login/register'),
    meta: {
      depth: 0,
      auth: false,
      background: '#fff'
    }
  }, {
    path: '/password_reset',
    name: 'passwordReset',
    component: () => import('@/pages/login/password-reset'),
    meta: {
      depth: 0,
      auth: false,
      title: '忘记密码'
    }
  }, {
    path: '/product_list',
    name: 'productList',
    component: () => import('@/pages/product/index'),
    meta: {
      depth: 0,
      auth: false,
      title: '产品推荐',
      back: false
    },
    beforeEnter: (to, from, next) => {
      to.meta.back = (to.query.type === 'back')
      next()
    }
  }, {
    path: '/product_detail',
    name: 'productDetail',
    component: () => import('@/pages/product/detail'),
    meta: {
      depth: 0,
      auth: false,
      title: '产品介绍'
    }
  }]
}
