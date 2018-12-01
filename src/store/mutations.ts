import { State } from './state'
import { isBoolean, isObject } from 'lodash'
import { UserInfo, ITrack, IArtist, IPlaySong } from './state'
import { srorageSet } from '@/utils'

export interface IkeyVal {
  key: string
  val: any
}

export default {
  isLoading(state: State, val: boolean | {}) {
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
          songer = `${songer} - ${album || ''}`
        }
        tempPlaySongList.push({
          id,
          name,
          picUrl,
          songer,
          duration: Math.floor((duration || 0) / 1000)
        })
      })
    }
    state.playList = tempPlaySongList
    srorageSet('playList', val)
  },
  setCurrentSong(state: State, song: number) {
    const playList: IPlaySong[] = state.playList
    if (playList && playList.length > 0 && song) {
      for (let i = 0; i < playList.length; i++) {
        const tempItem: IPlaySong = playList[i]
        if (tempItem.id === song) {
          state.currentSong = tempItem
          srorageSet('currentSong', song)
          break
        }
      }
    }
  }
}
