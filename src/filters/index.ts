import Vue from 'vue'
import { getStrLength } from '@/utils'
// 处理返回值为空的情况【'' , null】
Vue.filter('dealEmpty', (val: any, replaceMent = '--', suffix = '', withZero = false) => {
  if (withZero) {
    return val === '' || val === 0 || val === null || val === undefined ? replaceMent : val + suffix
  } else {
    return val === '' || val === null || val === undefined ? replaceMent : val + suffix
  }
})

// 处理字数超过的情形
Vue.filter('limitIn', (val: any, limit: number) => {
  if (getStrLength(val) <= limit) {
    return val
  } else {
    return `${val.substring(0, limit - 1)}...`
  }
})

// 处理歌曲收听人数
Vue.filter('dealWithPlayCount', (val: number) => {
  if (val < 9999) {
    return val
  } else {
    return `${Math.floor(val / 10000)}万`
  }
})

// 处理返回值为空的情况【'' , null】
Vue.filter(
  'dealEmpty',
  (val: any, replaceMent = '--', suffix = '', withZero = false, hasData = false) => {
    if (withZero) {
      if (hasData) {
        return val === '' || val === 0 || val === null || val === undefined
          ? replaceMent
          : val + suffix
      } else {
        return val === '' || val === 0 || val === null || val === undefined || val === '0.00'
          ? replaceMent
          : val + suffix
      }
    } else {
      return val === '' || val === null || val === undefined ? replaceMent : val + suffix
    }
  }
)
