export default {
  base: '/customer',
  routes: [{
    path: '/',
    name: 'customer',
    component: () => import('@/pages/customer'),
    meta: {
      depth: 0,
      title: '我的客户',
      back: false,
      button: {
        icon: 'hl-icon-add'
      }
    }
  }, {
    path: '/recommend',
    name: 'recommend',
    component: () => import('@/pages/customer/recommend'),
    meta: {
      depth: 1,
      title: '推荐借款'
    }
  }, {
    path: 'group',
    name: 'customerGroup',
    component: () => import('@/pages/customer/customer-group'),
    meta: {
      depth: 1,
      title: '我的分组'
    }
  }, {
    path: 'recent',
    name: 'customerRecent',
    component: () => import('@/pages/customer/customer-recent'),
    meta: {
      depth: 1,
      title: '最近添加',
      button: {
        icon: 'hl-icon-add'
      }
    }
  }, {
    path: 'add',
    name: 'customerAdd',
    component: () => import('@/pages/customer/customer-add'),
    meta: {
      depth: 2,
      title: '新建客户档案',
      icon: 'hl-icon-close'
    }
  }, {
    path: 'detail',
    name: 'customerDetail',
    component: () => import('@/pages/customer/customer-add'),
    meta: {
      depth: 2,
      title: '客户信息'
    }
  }, {
    path: 'loan',
    name: 'customerLoan',
    component: () => import('@/pages/customer/loan/customer-loan'),
    meta: {
      depth: 3,
      title: '借款申请'
    }
  }, {
    path: 'estimate',
    name: 'customerEstimate',
    component: () => import('@/pages/customer/loan/customer-estimate'),
    meta: {
      depth: 3,
      title: '评估记录'
    }
  }, {
    path: 'upload_image',
    name: 'customerUploadImage',
    component: () => import('@/pages/customer/resource/customer-upload-image'),
    meta: {
      depth: 3,
      title: '图片资料'
    }
  }, {
    path: 'share',
    name: 'customerShare',
    component: () => import('@/pages/customer/share'),
    meta: {
      depth: 4,
      title: '图片资料'
    }
  }, {
    path: 'supply',
    name: 'customerSupply',
    component: () => import('@/pages/customer/share/customer-supply'),
    meta: {
      depth: 0,
      auth: false,
      back: false,
      title: '客户信息'
    }
  }, {
    path: 'encrypt_image',
    name: 'customerEncryptImage',
    component: () => import('@/pages/customer/resource/customer-encrypt-image'),
    meta: {
      depth: 3,
      title: '加密图片资料'
    }
  }, {
    path: 'auth',
    name: 'customerAuth',
    component: () => import('@/pages/customer/share/customer-auth'),
    meta: {
      depth: 0,
      auth: false,
      background: '#fff'
    }
  }, {
    path: 'encrypt',
    name: 'customerEncrypt',
    component: () => import('@/pages/customer/share/customer-encrypt'),
    meta: {
      depth: 1,
      auth: false,
      back: false,
      title: '加密图片资料'
    }
  }, {
    path: 'record',
    name: 'customerRecord',
    component: () => import('@/pages/customer/record/customer-record'),
    meta: {
      depth: 3,
      title: '访问记录'
    }
  }, {
    path: 'record/add',
    name: 'customerRecordAdd',
    component: () => import('@/pages/customer/record/customer-record-add'),
    meta: {
      depth: 4,
      title: '新增访问记录',
      icon: 'hl-icon-close',
      background: '#fff'
    }
  }]
}
