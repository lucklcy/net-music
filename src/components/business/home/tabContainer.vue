<template>
  <div class="tab border-1px">
    <ul class="container" v-if="type === 'recommand'">
      <li class="item">
        <div class="pic fm-img"></div>
        <span>私人FM</span>
      </li>
      <li class="item">
        <div class="pic recommand-img"></div>
        <span>每日推荐</span>
      </li>
      <li class="item" @click="goToSongTable">
        <div class="pic song-list-img"></div>
        <span>歌单</span>
      </li>
      <li class="item" @click="goToTopList">
        <div class="pic ranking-list-img"></div>
        <span>排行榜</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'

export const enum TAB_TYPE {
  RECOMMAND = 'recommand',
  BROADCAST = 'broadcast'
}

@Component({
  components: {}
})
export default class TabContainer extends mixins(CommonMixin) {
  @Prop({ default: TAB_TYPE.RECOMMAND })
  private type: string

  private goToSongTable() {
    this.$router.push({ name: 'r_song_table_index' })
  }

  private goToTopList() {
    this.$router.push({ name: 'r_top_list' })
  }
}
</script>
<style lang="scss" scoped>
$baseAsset: '../../../assets';
.tab {
  .container {
    @include setSize(100%, 260px);
    @include setFlexPos(row, space-around, center);
    .item {
      height: 100%;
      @include setFlexPos(column, space-around, center);
      .pic {
        @include setSize(156px, 156px);
        @include setFlexPos(row, center, center);
        background-color: $color-highlight-background;
        border-radius: 50%;
        color: #fff;
        &.fm-img {
          @include setBgImg('#{$baseAsset}/img/home/fm.png', center, center, cover, no-repeat);
        }
        &.recommand-img {
          @include setBgImg(
            '#{$baseAsset}/img/home/recommand.png',
            center,
            center,
            cover,
            no-repeat
          );
        }
        &.song-list-img {
          @include setBgImg(
            '#{$baseAsset}/img/home/song-list.png',
            center,
            center,
            cover,
            no-repeat
          );
        }
        &.ranking-list-img {
          @include setBgImg('#{$baseAsset}/img/home/ranking.png', center, center, cover, no-repeat);
        }
      }
      span {
        font-size: 0.36rem;
        color: #555;
      }
    }
  }
  &.border-1px {
    @include border-1px(bottom, $border-color);
  }
}
</style>


