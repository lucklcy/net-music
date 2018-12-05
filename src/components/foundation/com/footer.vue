<template>
  <div class="footer">
    <ul>
      <li>
        <SvgIcon :iconClass="'net-music'" :className="'net-music'"></SvgIcon>
      </li>
      <li>
        <SvgIcon :iconClass="'net-vedio'" :className="'net-vedio'"></SvgIcon>
      </li>
      <li>
        <SvgIcon :iconClass="'net-my'" :className="'net-my'"></SvgIcon>
      </li>
      <li>
        <SvgIcon :iconClass="'net-friends'" :className="'net-friends'"></SvgIcon>
      </li>
      <li>
        <SvgIcon :iconClass="'net-account'" :className="'net-account'"></SvgIcon>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'

@Component({
  components: {}
})
export default class Footer extends mixins(CommonMixin) {}
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
      .svg-icon {
        font-size: 0.62rem;
        color: #666;
        &.net-music {
          
        }
      }
    }
  }
}
</style>
