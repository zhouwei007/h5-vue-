const SETTING = {
  DEBUG: false && process.env.VUE_APP_DEBUG === 'enable',
  ERROR_SILENT: false,
  WECHAT_TITLE: '维客易',
  WECHAT_DESCRIPTION: '财富自由之路就从加入我们开始！',
  SENSORS_PROJECT: process.env.VUE_APP_SENSORS,
  QUERY_INTERVAL: 1000,
  QRCODE_API_URL: 'https://events.souyidai.com/connect/qrCode',
  LS_INVITE_RELOAD_KEY: 'saas_yjj_invite',
  LS_WECHAT_RELOAD_KEY: 'saas_yjj_wechat',
  BS_WECHAT_DEBUG: 'wechat_debug_saas',
  BS_ERROR_MESSAGE_KEY: 'partner_loan_saas',
  BS_PASSWORD_PUBLIC: 'saas_passport',
  BS_BANK_KEY: 'bank_partner_saas',
  BS_MARRIAGE_KEY: 'marstatus_saas',
  BS_RECOMMEND_CITY_KEY: 'recommend_city_saas',
  BS_LOAN_PERIODS_KEY: 'loan_periods_house_h5_saas',
  BS_COUNTER_LOAN_PERIODS_KEY: 'counter_loan_period_saas',
  BS_COUNTER_BASE_RATE_KEY: 'counter_loan_base_rate_saas',
  BS_COUNTER_LOAN_RATE_KEY: 'counter_loan_rate_saas',
  BS_HOUSE_CITY_KEY: 'houselocation_saas',
  BS_HOUSE_PAY_TYPE_KEY: 'pay_type_saas',
  BS_CUSTOMER_TYPE_KEY: 'customer_type_saas',
  BS_PROFILE_BUTTON_KEY: 'saas_profile_button',
  BS_PRODUCT_CITY_KEY: 'target_city_saas',
  BS_PRODUCT_RATE_TYPE_KEY: 'saas_fund_rate_type'
}

export default SETTING
