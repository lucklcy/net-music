<template>
  <div class="main-player">
    <transition name="normal">
      <div class="normal-player">
        <div class="background">
          <img :src="currentSong.picUrl" alt="背景" width="100%" height="100%">
        </div>
        <div class="top">
          <i class="back iconfont icon-arrow-down-" @click="$router.go(-1)"></i>
          <div class="song-header">
            <span class="title">{{currentSong.name | limitIn(18)}}</span>
            <span class="subtitle">{{currentSong.songer | limitIn(38)}}</span>
          </div>
          <i class="about iconfont icon-qunfengshoucang"></i>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <div class="image" :style="{backgroundImage:'url('+currentSong.picUrl+')'}"></div>
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data-list="currentLyric && currentLyric.lines">
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
            <span class="play iconfont icon-random" @click="gotoPlay"></span>
            <span class="play iconfont icon-Next" @click="gotoPlay"></span>
            <span class="play iconfont icon-paly" @click="gotoPlay"></span>
            <span class="play iconfont icon-next1" @click="gotoPlay"></span>
            <span class="play iconfont icon-shoucangyuguanzhu" @click="gotoPlay"></span>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player"></div>
    </transition>
    <audio :src="songUrl" ref="audio" loop="loop" @timeupdate="updateTime"></audio>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State } from 'vuex-class'
import scroll from '~/foundation/base/scroll.vue'
import ProgressBar from '~/foundation/base/progressBar.vue'
import { prefixStyle } from '@/utils/dom'

interface IPlaySong {
  id: number
  name: string
  picUrl: string
  songer: string
  duration: number
}

interface ISongDetail {
  id: number
  url: string
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
    ProgressBar
  }
})
export default class SongMainPlayer extends mixins(CommonMixin) {
  private songId: string = ''
  @State currentSong: IPlaySong
  @State playing: boolean

  private touch: ITtuch = { initiated: false, moved: false, startX: 0, startY: 0, percent: 0 }
  private currentShow: string = 'cd'
  private playingLyric: string = ''
  private currentLyric: null = null
  private currentTime: number = 10
  private songUrl: string = ''
  private autoPlayTimer: number

  get cdCls() {
    return this.playing ? 'play' : 'play pause'
  }

  get playIcon() {
    return this.playing ? 'icon-pause' : 'icon-play'
  }
  get miniIcon() {
    return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
  }
  // get  disableCls() {
  //     return this.songReady ? '' : 'disable'
  //   }
  get percent() {
    return this.currentTime / this.currentSong.duration
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
    let lyricElement = this.$refs.lyricList as HTMLElement
    let middleLElement = this.$refs.middleL as HTMLElement
    let lyricElementStyleCssText = `${transform}:translate3d(${offsetWidth}px,0,0); ${transitionDuration}:0;`
    let middleLElementStyleCssText = `opacity:${1 - this.touch.percent};${transitionDuration}:0;`
    middleLElement.style.cssText = lyricElementStyleCssText
    middleLElement.style.cssText = middleLElementStyleCssText
  }
  private middleTouchEnd() {
    if (!this.touch.moved) {
      return
    }
    let offsetWidth
    let opacity
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

    let lyricElement = this.$refs.lyricList as HTMLElement
    let middleLElement = this.$refs.middleL as HTMLElement
    middleLElement.style.cssText = `${transform}:translate3d(${offsetWidth}px,0,0); ${transitionDuration}:${time}ms;`
    middleLElement.style.cssText = `opacity:${opacity};${transitionDuration}:${time}ms;`
    this.touch.initiated = false
  }

  private onProgressBarChange(percent: number) {
    const currentTime = this.currentSong.duration * percent
    let AudioElement = this.$refs.audio as HTMLAudioElement
    AudioElement.currentTime = currentTime
    if (!this.playing) {
      // this.togglePlaying()
    }
    if (this.currentLyric) {
      // this.currentLyric.seek(currentTime * 1000)
    }
  }

  // private updateTime(e:) {
  //   this.currentTime = e.target.currentTime
  // }

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

  private gotoPlay() {
    let AudioElement = this.$refs.audio as HTMLAudioElement
    AudioElement.play()
  }

  private updateTime(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime
  }

  created() {
    let songId = this.$route.query && (this.$route.query.id as string)
    this.songId = songId
    this.service.getSongUrl({ id: songId }).then((resultSongDetail: { data: ISongDetail[] }) => {
      let dataArray = resultSongDetail['data']
      this.songUrl = dataArray[0]['url']
      let AudioElement = this.$refs.audio as HTMLAudioElement
      clearTimeout(this.autoPlayTimer)
    })
    this.service.getSongLyric({ id: songId }).then((resultSongLyric: ISongDetail) => {
      console.log({ resultSongLyric })
    })
  }
}
</script>
<style lang="scss" scoped src="./main.scss"></style>


