<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset" />
      <g v-if="playing">
        <line x1="39" y1="32" x2="39" y2="68" /> -->
        <line x1="60" y1="32" x2="60" y2="68" />
      </g>
      <polygon fill="transparent" points="39,32 70,50 39,68 39,32" v-else />
    </svg>
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
  @State playing: boolean

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
  line {
    stroke-width: 24px;
    stroke: $color-theme;
  }
  polygon {
    stroke-width: 20px;
    stroke: $color-theme;
  }
}
</style>