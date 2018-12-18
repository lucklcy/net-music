<template>
  <div class="song-table">
    <TopBar back-route-name='r_home_recommand' title='歌单'></TopBar>
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
      <div class="all-category" @click="goToCatChoose">
        <span class="lable">全部歌单</span>
        <SvgIcon :iconClass="'arrow-right-thin'" :className="'arrow-right-thin'"></SvgIcon>
      </div>
      <div class="hot-catgeory">
        <span :class="{'border-right-1px':index!== 4,'active':item.name===tableCat}" v-for="(item,index) in hotCategoryList"
          :key="index" @click="changeCat(item.name)" v-if="index<=4">
          {{item.name}}
        </span>
      </div>
    </section>
    <section class="container">
      <ul class="list" v-if="handpickSongListArray && handpickSongListArray.length>0">
        <li class="item" v-for="(item,index) in handpickSongListArray" :key="index" @click="gotoDetail(item.id)">
          <div class="pic" :style="{backgroundImage:'url('+item.coverImgUrl+')'}">
            <SvgIcon v-if="item.highQuality" :iconClass="'high-quality-triangle'" :className="'high-quality-triangle'"></SvgIcon>
            <div class="heared">
              <span>
                <i class="iconfont icon-erji"></i>
                {{item.playCount|dealWithPlayCount}}
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
      </ul>
    </section>
    <Footer></Footer>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { ICreator, IPlayList, ICategory } from '@/common/interface/base.ts'
import TopBar from '~/foundation/com/topBar.vue'
import Footer from '~/foundation/com/footer.vue'
import { Mutation, State } from 'vuex-class'

@Component({
  components: { TopBar, Footer }
})
export default class SongTable extends mixins(CommonMixin) {
  @State tableCat: string
  private highQualitySong: IPlayList | null = null
  private handpickSongListArray: IPlayList[] | null = null
  private limit: number = 20
  private categoryList: ICategory[] = []
  private hotCategoryList: ICategory[] = []

  @Mutation changeTableCat: (payload: { type: number; cat: string }) => void

  private gotoDetail(id: string) {
    this.$router.push({ name: 'r_song_list', query: { id } })
  }

  private goToHighQualityTable() {
    this.$router.push({ name: 'r_song_table_high_quality' })
  }

  private goToCatChoose() {
    this.$router.push({ name: 'r_table_cat_choose' })
  }

  private getHandpickList() {
    const params = { limit: this.limit, cat: this.tableCat }
    this.service.getHandpickList(params).then((handpickListResult: { playlists: IPlayList[] }) => {
      this.handpickSongListArray = handpickListResult['playlists']
    })
  }

  private getHighQualityList() {
    this.service
      .getHighQualityList({ limit: 1 })
      .then((highQualityListResult: { playlists: IPlayList[] }) => {
        this.highQualitySong =
          highQualityListResult['playlists'] && highQualityListResult['playlists'][0]
      })
  }

  private changeCat(name: string) {
    this.changeTableCat({ type: 0, cat: name })
    this.getHandpickList()
  }

  private getCategoryList() {
    this.service.getCategoryList({}).then((categoryListResult: { playlists: IPlayList[] }) => {
      console.log({ categoryListResult })
    })
  }

  private getHotCategoryList() {
    this.service.getHotCategoryList({}).then((hotCategoryListResult: { tags: ICategory[] }) => {
      this.hotCategoryList = hotCategoryListResult['tags']
    })
  }

  created() {
    this.getHandpickList()
    this.getHighQualityList()
    this.getCategoryList()
    this.getHotCategoryList()
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
    }
  }
}
</style>


