<template>
  <div class="song-table">
    <div class="top">
      <span @click='goBack'>
        <SvgIcon :iconClass="'arrow-left'" :className="'arrow-left'"></SvgIcon>
      </span>
      <span class="title">歌单</span>
      <SvgIcon :iconClass="'table'" :className="'table'"></SvgIcon>
    </div>
    <section class="high-quality" v-if="highQualitySong" @click="goToHighQualityTable">
      <div class="background" :style="{backgroundImage:'url('+highQualitySong.coverImgUrl+')'}">
      </div>
      <div class="content">
        <div class="pic" :style="{backgroundImage:'url('+highQualitySong.coverImgUrl+')'}"></div>
        <ul class="label">
          <li class="title">
            <SvgIcon :iconClass="'high-quality'" :className="'high-quality'"></SvgIcon>
            <i>精品歌单</i>
            <SvgIcon :iconClass="'arrow-right-thin'" :className="'arrow-right-thin'"></SvgIcon>
          </li>
          <li class="name">{{highQualitySong.name | limitIn(19)}}</li>
          <li class="copywriter">{{highQualitySong.copywriter}}</li>
        </ul>
      </div>
    </section>
    <section class="oper-choose">
      <div class="all-category">
        <span class="lable">全部歌单</span>
        <SvgIcon :iconClass="'arrow-right-thin'" :className="'arrow-right-thin'"></SvgIcon>
      </div>
      <div class="hot-catgeory">
        <span class="border-1px-v">华语</span>
        <span class="border-1px-v">电子</span>
        <span>民谣</span>
      </div>
    </section>
    <section class="container">
      <ul class="list" v-if="handpickSongListArray && handpickSongListArray.length>0">
        <li class="item" v-for="(item,index) in handpickSongListArray" :key="index" @click="gotoDetail(item.id)">
          <div class="pic" :style="{backgroundImage:'url('+item.coverImgUrl+')'}">
            <div class="heared">
              <span>
                <i class="iconfont icon-erji"></i>
                {{item.playCount|dealWithPlayCount}}
              </span>
            </div>
            <div class="description">
              <div class="avatar" :style="{backgroundImage:'url('+item.creator.avatarUrl+')'}"></div>
              <span>{{item.creator.nickname | limitIn(7)}}</span>
            </div>
          </div>
          <span class="name">{{item.name}}</span>
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
  private highQualitySong: IPlayList | null = null
  private handpickSongListArray: IPlayList[] | null = null

  private goBack() {
    this.$router.push({ name: 'r_home_recommand' })
  }

  private gotoDetail(id: string) {
    this.$router.push({ name: 'r_song_list', query: { id } })
  }

  private goToHighQualityTable() {
    this.$router.push({ name: 'r_song_table_high_quality' })
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
        this.highQualitySong =
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
    @include setSize(100%, 138px);
    @include setFlexPos(row, space-between, center);
    background-color: $color-highlight-background;
    z-index: 10;
    color: #fff;
    .arrow-left {
      font-size: 0.62rem;
      margin-left: 32px;
    }
    .title {
      font-size: 0.44rem;
    }
    .table {
      font-size: 0.62rem;
      margin-right: 40px;
    }
  }
  .high-quality {
    position: relative;
    background-color: #333;
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
    .content {
      z-index: 10;
      position: relative;
      padding: 80px 20px 0 20px;
      @include setFlexPos(row, space-around, center);
      .pic {
        @include setSize(292px, 292px);
        @include setBgImg('', center, center, cover, no-repeat);
        border-radius: 12px;
      }
      .label {
        @include setSize(672px, 292px);
        .title {
          height: 100px;
          @include setFlexPos(row, flex-start, center);
          .high-quality {
            color: $color-theme;
            @include setSize(62px, 62px);
            background-color: rgba(255, 255, 255, 0);
            margin-right: 32px;
          }
          i {
            font-style: normal;
            font-size: 0.48rem;
            color: #fff;
            margin-right: 26px;
          }
          .arrow-right-thin {
            font-size: 0.46rem;
            color: #fff;
          }
        }
        .name {
          margin-top: 28px;
          font-size: 0.38rem;
          color: #fff;
        }
        .copywriter {
          margin-top: 20px;
          font-size: 0.28rem;
          color: #afafaf;
        }
      }
    }
  }
  .oper-choose {
    z-index: 10;
    @include setSize(100%, 152px);
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
  .container {
    flex: 1;
    width: 100%;
    overflow: auto;
    .list {
      z-index: 10;
      padding: 0 32px;
      background-color: #fff;
      @include setFlexPos(row, space-between, flex-start);
      flex-wrap: wrap;
      .item {
        width: 46vw;
        margin-bottom: 20px;
        .pic {
          @include setSize(100%, 520px);
          @include setBgImg('', center, center, cover, no-repeat);
          border-radius: 12px;
          position: relative;
          .heared {
            float: right;
            padding: 10px 10px 0 0;
            span {
              margin: 0 0 0 8px;
              color: #eee;
              font-size: 0.32rem;
              .iconfont {
                font-size: 0.28rem;
              }
            }
          }
          .description {
            position: absolute;
            font-size: 0.37rem;
            color: #fff;
            bottom: 18px;
            left: 18px;
            background-color: rgba(61, 60, 60, 0.363);
            @include setFlexPos(row, flex-start, center);
            .avatar {
              @include setSize(56px, 56px);
              @include setBgImg('', center, center, cover, no-repeat);
              border-radius: 4px;
            }
            span {
              margin-left: 16px;
              font-size: 0.28rem;
            }
          }
        }
        .name {
          display: inline-block;
          padding: 20px 20px;
          font-size: 0.36rem;
          color: #555;
        }
      }
    }
  }
}
</style>


