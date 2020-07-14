import Vue from 'vue'
import Router from 'vue-router'
import Common from 'common/common'
import HlLayout from '@/layout'
import rootRouter from './root'
import marketingRouter from './marketing'
import profileRouter from './profile'
import customerRouter from './customer'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '*',
    redirect: '/profile'
  }, {
    path: '/',
    redirect: '/profile'
  }, ...[
    rootRouter,
    customerRouter,
    marketingRouter,
    profileRouter
  ].map(item => ({
    path: item.base,
    component: HlLayout,
    children: item.routes
  }))]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.auth !== false) {
    const identity = await Common.auth()
    identity ? next() : next({ name: 'login' })
  } else {
    next()
  }
})

export default router
