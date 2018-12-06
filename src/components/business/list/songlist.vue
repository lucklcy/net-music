<template>
  <div class="song-list" v-if="songList">
    <section class="header" :style="{backgroundImage:'url('+songList.coverImgUrl+')'}">
      <div class="title-bar">
        <span class="backup" @click="goBack">
          <i class="iconfont icon-arrow-left-"></i>
        </span>
        <span class="title">歌单</span>
        <MiniPlayer></MiniPlayer>
      </div>
      <div class="content">
        <div class="pic" :style="{backgroundImage:'url('+songList.coverImgUrl+')'}">
          <div class="heared">
            <span class="data">
              <i class="iconfont icon-erji"></i>
              {{songList.playCount | dealWithPlayCount}}
            </span>
          </div>
        </div>
        <div class="label">
          <span class="title">{{songList.name | limitIn(14)}}</span>
          <span class="author">
            <i class="author-pic" :style="{backgroundImage:'url('+songList.creator.avatarUrl+')'}"></i>
            <span class="author-name">{{songList.creator.nickname}}</span>
          </span>
          <span class="info">
            <i class="comment-pic iconfont icon-pinglun"></i>
            <span class="comment-data">{{songList.commentCount}}</span>
            <i class="share-pic iconfont icon-fenxiang"></i>
            <span class="share-data">{{songList.shareCount}}</span>
          </span>
        </div>
      </div>
    </section>
    <section class="summary border-1px">
      <div class="play-all" @click="doPlayAll">
        <SvgIcon :iconClass="'list-play'" :className="'list-play'"></SvgIcon>
        <span>播放全部</span>
        <span class="track-count">共({{songList.trackCount}})首</span>
      </div>
      <div class="collect" @click="doSubscribe">
        <SvgIcon :iconClass="'list-plus'" :className="'list-plus'"></SvgIcon>
        <span>收藏</span>
        <span class="subscribe">({{songList.subscribedCount}})</span>
      </div>
    </section>
    <section class="list-container">
      <ul>
        <li v-for="(item,index) in songList.tracks" :key="index" @click="goToSongPlay(item.id)">
          <div class="index">{{index+1}}</div>
          <div class="song-content border-1px">
            <div class="label">
              <span class="name">{{item.name | limitIn(30) }}</span>
              <span class="author">{{getAuthorString(item) | limitIn(28)}}</span>
            </div>
            <div class="oper">
              <i class="play iconfont icon-paly-time"></i>
            </div>
          </div>
        </li>
        <li class="subscribers">
          <template v-for="(item,index) in songList.subscribers">
            <span :key="index" :style="{backgroundImage:'url('+item.avatarUrl+')'}" v-if="index < 7">
            </span>
          </template>
          <i class="count">{{songList.subscribedCount}}人收藏</i>
        </li>
      </ul>
    </section>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import Footer from '~/foundation/com/footer.vue'
import { State, Mutation } from 'vuex-class'
import MiniPlayer from '~/business/player/mini.vue'
import { IPlaylist, ITrack } from '@/store/state'
import { IPlaySong } from '@/store/state'

@Component({
  components: {
    MiniPlayer,
    Footer
  }
})
export default class SongList extends mixins(CommonMixin) {
  @Mutation setPlayList: (tarcks: ITrack[]) => void
  @Mutation setCurrentSong: (songId: number) => void
  @Mutation changePlayingStatus: (flag: boolean) => void

  @State playList: IPlaySong[]

  private songList: IPlaylist | null = null

  private goBack() {
    this.$router.push({ name: 'r_home_recommand' })
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
    }
  }

  private doPlayAll() {
    let tracks = (this.songList as IPlaylist).tracks
    this.changePlayingStatus(false)
    this.setPlayList(tracks)
    this.setCurrentSong(tracks && tracks[0]['id'])
  }

  private doSubscribe() {
    console.log((this.songList as IPlaylist).id)
  }
  created() {
    let songListId = this.$route.query && this.$route.query.id
    this.service
      .getPlayListDetail({ id: songListId })
      .then((playListDetail: { playlist: IPlaylist }) => {
        this.songList = playListDetail && playListDetail['playlist']
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }
}
</script>
<style lang="scss" scoped src='./songlist.scss'></style>

