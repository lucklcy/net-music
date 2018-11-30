<template>
  <div class="song-list" v-if="playlist">
    <section class="header" :style="{backgroundImage:'url('+playlist.coverImgUrl+')'}">
      <div class="title-bar">
        <span class="backup" @click="goBack">
          <i class="iconfont icon-arrow-left-"></i>
        </span>
        <span class="title">歌单</span>
        <MiniPlayer></MiniPlayer>
      </div>
      <div class="content">
        <div class="pic" :style="{backgroundImage:'url('+playlist.coverImgUrl+')'}">
          <div class="heared">
            <span class="data">
              <i class="iconfont icon-erji"></i>
              {{playlist.playCount | dealWithPlayCount}}
            </span>
          </div>
        </div>
        <div class="label">
          <span class="title">{{playlist.name | limitIn(14)}}</span>
          <span class="author">
            <i class="author-pic" :style="{backgroundImage:'url('+playlist.creator.avatarUrl+')'}"></i>
            <span class="author-name">{{playlist.creator.nickname}}</span>
          </span>
          <span class="info">
            <i class="comment-pic iconfont icon-pinglun"></i>
            <span class="comment-data">{{playlist.commentCount}}</span>
            <i class="share-pic iconfont icon-fenxiang"></i>
            <span class="share-data">{{playlist.shareCount}}</span>
          </span>
        </div>
      </div>
    </section>
    <section class="list-container">
      <ul>
        <li v-for="(item,index) in playlist.tracks" :key="index" @click="goToSongPlay(item.id)">
          <div class="index">{{index+1}}</div>
          <div class="song-content border-1px">
            <div class="label">
              <span class="name">{{item.name}}</span>
              <span class="author">{{getAuthorString(item)}}</span>
            </div>
            <div class="oper">
              <i class="play iconfont icon-paly-time"></i>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State, Mutation } from 'vuex-class'
import MiniPlayer from '~/business/player/mini.vue'
import { IPlaylist, ITrack } from '@/store/state'

@Component({
  components: {
    MiniPlayer
  }
})
export default class SongList extends mixins(CommonMixin) {
  @Mutation setPlayList: (tarcks: ITrack[]) => void
  @Mutation setCurrentSong: (songId: number) => void

  private playlist: IPlaylist | null = null

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
    this.setPlayList((this.playlist as IPlaylist).tracks)
    this.setCurrentSong(songId)
    this.$router.push({ name: 'r_song_play', query: { id: `${songId}` } })
  }

  created() {
    let songListId = this.$route.query && this.$route.query.id
    this.service
      .getPlayListDetail({ id: songListId })
      .then((playListDetail: { playlist: IPlaylist }) => {
        this.playlist = playListDetail && playListDetail['playlist']
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }
}
</script>
<style lang="scss" scoped src='./songlist.scss'></style>

