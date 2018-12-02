import _ from 'lodash'
// common方法定义在这里
const urlRegExp: RegExp = /^((https?:)?\/\/)/

/**
 * 生成uuid，以作临时id用
 * @param {生成的uuid的长度} len
 * @param {随机的字符范围}} radix
 * @returns 返回uuid字符串
 */
export const uuid = (len: number, radix: number) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const result = []
  let i = 0
  let r = 0
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) {
      result[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    result[8] = result[13] = result[18] = result[23] = '-'
    result[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!result[i]) {
        r = 0 | (Math.random() * 16)
        result[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return result.join('')
}

/**
 * 加载图片promise版本
 * @param {加载图片的url地址} url
 * @returns 返回promise对象
 */
export const preloadImg = (url: string) => {
  return new Promise(resolve => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      resolve()
    }
  })
}

/**
 * 转换querystring为对象并返回该对象
 */
export const getUrlParams = () => {
  let query = ''
  if (location.hash.split('?')[1]) {
    query = location.hash.split('?')[1]
  }
  const queryObj: { [propName: string]: string } = {}
  if (query) {
    const splitArr = query.split('&')
    if (splitArr.length) {
      for (const queryStr of splitArr) {
        const strArr = queryStr.split('=')
        if (strArr[0] !== undefined && strArr[0] !== null) {
          queryObj[strArr[0]] = strArr[1] || ''
        }
      }
    }
  }
  return queryObj
}
/**
 * 将对象转换为queryString
 * @param {要转换为queryString的对象} obj
 */
export const createSearch = (obj: { [propName: string]: any }) => {
  let search = ''
  if (typeof obj === 'object' && !(obj instanceof Array)) {
    const array = []
    for (const key of Object.keys(obj)) {
      array.push({
        key,
        value: obj[key]
      })
    }
    if (array.length === 0) {
      return search
    }
    for (let i = 0; i < array.length; i++) {
      const str = i === 0 ? '?' : '&'
      search += str + array[i].key + '=' + array[i].value
    }
  }
  return search
}

/**
 * 获取字符数，1个中文=2个英文字符，标点为一个英文字符
 * @param {传入的字符串} str
 */
export const getStrLength = (str: string) => {
  const value = str
  let length = value.length
  if (length > 0) {
    for (let i = 0; i < length; i++) {
      const valueSubstr = value.substr(i, 1) // 截取字符串
      const valueEscape = escape(valueSubstr) // 编码
      if (valueEscape.indexOf('%u') > -1) {
        length++
      } // 是否搜索到指定字符串
    }
  }
  return length
}

/**
 * 判断值是否为空
 * @param {要判断的值} val
 * @param {0是否为空}} isZeroNull
 * @returns Boolean
 */
export const isEmpty = (val: any, isZeroNull: boolean = false) => {
  return val === '' || val === null || val === undefined || (isZeroNull && val === 0)
}
/**
 * 判断对象是否非空
 * @param {要判断的值} val
 * @param {0是否为空} isZeroNull
 */
export const isNotEmpty = (val: any, isZeroNull: boolean = false) => {
  return !isEmpty(val, isZeroNull)
}

/**
 * 数字保留*位小数，返回相应位数小数的字符串
 * @param {要保留位数的值，可以为数字或者数字字符串} val
 * @param {要保留的小数位数，整型} digits
 */
export const cutNumber = (val: number | string, digits: number) => {
  if (isEmpty(val)) {
    return 0
  } else {
    if (Number.isInteger(val as number)) {
      return (val as number).toFixed(digits)
    }
    const strVal = String(val)
    const strArr = strVal.split('.')
    if (strArr.length === 1) {
      strArr[1] = _.padEnd('', digits, '0')
    } else {
      if (strArr[1].length > digits) {
        strArr[1] = strArr[1].substr(0, digits)
      } else {
        strArr[1] = _.padEnd(strArr[1], digits, '0')
      }
    }
    return strArr.join('.')
  }
}
/**
 * 数字格式化
 * @param {要格式话的数字} amount
 */
export const formatNumber = (amount: number | string) => {
  if (!amount) {
    return 0
  }
  const isNegative = String(amount).indexOf('-') === 0
  amount = isNegative ? String(amount).substring(1, String(amount).length) : amount
  const iAmount = String(amount).split('.')[0]
  const dAmount = String(amount).split('.')[1]
  const reversedAmount = iAmount.split('').reverse()
  const computedArr = []
  for (let i = 0; i < reversedAmount.length; i++) {
    computedArr.unshift(reversedAmount[i])
    if (i % 3 === 2 && i !== reversedAmount.length - 1) {
      computedArr.unshift(',')
    }
  }
  const returnStr = computedArr.join('') + (dAmount ? '.' + dAmount : '')
  return isNegative ? '-' + returnStr : returnStr
}

/**
 * 判断字符串是否为合法的url
 * @param {url字符串} str
 */
export const isValidUrl = (str: string) => {
  return urlRegExp.test(str)
}

/**
 * 判断字符串是否为路由path
 * @param {变量} str
 */
export const isUrlPath = (str: string) => {
  return !isValidUrl(str) && str.indexOf('/') === 0
}

/**
 * 判断对象是否为空对象
 * @param {对象} e
 */
export const isEmptyObject = (e: { [propName: string]: any }) => {
  return Object.keys(e).length === 0
}

/**
 * 用来定位输入框中光标的位置
 * @param {目标dom元素} tobj
 * @param {位置值} spos
 */
export const loactionInput = (tobj: HTMLInputElement, spos: number) => {
  if (spos < 0) {
    spos = tobj.value.length
  }
  if (tobj.setSelectionRange) {
    // 兼容火狐,谷歌
    setTimeout(() => {
      tobj.setSelectionRange(spos, spos)
      tobj.focus()
    }, 0)
  }
}

export const formatAndRetainTwoDecimal = (amount: string | number) => {
  if (isEmpty(amount)) {
    return 0
  }
  const cuttedNumber = cutNumber(amount, 2)
  return formatNumber(cuttedNumber)
}

enum STORAGETYPE {
  SESSION = 'session',
  LOCAL = 'local'
}

export const srorageSet = (key: string, val: any, storageType: string = STORAGETYPE.LOCAL) => {
  switch (storageType) {
    case STORAGETYPE.SESSION:
      window.sessionStorage.setItem(key, JSON.stringify(val))
      break
    case STORAGETYPE.LOCAL:
      window.localStorage.setItem(key, JSON.stringify(val))
      break
    default:
      window.localStorage.setItem(key, JSON.stringify(val))
      break
  }
}

export const srorageGet = (key: string, storageType: string = STORAGETYPE.LOCAL) => {
  let returnObj: any
  switch (storageType) {
    case STORAGETYPE.SESSION:
      const sessionVal = window.sessionStorage.getItem(key)
      if (sessionVal !== null) {
        returnObj = JSON.parse(sessionVal)
      } else {
        returnObj = sessionVal
      }
    case STORAGETYPE.LOCAL:
      const localVal = window.localStorage.getItem(key)
      if (localVal !== null) {
        returnObj = JSON.parse(localVal)
      } else {
        returnObj = localVal
      }
      break
    default:
      const defaultVal = window.localStorage.getItem(key)
      if (defaultVal !== null) {
        returnObj = JSON.parse(defaultVal)
      } else {
        returnObj = defaultVal
      }
      break
  }
  return returnObj
}
