<template>
  <div class="header">
    <Search></Search>
    <div :class="{'panel-container':true}">
      <div class="panel-list">
        <router-link class="panel-item" :to="{name:'r_home_recommand'}">个性推荐</router-link>
        <router-link class="panel-item" :to="{name:'r_home_broadcast'}">主播电台</router-link>
      </div>
      <div :class="{'under-tag':true,'to-first':$route.name==='r_home_recommand','to-second':$route.name==='r_home_broadcast'}"></div>
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
  background-color: $color-highlight-background;
  .panel-container {
    @include setSize(100%, 100px);
    @include setFlexPos(column, space-around, center);
    margin-bottom: 14px;
    .panel-list {
      .panel-item {
        display: inline-block;
        font-size: 0.4rem;
        color: #fff;
        text-decoration: none;
        padding: 10px 112px;
        // 取消移动端点击的蓝色背景色
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        -webkit-user-select: none;
        -moz-user-focus: none;
        -moz-user-select: none;
      }
    }
    .under-tag {
      display: inline-block;
      position: relative;
      @include setSize(100px, 6px);
      border-radius: 50px;
      border: none;
      background-color: #fff;
      transition: left linear 0.1s;
      &.to-first {
        left: -198px;
      }
      &.to-second {
        left: 195px;
      }
    }
  }
}
</style>
