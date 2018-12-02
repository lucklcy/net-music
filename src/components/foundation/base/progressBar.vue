<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove" @touchend="progressTouchEnd" :style="progressBtnStyle">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State } from 'vuex-class'
import { prefixStyle } from '@/utils/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

interface ITtuch {
  initiated: boolean
  moved: boolean
  startX: number
  startY: number
  percent: number
  left: number
}

@Component({
  components: {}
})
export default class ProgressBar extends mixins(CommonMixin) {
  @Prop({ default: 0 })
  private percent: number
  private progressBtnStyle: string = ''

  private touch: ITtuch = {
    initiated: false,
    moved: false,
    startX: 0,
    startY: 0,
    percent: 0,
    left: 0
  }

  private progressTouchStart(e: TouchEvent) {
    this.touch.initiated = true
    this.touch.startX = e.touches[0].pageX
    let progressElement = this.$refs.progress as HTMLElement
    this.touch.left = progressElement.clientWidth
  }
  private progressTouchMove(e: TouchEvent) {
    if (!this.touch.initiated) {
      return
    }
    const deltaX = e.touches[0].pageX - this.touch.startX
    let progressBarElement = this.$refs.progressBar as HTMLElement
    const offsetWidth = Math.min(
      progressBarElement.clientWidth - progressBtnWidth,
      Math.max(0, this.touch.left + deltaX)
    )
    this._offset(offsetWidth)
  }
  private progressTouchEnd() {
    this.touch.initiated = false
    this._triggerPercent()
  }
  private progressClick(e: MouseEvent) {
    let progressBarElement = this.$refs.progressBar as HTMLElement
    const rect = progressBarElement.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    this._offset(offsetWidth)
    // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
    // this._offset(e.offsetX)
    this._triggerPercent()
  }
  private _triggerPercent() {
    let progressElement = this.$refs.progress as HTMLElement
    let progressBarElement = this.$refs.progressBar as HTMLElement
    const barWidth = progressBarElement.clientWidth - progressBtnWidth
    const percent = progressElement.clientWidth / barWidth
    this.$emit('percentChange', percent)
  }
  private _offset(offsetWidth: number) {
    let progressElement = this.$refs.progress as HTMLElement
    this.progressBtnStyle = `${transform}:translate3d(${offsetWidth}px,0,0);`
    progressElement.style.width = `${offsetWidth}px`
  }

  @Watch('percent')
  onPercentChange(newPercent: number, oldPercent: number) {
    if (newPercent >= 0 && !this.touch.initiated) {
      let progressBarElement = this.$refs.progressBar as HTMLElement
      const barWidth = progressBarElement.clientWidth - progressBtnWidth
      const offsetWidth = newPercent * barWidth
      this._offset(offsetWidth)
    }
  }
}
</script>

<style scoped lang="scss">
.progress-bar {
  height: 100px;

  .bar-inner {
    position: relative;
    top: 46px;
    height: 12px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -20px;
      top: -20px;
      width: 52px;
      height: 52px;

      .progress-btn {
        position: relative;
        top: 10px;
        left: 10px;
        box-sizing: border-box;
        width: 32px;
        height: 32px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>