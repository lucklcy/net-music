import Vue from 'vue'
// 处理返回值为空的情况【'' , null】
Vue.filter('dealEmpty', (val: any, replaceMent = '--', suffix = '', withZero = false) => {
  if (withZero) {
    return val === '' || val === 0 || val === null || val === undefined ? replaceMent : val + suffix
  } else {
    return val === '' || val === null || val === undefined ? replaceMent : val + suffix
  }
})
