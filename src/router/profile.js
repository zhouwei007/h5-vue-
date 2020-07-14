export default {
  base: '/profile',
  routes: [{
    path: '/',
    name: 'profile',
    component: () => import('@/pages/profile'),
    meta: {
      depth: 0
    }
  }, {
    path: '/message',
    name: 'message',
    component: () => import('@/pages/profile/message'),
    meta: {
      depth: 1,
      title: '消息中心'
    }
  }, {
    path: '/message/detail',
    name: 'messageDetail',
    component: () => import('@/pages/profile/message/message-detail'),
    meta: {
      depth: 2,
      title: '消息中心'
    }
  }, {
    path: '/brokerage',
    name: 'brokerage',
    component: () => import('@/pages/profile/brokerage'),
    meta: {
      depth: 1,
      title: '奖励金查询'
    }
  }, {
    path: '/loan',
    name: 'loan',
    component: () => import('@/pages/profile/loan'),
    meta: {
      depth: 1,
      title: '我的推荐'
    }
  }, {
    path: '/bankcard',
    name: 'bankcard',
    component: () => import('@/pages/profile/bankcard'),
    meta: {
      depth: 1,
      title: '银行卡'
    }
  }, {
    path: '/bankcard/detail',
    name: 'bankcardDetail',
    component: () => import('@/pages/profile/bankcard/bankcard-add'),
    meta: {
      depth: 2,
      title: '银行卡详情'
    }
  }, {
    path: '/bankcard/add',
    name: 'bankcardAdd',
    component: () => import('@/pages/profile/bankcard/bankcard-add'),
    meta: {
      depth: 3,
      title: '添加银行卡'
    }
  }, {
    path: '/bankcard/update',
    name: 'bankcardUpdate',
    component: () => import('@/pages/profile/bankcard/bankcard-add'),
    meta: {
      depth: 3,
      title: '修改银行卡'
    }
  }, {
    path: '/invite',
    name: 'invite',
    component: () => import('@/pages/profile/invite'),
    meta: {
      depth: 1,
      title: '邀请经纪人',
      background: '#070000'
    }
  }, {
    path: '/share',
    name: 'inviteShare',
    component: () => import('@/pages/profile/invite/invite-share'),
    meta: {
      depth: 0,
      auth: false,
      background: '#070000'
    }
  }, {
    path: '/broker',
    name: 'broker',
    component: () => import('@/pages/profile/broker'),
    meta: {
      depth: 1,
      title: '我的经纪人'
    }
  }, {
    path: '/broker/detail',
    name: 'brokerDetail',
    component: () => import('@/pages/profile/broker/broker-detail'),
    meta: {
      depth: 2,
      title: '我的经纪人'
    }
  }, {
    path: '/feedback',
    name: 'feedback',
    component: () => import('@/pages/profile/feedback'),
    meta: {
      depth: 1,
      title: '意见反馈'
    }
  }, {
    path: '/setting',
    name: 'setting',
    component: () => import('@/pages/profile/setting'),
    meta: {
      depth: 1,
      title: '账户设置'
    }
  }, {
    path: '/certification',
    name: 'certification',
    component: () => import('@/pages/profile/setting/certification'),
    meta: {
      depth: 1,
      title: '实名认证'
    }
  }, {
    path: '/setting/password',
    name: 'updatePassword',
    component: () => import('@/pages/profile/setting/update-password'),
    meta: {
      depth: 2,
      title: '修改登录密码'
    }
  }, {
    path: '/setting/mobile',
    name: 'updateMobile',
    component: () => import('@/pages/profile/setting/update-mobile'),
    meta: {
      depth: 2,
      title: '修改手机号'
    }
  }]
}
