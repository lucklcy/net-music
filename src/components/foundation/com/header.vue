<template>
  <div class="header">
    <div class="header-top">
      <span>
        <SvgIcon :iconClass="'net-music'" :className="'net-music'"></SvgIcon>
        <label class="discover">发现</label>
      </span>
      <span>
        <SvgIcon :iconClass="'search-big'" :className="'search-big'"></SvgIcon>
      </span>
    </div>
    <div :class="{'panel-container':true}">
      <div class="panel-list">
        <router-link class="panel-item" :to="{name:'r_home_recommand'}">个性推荐</router-link>
        <router-link class="panel-item" :to="{name:'r_home_broadcast'}">精彩节目</router-link>
      </div>
      <div :class="{'under-tag':true,'to-first':$route.name==='r_home_recommand','to-second':$route.name==='r_home_broadcast'}"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'

@Component({
  components: {}
})
export default class Header extends mixins(CommonMixin) {}
</script>
<style lang="scss" scoped>
$baseAssets: '../../../assets';
.header {
  background-color: $color-highlight-background;
  .header-top {
    @include setSize(100%, 168px);
    @include setFlexPos(row, space-between, center);
    color: #fff;
    .net-music {
      font-size: 0.54rem;
      margin-left: 50px;
    }
    .discover {
      font-size: 0.48rem;
      margin-left: 100px;
    }
    .search-big {
      font-size: 0.54rem;
      margin-right: 60px;
    }
  }
  .panel-container {
    @include setSize(100%, 112px);
    @include setFlexPos(column, space-around, center);
    margin-bottom: 14px;
    .panel-list {
      .panel-item {
        display: inline-block;
        font-size: 0.4rem;
        color: #fff;
        text-decoration: none;
        padding: 10px 100px;
        &:first-child {
          margin-right: 146px;
        }
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
      @include setSize(72px, 6px);
      border-radius: 50px;
      border: none;
      background-color: #fff;
      transition: left linear 0.16s;
      &.to-first {
        left: -268px;
      }
      &.to-second {
        left: 266px;
      }
    }
  }
}
</style>
