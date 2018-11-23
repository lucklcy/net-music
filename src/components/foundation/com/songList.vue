<template>
  <section class="song-list">
    <p class="title">{{songListTitle}}</p>
    <div class="recommand-container">
      <ul class="recommand-list">
        <li v-for="(item,index) in SongList" :key="index" class="recommand-item">
          <div class="back-img" :style="{backgroundImage:'url('+item.picUrl+')'}">
            <div class="heared">
              <img :src="earPodImg" alt="听过">
              <span>{{item.playcount|dealWithPlayCount}}</span>
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

interface ISongDataList {
  id: number
  picUrl: string
  copywriter: string
  name: string
  [propName: string]: any
}

const enum SongType {
  RECOMMAND = 'recommand'
}

@Component({
  components: {}
})
export default class Header extends mixins(CommonMixin) {
  private SongList: ISongDataList[] = []
  private earPodImg: string | ImageData = require('@/assets/img/earPod.png')
  @Prop({ default: SongType.RECOMMAND })
  private type: string

  @State(state => state.userInfo.userId)
  private userId: number

  get songListTitle() {
    let title: string
    switch (this.type) {
      case SongType.RECOMMAND:
        title = '推荐歌单'
        break
      default:
        title = '推荐歌单'
        break
    }
    return title
  }
  created() {
    if (this.type === SongType.RECOMMAND) {
      this.service
        .getRecommendList({})
        .then((resultRecommendList: { recommend: ISongDataList[] }) => {
          this.SongList = resultRecommendList && resultRecommendList['recommend']
        })
        .catch((err: Error) => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped src='./songList.scss'></style>
