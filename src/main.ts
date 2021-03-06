import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import 'normalize.css'
import '@/assets/scss/common.scss'
import FastClick from 'fastclick'
import '@/filters'
import initPromise from '@/common/initLogin'
import '@/assets/icons/index'

// 兼容毒瘤ios的300ms延迟问题
if ('addEventListener' in document) {
  document.addEventListener(
    'DOMContentLoaded',
    () => (FastClick as any).attach(document.body),
    false
  )
}

Vue.config.productionTip = false

initPromise.then(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
