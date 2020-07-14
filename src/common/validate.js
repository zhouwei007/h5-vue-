export const validateReg = {
  none: /^[\s\S]+$/,
  number: /^\d+$/,
  positiveInteger: /^[1-9]\d{0,7}$/,
  float: /^[0-9]+(\.?[0-9]*)$/,
  money: /^[0-9]+(\.([0-9]){0,2})?$/,
  name: /^[a-zA-Z\u4e00-\u9fa5].*$/,
  email: /^([a-zA-Z0-9_-])+@(([a-zA-Z0-9_-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  mobile: /^1\d{10}$/,
  password: /^(?=.*[0-9].*)(?=.*[A-Za-z].*).{8,20}$/,
  idcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
  bankcard: /^\d{12,22}$/
}

const validateMessage = {
  none: '内容不能为空',
  number: '请输入数字',
  positiveInteger: '请输入正整数',
  float: '请输入数字',
  money: '请输入正确的金额',
  name: '请以汉字或字母做为首字符',
  email: '请输入正确的邮箱地址',
  mobile: '请输入正确的手机号码',
  password: '密码长度需8-20位，至少包含数字和字母',
  idcard: '请输入正确的身份证号',
  bankcard: '请输入正确的银行卡卡号'
}

class Validate {
  constructor (config) {
    this.regs = config
  }

  test (data, rules) {
    for (const key of Object.keys(rules)) {
      const value = data[key]
      for (const rule of rules[key]) {
        if (rule.boolean !== void 0 && rule.boolean !== value) {
          return {
            result: false,
            message: rule.message
          }
        }
        if (Array.isArray(value) &&
          ((typeof rule.min === 'number' && value.length < rule.min) ||
          (typeof rule.max === 'number' && value.length > rule.max))) {
          return {
            result: false,
            message: rule.message
          }
        }
        const isNone = [null, undefined].includes(value) || (value.trim && !value.trim().length)
        if (rule.required !== false && isNone) {
          return {
            result: false,
            message: rule.message || validateMessage.none
          }
        }
        if (!isNone && rule.validator &&
          this.regs[rule.validator] &&
          !this.regs[rule.validator].test(value)) {
          return {
            result: false,
            message: rule.message || validateMessage[rule.validator]
          }
        }
      }
    }
    return {
      result: true
    }
  }
}

export default new Validate(validateReg)
