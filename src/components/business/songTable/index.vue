<template>
  <div class="song-table">
    <div class="top">
      <span @click='goBack'>
        <SvgIcon :iconClass="'arrow-left'" :className="'arrow-left'"></SvgIcon>
      </span>
      <span class="title">歌单</span>
      <SvgIcon :iconClass="'table'" :className="'table'"></SvgIcon>
    </div>
    <section class="high-quality" v-if="highQualitySongList">
      <div class="background" :style="{backgroundImage:'url('+highQualitySongList.coverImgUrl+')'}">
      </div>
    </section>
    <section class="container">
      <div class="oper-choose">
        <div class="all-category">
          <span class="lable">全部歌单</span>
          <SvgIcon :iconClass="'arrow-right-thin'" :className="'arrow-right-thin'"></SvgIcon>
        </div>
        <div class="hot-catgeory">
          <span class="border-1px-v">华语</span>
          <span class="border-1px-v">电子</span>
          <span>民谣</span>
        </div>
      </div>
      <ul class="list" v-if="handpickSongListArray && handpickSongListArray.length>0">
        <li class="item" v-for="(item,index) in handpickSongListArray" :key="index" @click="gotoDetail(item.id)">
          <div class="pic" :style="{backgroundImage:'url('+item.coverImgUrl+')'}"></div>
          <span>{{item.name}}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { ICreator } from '@/store/state'

interface ICreater {
  avatarUrl: string
  backgroundUrl: string
  nickname: string
  userId: number
  [propName: string]: any
}

interface IPlayList {
  createTime: number
  creator: ICreator
  copywriter?: string
  coverImgUrl: string
  description: string
  name: string
  playCount: number
  shareCount: number
  trackCount: number
  updateTime: number
  userId: number
  tags: string[]
  [propName: string]: any
}

@Component({
  components: {}
})
export default class SongTable extends mixins(CommonMixin) {
  private highQualitySongList: IPlayList | null = null
  private handpickSongListArray: IPlayList[] | null = null

  private goBack() {
    this.$router.push({ name: 'r_home_recommand' })
  }

  private gotoDetail(id: string) {
    this.$router.push({ name: 'r_song_list', query: { id } })
  }

  created() {
    this.service
      .getHandpickList({ limit: 50 })
      .then((handpickListResult: { playlists: IPlayList[] }) => {
        this.handpickSongListArray = handpickListResult['playlists']
      })
    this.service
      .getHighQualityList({ limit: 1 })
      .then((highQualityListResult: { playlists: IPlayList[] }) => {
        this.highQualitySongList =
          highQualityListResult['playlists'] && highQualityListResult['playlists'][0]
      })
  }
}
</script>
<style lang="scss" scoped>
$baseAsset: '../../../assets';
.song-table {
  @include setSize(100%, 100%);
  @include setFlexPos(column, flex-start, flex-start);
  .top {
    @include setSize(100%, 112px);
    @include setFlexPos(row, space-between, center);
    background-color: $color-highlight-background;
    z-index: 10;
    color: #fff;
    .arrow-left {
      font-size: 0.56rem;
      margin-left: 32px;
    }
    .title {
      font-size: 0.4rem;
    }
    .table {
      font-size: 0.56rem;
      margin-right: 40px;
    }
  }
  .high-quality {
    position: relative;
    background-color: #efefef;
    @include setSize(100%, 420px);
    .background {
      @include setBgImg('', center, center, cover, no-repeat);
      position: absolute;
      z-index: 9;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      filter: blur(40px);
    }
  }
  .container {
    flex: 1;
    z-index: 10;
    width: 100%;
    overflow: auto;
    .oper-choose {
      @include setSize(100%, 160px);
      @include setFlexPos(row, space-between, center);
      background-color: #fff;
      .all-category {
        padding: 10px 28px;
        margin-left: 20px;
        border: 1px #aaa solid;
        border-radius: 40px;
        .lable {
          margin-right: 20px;
          font-size: 0.4rem;
          color: #444;
        }
        .arrow-right-thin {
          font-size: 0.32rem;
          color: #aaa;
        }
      }
      .hot-catgeory {
        font-size: 0.36rem;
        color: #666;
        span {
          padding: 0 30px;
          &.border-1px-v {
            @include border-1px(right, $border-color);
          }
        }
      }
    }
    .list {
      z-index: 10;
      padding: 0 16px;
      background-color: #fff;
      @include setFlexPos(row, space-between, flex-start);
      flex-wrap: wrap;
      .item {
        .pic {
          @include setSize(100%, 560px);
          @include setBgImg('', center, center, cover, no-repeat);
          border-radius: 12px;
        }
        @include setSize(48vw, 680px);
      }
    }
  }
}
</style>


