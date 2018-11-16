<template>
  <div class="home">
    <Search></Search>
    <div class="panel-container">
      <div class="panel-list">
        <span class="panel-item recommend">个性推荐</span>
        <span class="panel-item broadcaster">主播电台</span>
      </div>
      <div class="under-tag"></div>
    </div>
    <Banner></Banner>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Search from '~/foundation/base/search.vue'
import Banner from '~/foundation/base/banner.vue'

@Component({
  components: {
    Search,
    Banner
  }
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.home {
  .panel-container {
    @include setSize(100%, 100px);
    display: flex;
    margin-bottom: 14px;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .panel-list {
      display: flex;
      justify-content: center;
      align-items: center;
      .panel-item {
        font-size: 0.4rem;
        color: #424242;
        &.recommend {
          margin-right: 220px;
        }
      }
    }
    .under-tag {
      display: inline-block;
      position: relative;
      @include setSize(100px, 12px);
      left: -198px;
      border-radius: 40px;
      border: none;
      background-color: #adadad;
    }
  }
}
</style>

