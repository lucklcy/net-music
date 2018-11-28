<template>
  <div class="tab border-1px">
    <ul class="container" v-if="type === 'recommand'">
      <li class="item">
        <div class="pic fm-img">FM</div>
        <span>私人FM</span>
      </li>
      <li class="item">
        <div class="pic recommand-img">推荐</div>
        <span>每日推荐</span>
      </li>
      <li class="item">
        <div class="pic song-list-img">歌单</div>
        <span>歌单</span>
      </li>
      <li class="item">
        <div class="pic ranking-list-img">排行</div>
        <span>排行榜</span>
      </li>
    </ul>
    <ul class="container" v-if="type === 'broadcast'">
      <li class="item">
        <div class="pic fm-img">分类</div>
        <span>电台分类</span>
      </li>
      <li class="item">
        <div class="pic recommand-img">排行</div>
        <span>电台排行</span>
      </li>
      <li class="item">
        <div class="pic song-list-img">DI</div>
        <span>DI电音</span>
      </li>
      <li class="item">
        <div class="pic ranking-list-img">小冰</div>
        <span>小冰电台</span>
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
}
</script>
<style lang="scss" scoped>
.tab {
  .container {
    @include setSize(100%, 300px);
    @include setFlexPos(row, space-around, center);
    .item {
      height: 280px;
      @include setFlexPos(column, space-around, center);
      .pic {
        @include setSize(200px, 200px);
        background-color: rgba(248, 120, 120, 0.9);
        border-radius: 50%;
        text-align: center;
        padding: 80px 0 0 0;
        color: #555;
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


