<template>
  <div class="search">
    <div class="search-bar">
      <span>
        <i class="iconfont icon-seach"></i>
        搜索
      </span>
    </div>
    <MiniPlayer></MiniPlayer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MiniPlayer from '~/business/player/mini.vue'

@Component({
  components: {
    MiniPlayer
  }
})
export default class Search extends Vue {}
</script>
<style lang="scss" scoped>
$baseAssets: '../../../assets';
.search {
  @include setSize(100%, 150px);
  border: none;
  @include setFlexPos(row, space-around, center);
  .search-bar {
    @include setFlexPos(row, center, center);
    border: none;
    border-radius: 48px;
    outline: none;
    color: #d8d7d7a4;
    text-align: center;
    @include setSize(76%, 92px);
    background-color: #f1f1f136;
    span {
      font-size: 0.44rem;
      display: inline-block;
      .iconfont {
        font-size: 0.4rem;
      }
    }
  }
}
</style>
