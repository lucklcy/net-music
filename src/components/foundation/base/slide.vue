<template>
  <div class="banner clear-float">
    <div class="backgrond"></div>
    <div class="slide" ref="slide">
      <div class="slide-group" ref="slideGroup">
        <slot>
        </slot>
      </div>
      <div v-if="showDot" class="dots">
        <span class="dot" :key="index" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BScroll from 'better-scroll'
import { addClass } from '@/utils/dom'

@Component({})
export default class Slide extends Vue {
  private dots: any[] = []
  private resizeTimer: number
  private timer: number
  private currentPageIndex: number = 0
  private slide: BScroll
  private children: HTMLCollection
  @Prop({ default: true })
  private loop: boolean

  @Prop({ default: true })
  private autoPlay: boolean

  @Prop({ default: 4000 })
  private interval: number

  @Prop({ default: true })
  private showDot: boolean

  @Prop({ default: true })
  private click: boolean

  @Prop({ default: 0.3 })
  private threshold: number

  @Prop({ default: 400 })
  private speed: number

  private update() {
    if (this.slide) {
      this.slide.destroy()
    }
    this.$nextTick(() => {
      this.init()
    })
  }
  private refresh() {
    this._setSlideWidth(true)
    this.slide.refresh()
  }
  private prev() {
    this.slide.prev()
  }
  private next() {
    this.slide.next()
  }
  private init() {
    clearTimeout(this.timer)
    this.currentPageIndex = 0
    this._setSlideWidth()
    if (this.showDot) {
      this._initDots()
    }
    this._initSlide()

    if (this.autoPlay) {
      this._play()
    }
  }
  private _setSlideWidth(isResize: boolean = false) {
    this.children = (this.$refs.slideGroup as HTMLElement).children
    let width = 0
    let slideWidth = (this.$refs.slide as HTMLElement).clientWidth
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i] as HTMLElement
      addClass(child, 'slide-item')
      child.style.width = slideWidth + 'px'
      width += slideWidth
    }
    if (this.loop && !isResize) {
      width += 2 * slideWidth
    }
    let slideGroup = this.$refs.slideGroup as HTMLElement
    slideGroup.style.width = width + 'px'
  }
  private _initSlide() {
    this.slide = new BScroll(this.$refs.slide as HTMLElement, {
      scrollX: true,
      scrollY: false,
      momentum: false,
      snap: {
        loop: this.loop,
        threshold: this.threshold,
        speed: this.speed
      },
      bounce: false,
      stopPropagation: true,
      click: this.click
    })

    this.slide.on('scrollEnd', this._onScrollEnd)

    this.slide.on('touchEnd', () => {
      if (this.autoPlay) {
        this._play()
      }
    })

    this.slide.on('beforeScrollStart', () => {
      if (this.autoPlay) {
        clearTimeout(this.timer)
      }
    })
  }
  private _onScrollEnd() {
    let pageIndex = this.slide.getCurrentPage().pageX
    this.currentPageIndex = pageIndex
    if (this.autoPlay) {
      this._play()
    }
  }
  private _initDots() {
    this.dots = new Array(this.children.length)
  }

  private _play() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.slide.next()
    }, this.interval)
  }

  mounted() {
    this.update()
    window.addEventListener('resize', () => {
      if (!this.slide || !this.slide.enabled) {
        return
      }
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.slide.isInTransition) {
          this._onScrollEnd()
        } else {
          if (this.autoPlay) {
            this._play()
          }
        }
        this.refresh()
      }, 60)
    })
  }

  activated() {
    if (!this.slide) {
      return
    }
    this.slide.enable()
    let pageIndex = this.slide.getCurrentPage().pageX
    this.slide.goToPage(pageIndex, 0, 0)
    this.currentPageIndex = pageIndex
    if (this.autoPlay) {
      this._play()
    }
  }
  deactivated() {
    this.slide.disable()
    clearTimeout(this.timer)
  }
  beforeDestroy() {
    this.slide.disable()
    clearTimeout(this.timer)
  }
}
</script>

<style lang="scss">
.banner {
  position: relative;
  @include setSize(100%, 380px);
  .backgrond {
    @include setSize(100%, 180px);
    background-color: $color-highlight-background;
  }
  .slide {
    position: absolute;
    top: 0;
    left: 3%;
    width: 94%;
    min-height: 1px;
    max-height: 480px;
    border-radius: 10px;
    overflow: hidden;

    .slide-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;

      .slide-item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;

        a {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }

        img {
          display: block;
          width: 100%;
        }
      }
    }

    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      transform: translateZ(1px);
      text-align: center;
      font-size: 0;

      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #999;

        &.active {
          width: 20px;
          border-radius: 5px;
          background: #fff;
        }
      }
    }
  }
}
</style>
