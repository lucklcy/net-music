<template>
  <div class="song-list">
    <section class="header" :style="{backgroundImage:'url('+currentSongListBackgroundUrl+')'}">
      <div class="title-bar">
        <span class="backup" @click='goBack'>
          <SvgIcon :iconClass="'arrow-left'" :className="'arrow-left'"></SvgIcon>
        </span>
        <span class="title">歌单</span>
        <span class="collect">
          <SvgIcon :iconClass="'collect'" :className="'collect'"></SvgIcon>
        </span>
      </div>
      <div class="content">
        <div class="pic" :style="{backgroundImage:'url('+currentSongListBackgroundUrl+')'}">
          <div class="heared">
            <span class="data">
              <SvgIcon :iconClass="'earpod'" :className="'earpod'"></SvgIcon>
              <i class="play-count-data" v-if="songList">
                {{songList.playCount | dealWithPlayCount}}
              </i>
              <i class="play-count-data" v-else>&nbsp;???</i>
            </span>
          </div>
        </div>
        <div class="label">
          <span class="title">
            <template v-if="songList">
              {{songList.name | limitIn(14)}}
            </template>
            <template v-else>
              歌单还在.在.在.加载中...
            </template>
          </span>
          <span class="author">
            <i class="author-pic" :data-background-img='songList?songList.creator.avatarUrl:defaultSingerImg'
              v-change-back-img></i>
            <span class="author-name">
              {{songList?songList.creator.nickname:'作者还没出来哦...'}}
            </span>
          </span>
          <span class="info">
            <SvgIcon :iconClass="'song-comments'" :className="'song-comments'"></SvgIcon>
            <span class="comment-data">{{songList?songList.commentCount:'????'}}</span>
            <SvgIcon :iconClass="'song-share'" :className="'song-share'"></SvgIcon>
            <span class="share-data">{{songList?songList.shareCount:'????'}}</span>
          </span>
        </div>
      </div>
    </section>
    <section class="summary border-bottom-1px">
      <div class="play-all" @click="doPlayAll">
        <template v-if="currentSongListId === songListId">
          <SvgIcon :iconClass="'play-status-playing'" :className="'play-status-playing'" v-if="playing"></SvgIcon>
          <SvgIcon :iconClass="'play-status-pause'" :className="'play-status-pause'" v-else></SvgIcon>
          <span>正在播放</span>
        </template>
        <template v-else>
          <SvgIcon :iconClass="'list-play'" :className="'list-play'"></SvgIcon>
          <span>播放全部</span>
        </template>
        <span class="track-count">共({{songList?songList.trackCount:'???'}})首</span>
      </div>
      <div class="collect" @click="doSubscribe">
        <SvgIcon :iconClass="'list-plus'" :className="'list-plus'"></SvgIcon>
        <span>收藏</span>
        <span class="subscribe">({{songList?songList.subscribedCount:'???'}})</span>
      </div>
    </section>
    <div class="list-container" v-if="songList && songList.tracks && songList.tracks.length>0">
      <ul>
        <li v-for="(item,index) in songList.tracks" :key="index" @click="goToSongPlay(item.id)" :class="{'active':currentSong.id === item.id}">
          <div class="index">{{index+1}}</div>
          <div class="song-content border-bottom-1px">
            <div class="label">
              <span class="name">{{item.name | limitIn(30) }}</span>
              <span class="author">{{getAuthorString(item) | limitIn(28)}}</span>
            </div>
            <div class="oper active" v-if="currentSong.id === item.id">
              <SvgIcon :iconClass="'play-status-playing'" :className="'play-status-playing'" v-if="playing"></SvgIcon>
              <SvgIcon :iconClass="'play-status-pause'" :className="'play-status-pause'" v-else></SvgIcon>
            </div>
            <div class="oper" v-else>
              <SvgIcon :iconClass="'and-so-on'" :className="'and-so-on'"></SvgIcon>
            </div>
          </div>
        </li>
        <li class="subscribers">
          <template v-for="(item,index) in songList.subscribers">
            <span :key="index" :style="{backgroundImage:'url('+item.avatarUrl+')'}" :data-background-img='item.avatarUrl'
              v-change-back-img v-if="index < 6">
            </span>
          </template>
          <i class="count">{{songList.subscribedCount}}人收藏</i>
        </li>
      </ul>
    </div>
    <div class="spinner-container" v-else>
      <div class="loadding">
        <SvgIcon :iconClass="'spinner-bars'" :className="'spinner-bars'"></SvgIcon>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State, Mutation } from 'vuex-class'
import Scroll from '~/foundation/base/scroll.vue'
import { IPlaySong, IPlaylist, ITrack } from '@/common/interface/base.ts'
import { isEmpty } from '@/utils/index.ts'
import ChangeBackImg from '@/directives/changeBackImg.ts'
import { isIos } from '@/utils/index.ts'

@Component({
  components: {
    Scroll
  },
  directives: {
    'change-back-img': ChangeBackImg
  }
})
export default class SongList extends mixins(CommonMixin) {
  @State
  currentSongListId: number
  @State
  playList: IPlaySong[]
  @State
  currentSong: IPlaySong
  @State
  currentSongListBackgroundUrl: string
  @State
  playing: boolean
  @State
  iosAudioTrigger: boolean
  private songList: IPlaylist | null = null
  private songListId: number = 0
  private defaultSingerImg: File = require('@/assets/img/singer-default.jpeg')

  @Mutation
  setPlayList: (tarcks: ITrack[]) => void
  @Mutation
  setCurrentSong: (songId: number) => void
  @Mutation
  changePlayingStatus: (flag: boolean) => void
  @Mutation
  setCurrentSongListId: (listId: number) => void
  @Mutation
  setCurrentSongListBackgroundUrl: (backgroundUrl: string) => void
  @Mutation
  changeIosAudioTrigger: (flag: boolean) => void

  get getCoverImgUrl() {
    return ''
  }

  private dealIosPlay() {
    if (isIos && !this.iosAudioTrigger) {
      const audio = document.querySelector('#song_audio') as HTMLAudioElement
      try {
        audio.play()
        audio.pause()
        this.changeIosAudioTrigger(true)
      } catch (error) {
        console.log({ error })
      }
    }
  }

  private goBack() {
    this.$router.go(-1)
  }

  private getAuthorString(item: ITrack) {
    let { al, ar } = item
    let songName = al['name']
    let artistes = ar
      .map(innerItem => {
        return innerItem['name']
      })
      .join('/')
    return `${artistes} - ${songName}`
  }

  private goToSongPlay(songId: number) {
    this.dealIosPlay()
    // 若是当前正在播放歌曲
    if (this.currentSong.id === songId) {
      this.changePlayingStatus(!this.playing)
    } else {
      this.changePlayingStatus(false)
      let [tracks, isInList] = [(this.songList as IPlaylist).tracks, false]
      this.playList.forEach((item, index) => {
        if (item['id'] === songId) {
          isInList = true
        }
      })
      // 若是当前播放列表
      if (isInList) {
        this.setCurrentSong(songId)
      } else {
        this.setPlayList(tracks)
        this.setCurrentSong(songId)
        this.setCurrentSongListId(this.songListId)
      }
    }
  }

  private doPlayAll() {
    if (this.currentSongListId !== this.songListId) {
      this.dealIosPlay()
      let tracks = (this.songList as IPlaylist).tracks
      this.changePlayingStatus(false)
      this.setPlayList(tracks)
      this.setCurrentSong(tracks && tracks[0]['id'])
      this.setCurrentSongListId(this.songListId)
    }
  }

  private doSubscribe() {
    console.log((this.songList as IPlaylist).id)
  }

  private init() {
    let songListId = this.$route.params && this.$route.params.id
    this.songListId = Number(songListId)
    this.service
      .getPlayListDetail({ id: songListId })
      .then((playListDetail: { playlist: IPlaylist }) => {
        let tempPlaylist = playListDetail && playListDetail['playlist']
        this.songList = tempPlaylist
        // 处理刷新情况背景未被注入的情况
        if (isEmpty(this.currentSongListBackgroundUrl)) {
          this.setCurrentSongListBackgroundUrl(tempPlaylist['coverImgUrl'])
        }
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }

  activated() {
    this.init()
  }

  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped src='./songlist.scss'></style>

