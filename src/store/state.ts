import { IPlaySong, Indicator, UserInfo } from '@/common/interface/base.ts'

export const PLAYING_MODE = {
  SEQUENCE: 'sequence',
  LOOP: 'loop',
  RANDOM: 'random',
  CYCLE: 'cycle'
}

export const FOOT_BAR_STATUS = {
  MUSIC: { icon: 'net-music', name: '音乐' },
  VIDEO: { icon: 'net-video', name: '视频' },
  MY: { icon: 'net-my', name: '我的' },
  FRIENDS: { icon: 'net-friends', name: '朋友' },
  ACCOUNT: { icon: 'net-account', name: '账号' }
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
  footBarStatus: string
  showSongList: boolean
  currentSongListId: number
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
  currentSong: { id: 0, name: '', picUrl: '', songer: '', duration: 0 },
  playing: false,
  fullScreen: true,
  currentIndex: -1,
  mode: PLAYING_MODE.SEQUENCE,
  footBarStatus: FOOT_BAR_STATUS.MUSIC.icon,
  showSongList: false,
  currentSongListId: 0
}

export default stateData
