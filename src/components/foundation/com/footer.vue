<template>
  <div class="footer border-top-1px">
    <ul>
      <li v-for="(item,index) in footBarStatusMap" @click="goToTab(item.code)">
        <SvgIcon :iconClass="item.icon" :className="getClassName(item.code)"></SvgIcon>
        <span v-if="nameShow(item.code)">{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { FOOT_BAR_STATUS } from '@/store/state'
import { State, Mutation } from 'vuex-class'

@Component({
  components: {}
})
export default class Footer extends mixins(CommonMixin) {
  @State footTab: string
  private footBarStatusMap: { [propName: string]: { icon: string; name: string } } = FOOT_BAR_STATUS

  @Mutation changeFootTab: (code: string) => void

  private getClassName(name: string) {
    if (name === this.footTab) {
      return `${name} active`
    } else {
      return `${name}`
    }
  }

  private nameShow(code: string) {
    return code === this.footTab
  }

  private goToTab(code: string) {
    let tabRouterMap: { [propName: string]: string } = { music: 'r_home_recommand' }
    this.$router.push({ name: tabRouterMap[code] })
    this.changeFootTab(code)
  }
}
</script>
<style lang="scss">
$baseAssets: '../../../assets';
.footer {
  width: 100%;
  height: $mini-player-height;
  &.border-top-1px {
    @include border-set(top, $border-color);
  }
  ul {
    @include setSize(100%, 100%);
    padding: 0 40px;
    @include setFlexPos(row, space-around, center);
    li {
      @include setFlexPos(column, space-between, center);
      .svg-icon {
        font-size: 0.62rem;
        color: #666;
        &.active {
          color: $color-highlight-background;
        }
      }
      span {
        font-size: 0.3rem;
        margin-top: 12px;
        color: $color-highlight-background;
      }
    }
  }
}
</style>
