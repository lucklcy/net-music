<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset" />
    </svg>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State } from 'vuex-class'
import { prefixStyle } from '@/utils/dom'
@Component({
  components: {}
})
export default class ProgressCircle extends mixins(CommonMixin) {
  @Prop({ default: 100 })
  private radius: number

  @Prop({ default: 0 })
  private percent: number
  private dashArray: number = Math.PI * 100

  get dashOffset() {
    return (1 - this.percent) * this.dashArray
  }
}
</script>

<style scoped lang="scss" scoped>
.progress-circle {
  position: relative;

  circle {
    stroke-width: 20px;
    transform-origin: center;

    &.progress-background {
      transform: scale(0.9);
      stroke: $color-theme-d;
    }

    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }
}
</style>