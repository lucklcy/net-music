<template>
  <section class="song-list">
    <p class="title">{{songListTitle}}</p>
    <div class="recommand-container">
      <ul class="recommand-list">
        <li v-for="(item,index) in SongList" :key="index" class="recommand-item" @click='onSongRecommandClick(item.id)'>
          <div class="back-img" :style="{backgroundImage:'url('+item.picUrl+')'}">
            <div class="heared">
              <img :src="earPodImg" alt="听过">
              <span>{{item.playcount|dealWithPlayCount}}</span>
            </div>
            <div class="description">
              <div class="avatar" :style="{backgroundImage:'url('+item.creator.avatarUrl+')'}"></div>
              <span>{{item.creator.nickname | limitIn(7)}}</span>
            </div>
          </div>
          <div class="content">{{item.name | limitIn(16)}}</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State } from 'vuex-class'

interface ISongRecommandList {
  id: number
  picUrl: string
  copywriter: string
  name: string
  [propName: string]: any
}

const enum SongRecType {
  RECOMMAND = 'recommand'
}

@Component({
  components: {}
})
export default class Header extends mixins(CommonMixin) {
  private SongList: ISongRecommandList[] = []
  private earPodImg: string | ImageData = require('@/assets/img/earPod.png')
  @Prop({ default: SongRecType.RECOMMAND })
  private type: string

  @State(state => state.userInfo.userId)
  private userId: number

  private onSongRecommandClick(id: string) {
    this.$router.push({ name: 'r_song_list', query: { id } })
  }

  get songListTitle() {
    let title: string
    switch (this.type) {
      case SongRecType.RECOMMAND:
        title = '推荐歌单'
        break
      default:
        title = '推荐歌单'
        break
    }
    return title
  }
  created() {
    if (this.type === SongRecType.RECOMMAND) {
      this.service
        .getRecommendList({})
        .then((resultRecommendList: { recommend: ISongRecommandList[] }) => {
          this.SongList = resultRecommendList && resultRecommendList['recommend']
        })
        .catch((err: Error) => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped src='./songrec.scss'></style>
