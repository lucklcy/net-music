<template>
  <div class="song-list">
    <section class="header" :style="{backgroundImage:'url('+currentSongListBackgroundUrl+')'}">
      <div class="title-bar">
        <span class="backup" @click='goBack'>
          <SvgIcon :iconClass="'arrow-left'" :className="'arrow-left'"></SvgIcon>
        </span>
        <span class="title">歌单</span>
        <MiniPlayer></MiniPlayer>
      </div>
      <div class="content">
        <div class="pic" :style="{backgroundImage:'url('+currentSongListBackgroundUrl+')'}">
          <div class="heared">
            <span class="data">
              <i class="iconfont icon-erji"></i>
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
            <i class="author-pic" :style="{backgroundImage:'url('+songList.creator.avatarUrl+')'}"
              v-if="songList && songList.creator"></i>
            <SvgIcon :iconClass="'avatar-default'" :className="'avatar-default'" v-else> </SvgIcon>
            <span class="author-name">
              {{songList?songList.creator.nickname:'作者还没出来哦...'}}
            </span>
          </span>
          <span class="info">
            <i class="comment-pic iconfont icon-pinglun"></i>
            <span class="comment-data">{{songList?songList.commentCount:'????'}}</span>
            <i class="share-pic iconfont icon-fenxiang"></i>
            <span class="share-data">{{songList?songList.shareCount:'????'}}</span>
          </span>
        </div>
      </div>
    </section>
    <section class="summary border-bottom-1px">
      <div class="play-all" @click="doPlayAll">
        <SvgIcon :iconClass="'playing'" :className="'playing'" v-if="currentSongListId === songListId"></SvgIcon>
        <SvgIcon :iconClass="'list-play'" :className="'list-play'" v-else></SvgIcon>
        <span v-if="currentSongListId === songListId">正在播放</span>
        <span v-else>播放全部</span>
        <span class="track-count">共({{songList?songList.trackCount:'???'}})首</span>
      </div>
      <div class="collect" @click="doSubscribe">
        <SvgIcon :iconClass="'list-plus'" :className="'list-plus'"></SvgIcon>
        <span>收藏</span>
        <span class="subscribe">({{songList?songList.subscribedCount:'???'}})</span>
      </div>
    </section>
    <Scroll class="list-container" ref="songList" :data-list="songList.tracks" v-if="songList && songList.tracks && songList.tracks.length>0">
      <ul>
        <li v-for="(item,index) in songList.tracks" :key="index" @click="goToSongPlay(item.id)"
          :class="{'active':currentSong.id === item.id}">
          <div class="index">{{index+1}}</div>
          <div class="song-content border-bottom-1px">
            <div class="label">
              <span class="name">{{item.name | limitIn(30) }}</span>
              <span class="author">{{getAuthorString(item) | limitIn(28)}}</span>
            </div>
            <div class="oper active" v-if="currentSong.id === item.id">
              <SvgIcon :iconClass="'playing'" :className="'playing'"></SvgIcon>
            </div>
            <div class="oper" v-else>
              <SvgIcon :iconClass="'and-so-on'" :className="'and-so-on'"></SvgIcon>
            </div>
          </div>
        </li>
        <li class="subscribers">
          <template v-for="(item,index) in songList.subscribers">
            <span :key="index" :style="{backgroundImage:'url('+item.avatarUrl+')'}" v-if="index < 6">
            </span>
          </template>
          <i class="count">{{songList.subscribedCount}}人收藏</i>
        </li>
      </ul>
    </Scroll>
    <div class="spinner-container" v-else>
      <div class="loadding">
        <SvgIcon :iconClass="'spinnner-bars'" :className="'spinnner-bars'"></SvgIcon>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import Footer from '~/foundation/com/footer.vue'
import { State, Mutation } from 'vuex-class'
import MiniPlayer from '~/business/player/mini.vue'
import Scroll from '~/foundation/base/scroll.vue'
import { IPlaySong, IPlaylist, ITrack } from '@/common/interface/base.ts'
import { isEmpty } from '@/utils/index.ts'

@Component({
  components: {
    MiniPlayer,
    Footer,
    Scroll
  }
})
export default class SongList extends mixins(CommonMixin) {
  @State currentSongListId: number
  @State playList: IPlaySong[]
  @State currentSong: IPlaySong
  @State currentSongListBackgroundUrl: string
  private songList: IPlaylist | null = null
  private songListId: number = 0

  @Mutation setPlayList: (tarcks: ITrack[]) => void
  @Mutation setCurrentSong: (songId: number) => void
  @Mutation changePlayingStatus: (flag: boolean) => void
  @Mutation setCurrentSongListId: (listId: number) => void
  @Mutation setCurrentSongListBackgroundUrl: (backgroundUrl: string) => void

  get getCoverImgUrl() {
    return ''
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
    this.changePlayingStatus(false)
    let tracks = (this.songList as IPlaylist).tracks
    let isInList = false
    this.playList.forEach((item, index) => {
      if (item['id'] === songId) {
        isInList = true
      }
    })
    if (isInList) {
      this.setCurrentSong(songId)
    } else {
      this.setPlayList(tracks)
      this.setCurrentSong(songId)
      this.setCurrentSongListId(this.songListId)
    }
  }

  private doPlayAll() {
    if (this.currentSongListId !== this.songListId) {
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
  created() {
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
}
</script>
<style lang="scss" scoped src='./songlist.scss'></style>

