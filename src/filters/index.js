// 全局filter定义在这里
import Vue from 'vue'
import FLOAT from '@/utils/float'
import { isEmpty, cutNumber, formatNumber, padStart, formatAndRetainTwoDecimal } from '@/utils'

/**
 * 将金额格式化 e.g. 1111111 => 1,111,111, 1111111.11 => 1,111,111.11
 */
Vue.filter('formatNumber', formatNumber)

/**
 * 金额格式化并保留两位小数【截断】
 */
Vue.filter('formatAndRetainTwoDecimal', formatAndRetainTwoDecimal)

/**
 * 金额格式化并保留两位小数【截断】
 * 去除空值
 * 增加前缀，默认为'¥'
 */
Vue.filter('formatAndRetainTwoDecimalWithoutNull', (amount, prefix = '¥') => {
  if (amount === 0 || amount === null || amount === undefined) {
    return ''
  }
  let cuttedNumber = cutNumber(amount, 2)
  return `${prefix}${formatNumber(cuttedNumber)}`
})

// 转换为整数
Vue.filter('turnToInteger', val => {
  return val && Math.round(val)
})

/*
* 日期处理
*/
Vue.filter('daysToMonth', val => {
  if (isEmpty(val)) {
    return 0
  }
  let month = Math.floor((val - 1) / 30)
  return month
})

/**
 * digits 保留小数的小数位数
 * 转百分数 e.g. 0.123 => 12.3
 */
Vue.filter('transformPercent', (val, digits) => {
  return val && parseFloat(val) ? FLOAT.multiply(val, 100).toFixed(digits) : 0
})
/**
 * digits 保留小数的小数位数
 * 转千分数 e.g. 0.001 => 1
 */
Vue.filter('transformThousand', (val, digits) => {
  return val && parseFloat(val) ? FLOAT.multiply(val, 1000).toFixed(digits) : 0
})

/**
 * digits 保留小数的小数位数
 * 转xx万 e.g. 100000 => 10
 */
Vue.filter('transformMillion', (val, digits) => {
  return val && parseFloat(val) ? FLOAT.divide(val, 10000).toFixed(digits) : 0
})

/**
 * 日期格式化，传入毫秒格式化
 */
Vue.filter('dateFormat', formatDate)

/**
 * 日期格式化，传入秒格式化
 */
Vue.filter('dateFormatS', (val, format) => {
  return formatDate(val * 1000, format)
})

function formatDate(val, format) {
  var deFormat, theDate, month, year, date, hours, mins, seconds
  var formats = {
    LLLL: function() {
      return `${year}年${month}月${date}日  ${hours}:${mins}`
    },
    LLL: function() {
      return `${year}年${month}月${date}日`
    },
    llll: function() {
      return `${year}.${month}.${date}  ${hours}:${mins}`
    },
    lll: function() {
      return `${year}.${month}.${date}`
    },
    LL: function() {
      return `${month}月${date}日`
    },
    mm: function() {
      return `${hours}:${mins}`
    },
    Lll: function() {
      return `${year}-${month}-${date}`
    },
    Ll: function() {
      return `${year}-${month}`
    },
    Llls: function() {
      return `${year}/${month}/${date}`
    },
    Lllss: function() {
      return `${year}/${month}/${date} ${hours}:${mins}:${seconds}`
    },
    Lllmm: function() {
      return `${year}-${month}-${date}  ${hours}:${mins}`
    },
    hhmm: function() {
      return `${hours}:${mins}`
    }
  }
  if (!val && typeof val !== 'number') {
    return ''
  }
  deFormat = format || 'LLL'
  theDate = new Date(val)
  year = theDate.getFullYear()
  month = padStart(String(theDate.getMonth() + 1), 2, '0')
  date = padStart(String(theDate.getDate()), 2, '0')
  hours = padStart(String(theDate.getHours()), 2, '0')
  mins = padStart(String(theDate.getMinutes()), 2, '0')
  seconds = padStart(String(theDate.getSeconds()), 2, '0')
  return formats[deFormat]()
}

// 处理返回值为空的情况【'' , null】
Vue.filter('dealEmpty', (val, replaceMent = '--', suffix = '', withZero = false) => {
  if (withZero) {
    return val === '' || val === 0 || val === null || val === undefined ? replaceMent : val + suffix
  } else {
    return val === '' || val === null || val === undefined ? replaceMent : val + suffix
  }
})

// 超长截断
Vue.filter('limitIn', (val, limitLength = 20, ellipsis = '...', nullReplacer = '***') => {
  if (val === '' || val === null || val === undefined) {
    return nullReplacer
  } else if (val.length > limitLength) {
    return val.substring(0, limitLength - 1) + ellipsis
  }
  return val
})

// 手机号部分隐藏
Vue.filter('shodowStr', (val, front = 4, behind = 3, replaceStr = '***') => {
  if (isEmpty(val)) {
    return ''
  } else if (val.length <= front + behind) {
    return val
  } else {
    return val.substr(0, front) + replaceStr + val.substr(-behind)
  }
})

/**
 * 截取小数位数
 * val:小数值 digits:保留的小数位数
 */
Vue.filter('cutNumber', cutNumber)
