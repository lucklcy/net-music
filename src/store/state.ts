export interface ICreator {
  avatarUrl: string
  birthday: number
  nickname: string
  userId: number
  city: number
  province: number
  [propName: string]: any
}

export interface IAl {
  id: number
  name: string
  pic: number
  picUrl: string
  [propName: string]: any
}

export interface IArtist {
  id: number
  name: string
  [propName: string]: any
}

export interface ITrack {
  id: number
  al: IAl
  ar: IArtist[]
  dt: number
  name: string
}

export interface IPlaylist {
  creator: ICreator
  tracks: ITrack[]
  coverImgUrl: string
  createTime: number
  description: string
  name: string
  [propName: string]: any
}

export interface Indicator {
  text: string
  tip?: string
  visible: boolean
}

export interface UserInfo {
  nickname: string
  userId: number
  avatarUrl: string
  backgroundUrl: string
  [propName: string]: any
}

export interface IPlaySong {
  id: number
  name: string
  picUrl: string
  songer: string
  duration: number
}

export const PLAYING_MODE = {
  SEQUENCE: 'sequence',
  LOOP: 'loop',
  RANDOM: 'random',
  CYCLE: 'cycle'
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
  mode: PLAYING_MODE.SEQUENCE
}

export default stateData
