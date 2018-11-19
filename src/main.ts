import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import 'normalize.css'
import '@/assets/scss/common.scss'
import FastClick from 'fastclick'

// 兼容毒瘤ios的300ms延迟问题
if ('addEventListener' in document) {
  document.addEventListener(
    'DOMContentLoaded',
    () => (FastClick as any).attach(document.body),
    false
  )
}
// 调用接口封装
import api from '@/service'

Vue.config.productionTip = false

// 将调用接口的函数扩展到每个组件中
Vue.prototype.$http = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
