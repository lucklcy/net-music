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
  },
  // 说明 : 歌单能看到歌单名字 , 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可 以获取对应歌单内的所有的音乐
  {
    subUrl: '/playlist/detail',
    name: 'getPlayListDetail',
    method: REQUEST_METHOD_MAP.GET
  },
  // 使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url, 调用此接口 , 传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url( 不需要登录 )
  // 必选参数 : id : 音乐 id
  // 可选参数 : br: 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
  // 调用例子 : /song/url?id=33894312 /song/url?id=405998841,33894312
  {
    subUrl: '/song/url',
    name: 'getSongUrl',
    method: REQUEST_METHOD_MAP.GET
  }
]
