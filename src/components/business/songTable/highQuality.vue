<template>
  <div class="song-table-high-quality">
    <TopBar back-route-name='r_song_table_index' :title="getCatTitle"></TopBar>
    <div class="oper-choose border-bottom-1px">
      <span @click="isShowTableCat = true">{{hotTableCat===''?'全部':hotTableCat}}</span>
      <span @click='isShowTableCat = true'>
        <SvgIcon :iconClass="'filtrate'" :className="'filtrate'"></SvgIcon>
        筛选
      </span>
    </div>
    <Scroll class="container" ref="highQualitySongList" :data-list="highQualitySongListArray"
      :pullup="true" @scrollToEnd="doPullup" v-if="highQualitySongListArray && highQualitySongListArray.length>0">
      <ul class="list">
        <li class="item" v-for="(item,index) in highQualitySongListArray" :key="item.id" @click="gotoDetail(item)">
          <div class="pic" :data-background-img='item.coverImgUrl' v-change-back-img>
            <SvgIcon v-if="item.highQuality" :iconClass="'high-quality-triangle'" :className="'high-quality-triangle'"></SvgIcon>
            <div class="heared">
              <span>
                <SvgIcon :iconClass="'earpod'" :className="'earpod'"></SvgIcon>
                <i> {{item.playCount|dealWithPlayCount}}</i>
              </span>
            </div>
          </div>
          <div class="label border-bottom-1px">
            <span class="name">{{item.name}}</span>
            <span class="author">by {{item.creator.nickname}}</span>
            <span class="copywriter">
              <i class="tag border-1px">{{item.tag}}</i>
              {{item.copywriter}}</span>
          </div>
        </li>
        <li class="pull-up-asking" v-if="total>highQualitySongListArray.length">
          <SvgIcon :iconClass="'small-loading'" :className="'small-loading'"></SvgIcon>
          <span>加载中</span>
          <SvgIcon :iconClass="'small-loading'" :className="'small-loading'"></SvgIcon>
        </li>
        <li class="no-more" v-else>
          <span>没有更过了...</span>
        </li>
      </ul>
    </Scroll>
    <div class="spinner-container" v-else>
      <div class="loadding">
        <SvgIcon :iconClass="'spinner-bars'" :className="'spinner-bars'"></SvgIcon>
      </div>
    </div>
    <div class="table-cat" v-show="isShowTableCat">
      <div class="cat-container">
        <div class="all" @click="changeCat('')" :class="{'active':hotTableCat===''}">
          <span class="border-1px">
            全部
            <SvgIcon v-if="hotTableCat===''" :iconClass="'right-triangle'" :className="'right-triangle'"></SvgIcon>
          </span>
        </div>
        <div class="cat-list border-top-1px">
          <div class="cat-list-container border-left-1px">
            <div class="cat-item border-bottom-1px" v-for='(item,index) in tableCatArray' @click="changeCat(item.value)">
              <span :class="{'active':hotTableCat===item.value,'border-right-1px':true}">
                {{item.value}}
                <SvgIcon v-if='hotTableCat===item.value' :iconClass="'right-triangle'" :className="'right-triangle'"></SvgIcon>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal" @click="isShowTableCat = false"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { ICreator, IPlayList } from '@/common/interface/base.ts'
import TopBar from '~/foundation/com/topBar.vue'
import Scroll from '~/foundation/base/scroll.vue'
import { Mutation, State } from 'vuex-class'
import { isEmpty } from '@/utils/index.ts'
import { HOT_TABLE_CAT_ARRAY } from '@/common/const.ts'
import ChangeBackImg from '@/directives/changeBackImg.ts'

@Component({
  components: { TopBar, Scroll },
  directives: {
    'change-back-img': ChangeBackImg
  }
})
export default class SongHighQualityTable extends mixins(CommonMixin) {
  @State hotTableCat: string
  @Mutation changeTableCat: (payload: { type: number; cat: string }) => void
  @Mutation setCurrentSongListBackgroundUrl: (backgroundUrl: string) => void
  private highQualitySongListArray: IPlayList[] = []
  private limit: number = 10
  private updateTime: number = 0
  private tableCatArray: any[] = HOT_TABLE_CAT_ARRAY
  private isShowTableCat: boolean = false
  private total: number = 0
  private gotoDetail(item: IPlayList) {
    this.setCurrentSongListBackgroundUrl(item.coverImgUrl)
    this.$router.push({ name: 'r_song_list', params: { id: item.id } })
  }
  private doPullup() {
    this.addHighQualityList()
  }

  private addHighQualityList() {
    if (this.total > this.highQualitySongListArray.length) {
      let params: { [propName: string]: string | number } = {
        limit: this.limit,
        before: this.updateTime
      }
      if (this.hotTableCat !== '') {
        params['cat'] = this.hotTableCat
      }
      this.service
        .getHighQualityList(params)
        .then((highQualityListResult: { playlists: IPlayList[] }) => {
          let thisHighQualitySongListArray = this.highQualitySongListArray
          let tempHighQualitySongListArray =
            highQualityListResult['playlists'] && highQualityListResult['playlists']
          this.updateTime =
            tempHighQualitySongListArray[tempHighQualitySongListArray.length - 1]['updateTime']
          this.highQualitySongListArray = thisHighQualitySongListArray.concat(
            tempHighQualitySongListArray
          )
        })
    }
  }
  private changeCat(name: string) {
    this.isShowTableCat = false
    this.changeTableCat({ type: 1, cat: name })
    this.getPlayList()
  }
  // 获取精选歌单
  private getPlayList() {
    this.highQualitySongListArray = []
    this.$nextTick(() => {
      let params: { [propName: string]: string | number } = { limit: this.limit }
      if (this.hotTableCat !== '') {
        params['cat'] = this.hotTableCat
      }
      this.service
        .getHighQualityList(params)
        .then((highQualityListResult: { playlists: IPlayList[]; total: number }) => {
          this.total = highQualityListResult['total']
          let tempHighQualitySongListArray =
            highQualityListResult['playlists'] && highQualityListResult['playlists']
          this.highQualitySongListArray = tempHighQualitySongListArray
          this.updateTime =
            tempHighQualitySongListArray[tempHighQualitySongListArray.length - 1]['updateTime']
        })
    })
  }
  get getCatTitle() {
    if (isEmpty(this.hotTableCat)) {
      return '精品歌单'
    } else return this.hotTableCat + '.精品歌单'
  }
  created() {
    this.getPlayList()
  }
}
</script>
<style lang="scss">
$baseAsset: '../../../assets';
$category-background-color: #f8f8f8;
$category-border-color: #aaa;
.song-table-high-quality {
  @include setSize(100%, 100%);
  @include setFlexPos(column, flex-start, flex-start);
  .oper-choose {
    @include setSize(100%, 92px);
    @include setFlexPos(row, space-between, center);
    &.border-bottom-1px {
      @include border-set(bottom, $border-color);
    }
    background-color: $category-background-color;
    padding: 0 2vw;
    font-size: 0.38rem;
    color: #333;
  }
  .table-cat {
    position: fixed;
    top: 140px;
    left: 0;
    right: 0;
    bottom: 0;
    animation: fadeIn 0.2s 1 0s;
    opacity: 0.956;
    @include setFlexPos(column, flex-start, flex-start);
    .cat-container {
      @include setSize(100%, '');
      padding: 3vw 1vw 2vw 1vw;
      background-color: $category-background-color;
      .all {
        @include setSize(100%, 132px);
        padding: 0 0 3vw 0;
        span {
          display: inline-block;
          @include setSize(100%, 100%);
          text-align: center;
          font-size: 0.34rem;
          line-height: 108px;
          color: #222;
          @include border-set(all, $category-border-color);
          &.active {
            color: $color-highlight-background;
          }
        }
      }
      .cat-list {
        @include border-set(top, $category-border-color);
        .cat-list-container {
          @include setFlexPos(row, flex-start, flex-start);
          flex-wrap: wrap;
          @include border-set(left, $category-border-color);
          .cat-item {
            @include setSize(24.5vw, 108px);
            @include border-set(bottom, $category-border-color);
            span {
              @include setSize(100%, 100%);
              display: inline-block;
              text-align: center;
              line-height: 100px;
              font-size: 0.32rem;
              padding: 10px;
              @include border-set(right, #999);
              &.active {
                color: $color-highlight-background;
              }
            }
          }
        }
      }
      .right-triangle {
        position: absolute;
        bottom: 1px;
        right: 1px;
        font-size: 0.56rem;
        color: $color-highlight-background;
      }
    }
    .modal {
      @include setSize(100%, '');
      flex: 1;
      background-color: rgba(39, 39, 39, 0.301);
    }
  }

  .container {
    flex: 1;
    width: 100%;
    margin: 20px 0 4px 0;
    overflow: hidden;
    .list {
      z-index: 10;
      padding: 0 18px;
      background-color: #fff;
      .item {
        width: 100%;
        margin-bottom: 12px;
        @include setFlexPos(row, space-between, flex-start);
        .pic {
          @include setSize(320px, 320px);
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
              margin: 0 0 0 8px;
              color: #eee;
              font-size: 0.32rem;
              .earpod {
                font-size: 0.28rem;
              }
              i {
                font-style: normal;
                position: relative;
                top: 1px;
              }
            }
          }
        }
        .label {
          @include setSize(700px, 320px);
          @include setFlexPos(column, space-around, flex-start);
          &.border-bottom-1px {
            @include border-set(bottom, $border-color);
          }
          .name {
            font-size: 0.4rem;
            font-weight: bold;
            color: #222;
            line-height: 1.2;
          }
          .author {
            font-size: 0.28rem;
            color: #666;
          }
          .copywriter {
            .tag {
              font-style: normal;
              color: $color-highlight-background;
              font-size: 0.2rem;
              padding: 0px 8px 0px 8px;
              display: inline-block;
              &.border-1px {
                @include border-set(all, $color-highlight-background, 1px, 12px);
              }
            }
            font-size: 0.28rem;
            color: #666;
            line-height: 1.4;
          }
        }
      }
      .pull-up-asking {
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
      .no-more {
        @include setSize(100%, 82px);
        @include setFlexPos(row, center, center);
        span {
          font-size: 0.38rem;
          margin: 0 24px;
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
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.9;
    }
  }
}
</style>


