<template>
  <div class="main-player">
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
    </div>
    <div class="mini-player"></div>
    <audio src=""></audio>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State } from 'vuex-class'

interface IPlaySong {
  id: number
  name: string
  picUrl: string
  songer: string
}

interface ISongDetail {
  id: number
  url: string
}
@Component({
  components: {}
})
export default class SongMainPlayer extends mixins(CommonMixin) {
  private songId: string = ''
  @State currentSong: IPlaySong
  created() {
    let songId = this.$route.query && this.$route.query.id
    this.songId = songId
    this.service.getSongUrl({ id: songId }).then((resultSongDetail: ISongDetail) => {
      console.log({ resultSongDetail })
    })
  }
}
</script>
<style lang="scss" scoped src="./main.scss"></style>


