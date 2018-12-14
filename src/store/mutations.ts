import { State } from './state'
import { isBoolean, isObject } from 'lodash'
import { IPlaySong } from '@/common/interface/base.ts'
import { UserInfo, ITrack, IArtist } from '@/common/interface/base.ts'

export interface IkeyVal {
  key: string
  val: any
}

export default {
  isLoading(state: State, val: boolean | {}): void {
    if (isBoolean(val)) {
      Object.assign(state.indicator, { text: '正在加载...', visible: val })
    } else if (isObject(val)) {
      Object.assign(state.indicator, val)
    }
  },
  setUserInfo(state: State, val: UserInfo): void {
    Object.assign(state.userInfo, val)
  },
  setPlayList(state: State, val: ITrack[]): void {
    const tempPlaySongList: IPlaySong[] = []
    if (val && val.length > 0) {
      val.forEach((innerItem: ITrack) => {
        const { id, name, dt: duration } = innerItem
        const { name: album, picUrl } = innerItem.al
        const artist = innerItem.ar
        let songer = ''
        if (artist && artist.length > 0) {
          songer = artist
            .map((artItem: IArtist) => {
              return artItem.name
            })
            .join('/')
          songer = `${album || ''}`
        }
        tempPlaySongList.push({
          id,
          name,
          picUrl,
          songer,
          duration: Math.floor((duration || 0) / 1000)
        })
      })
      state.playList = tempPlaySongList
    }
  },
  setCurrentSong(state: State, song: number): void {
    const playList: IPlaySong[] = state.playList
    if (playList && playList.length > 0 && song) {
      for (let i = 0; i < playList.length; i++) {
        const tempItem: IPlaySong = playList[i]
        if (tempItem.id === song) {
          state.currentIndex = i
          state.currentSong = tempItem
          break
        }
      }
    }
  },
  changePlayingStatus(state: State, playFlag: boolean): void {
    state.playing = playFlag
  },
  changeFullScreen(state: State, fullScreenFlag: boolean): void {
    state.fullScreen = fullScreenFlag
    if (!fullScreenFlag) {
      state.showSongList = false
    }
  },
  setCurrentIndex(state: State, index: number): void {
    state.currentIndex = index
    const playList: IPlaySong[] = state.playList
    if (playList && playList.length > 0 && index >= 0 && index < playList.length - 1) {
      state.currentSong = playList[index]
    }
  },
  changePlayingMode(state: State, mode: string) {
    state.mode = mode
  },
  changeShowSongList(state: State, flag: boolean) {
    state.showSongList = flag
  },
  setCurrentSongListId(state: State, listId: number) {
    state.currentSongListId = listId
  },
  changeFootTab(state: State, footTabCode: string) {
    state.footTab = footTabCode
  }
}
