<template>
  <div class="top-bar">
    <span @click='goBack'>
      <SvgIcon :iconClass="'arrow-left'" :className="'arrow-left'"></SvgIcon>
    </span>
    <span class="title">{{title}}</span>
    <SvgIcon :iconClass="'table'" :className="'table'"></SvgIcon>
  </div>

</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'

@Component({
  components: {}
})
export default class TopBar extends mixins(CommonMixin) {
  /**
   * bar title
   */
  @Prop({ default: 'net-music' })
  private title: string

  /**
   * 返回的router Name
   */
  @Prop({ default: 'r_home' })
  private backRouteName: string

  /**
   * 返回类型【1:跳转到制定路由;2:浏览器回退;】
   */
  @Prop({ default: 1 })
  private backType: number

  private goBack() {
    if (this.backType === 1) {
      this.$router.push({ name: this.backRouteName })
    } else if (this.backType === 2) {
      this.$router.go(-1)
    }
  }

  created() {}
}
</script>
<style lang="scss" scoped>
.top-bar {
  @include setSize(100%, 138px);
  @include setFlexPos(row, space-between, center);
  background-color: $color-highlight-background;
  z-index: 10;
  color: #fff;
  .arrow-left {
    font-size: 0.62rem;
    margin-left: 32px;
  }
  .title {
    font-size: 0.44rem;
  }
  .table {
    font-size: 0.62rem;
    margin-right: 40px;
  }
}
</style>
