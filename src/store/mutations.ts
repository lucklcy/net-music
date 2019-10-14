import { State } from './state'
import { isBoolean, isObject } from 'lodash'
import { IPlaySong } from '@/common/interface/base.ts'
import { UserInfo, ITrack, IArtist } from '@/common/interface/base.ts'
import { isEmpty } from '@/utils'
import Vue from 'vue'

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
        const { id, name, dt: duration, liked } = innerItem
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
          duration: Math.floor((duration || 0) / 1000),
          liked
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
  addIntoPlayList(state: State, song: IPlaySong) {
    const playList: IPlaySong[] = state.playList
    let hasSongInList: boolean = false
    for (let i = 0; i < playList.length; i++) {
      const tempItem: IPlaySong = playList[i]
      if (tempItem.id === song.id) {
        hasSongInList = true
        break
      }
    }
    if (!hasSongInList) {
      state.playList = playList.concat([song])
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
  setCurrentSongListBackgroundUrl(state: State, backgroundUrl: string): void {
    if (!isEmpty(backgroundUrl)) {
      state.currentSongListBackgroundUrl = backgroundUrl
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
  },
  changeTableCat(state: State, payload: { type: number; cat: string }): void {
    const { type, cat } = payload
    if (type === 0) {
      state.tableCat = cat
    } else if (type === 1) {
      state.hotTableCat = cat
    }
  },
  changeIosAudioTrigger(state: State, flag: boolean) {
    state.iosAudioTrigger = flag
  },
  initialLikedSonglist(state: State, songIdList: number[]) {
    state['likedSongList'] = songIdList
  },
  updateLikedSongList(state: State, operate: { flag: string; songId: number }) {
    let { likedSongList, playList: tempPlayList, currentSong } = state
    let { flag, songId } = operate
    switch (flag) {
      case 'add':
        likedSongList.push(songId)
        if (currentSong && currentSong['id'] && currentSong['id'] === songId) {
          state.currentSong = { ...state.currentSong, liked: true }
          state.changeSongLikeInfo = { ...state.currentSong, liked: true }
        }
        break
      case 'minus':
        let tempIndex = likedSongList.findIndex(val => {
          return val === songId
        })
        if (tempIndex && tempIndex > -1) {
          likedSongList.splice(tempIndex, 1)
        }
        if (currentSong && currentSong['id'] && currentSong['id'] === songId) {
          state.currentSong = { ...state.currentSong, liked: false }
          state.changeSongLikeInfo = { ...state.currentSong, liked: false }
        }
        break
    }
    if (tempPlayList) {
      tempPlayList.forEach((item, index) => {
        if (item.id === songId) {
          item.liked = !item.liked
        }
      })
      state.playList = tempPlayList
    }
    state.likedSongList = likedSongList
  }
}
