<template>
  <section class="song-list">
    <p class="title">{{songListTitle}}</p>
    <div class="recommand-container">
      <ul class="recommand-list">
        <li v-for="(item,index) in SongList" :key="index" class="recommand-item" @click='onSongRecommandClick(item)'>
          <div class="back-img" :data-background-img='item.picUrl' v-change-back-img>
            <div class="heared">
              <span>
                <SvgIcon :iconClass="'earpod'" :className="'earpod'"></SvgIcon>
                <i>{{item.playcount|dealWithPlayCount}}</i>
              </span>
            </div>
            <div class="description">
              <div class="avatar">
                <SvgIcon v-if="item.creator.gender === 1" :iconClass="'avatar-male-default'" :className="'avatar-male-default'"></SvgIcon>
                <SvgIcon v-else-if="item.creator.gender === 2" :iconClass="'avatar-female-default'" :className="'avatar-female-default'"></SvgIcon>
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
import { Y, N } from '@/common/const'

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
    this.setCurrentSongListBackgroundUrl(item.picUrl)
    this.$router.push({
      name: 'r_song_list',
      params: { id: item.id },
      query: {
        subscribed: item['subscribed'] ? Y : N
      }
    })
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
  private dealRecommendList(SongList: ISongRecommandList[]) {
    if (SongList && SongList.length > 0) {
      if (SongList.length <= 9) {
        this.SongList = SongList.slice(0, 6)
      } else if (SongList.length <= 12) {
        this.SongList = SongList.slice(0, 9)
      } else if (SongList.length <= 15) {
        this.SongList = SongList.slice(0, 12)
      } else if (SongList.length <= 18) {
        this.SongList = SongList.slice(0, 15)
      } else if (SongList.length <= 21) {
        this.SongList = SongList.slice(0, 18)
      } else if (SongList.length <= 24) {
        this.SongList = SongList.slice(0, 21)
      } else if (SongList.length <= 27) {
        this.SongList = SongList.slice(0, 24)
      } else if (SongList.length <= 30) {
        this.SongList = SongList.slice(0, 27)
      }
    }
  }
  created() {
    if (this.type === SongRecType.RECOMMAND) {
      this.service
        .getRecommendList({})
        .then((resultRecommendList: { recommend: ISongRecommandList[] }) => {
          this.dealRecommendList(resultRecommendList && resultRecommendList['recommend'])
        })
        .catch((err: Error) => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped src='./songrec.scss'></style>
