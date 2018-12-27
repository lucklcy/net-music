<template>
  <div class="ys-float-btn" :style="{'width':itemWidth+'px','height':itemHeight+'px','left':left+'px','top':top+'px'}"
    ref="div" @click="onBtnClicked">
    <slot name="icon"></slot>
    <p>{{text}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class DragBuddle extends Vue {
  @Prop({ default: '默认文字' })
  private text: string

  @Prop({ default: 60 })
  private itemWidth: number

  @Prop({ default: 60 })
  private itemHeight: number

  @Prop({ default: 10 })
  private gapWidth: number

  @Prop({ default: 0.8 })
  private coefficientHeight: number

  private timer: number = 0
  private currentTop: number = 0
  private clientWidth: number = 0
  private clientHeight: number = 0
  private left: number = 0
  private top: number = 0

  private onBtnClicked() {
    this.$emit('onFloatBtnClicked')
  }
  private handleScrollStart() {
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.handleScrollEnd()
    }, 300)
    this.currentTop = document.documentElement.scrollTop || document.body.scrollTop
    if (this.left > this.clientWidth / 2) {
      this.left = this.clientWidth - this.itemWidth / 2
    } else {
      this.left = -this.itemWidth / 2
    }
  }

  private handleScrollEnd() {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop === this.currentTop) {
      if (this.left > this.clientWidth / 2) {
        this.left = this.clientWidth - this.itemWidth - this.gapWidth
      } else {
        this.left = this.gapWidth
      }
      clearTimeout(this.timer)
    }
  }

  created() {
    this.clientWidth = document.documentElement.clientWidth
    this.clientHeight = document.documentElement.clientHeight
    this.left = this.clientWidth - this.itemWidth - this.gapWidth
    this.top = this.clientHeight * this.coefficientHeight
  }
  mounted() {
    window.addEventListener('scroll', this.handleScrollStart)
    this.$nextTick(() => {
      const div = this.$refs.div as HTMLDivElement
      div.addEventListener('touchstart', () => {
        div.style.transition = 'none'
      })
      div.addEventListener('touchmove', event => {
        if (event.targetTouches.length === 1) {
          let touch = event.targetTouches[0]
          this.left = touch.clientX - this.itemWidth / 2
          this.top = touch.clientY - this.itemHeight / 2
        }
      })
      div.addEventListener('touchend', () => {
        div.style.transition = 'all 0.3s'
        if (this.left > this.clientWidth / 2) {
          this.left = this.clientWidth - this.itemWidth - this.gapWidth
        } else {
          this.left = this.gapWidth
        }
      })
    })
  }
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScrollStart)
  }
}
</script>

<style lang="scss" scoped>
.ys-float-btn {
  background: rgb(255, 255, 255);
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  color: #666666;
  z-index: 20;
  transition: all 0.3s;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: fixed;
  bottom: 20vw;

  img {
    width: 50%;
    height: 50%;
    object-fit: contain;
    margin-bottom: 3px;
  }

  p {
    font-size: 7px;
  }
}
</style>
