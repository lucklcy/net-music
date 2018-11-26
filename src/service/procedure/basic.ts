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
  },
  // 调用此接口 , 可获取推荐歌单
  {
    subUrl: '/personalized',
    name: 'getPersonalized',
    method: REQUEST_METHOD_MAP.GET
  },
  // 调用此接口 , 可获取推荐新音乐
  {
    subUrl: '/personalized/newsong',
    name: 'getPersonalizedNewSong',
    method: REQUEST_METHOD_MAP.GET
  },
  // 获取用户歌单
  {
    subUrl: '/user/playlist',
    name: 'getUserPlayList',
    method: REQUEST_METHOD_MAP.GET
  },
  // 登陆后调用此接口 , 传入用户 id, 可获取用户播放记录
  {
    subUrl: '/user/record',
    name: 'getUserPlayRecord',
    method: REQUEST_METHOD_MAP.GET
  },
  // 调用此接口 , 可获取推荐电台
  {
    subUrl: '/personalized/djprogram',
    name: 'getDjprogram',
    method: REQUEST_METHOD_MAP.GET
  },
  // 调用此接口 , 可获取推荐电台
  {
    subUrl: '/program/recommend',
    name: 'getProgramRecommend',
    method: REQUEST_METHOD_MAP.GET
  }
]
