<template>
  <div class="song-table">
    <TopBar back-route-name='r_home_recommand' title='歌单'></TopBar>
    <section class="high-quality" v-if="highQualitySong" @click="$router.push({ name: 'r_song_table_high_quality' })">
      <div class="background" :data-background-img='highQualitySong.coverImgUrl' v-change-back-img>
      </div>
      <div class="content">
        <div class="pic" :data-background-img='highQualitySong.coverImgUrl' v-change-back-img></div>
        <ul class="label">
          <li class="title">
            <SvgIcon :iconClass="'high-quality'" :className="'high-quality'"></SvgIcon>
            <i>精品歌单</i>
            <SvgIcon :iconClass="'arrow-right-thin'" :className="'arrow-right-thin'"></SvgIcon>
          </li>
          <li class="name">{{highQualitySong.name | limitIn(17)}}</li>
          <li class="copywriter">{{highQualitySong.copywriter}}</li>
        </ul>
      </div>
    </section>
    <div class="spinner-high-quality" v-else>
      <SvgIcon :iconClass="'spinner-bars'" :className="'spinner-bars'"></SvgIcon>
    </div>
    <section class="oper-choose">
      <div class="all-category" @click="$router.push({ name: 'r_table_cat_choose' })">
        <span class="lable">{{tableCat || '全部歌单'}}</span>
        <SvgIcon :iconClass="'arrow-right-thin'" :className="'arrow-right-thin'"></SvgIcon>
      </div>
      <div class="hot-catgeory">
        <span :class="{'border-right-1px':index!== 4,'active':item.name===tableCat}" v-for="(item,index) in hotCategoryList"
          :key="index" @click="changeCat(item.name)" v-if="index<=4">
          {{item.name}}
        </span>
      </div>
    </section>
    <Scroll class="container" ref="handpickSongList" :data-list="handpickSongListArray" :pullup="true"
      @scrollToEnd="doPullup" v-if="handpickSongListArray && handpickSongListArray.length>0">
      <ul class="list">
        <li class="item" v-for="(item,index) in handpickSongListArray" :key="item.id" @click="gotoDetail(item)">
          <div class="pic" :data-background-img='item.coverImgUrl' v-change-back-img>
            <SvgIcon v-if="item.highQuality" :iconClass="'high-quality-triangle'" :className="'high-quality-triangle'"></SvgIcon>
            <div class="heared">
              <span>
                <SvgIcon :iconClass="'earpod'" :className="'earpod'"></SvgIcon>
                <i>{{item.playCount|dealWithPlayCount}}</i>
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
              <span>{{item.creator.nickname | limitIn(7)}}</span>
            </div>
          </div>
          <span class="name">{{item.name}}</span>
        </li>
        <li class="pull-up-asking">
          <SvgIcon :iconClass="'small-loading'" :className="'small-loading'"></SvgIcon>
          <span>加载中</span>
          <SvgIcon :iconClass="'small-loading'" :className="'small-loading'"></SvgIcon>
        </li>
      </ul>
    </Scroll>
    <div class="spinner-container" v-else>
      <div class="loadding">
        <SvgIcon :iconClass="'spinner-bars'" :className="'spinner-bars'"></SvgIcon>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { ICreator, IPlayList, ICategory } from '@/common/interface/base.ts'
import TopBar from '~/foundation/com/topBar.vue'
import Scroll from '~/foundation/base/scroll.vue'
import { Mutation, State } from 'vuex-class'
import ChangeBackImg from '@/directives/changeBackImg.ts'

@Component({
  components: { TopBar, Scroll },
  directives: {
    'change-back-img': ChangeBackImg
  }
})
export default class SongTable extends mixins(CommonMixin) {
  @State tableCat: string

  private currentPage: number = 1
  private highQualitySong: IPlayList | null = null
  private handpickSongListArray: IPlayList[] = []
  private limit: number = 10
  private categoryList: ICategory[] = []
  private hotCategoryList: ICategory[] = []

  @Mutation changeTableCat: (payload: { type: number; cat: string }) => void
  @Mutation setCurrentSongListBackgroundUrl: (backgroundUrl: string) => void

  private gotoDetail(item: IPlayList) {
    this.setCurrentSongListBackgroundUrl(item.coverImgUrl)
    this.$router.push({ name: 'r_song_list', params: { id: item.id } })
  }

  // 初始化时获取歌单数据
  private getHandpickList() {
    this.handpickSongListArray = []
    let params: { [propName: string]: any } = {
      offset: 0,
      limit: this.limit
    }
    if (this.tableCat !== '') {
      params['cat'] = this.tableCat
    }
    this.service.getHandpickList(params).then((handpickListResult: { playlists: IPlayList[] }) => {
      let tempHandpickSongListArray = handpickListResult['playlists']
      this.handpickSongListArray = tempHandpickSongListArray
    })
  }

  // 上拉加载时，加载下一页数据
  private addHandpickList() {
    let params: { [propName: string]: any } = {
      offset: this.currentPage * this.limit,
      limit: this.limit
    }
    if (this.tableCat !== '') {
      params['cat'] = this.tableCat
    }
    this.service.getHandpickList(params).then((handpickListResult: { playlists: IPlayList[] }) => {
      let tempHandpickSongListArray = handpickListResult['playlists']
      let _thisHandpickSongListArray = this.handpickSongListArray
      ++this.currentPage
      this.handpickSongListArray = _thisHandpickSongListArray.concat(tempHandpickSongListArray)
    })
  }

  // 获取精品歌单，作为顶部精品歌单概览展示用
  private getHighQualityList() {
    this.service
      .getHighQualityList({ limit: 1 })
      .then((highQualityListResult: { playlists: IPlayList[] }) => {
        this.highQualitySong =
          highQualityListResult['playlists'] && highQualityListResult['playlists'][0]
      })
  }

  // 当点击切换歌单类型的时候
  private changeCat(name: string) {
    this.changeTableCat({ type: 0, cat: name })
    this.currentPage = 1
    this.getHandpickList()
  }

  // 获取热门歌单类型
  private getHotCategoryList() {
    this.service.getHotCategoryList({}).then((hotCategoryListResult: { tags: ICategory[] }) => {
      this.hotCategoryList = hotCategoryListResult['tags']
    })
  }

  // 上拉时，加载下一页歌单数据
  private doPullup() {
    this.addHandpickList()
  }

  activated() {
    this.getHandpickList()
  }

  created() {
    this.getHighQualityList()
    this.getHotCategoryList()
    this.getHandpickList()
  }
}
</script>
<style lang="scss" scoped>
$baseAsset: '../../../assets';
.song-table {
  @include setSize(100%, 100%);
  @include setFlexPos(column, flex-start, flex-start);
  .high-quality {
    position: relative;
    background-color: #333;
    @include setSize(100%, 420px);
    .background {
      @include setBgImg('#{$baseAsset}/img/cd-default.png', center, center, cover, no-repeat);
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
        @include setBgImg('#{$baseAsset}/img/cd-default.png', center, center, cover, no-repeat);
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
  .spinner-high-quality {
    @include setSize(100%, 420px);
    @include setFlexPos(row, center, center);
    z-index: 10;
    background-color: #fff;
    .spinner-bars {
      font-size: 0.86rem;
      color: $color-highlight-background;
    }
  }
  .oper-choose {
    z-index: 10;
    @include setSize(100%, 152px);
    @include setFlexPos(row, space-between, center);
    background-color: #fff;
    .all-category {
      padding: 0 28px;
      @include setFlexPos(row, space-between, center);
      @include setSize('', 76px);
      margin-left: 20px;
      border: 1px #aaa solid;
      border-radius: 40px;
      .lable {
        margin-right: 20px;
        font-size: 0.35rem;
        color: $color-highlight-background;
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
        &.border-right-1px {
          @include border-set(right, $border-color);
        }
        &.active {
          color: $color-highlight-background;
        }
      }
    }
  }
  .container {
    flex: 1;
    width: 100%;
    overflow: hidden;
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
          @include setBgImg('#{$baseAsset}/img/cd-default.png', center, center, cover, no-repeat);
          border-radius: 12px;
          position: relative;
          .high-quality-triangle {
            color: $color-theme;
            font-size: 0.68rem;
          }
          .heared {
            float: right;
            padding: 10px 10px 0 0;
            span {
              display: inline-block;
              padding: 4px 20px 8px 20px;
              background-color: rgba(61, 60, 60, 0.363);
              border-radius: 6px;
              margin: 0 0 0 8px;
              color: #eee;
              font-size: 0.32rem;
              .earpod {
                font-size: 0.28rem;
              }
              i {
                position: relative;
                top: 1px;
                font-style: normal;
                margin-left: 8px;
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
              .avatar-male-default,
              .avatar-female-default,
              .avatar-default {
                font-size: 0.4rem;
                color: #fff;
              }
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
      .pull-up-asking {
        @include setSize(100vw, '');
        @include setFlexPos(row, center, center);
        span {
          font-size: 0.38rem;
          margin: 0 24px;
          color: #666;
        }
        .small-loading {
          font-size: 1rem;
          color: #999;
        }
      }
    }
  }
  .spinner-container {
    flex: 1;
    width: 100%;
    overflow: hidden;
    .loadding {
      @include setSize(100%, 100%);
      @include setFlexPos(row, center, center);
      background-color: #fff;
      .spinner-bars {
        font-size: 0.86rem;
        color: $color-highlight-background;
      }
    }
  }
}
</style>


