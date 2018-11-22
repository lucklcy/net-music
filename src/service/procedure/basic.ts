import { REQUEST_METHOD_MAP } from '../../common/const'
export default [
  {
    subUrl: '/login/cellphone',
    name: 'login',
    method: REQUEST_METHOD_MAP.GET
  },
  {
    subUrl: '/banner',
    name: 'getBanner',
    method: REQUEST_METHOD_MAP.GET
  },
  {
    subUrl: '/recommend/resource',
    name: 'getRecommendList',
    method: REQUEST_METHOD_MAP.GET
  }
]
