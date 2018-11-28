<template>
  <div class="search">
    <div class="search-bar">
      <span>搜索</span>
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
    border: none;
    border-radius: 48px;
    outline: none;
    color: #b7b7b7;
    font-size: 0.36rem;
    text-align: center;
    @include setSize(76%, 92px);
    background-color: #f1f1f1;
    font-size: 0.42rem;
    line-height: 92px;
    span {
      position: relative;
      display: inline-block;
      background-image: url('#{$baseAssets}/img/search.png');
      background-size: 40px;
      background-position: left center;
      background-repeat: no-repeat;
      padding: 0 0 0 58px;
    }
  }
}
</style>
