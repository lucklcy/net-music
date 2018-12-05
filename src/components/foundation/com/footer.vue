<template>
  <div class="footer">
    <ul>
      <li v-for="(item,index) in footBarStatusMap">
        <SvgIcon :iconClass="item.icon" :className="getClassName(item.icon)"></SvgIcon>
        <span v-if="nameShow(item.icon)">{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { FOOT_BAR_STATUS } from '@/store/state'
import { State } from 'vuex-class'

@Component({
  components: {}
})
export default class Footer extends mixins(CommonMixin) {
  @State footBarStatus: string
  private footBarStatusMap: { [propName: string]: { icon: string; name: string } } = FOOT_BAR_STATUS

  private getClassName(name: string) {
    if (name === this.footBarStatus) {
      return `${name} active`
    } else {
      return `${name}`
    }
  }

  private nameShow(name: string) {
    return name === this.footBarStatus
  }
}
</script>
<style lang="scss">
$baseAssets: '../../../assets';
.footer {
  width: 100%;
  height: $mini-player-height;
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
