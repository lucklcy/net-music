import axios from 'axios'
import { SUCCESS_STATUS_CODE } from '@/common/const'
import { REQUEST_METHOD_MAP } from '../common/const'
import basic from './procedure/basic'

const services = [...basic]

const defaultConfig = {
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  module: '',
  timeout: 10000,
  validateStatus: (status: number) => {
    return true
  },
  withCredentials: true
}

const innerHttp = axios.create(defaultConfig)

// 添加请求拦截器
innerHttp.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // 对请求错误做些什么
    console.log({ error })
    Promise.reject(error)
  }
)

innerHttp.interceptors.response.use(
  response => {
    const { data: res, status: httpStatus, config } = response
    if (httpStatus === SUCCESS_STATUS_CODE) {
      // http status 为 200，表示正确响应
      return Promise.resolve(res)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器出现问题，无法给予正确的响应
  error => {
    console.log({ error })
    Promise.reject(error)
  }
)

export interface HttpService {
  [propName: string]: (params: { [propName: string]: any } | {}) => { [key: string]: any } // Add index signature
}

const apis: HttpService = {}
services.forEach(item => {
  const { subUrl, name, method } = item
  apis[name] = (params: { [propName: string]: any } | {}) => {
    if (method === REQUEST_METHOD_MAP.POST) {
      return innerHttp.post(subUrl, params || {})
    }
    return innerHttp.get(subUrl, { params } || {})
  }
})

export default apis
