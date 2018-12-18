<template>
  <div class="song-table-high-quality">
    <TopBar back-route-name='r_song_table_index' title='精品歌单'></TopBar>
    <div class="oper-choose border-bottom-1px">
      <span>全部</span>
      <span>
        <SvgIcon :iconClass="'filtrate'" :className="'filtrate'"></SvgIcon>
        筛选
      </span>
    </div>
    <Scroll class="container" ref="highQualitySongList" :data-list="highQualitySongListArray"
      :pullup="true" @scrollToEnd="doPullup">
      <ul class="list">
        <li class="item" v-for="(item,index) in highQualitySongListArray" :key="index" @click="gotoDetail(item.id)">
          <div class="pic" :style="{backgroundImage:'url('+item.coverImgUrl+')'}">
            <SvgIcon v-if="item.highQuality" :iconClass="'high-quality-triangle'" :className="'high-quality-triangle'"></SvgIcon>
            <div class="heared">
              <span>
                <i class="iconfont icon-erji"></i>
                {{item.playCount|dealWithPlayCount}}
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
        <li class="pull-up-asking">
          <SvgIcon :iconClass="'small-loading'" :className="'small-loading'"></SvgIcon>
          <span>加载中</span>
          <SvgIcon :iconClass="'small-loading'" :className="'small-loading'"></SvgIcon>
        </li>
      </ul>
    </Scroll>
    <Footer></Footer>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { ICreator, IPlayList } from '@/common/interface/base.ts'
import TopBar from '~/foundation/com/topBar.vue'
import Footer from '~/foundation/com/footer.vue'
import Scroll from '~/foundation/base/scroll.vue'

@Component({
  components: { TopBar, Footer, Scroll }
})
export default class SongHighQualityTable extends mixins(CommonMixin) {
  private highQualitySongListArray: IPlayList[] = []
  private limit: number = 10
  private updateTime: number = 0
  private gotoDetail(id: string) {
    this.$router.push({ name: 'r_song_list', query: { id } })
  }
  private doPullup() {
    this.addHighQualityList()
  }

  private getHighQualityList() {
    this.service
      .getHighQualityList({ limit: this.limit })
      .then((highQualityListResult: { playlists: IPlayList[] }) => {
        let tempHighQualitySongListArray =
          highQualityListResult['playlists'] && highQualityListResult['playlists']
        this.highQualitySongListArray = tempHighQualitySongListArray
        this.updateTime =
          tempHighQualitySongListArray[tempHighQualitySongListArray.length - 1]['updateTime']
      })
  }

  private addHighQualityList() {
    this.service
      .getHighQualityList({ before: this.updateTime, limit: this.limit })
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

  created() {
    this.getHighQualityList()
  }
}
</script>
<style lang="scss">
$baseAsset: '../../../assets';
.song-table-high-quality {
  @include setSize(100%, 100%);
  @include setFlexPos(column, flex-start, flex-start);
  .oper-choose {
    @include setSize(100%, 92px);
    @include setFlexPos(row, space-between, center);
    &.border-bottom-1px {
      @include border-set(bottom, $border-color);
    }
    background-color: #f5f5f5;
    padding: 0 20px;
    font-size: 0.39rem;
    color: #555;
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
    }
  }
}
</style>


