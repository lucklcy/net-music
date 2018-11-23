<template>
  <div class="header">
    <Search></Search>
    <div class="panel-container">
      <div class="panel-list">
        <span class="panel-item recommend">个性推荐</span>
        <span class="panel-item broadcaster">主播电台</span>
      </div>
      <div class="under-tag"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import Search from '~/foundation/base/search.vue'
import { Component, Vue } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'

@Component({
  components: {
    Search
  }
})
export default class Header extends mixins(CommonMixin) {}
</script>
<style lang="scss" scoped>
$baseAssets: '../../../assets';
.header {
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
      @include setSize(100px, 6px);
      left: -194px;
      border-radius: 50px;
      border: none;
      background-color: #adadad;
    }
  }
}
</style>
