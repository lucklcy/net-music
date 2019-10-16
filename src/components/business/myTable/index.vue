<template>
  <div class="my-song-table">
    <TopBar back-route-name='r_home_recommand' title='我的歌单'></TopBar>
    <div class="tab border-bottom-1px">
      <ul class="container">
        <li class="item">
          <div class="pic fm-img" @click="doShowFmPlayer">
            <SvgIcon icon-class="fm" class-name="fm"></SvgIcon>
          </div>
          <span class="name-title">私人FM</span>
        </li>
      </ul>
    </div>
    <template v-if="mySongListArray && mySongListArray.length>0">
      <div class="label-title">我创建的歌单</div>
      <ul class="program-list">
        <li v-for="(item,index) in mySongListArray" v-if="item.userId===userInfo.userId" :key="index" @click="gotoDetail(item)">
          <div class="program-item">
            <div class="pic" :data-background-img='item.coverImgUrl' v-change-back-img>
              <SvgIcon :iconClass="'program-play'" :className="'program-play'"></SvgIcon>
            </div>
            <div class="content">
              <span class="name">{{item.name}}</span>
              <span class="count">
                <SvgIcon :iconClass="'earpod'" :className="'earpod'"></SvgIcon>
                <i>{{item.playCount|dealWithPlayCount}}</i>
              </span>
            </div>
          </div>
        </li>
      </ul>
      <div class="label-title">我收藏的歌单</div>
      <ul class="program-list">
        <li v-for="(item,index) in mySongListArray" v-if="item.userId!==userInfo.userId" :key="index" @click="gotoDetail(item)">
          <div class="program-item">
            <div class="pic" :data-background-img='item.coverImgUrl' v-change-back-img>
              <SvgIcon :iconClass="'program-play'" :className="'program-play'"></SvgIcon>
            </div>
            <div class="content">
              <span class="name">{{item.name}}</span>
              <span class="count">
                <SvgIcon :iconClass="'earpod'" :className="'earpod'"></SvgIcon>
                <i>{{item.playCount|dealWithPlayCount}}</i>
              </span>
              <span class="desc">{{item.description | limitIn(46)}}</span>
            </div>
          </div>
        </li>
      </ul>
    </template>
    <div class="loading" v-else>
      <SvgIcon :iconClass="'spinner-bars'" :className="'spinner-bars'"></SvgIcon>
    </div>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { UserInfo, IPlayList, ICreator, ICategory } from '@/common/interface/base.ts'
import TopBar from '~/foundation/com/topBar.vue'
import { Mutation, State } from 'vuex-class'
import ChangeBackImg from '@/directives/changeBackImg.ts'
import { N, Y } from '@/common/const'
import { isIos } from '@/utils/index.ts'

@Component({
  components: { TopBar },
  directives: {
    'change-back-img': ChangeBackImg
  }
})
export default class MyTable extends mixins(CommonMixin) {
  @State
  userInfo: UserInfo
  @State
  showFmPlayer: boolean

  private mySongListArray: IPlayList[] = []

  @Mutation
  changeTableCat: (payload: { type: number; cat: string }) => void
  @Mutation
  setCurrentSongListBackgroundUrl: (backgroundUrl: string) => void
  @Mutation
  changeFmPlayStatus: (flag: boolean) => void
  @Mutation
  changeFullScreen: (flag: boolean) => void

  private gotoDetail(item: IPlayList) {
    this.setCurrentSongListBackgroundUrl(item.coverImgUrl)
    this.$router.push({
      name: 'r_song_list',
      params: { id: item.id },
      query: {
        subscribed: item['subscribed'] ? Y : N
      }
    })
  }

  // 初始化时获取歌单数据
  private getMyTable() {
    this.service.getUserPlayList({ uid: this.userInfo.userId }).then((playListDetail: { playlist: IPlayList[] }) => {
      this.mySongListArray = playListDetail.playlist
    })
  }

  private doShowFmPlayer() {
    !this.showFmPlayer && this.changeFmPlayStatus(true)
    this.changeFullScreen(true)
  }

  private onOpenPlayList(item: IPlayList) {}

  activated() {
    this.getMyTable()
  }

  created() {
    this.getMyTable()
  }
}
</script>
<style lang="scss" scoped>
$baseAssets: '../../../assets';
.my-song-table {
  @include setSize(100%, 100%);
  .tab {
    @include setSize(100%, 240px);
    &.border-bottom-1px {
      @include border-set(bottom, $border-color);
    }
    .container {
      @include setFlexPos(row, flex-start, center);
      height: 100%;
      padding: 20px 80px;
      .item {
        height: 100%;
        @include setFlexPos(column, space-around, center);
        .pic {
          @include setSize(120px, 120px);
          border-radius: 50%;
          background-color: $color-highlight-background;
          @include setFlexPos(row, center, center);
          &.fm-img .fm {
            color: #fff;
            font-size: 0.68rem;
          }
        }
        .name-title {
          font-size: 0.32rem;
          color: #555;
        }
      }
    }
  }
  .label-title {
    padding: 28px 0 28px 50px;
    font-size: 0.42rem;
    font-weight: bold;
    color: #444;
  }
  .program-list {
    padding: 0 50px;
    li {
      margin-bottom: 20px;
    }
    .program-item {
      @include setFlexPos(row, flex-start, center);
      .pic {
        border-radius: 12px;
        position: relative;
        @include setSize(240px, 240px);
        @include setBgImg('#{$baseAssets}/img/cd-default.png', center, center, cover, no-repeat);
        .program-play {
          position: absolute;
          bottom: 12px;
          right: 12px;
          font-size: 0.6rem;
          color: #ffffffd2;
        }
      }
      .content {
        margin-left: 20px;
        @include setFlexPos(column, space-around, flex-start);
        @include setSize(74%, 240px);
        font-size: 0.222222rem;
        .name {
          display: inline-block;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.351852rem;
          color: #555;
        }
        .count {
          font-size: 0.3rem;
          color: #666;
          i {
            position: relative;
            top: 1px;
            font-style: normal;
            margin-left: 16px;
          }
          .earpod {
            font-size: 0.28rem;
          }
        }
        .desc {
          color: #999;
        }
      }
    }
  }
  .loading {
    @include setFlexPos(column, center, center);
    .spinner-bars {
      margin-top: 400px;
      font-size: 1rem;
      color: $color-highlight-background;
    }
  }
}
</style>


