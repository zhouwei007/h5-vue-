export default {
  base: '/marketing',
  routes: [{
    path: '/',
    name: 'marketing',
    component: () => import('@/pages/marketing'),
    meta: {
      depth: 0,
      auth: false
    }
  }, {
    path: '/estimate',
    name: 'estimate',
    component: () => import('@/pages/marketing/estimate'),
    meta: {
      depth: 1,
      title: '客户评估',
      back: 'marketing'
    }
  }, {
    path: '/estimate/record',
    name: 'estimateRecord',
    component: () => import('@/pages/profile/record/estimate-record'),
    meta: {
      depth: 1,
      title: '评估记录'
    }
  }, {
    path: '/estimate/detail',
    name: 'estimateDetail',
    component: () => import('@/pages/profile/record/estimate-detail'),
    meta: {
      depth: 5,
      title: '评估详情'
    }
  }, {
    path: '/query',
    name: 'query',
    component: () => import('@/pages/marketing/query'),
    meta: {
      depth: 1,
      title: '房产询值',
      back: 'marketing'
    }
  }, {
    path: '/query/record',
    name: 'queryRecord',
    component: () => import('@/pages/profile/record/query-record'),
    meta: {
      depth: 1,
      title: '询值记录'
    }
  }, {
    path: '/introduce',
    name: 'introduce',
    component: () => import('@/pages/marketing/introduce'),
    meta: {
      depth: 1,
      auth: false,
      title: '产品介绍',
      back: 'marketing'
    }
  }, {
    path: '/business',
    name: 'business',
    component: () => import('@/pages/marketing/business'),
    meta: {
      depth: 1,
      auth: false,
      title: '展业工具',
      back: 'marketing'
    }
  }, {
    path: '/business/detail',
    name: 'businessDetail',
    component: () => import('@/pages/marketing/business/business-detail'),
    meta: {
      depth: 2,
      auth: false,
      title: '展业工具'
    }
  }, {
    path: '/calculator',
    name: 'calculator',
    component: () => import('@/pages/marketing/calculator'),
    meta: {
      depth: 1,
      auth: false,
      title: '借贷计算器',
      back: 'marketing',
      background: '#fff'
    }
  }, {
    path: '/calculator/house_loan',
    name: 'calculatorHouseLoan',
    component: () => import('@/pages/marketing/calculator/calculator-house-loan'),
    meta: {
      depth: 2,
      auth: false,
      title: '房贷'
    }
  }, {
    path: '/calculator/repayment_mode',
    name: 'calculatorRepaymentMode',
    component: () => import('@/pages/marketing/calculator/calculator-repayment-mode'),
    meta: {
      depth: 2,
      auth: false,
      title: '还款方式比较'
    }
  }, {
    path: '/calculator/combined_loan',
    name: 'calculatorCombinedLoan',
    component: () => import('@/pages/marketing/calculator/calculator-combined-loan'),
    meta: {
      depth: 2,
      auth: false,
      title: '组合贷款'
    }
  }, {
    path: '/calculator/prepay',
    name: 'calculatorPrepay',
    component: () => import('@/pages/marketing/calculator/calculator-prepay'),
    meta: {
      depth: 2,
      auth: false,
      title: '提前还款'
    }
  }, {
    path: '/calculator/house_tax',
    name: 'calculatorHouseTax',
    component: () => import('@/pages/marketing/calculator/calculator-house-tax'),
    meta: {
      depth: 2,
      auth: false,
      title: '房产税'
    }
  }]
}
