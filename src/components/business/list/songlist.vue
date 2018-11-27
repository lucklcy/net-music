<template>
  <div class="song-list">
    <div class="title-bar">
      <span class="backup"></span>
      <span class="title">歌单</span>

    </div>
    <section class="header">

    </section>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State } from 'vuex-class'

export interface ICreator {
  avatarUrl: string
  birthday: number
  nickname: string
  userId: number
  city: number
  province: number
  [propName: string]: any
}

interface IAl {
  id: number
  name: string
  pic: number
  picUrl: string
  [propName: string]: any
}

export interface ITrack {
  id: number
  al: IAl
  name: string
}
export interface IPlaylist {
  creator: ICreator
  tracks: ITrack[]
  coverImgUrl: string
  createTime: number
  description: string
  name: string
  [propName: string]: any
}

@Component({
  components: {}
})
export default class SongList extends mixins(CommonMixin) {
  private palylist: IPlaylist
  created() {
    let songListId = this.$route.query && this.$route.query.id
    this.service
      .getPlayListDetail({ id: songListId })
      .then((playListDetail: { playlist: IPlaylist }) => {
        this.palylist = playListDetail && playListDetail['playlist']
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }
}
</script>
<style lang="scss" scoped src='./songlist.scss'></style>

