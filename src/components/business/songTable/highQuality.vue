<template>
  <div class="song-table-high-quality">
    <TopBar back-route-name='r_song_table_index' title='精品歌单'></TopBar>
    <section class="container">
      <ul class="list" v-if="highQualitySongListArray && highQualitySongListArray.length>0">
        <li class="item border-1px" v-for="(item,index) in highQualitySongListArray" :key="index"
          @click="gotoDetail(item.id)">
          <div class="pic" :style="{backgroundImage:'url('+item.coverImgUrl+')'}">
            <div class="heared">
              <span>
                <i class="iconfont icon-erji"></i>
                {{item.playCount|dealWithPlayCount}}
              </span>
            </div>
          </div>
          <div class="label">
            <span class="name">{{item.name}}</span>
            <span class="author">by {{item.creator.nickname}}</span>
            <span class="copywriter">
              <i class="tag">{{item.tag}}</i>
              {{item.copywriter}}</span>
          </div>
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
import { ICreator, IPlayList } from '@/common/interface/base.ts'
import TopBar from '~/foundation/com/topBar.vue'
import Footer from '~/foundation/com/footer.vue'

@Component({
  components: { TopBar, Footer }
})
export default class SongHighQualityTable extends mixins(CommonMixin) {
  private highQualitySongListArray: IPlayList[] | null = null

  private gotoDetail(id: string) {
    this.$router.push({ name: 'r_song_list', query: { id } })
  }

  created() {
    this.service
      .getHighQualityList({ limit: 30 })
      .then((highQualityListResult: { playlists: IPlayList[] }) => {
        this.highQualitySongListArray =
          highQualityListResult['playlists'] && highQualityListResult['playlists']
      })
  }
}
</script>
<style lang="scss">
$baseAsset: '../../../assets';
.song-table-high-quality {
  @include setSize(100%, 100%);
  @include setFlexPos(column, flex-start, flex-start);
  .container {
    flex: 1;
    width: 100%;
    overflow: auto;
    .list {
      z-index: 10;
      padding: 0 18px;
      background-color: #fff;
      .item {
        width: 100%;
        margin-bottom: 12px;
        @include setFlexPos(row, space-between, flex-start);
        &.border-1px {
          @include border-1px(bottom, $border-color);
        }
        .pic {
          @include setSize(320px, 320px);
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
        }
        .label {
          @include setSize(700px, 320px);
          @include setFlexPos(column, space-around, flex-start);
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
              color: red;
              font-size: 0.2rem;
            }
            font-size: 0.28rem;
            color: #666;
            line-height: 1.4;
          }
        }
      }
    }
  }
}
</style>


