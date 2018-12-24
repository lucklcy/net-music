<template>
  <section class="song-list">
    <p class="title">{{songListTitle}}</p>
    <div class="recommand-container">
      <ul class="recommand-list">
        <li v-for="(item,index) in SongList" :key="index" class="recommand-item" @click='onSongRecommandClick(item)'>
          <div class="back-img" :data-background-img='item.picUrl' v-change-back-img>
            <div class="heared">
              <span>
                <i class="iconfont icon-erji"></i>
                {{item.playcount|dealWithPlayCount}}
              </span>
            </div>
            <div class="description">
              <div class="avatar">
                <SvgIcon v-if="item.creator.gender === 1" :iconClass="'avatar-male-default'"
                  :className="'avatar-male-default'"></SvgIcon>
                <SvgIcon v-else-if="item.creator.gender === 2" :iconClass="'avatar-female-default'"
                  :className="'avatar-female-default'"></SvgIcon>
                <SvgIcon v-else :iconClass="'avatar-default'" :className="'avatar-default'"></SvgIcon>
              </div>
              <span>{{item.creator.nickname | limitIn(5)}}</span>
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
import { State, Mutation } from 'vuex-class'
import { ISongRecommandList, IPlaylist } from '@/common/interface/base.ts'
import ChangeBackImg from '@/directives/changeBackImg.ts'

const enum SongRecType {
  RECOMMAND = 'recommand'
}

@Component({
  components: {},
  directives: {
    'change-back-img': ChangeBackImg
  }
})
export default class SongRec extends mixins(CommonMixin) {
  private SongList: ISongRecommandList[] = []

  @State(state => state.userInfo.userId)
  private userId: number

  @Prop({ default: SongRecType.RECOMMAND })
  private type: string

  @Mutation
  setCurrentSongListBackgroundUrl: (backgroundUrl: string) => void

  private onSongRecommandClick(item: IPlaylist) {
    this.setCurrentSongListBackgroundUrl(item.coverImgUrl)
    this.$router.push({ name: 'r_song_list', params: { id: item.id } })
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
