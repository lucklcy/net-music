// requires and returns all modules that match
import Vue from 'vue'
import SvgIcon from '~/foundation/base/svgIcon.vue'

Vue.component('SvgIcon', SvgIcon)
const requireAll = (requireContext: __WebpackModuleApi.RequireContext) =>
  requireContext.keys().map(requireContext)

// import all svg
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
