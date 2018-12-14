// state
export interface IPlaySong {
  id: number
  name: string
  picUrl: string
  songer: string
  duration: number
}

export interface ICreator {
  avatarUrl: string
  birthday: number
  nickname: string
  userId: number
  city: number
  province: number
  backgroundUrl?: string
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

export interface IDJPrograms {
  id: number
  picUrl: string
  name: string
  copywriter: string
  [propName: string]: any
}

export interface IPrograms {
  id: number
  coverUrl: string
  name: string
  description: string
  [propName: string]: any
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

// 歌曲详情
export interface ISongDetail {
  id: number
  url: string
}

export interface ISongLyric {
  code: number
  lrc: { lyric: string; version: number }
  lyricUser: { id: number; nickname: string; userid: number; uptime: number }
  nolyric?: boolean
}

export interface ITouch {
  initiated: boolean
  moved: boolean
  startX: number
  startY: number
  percent: number
  left: number
}

export interface IPlayList {
  createTime: number
  creator: ICreator
  copywriter?: string
  coverImgUrl: string
  description: string
  name: string
  playCount: number
  shareCount: number
  trackCount: number
  updateTime: number
  userId: number
  tags: string[]
  [propName: string]: any
}

export interface ISongRecommandList {
  id: number
  picUrl: string
  copywriter: string
  name: string
  [propName: string]: any
}
