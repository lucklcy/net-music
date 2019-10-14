import { IPlaySong, Indicator, UserInfo } from '@/common/interface/base.ts'

export const PLAYING_MODE = {
  LOOP: 'loop',
  RANDOM: 'random',
  CYCLE: 'cycle'
}

export const FOOT_BAR_STATUS = {
  MUSIC: { icon: 'net-music', name: '音乐', code: 'music' },
  VIDEO: { icon: 'net-video', name: '视频', code: 'video' },
  MY: { icon: 'net-my', name: '我的', code: 'my' },
  FRIENDS: { icon: 'net-friends', name: '朋友', mcode: 'friends' },
  ACCOUNT: { icon: 'net-account', name: '账号', code: 'account' }
}

export interface State {
  indicator: Indicator
  userInfo: UserInfo
  playList: IPlaySong[]
  currentSong: IPlaySong
  playing: boolean
  fullScreen: boolean
  currentIndex: number
  mode: string
  footTab: string
  showSongList: boolean
  currentSongListId: number
  tableCat: string
  hotTableCat: string
  // 当前歌单的背景图url
  currentSongListBackgroundUrl: string
  iosAudioTrigger: boolean
  likedSongList: number[]
  changeSongLikeInfo: IPlaySong
}

// 初始状态
const stateData: State = {
  indicator: { text: '正在加载...', tip: '', visible: false },
  userInfo: {
    nickname: '',
    userId: 0,
    avatarUrl: '',
    backgroundUrl: ''
  },
  playList: [],
  currentSong: { id: 0, name: '', picUrl: '', songer: '', duration: 0, liked: false },
  playing: false,
  fullScreen: true,
  currentIndex: -1,
  mode: PLAYING_MODE.LOOP,
  footTab: FOOT_BAR_STATUS.MUSIC.code,
  showSongList: false,
  currentSongListId: 0,
  // 当前歌单类型
  tableCat: '',
  // 当前精品歌单类型
  hotTableCat: '',
  currentSongListBackgroundUrl: '',
  iosAudioTrigger: false,
  likedSongList: [],
  changeSongLikeInfo: { id: 0, name: '', picUrl: '', songer: '', duration: 0, liked: false }
}

export default stateData
