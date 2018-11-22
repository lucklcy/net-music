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
 * merge对象
 * @param {*} target
 */
export const merge = (target: { [propNmae: string]: any }) => {
  for (let i = 1, j = arguments.length; i < j; i++) {
    const source = arguments[i] || {}
    for (const prop in source) {
      if (source.hasOwnProperty(prop)) {
        const value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }
  return target
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
 * 判断传入的所有值是否全为假
 * @param  {...any} args 参数列表
 */
export const isAllFalse = (...args: any) => {
  for (let i = 0; i < args.length; i++) {
    if (args[i]) {
      return false
    }
  }
  return true
}

/**
 * 判断传入的所有值是否全为真
 * @param  {...any} args 参数列表
 */
export const isAllTrue = (...args: any) => {
  for (let i = 0; i < args.length; i++) {
    if (!args[i]) {
      return false
    }
  }
  return true
}

/**
 * 判断传入的所有值是否全为空值
 * @param  {...any} args 参数列表
 */
export const isAllEmpty = (...args: any) => {
  for (let i = 0; i < args.length; i++) {
    if (!isEmpty(args[i])) {
      return false
    }
  }
  return true
}

/**
 * 判断传入的所有值是否全不为空值
 * @param  {...any} args 参数列表
 */
export const isAllNotEmpty = (...args: any) => {
  for (let i = 0; i < args.length; i++) {
    if (isEmpty(args[i])) {
      return false
    }
  }
  return true
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

// 字符串repeat
export const stringRepeat = (sourceString: string, count: number) => {
  /* eslint-disable */
  'use strict'
  if (sourceString == null) {
    throw new TypeError(`can't convert  + ${sourceString} +  to object`)
  }
  let str = '' + sourceString
  count = +count
  if (count !== count) {
    count = 0
  }
  if (count < 0) {
    throw new RangeError('repeat count must be non-negative')
  }
  if (count === Infinity) {
    throw new RangeError('repeat count must be less than infinity')
  }
  count = Math.floor(count)
  if (str.length === 0 || count === 0) {
    return ''
  }
  // 确保 count 是一个 31 位的整数。这样我们就可以使用如下优化的算法。
  // 当前（2014年8月），绝大多数浏览器都不能支持 1 << 28 长的字符串，所以：
  if (str.length * count >= 1 << 28) {
    throw new RangeError('repeat count must not overflow maximum string size')
  }
  let rpt = ''
  for (;;) {
    if ((count & 1) === 1) {
      rpt += str
    }
    count >>>= 1
    if (count === 0) {
      break
    }
    str += str
  }
  return rpt
  /* eslint-enable */
}

export const padStart = (sourceString: string, targetLength: number, padString = ' ') => {
  padString = typeof padString === 'string' ? padString : String(padString)
  targetLength = targetLength >> 0
  if (sourceString.length > targetLength) {
    return sourceString
  } else {
    targetLength = targetLength - sourceString.length
    if (targetLength > padString.length) {
      padString += stringRepeat(padString, targetLength / padString.length)
    }
    return padString.slice(0, targetLength) + sourceString
  }
}

export const padEnd = (sourceString: string, targetLength: number, padString = ' ') => {
  padString = typeof padString === 'string' ? padString : String(padString)
  targetLength = targetLength >> 0
  if (sourceString.length > targetLength) {
    return sourceString
  } else {
    targetLength = targetLength - sourceString.length
    if (targetLength > padString.length) {
      padString += stringRepeat(padString, targetLength / padString.length)
    }
    return sourceString + padString.slice(0, targetLength)
  }
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
      strArr[1] = padEnd('', digits, '0')
    } else {
      if (strArr[1].length > digits) {
        strArr[1] = strArr[1].substr(0, digits)
      } else {
        strArr[1] = padEnd(strArr[1], digits, '0')
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
 * 判断变量是否为对象
 * @param {变量} val
 */
export const isObject = (val: any) => {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * 判断变量是否为数组
 * @param {变量} val
 */
export const isArray = (val: any) => {
  return Object.prototype.toString.call(val) === '[object Array]'
}

/**
 * 判断变量是否为数字
 * @param {变量} val
 */
export const isNumber = (val: any) => {
  return Object.prototype.toString.call(val) === '[object Number]'
}

/**
 * 判断变量是否为undefined
 * @param {变量} val
 */
export const isUndefined = (val: any) => {
  return Object.prototype.toString.call(val) === '[object Undefined]'
}

/**
 * 判断变量是否为字符串
 * @param {变量} val
 */
export const isString = (val: any) => {
  return Object.prototype.toString.call(val) === '[object String]'
}

/**
 * 判断变量是否为函数
 * @param {变量} val
 */
export const isFunction = (val: any) => {
  return Object.prototype.toString.call(val) === '[object Function]'
}

/**
 * 判断变量是否为正则表达式
 * @param {变量} val
 */
export const isRegExp = (val: any) => {
  return Object.prototype.toString.call(val) === '[object RegExp]'
}

/**
 * 判断变量是否为boolean类型
 * @param {变量} val
 */
export const isBoolean = (val: any) => {
  return Object.prototype.toString.call(val) === '[object Boolean]'
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
 * 获取当前url【不含hash】
 */
export const getCurrentPath = () => {
  const idx = location.href.indexOf('#/')
  return idx > 0 ? location.href.substring(0, idx) : location.href
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

/**
 * 在array中查找元素，找到这返回该元素，否则返回null
 * @param {列表数组} list
 * @param {key值} key
 * @param {value值} val
 */
export const findFirstInArray = (list: any[], key: string, val: any) => {
  let returnObj = null
  if (list && list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item[key] === val || (key === null && item === val)) {
        returnObj = item
        break
      }
    }
  }
  return returnObj
}

export const formatAndRetainTwoDecimal = (amount: string | number) => {
  if (isEmpty(amount)) {
    return 0
  }
  const cuttedNumber = cutNumber(amount, 2)
  return formatNumber(cuttedNumber)
}
