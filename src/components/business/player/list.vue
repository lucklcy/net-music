<template>
  <div class="palyer-song-list">
    <div class="container">
      <div class="summary border-1px">
        <span>
          <SvgIcon :iconClass="getIcon" :className="getIcon"></SvgIcon>
          <span class="mode-lable" v-text="getModeString"></span>
          <SvgIcon :iconClass="'player-list-subscribe'" :className="'player-list-subscribe'"></SvgIcon>
          <span class="player-list-subscribe-lable">收藏全部</span>
        </span>
        <SvgIcon :iconClass="'player-list-garbage'" :className="'player-list-garbage'"></SvgIcon>
      </div>
      <div class="list-wrapper">
        <ul>
          <li v-for="(item,index) in playList" :key="index" class="border-1px" @click="doClick(item.id)">
            <div class="face">
              <SvgIcon :iconClass="'playing'" :className="'playing'" v-show="currentSong.id === item.id"></SvgIcon>
              <span v-show="currentSong.id !== item.id">&nbsp;</span>
              <span class="cd" :style="{backgroundImage:'url('+item.picUrl+')'}"></span>
            </div>
            <div :class="{'content':true,'active':currentSong.id === item.id}">
              <span class="name">{{item.name | limitIn(16) }}</span>
              <span class="space"> - </span>
              <span class="songer">{{item.songer | limitIn(8)}}</span>
            </div>
            <SvgIcon :iconClass="'delete'" :className="'delete'"></SvgIcon>
          </li>
          <li class="last">
            <span>...到底啦....</span>
          </li>
        </ul>
      </div>

      <div class="close border-1px" @click="changeShowSongList(false)">
        <span>关闭</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Emit, Prop, Watch } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State, Mutation } from 'vuex-class'
import { PLAYING_MODE } from '@/store/state.ts'
import { IPlaySong } from '@/common/interface/base.ts'

@Component({
  components: {}
})
export default class PlaySongList extends mixins(CommonMixin) {
  @State mode: string
  @State playList: IPlaySong[]
  @State currentSong: IPlaySong
  @State showSongList: boolean

  @Mutation changePlayingMode: (mode: string) => void
  @Mutation setCurrentSong: (songId: number) => void
  @Mutation changePlayingStatus: (flag: boolean) => void
  @Mutation changeShowSongList: (flag: boolean) => void

  get getIcon() {
    return `player-mode-${this.mode}`
  }

  get getModeString() {
    const MODE_NAME_MAP = {
      [PLAYING_MODE.SEQUENCE]: '顺序播放',
      [PLAYING_MODE.LOOP]: '单曲循环',
      [PLAYING_MODE.RANDOM]: '随机播放',
      [PLAYING_MODE.CYCLE]: '循环播放'
    }
    return MODE_NAME_MAP[this.mode]
  }

  doClick(songId: number): void {
    this.changePlayingStatus(false)
    this.setCurrentSong(songId)
  }
}
</script>
<style lang="scss" scoped>
.palyer-song-list {
  .container {
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    @include setFlexPos(column, space-between, flex-start);
    @include setSize(100%, 100%);
    background-color: #fff;
    overflow: auto;
    .summary {
      @include setSize(100%, 100px);
      @include setFlexPos(row, space-between, center);
      &.border-1px {
        @include border-1px(bottom, $border-color);
      }
      .svg-icon {
        &.player-mode-sequence,
        &.player-mode-loop,
        &.player-mode-cycle,
        &.player-mode-random {
          font-size: 0.46rem;
          color: #555;
          margin-left: 40px;
        }
      }
      .mode-lable {
        font-size: 0.38rem;
        color: #444;
        margin-left: 20px;
      }
      .player-list-subscribe {
        font-size: 0.46rem;
        color: #555;
        margin-left: 160px;
      }
      .player-list-subscribe-lable {
        font-size: 0.38rem;
        color: #444;
        margin-left: 20px;
      }
      .player-list-garbage {
        font-size: 0.46rem;
        color: #333;
        margin-right: 60px;
      }
    }
    .list-wrapper {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      width: 100%;
      li {
        @include setSize(100%, 106px);
        @include setFlexPos(row, space-between, center);
        &.border-1px {
          @include border-1px(bottom, #efefef);
        }
        .cd {
          display: inline-block;
          @include setSize(60px, 60px);
          border-radius: 10%;
          @include setBgImg('', center, center, cover, no-repeat);
        }
        .face {
          width: 160px;
          @include setFlexPos(row, space-between, center);
          .playing {
            margin-left: 20px;
            font-size: 0.44rem;
            color: $color-highlight-background;
          }
        }
        .content {
          flex: 1;
          display: inline-block;
          overflow: hidden;
          margin-left: 60px;
          &.active {
            .name,
            .space,
            .songer {
              color: $color-highlight-background;
            }
          }
          .name {
            font-size: 0.34rem;
            color: #666;
          }
          .space {
            font-size: 0.26rem;
            color: #999;
          }
          .songer {
            font-size: 0.26rem;
            color: #999;
          }
        }
        .delete {
          margin-right: 60px;
          font-size: 0.32rem;
          color: #999;
        }
        &.last {
          @include setSize(100%, 80px);
          font-size: 0.26rem;
          color: #ccc;
          @include setFlexPos(row, center, center);
        }
      }
    }
    .close {
      @include setFlexPos(row, center, center);
      @include setSize(100%, 110px);
      &.border-1px {
        @include border-1px(top, $border-color);
      }
      font-size: 0.42rem;
      color: #666;
    }
  }
}
</style>
