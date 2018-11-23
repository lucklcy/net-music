<template>
  <div class="search">
    <input type="text" placeholder="搜索" class="search-bar" />
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
  display: flex;
  align-items: center;
  justify-content: space-around;
  .search-bar {
    border: none;
    border-radius: 50px;
    outline: none;
    color: #a0a0a0;
    font-size: 0.38rem;
    @include setSize(80%, 92px);
    background-color: #f1f1f1;
    font-size: 0.555556rem;
    padding: 8px 0 8px 420px;
    &::-webkit-input-placeholder {
      font-size: 0.42rem;
      font-weight: normal;
      color: #b7b7b7;
    }
    background-image: url('#{$baseAssets}/img/search.png');
    background-repeat: no-repeat;
    background-size: 42px;
    background-position: 346px 28px;
  }
}
</style>
