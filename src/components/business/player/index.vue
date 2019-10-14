<template>
  <div class="main-player">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <div class="inner" :data-background-img='currentSong.picUrl' v-change-back-img></div>
        </div>
        <div class="top">
          <span class="back" @click="back">
            <SvgIcon :iconClass="'arrow-down'" :className="'arrow-down'"></SvgIcon>
          </span>
          <div class="song-header">
            <span class="title">{{currentSong.name | limitIn(15)}}</span>
            <span class="subtitle">{{currentSong.songer | limitIn(20)}}</span>
          </div>
          <span class="collect" @click="doLikeSong">
            <SvgIcon iconClass="collect" className="collect liked" v-if="currentSong.liked"></SvgIcon>
            <SvgIcon iconClass="collect" className="collect" v-else></SvgIcon>
          </span>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapper" @click="changePanel('lyric')">
              <div class="cd" :class="cdCls">
                <div class="image" :data-background-img='currentSong.picUrl' v-change-back-img></div>
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <div class="middle-r" v-if="noLyricFlag" :style="lyricListStyle">
            <div class="no-lyric">
              <span>本歌曲暂无歌词</span>
            </div>
          </div>
          <template v-else>
            <scroll class="middle-r" ref="lyricList" :data-list="currentLyric && currentLyric.lines" :style="lyricListStyle">
              <div class="lyric-wrapper" @click="changePanel('cd')">
                <div v-if="currentLyric">
                  <p ref="lyricLine" class="text" :class="{'current': currentLineNum ===index}" v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                </div>
              </div>
            </scroll>
          </template>
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
            <span class="play-mode" @click.stop="changeMode">
              <SvgIcon :iconClass="modeIcon" :className="modeIcon"></SvgIcon>
            </span>
            <span class="play-prev" @click.stop="prev">
              <SvgIcon :iconClass="'control-prev'" :className="'control-prev'"></SvgIcon>
            </span>
            <span class="play-control" @click.stop="togglePlaying">
              <SvgIcon :iconClass="'control-pause'" :className="'control-pause'" v-if="playing"></SvgIcon>
              <SvgIcon :iconClass="'control-play'" :className="'control-play'" v-else></SvgIcon>
            </span>
            <span class="play-next" @click.stop="next">
              <SvgIcon :iconClass="'control-next'" :className="'control-next'"></SvgIcon>
            </span>
            <span class="play-list" @click.stop="changeShowSongList(true)">
              <SvgIcon :iconClass="'control-play-list'" :className="'control-play-list'"></SvgIcon>
            </span>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="content">
          <SvgIcon :iconClass="'play-status-playing'" :className="'play-status-playing'" v-if="playing"></SvgIcon>
          <SvgIcon :iconClass="'play-status-pause'" :className="'play-status-pause'" v-else></SvgIcon>
        </div>
      </div>
    </transition>
    <PlayingSongList class="song-list" v-show="showSongList"></PlayingSongList>
    <audio id="song_audio" :src="songUrl" ref="audio" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State, Mutation } from 'vuex-class'
import scroll from '~/foundation/base/scroll.vue'
import ProgressBar from '~/foundation/base/progressBar.vue'
import PlayingSongList from '~/business/player/list.vue'
import { prefixStyle } from '@/utils/dom'
import lyricParser from '@/utils/lyricParser'
import { PLAYING_MODE } from '@/store/state.ts'
import { IPlaySong, ITouch, ISongDetail, ISongLyric } from '@/common/interface/base.ts'
import ChangeBackImg from '@/directives/changeBackImg.ts'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

@Component({
  components: {
    scroll,
    ProgressBar,
    PlayingSongList
  },
  directives: {
    'change-back-img': ChangeBackImg
  }
})
export default class SongMainPlayer extends mixins(CommonMixin) {
  @State
  currentSong: IPlaySong
  @State
  playing: boolean
  @State
  fullScreen: boolean
  @State
  playList: IPlaySong[]
  @State
  currentIndex: number
  @State
  mode: string
  @State
  showSongList: boolean

  private songId: number = 0
  private middleLStyle: string = ''
  private lyricListStyle: string = ''
  private touch: ITouch = {
    initiated: false,
    moved: false,
    startX: 0,
    startY: 0,
    percent: 0,
    left: 0
  }
  private currentShow: string = 'cd'
  private playingLyric: string = ''
  private currentLyric: lyricParser = new lyricParser('', () => {})
  private currentTime: number = 10
  private songUrl: string = require('@/assets/music/background.mp3')
  private autoPlayTimer: number = 0
  private currentLineNum: number = 0
  private songReady: boolean = false
  private radius: number = 36
  private timer: number
  private noLyricFlag: boolean = false

  @Mutation
  changePlayingStatus: (flag: boolean) => void
  @Mutation
  changeFullScreen: (flag: boolean) => void
  @Mutation
  setCurrentIndex: (index: number) => void
  @Mutation
  changePlayingMode: (mode: string) => void
  @Mutation
  changeShowSongList: (flag: boolean) => void
  @Mutation
  updateLikedSongList: (operate: { flag: string; songId: number }) => void

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
      case PLAYING_MODE.LOOP:
        returnModeClass = 'control-cycle'
        break
      case PLAYING_MODE.RANDOM:
        returnModeClass = 'control-random'
        break
      case PLAYING_MODE.CYCLE:
        returnModeClass = 'control-cycle-one'
        break
      default:
        returnModeClass = 'control-cycle'
        break
    }
    return returnModeClass
  }

  private changeMode() {
    let mode = this.mode
    switch (mode) {
      case PLAYING_MODE.LOOP:
        this.changePlayingMode(PLAYING_MODE.RANDOM)
        break
      case PLAYING_MODE.RANDOM:
        this.changePlayingMode(PLAYING_MODE.CYCLE)
        break
      case PLAYING_MODE.CYCLE:
        this.changePlayingMode(PLAYING_MODE.LOOP)
        break
      default:
        this.changePlayingMode(PLAYING_MODE.LOOP)
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
  private changePanel(panel: string) {
    let costTime = 300
    if (panel === 'lyric') {
      Object.assign(this, {
        currentShow: panel,
        middleLStyle: `opacity:0;${transitionDuration}:${costTime}ms;`,
        lyricListStyle: `opacity:1;${transform}:translate3d(-100vw,0,0);${transitionDuration}:${costTime}ms;`
      })
    } else {
      Object.assign(this, {
        currentShow: panel,
        middleLStyle: `opacity:1;${transitionDuration}:${costTime}ms;`,
        lyricListStyle: `opacity:0;${transform}:translate3d(100vw,0,0);${transitionDuration}:${costTime}ms;`
      })
    }
  }

  private doLikeSong() {
    let { id, liked } = this.currentSong
    if (id) {
      this.service.doLikeSong({ id, like: !liked }).then((res: { code: number }) => {
        this.updateLikedSongList({ flag: liked ? 'minus' : 'add', songId: id })
      })
    }
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
    if (this.mode === PLAYING_MODE.CYCLE) {
      this.loop()
    } else {
      this.next()
    }
  }

  private loop() {
    this.changePlayingStatus(false)
    let audioElement = this.$refs.audio as HTMLAudioElement
    audioElement.currentTime = 0
    setTimeout(() => {
      this.changePlayingStatus(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    }, 200)
  }
  private getRandomIndex() {
    let playList = this.playList
    let currentSong = this.currentSong
    let randomNum = Math.floor(Math.random() * playList.length)
    while (playList[randomNum].id === currentSong.id) {
      randomNum = Math.floor(Math.random() * playList.length)
    }
    return randomNum
  }
  // 下一首
  private next() {
    if (!this.songReady) {
      return
    }
    if (this.mode === PLAYING_MODE.CYCLE || this.playList.length === 1) {
      this.loop()
      return
    } else if (this.mode === PLAYING_MODE.RANDOM) {
      let index = this.getRandomIndex()
      this.changePlayingStatus(false)
      this.setCurrentIndex(index)
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
    if (this.mode === PLAYING_MODE.CYCLE || this.playList.length === 1) {
      this.loop()
    } else if (this.mode === PLAYING_MODE.RANDOM) {
      let index = this.getRandomIndex()
      this.changePlayingStatus(false)
      this.setCurrentIndex(index)
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
      scrollToElement: (el: HTMLElement | string, time?: number, offsetX?: number | boolean, offsetY?: number | boolean, easing?: object) => void
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
      let dataArray = resultSongDetail['data'] || require('@/assets/music/background.mp3')
      this.songUrl = dataArray[0]['url']
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.currentTime = 0
        this.currentLineNum = 0
        this.songReady = true
        this.currentLyric.seek(0)
        this.changePlayingStatus(true)
      }, 800)
    })
    this.service.getSongLyric({ id: songId }).then((resultSongLyric: ISongLyric) => {
      this.currentLyric && this.currentLyric.destroy()
      if (resultSongLyric['lrc'] && resultSongLyric['lrc']['lyric']) {
        this.noLyricFlag = false
        let lyric = resultSongLyric['lrc']['lyric']
        this.playingLyric = this.currentSong.name
        this.currentLyric = new lyricParser(lyric, this.lyricHandler)
        this.$nextTick(() => {
          let scrollElement = this.$refs.lyricList as Vue & {
            scrollToElement: (el: HTMLElement | string, time?: number, offsetX?: number | boolean, offsetY?: number | boolean, easing?: object) => void
            scrollTo: (x: number, y: number, time?: number, easing?: object) => void
          }
          scrollElement.scrollTo(0, 0, 1000)
        })
      } else if (resultSongLyric['nolyric']) {
        this.noLyricFlag = true
        this.playingLyric = '本歌曲暂无歌词'
      } else {
        this.noLyricFlag = true
        this.playingLyric = '本歌曲暂无歌词'
      }
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


