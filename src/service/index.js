import axios from 'axios'
import getMsgByStatus from '@/common/codeMsg'
import NetworkErrorWindow from '@/components/foundation/networkError'
import {
  AC_LOGIN_PREFIX_URL,
  SUCCESS_STATUS_CODE,
  NO_USER_TOKEN_STATUS_CODE_GATEWAY,
  NO_USER_TOKEN_STATUS_CODE_SERVER
} from '@/common/const'
import { isEmpty, findFirstInArray } from '@/utils'
import { REQUEST_METHOD_MAP } from '../common/const'
import basic from './procedure/basic'

let userActivitySubUrl = (findFirstInArray(core, 'name', 'backLog') || {})['subUrl']

const defaultConfig = {
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  module: '',
  timeout: 10000,
  validateStatus: function(status) {
    return true
  },
  withCredentials: true
}

function Service() {
  let services = [...basic]
  let _this = this
  let _http = axios.create(defaultConfig)

  let doBackLog = (params, module) => {
    _http.defaults['module'] = module
    _http.post(userActivitySubUrl, params)
  }

  // 添加请求拦截器
  _http.interceptors.request.use(
    config => {
      return config
    },
    error => {
      // 对请求错误做些什么
      console && console.log({ error })
      Promise.reject(error)
    }
  )

  _http.interceptors.response.use(
    response => {
      let { data: res, status: httpStatus, config } = response
      let { module, url: apiUrl } = config
      if (httpStatus === SUCCESS_STATUS_CODE) {
        // http status 为 200，表示正确响应
        let { result: code } = res
        if (code !== 0) {
          const status = code < 200 ? code : isEmpty(module) ? code : `${module}-${code}`
          const msg = getMsgByStatus(status)
          if (msg) {
            res.resultMessage = msg
          }
        }
        if (code === -1) {
          return Promise.reject(res)
        } else {
          return Promise.resolve(res)
        }
      } // eslint-disable-line
      else if (
        httpStatus === NO_USER_TOKEN_STATUS_CODE_GATEWAY ||
        httpStatus === NO_USER_TOKEN_STATUS_CODE_SERVER
      ) {
        // http status 为 400 表示未登录
        const url = encodeURIComponent(window.location.href)
        const t = new Date().getTime()
        top.location.href = `${AC_LOGIN_PREFIX_URL}?redirect=${url}&activityId=${
          process.env.VUE_APP_AC_ID
        }&timestamp=${t}`
      } else {
        // 其他http status 的处理
        if (apiUrl.indexOf('?') !== -1) {
          apiUrl = apiUrl.substr(0, apiUrl.indexOf('?'))
        }
        // 如果接口异常，则记录后端埋点 ，对于后端埋点接口的异常不做处理
        if (apiUrl !== `/api${userActivitySubUrl}`) {
          let backLogParams = {
            eventId: 'request-error-from-server',
            content: `api:${apiUrl},response is:${JSON.stringify(res)}`
          }
          doBackLog(backLogParams, 'core')
        }
        return Promise.reject(res)
      }
    },
    // 服务器出现问题，无法给予正确的响应
    error => {
      console && console.log({ error })
      NetworkErrorWindow.open()
    }
  )

  services.forEach(item => {
    let { subUrl, name, method, module } = item
    _this[name] = params => {
      _http.defaults['module'] = module
      if (method === REQUEST_METHOD_MAP.GET) {
        return _http.get(subUrl, params || {})
      }
      if (method === REQUEST_METHOD_MAP.POST) {
        return _http.post(subUrl, params || {})
      }
    }
  })
}

export default new Service()
