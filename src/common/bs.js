import Utils from 'common/utils'

class BS {
  constructor () {
    this.url = 'https://yun.huli.com/bs/js'
    this.codes = null
    this.codesAll = null
    this.areaCode = null
    this.defaultFilter = {
      include: null,
      exclude: null,
      sn: null,
      zhSpell: null,
      zhSpellShort: null,
      status: 1
    }
  }

  async getValue (key, value = null) {
    const data = (await this.getCode())[key] || {}
    return value !== null ? (data[value] || null) : data
  }

  async getOptions (key, filter = {}) {
    let data = (await this.getCodeAll())[key]
    if (!data) {
      return []
    } else {
      data = data.items
    }
    const validate = []
    filter = { ...this.defaultFilter, ...filter }
    filter.include !== null && validate.push(item => item.codeName.includes(filter.include))
    filter.exclude !== null && validate.push(item => !item.codeName.includes(filter.exclude))
    filter.sn !== null && validate.push(item => item.sn === filter.sn)
    filter.zhSpell !== null && validate.push(item => item.zhSpell && item.zhSpell.includes(filter.zhSpell))
    filter.zhSpellShort !== null && validate.push(item => item.zhSpellShort && item.zhSpellShort.includes(filter.zhSpellShort))
    filter.status !== null && validate.push(item => item.status === filter.status)
    return Object.values(data)
      .sort((a, b) => a.sn - b.sn)
      .reduce((result, item) => {
        for (const fn of validate) {
          if (!fn(item)) {
            return result
          }
        }
        result.push({
          label: item.codeName,
          value: item.codeValue
        })
        return result
      }, [])
  }

  async getCode () {
    const codes = this.codes || (await this._getScript('codeset.js', 'codes'))
    return codes
  }

  async getCodeAll () {
    const codes = this.codesAll || (await this._getScript('codeset-obj.js', 'codesAll'))
    return codes
  }

  async getAreaCode () {
    const codes = this.areaCode || (await this._getScript('areacode.js', 'areaCode'))
    return codes
  }

  _getScript (file, prop) {
    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.src = `${this.url}/${file}?t=${Utils.randString()}`
    document.body.appendChild(script)
    return new Promise(resolve => {
      script.onload = () => {
        this[prop] = window[prop]
        window[prop] = void 0
        document.body.removeChild(script)
        resolve(this[prop])
      }
      script.onerror = () => {
        resolve({})
      }
    })
  }
}

export default new BS()
