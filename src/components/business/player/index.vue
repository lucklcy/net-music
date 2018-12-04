<template>
  <div class="main-player">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <div :style="{backgroundImage:'url('+currentSong.picUrl+')'}" class="inner"></div>
        </div>
        <div class="top">
          <i class="back iconfont icon-arrow-down-" @click="back"></i>
          <div class="song-header">
            <span class="title">{{currentSong.name | limitIn(18)}}</span>
            <span class="subtitle">{{currentSong.songer | limitIn(30)}}</span>
          </div>
          <i class="about iconfont icon-qunfengshoucang"></i>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <div class="image" :style="{backgroundImage:'url('+currentSong.picUrl+')'}"></div>
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data-list="currentLyric && currentLyric.lines"
            :style="lyricListStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" :class="{'current': currentLineNum ===index}" v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar :percent="percent" @percentChange="onProgressBarChange"></ProgressBar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <span class="play iconfont" :class="modeIcon" @click.stop="changeMode"></span>
            <span class="play iconfont icon-Next" @click.stop="prev"></span>
            <span class="play iconfont" :class="playIcon" @click.stop="togglePlaying"></span>
            <span class="play iconfont icon-next1" @click.stop="next"></span>
            <span class="play iconfont icon-shoucangyuguanzhu"></span>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" :style="{backgroundImage:'url('+currentSong.picUrl+')'}" :class="cdCls">
        </div>
        <div class="text">
          <span class="name" v-html="currentSong.name"></span>
          <span class="desc" v-html="currentSong.songer"></span>
        </div>
        <div class="control">
          <ProgressCircle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini iconfont" :class="miniIcon"></i>
          </ProgressCircle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="songUrl" ref="audio" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State, Mutation } from 'vuex-class'
import scroll from '~/foundation/base/scroll.vue'
import ProgressBar from '~/foundation/base/progressBar.vue'
import ProgressCircle from '~/foundation/base/progressCircle.vue'
import { prefixStyle } from '@/utils/dom'
import lyricParser from '@/utils/lyricParser'
import { PLAYING_MODE } from '@/store/state.ts'

interface ISongDetail {
  id: number
  url: string
}

interface IPlaySong {
  id: number
  name: string
  picUrl: string
  songer: string
  duration: number
}

interface ISongLyric {
  code: number
  lrc: { lyric: string; version: number }
  lyricUser: { id: number; nickname: string; userid: number; uptime: number }
}

interface ITtuch {
  initiated: boolean
  moved: boolean
  startX: number
  startY: number
  percent: number
}

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

@Component({
  components: {
    scroll,
    ProgressBar,
    ProgressCircle
  }
})
export default class SongMainPlayer extends mixins(CommonMixin) {
  private songId: number = 0
  private middleLStyle: string = ''
  private lyricListStyle: string = ''
  @State currentSong: IPlaySong
  @State playing: boolean
  @State fullScreen: boolean
  @State playList: IPlaySong[]
  @State currentIndex: number
  @State mode: string

  private touch: ITtuch = { initiated: false, moved: false, startX: 0, startY: 0, percent: 0 }
  private currentShow: string = 'cd'
  private playingLyric: string = ''
  private currentLyric: lyricParser = new lyricParser('', () => {})
  private currentTime: number = 10
  private songUrl: string = ''
  private autoPlayTimer: number = 0
  private currentLineNum: number = 0
  private songReady: boolean = false
  private radius: number = 36
  private timer: number

  @Mutation changePlayingStatus: (flag: boolean) => void
  @Mutation changeFullScreen: (flag: boolean) => void
  @Mutation setCurrentIndex: (index: number) => void
  @Mutation changePlayingMode: (mode: string) => void

  get cdCls() {
    return this.playing ? 'play' : 'play pause'
  }

  get playIcon() {
    return this.playing ? 'icon-icon_palyer' : 'icon-paly'
  }
  get miniIcon() {
    return this.playing ? 'icon-icon_palyer' : 'icon-paly'
  }
  get disableCls() {
    return this.songReady ? '' : 'disable'
  }
  get percent() {
    return this.currentTime / this.currentSong.duration
  }

  get modeIcon() {
    let mode = this.mode
    let returnModeClass = ''
    switch (mode) {
      case PLAYING_MODE.SEQUENCE:
        returnModeClass = 'icon-shunxu'
        break
      case PLAYING_MODE.LOOP:
        returnModeClass = 'icon-danquxunhuan'
        break
      case PLAYING_MODE.RANDOM:
        returnModeClass = 'icon-random'
        break
      case PLAYING_MODE.CYCLE:
        returnModeClass = 'icon-loop'
        break
      default:
        returnModeClass = 'icon-shunxu'
        break
    }
    return returnModeClass
  }

  private changeMode() {
    let mode = this.mode
    switch (mode) {
      case PLAYING_MODE.SEQUENCE:
        this.changePlayingMode(PLAYING_MODE.LOOP)
        break
      case PLAYING_MODE.LOOP:
        this.changePlayingMode(PLAYING_MODE.RANDOM)
        break
      case PLAYING_MODE.RANDOM:
        this.changePlayingMode(PLAYING_MODE.CYCLE)
        break
      case PLAYING_MODE.CYCLE:
        this.changePlayingMode(PLAYING_MODE.SEQUENCE)
        break
      default:
        this.changePlayingMode(PLAYING_MODE.SEQUENCE)
        break
    }
  }

  private back() {
    this.changeFullScreen(false)
  }
  private open() {
    this.changeFullScreen(true)
  }

  private middleTouchStart(e: TouchEvent) {
    this.touch.initiated = true
    // 用来判断是否是一次移动
    this.touch.moved = false
    const touch = e.touches[0]
    this.touch.startX = touch.pageX
    this.touch.startY = touch.pageY
  }
  private middleTouchMove(e: TouchEvent) {
    if (!this.touch.initiated) {
      return
    }
    const touch = e.touches[0]
    const deltaX = touch.pageX - this.touch.startX
    const deltaY = touch.pageY - this.touch.startY
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return
    }
    if (!this.touch.moved) {
      this.touch.moved = true
    }
    const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
    this.middleLStyle = `opacity:${1 - this.touch.percent};${transitionDuration}:0;`
    this.lyricListStyle = `${transform}:translate3d(${offsetWidth}px,0,0); ${transitionDuration}:0;`
  }
  private middleTouchEnd() {
    if (!this.touch.moved) {
      return
    }
    let offsetWidth = 0
    let opacity = 0
    if (this.currentShow === 'cd') {
      if (this.touch.percent > 0.1) {
        offsetWidth = -window.innerWidth
        opacity = 0
        this.currentShow = 'lyric'
      } else {
        offsetWidth = 0
        opacity = 1
      }
    } else {
      if (this.touch.percent < 0.9) {
        offsetWidth = 0
        this.currentShow = 'cd'
        opacity = 1
      } else {
        offsetWidth = -window.innerWidth
        opacity = 0
      }
    }
    const time = 300
    this.lyricListStyle = `${transform}:translate3d(${offsetWidth}px,0,0); ${transitionDuration}:${time}ms;`
    this.middleLStyle = `opacity:${opacity};${transitionDuration}:${time}ms;`
    this.touch.initiated = false
  }

  private onProgressBarChange(percent: number) {
    const currentTime = this.currentSong.duration * percent
    let AudioElement = this.$refs.audio as HTMLAudioElement
    AudioElement.currentTime = currentTime
    if (!this.playing) {
      this.togglePlaying()
    }
    if (this.currentLyric) {
      this.currentLyric.seek(currentTime * 1000)
    }
  }

  private togglePlaying() {
    if (!this.songReady) {
      return
    }
    this.changePlayingStatus(!this.playing)
    if (this.currentLyric) {
      this.currentLyric.togglePlay()
    }
  }

  private end() {
    if (this.mode === PLAYING_MODE.LOOP) {
      this.loop()
    } else {
      this.next()
    }
  }

  private loop() {
    let audioElement = this.$refs.audio as HTMLAudioElement
    audioElement.currentTime = 0
    audioElement.play()
    this.changePlayingStatus(true)
    if (this.currentLyric) {
      this.currentLyric.seek(0)
    }
  }
  // 下一首
  private next() {
    if (!this.songReady) {
      return
    }
    if (this.playList.length === 1) {
      this.loop()
      return
    } else {
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.changePlayingStatus(false)
      this.setCurrentIndex(index)
    }
  }
  // 上一首
  private prev() {
    if (!this.songReady) {
      return
    }
    if (this.playList.length === 1) {
      this.loop()
      return
    } else {
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.changePlayingStatus(false)
      this.setCurrentIndex(index)
    }
  }

  private format(interval: number) {
    interval = Math.floor(interval | 0)
    const minute = (interval / 60) | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  }

  private _pad(num: number, n = 2) {
    let resultNum: string = num.toString()
    let len = num.toString().length
    while (len < n) {
      resultNum = '0' + resultNum
      len++
    }
    return resultNum
  }

  private updateTime(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime
  }

  private lyricHandler(item: { txt: string; lineNum: number }): void {
    let { txt, lineNum } = item
    this.playingLyric = txt
    this.currentLineNum = lineNum
    let scrollElement = this.$refs.lyricList as Vue & {
      scrollToElement: (
        el: HTMLElement | string,
        time?: number,
        offsetX?: number | boolean,
        offsetY?: number | boolean,
        easing?: object
      ) => void
      scrollTo: (x: number, y: number, time?: number, easing?: object) => void
    }
    if (lineNum > 6) {
      let lineEl = (this.$refs.lyricLine as HTMLElement[])[lineNum - 6]
      scrollElement.scrollToElement(lineEl, 1000)
    } else {
      scrollElement.scrollTo(0, 0, 1000)
    }
  }

  private init(songId: number) {
    this.songId = songId
    this.songReady = false
    this.service.getSongUrl({ id: songId }).then((resultSongDetail: { data: ISongDetail[] }) => {
      let dataArray = resultSongDetail['data']
      this.songUrl = dataArray[0]['url']
      this.songReady = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.changePlayingStatus(true)
        this.currentLyric.seek(0)
      }, 800)
    })
    this.service.getSongLyric({ id: songId }).then((resultSongLyric: ISongLyric) => {
      let lyric = resultSongLyric['lrc']['lyric']
      if (this.currentLyric) {
        this.currentLyric.destroy()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      this.currentLyric = new lyricParser(lyric, this.lyricHandler)
    })
  }

  @Watch('currentSong', { deep: true })
  onCurrentSongChange(newSong: IPlaySong, oldSong: IPlaySong) {
    if (!newSong.id) {
      return
    }
    if (newSong.id === oldSong.id) {
      return
    }
    this.init(newSong.id)
  }
  @Watch('playing')
  onChangePlayingStatus(playingFlagNew: boolean, playingFlagOld: boolean) {
    const audio = this.$refs.audio as HTMLAudioElement
    this.$nextTick(() => {
      playingFlagNew ? audio.play() : audio.pause()
    })
  }

  created() {}
}
</script>
<style lang="scss" scoped src="./index.scss"></style>


