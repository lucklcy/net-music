<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BScroll from 'better-scroll'

@Component({})
export default class Scroll extends Vue {
  private scroll: BScroll
  /**
   * 1 滚动的时候会派发scroll事件，会截流。
   * 2 滚动的时候实时派发scroll事件，不会截流。
   * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
   */
  @Prop({ default: 1 })
  private probeType: number
  /**
   * 点击列表是否派发click事件
   */
  @Prop({ default: true })
  private click: boolean
  /**
   * 是否开启横向滚动
   */
  @Prop({ default: false })
  private scrollX: boolean
  /**
   * 是否派发滚动事件
   */
  @Prop({ default: false })
  private listenScroll: boolean
  /**
   * 列表的数据
   */
  @Prop({ default: [] })
  private dataList: Array<any>
  /**
   * 是否派发滚动到底部的事件，用于上拉加载
   */
  @Prop({ default: false })
  private pullup: boolean
  /**
   * 是否派发顶部下拉的事件，用于下拉刷新
   */
  @Prop({ default: false })
  private pulldown: boolean
  /**
   * 是否派发列表滚动开始的事件
   */
  @Prop(Boolean)
  private beforeScroll: boolean

  /**
   * 是否派发轻拂的事件
   */
  @Prop(Boolean)
  private flick: boolean

  /**
   * 当数据更新后，刷新scroll的延时。
   */
  @Prop({ default: 20 })
  private refreshDelay: number

  private _initScroll() {
    if (!this.$refs.wrapper) {
      return
    }
    // better-scroll的初始化
    this.scroll = new BScroll(<Element>this.$refs.wrapper, {
      probeType: this.probeType,
      click: this.click,
      scrollX: this.scrollX
    })

    // 是否派发滚动事件
    if (this.listenScroll) {
      this.scroll.on('scroll', pos => {
        this.$emit('scroll', pos)
      })
    }

    // 是否派发滚动到底部事件，用于上拉加载
    if (this.pullup) {
      this.scroll.on('scrollEnd', () => {
        // 滚动到底部
        if (this.scroll.y <= this.scroll.maxScrollY + 50) {
          this.$emit('scrollToEnd')
        }
      })
    }

    // 是否派发顶部下拉事件，用于下拉刷新
    if (this.pulldown) {
      this.scroll.on('touchEnd', pos => {
        // 下拉动作
        if (pos.y > 50) {
          this.$emit('pulldown')
        }
      })
    }

    // 是否派发列表滚动开始的事件
    if (this.beforeScroll) {
      this.scroll.on('beforeScrollStart', () => {
        this.$emit('beforeScroll')
      })
    }

    if (this.flick) {
      this.scroll.on('flick', () => {
        this.$emit('flick')
      })
    }
  }
  private disable() {
    // 代理better-scroll的disable方法
    this.scroll && this.scroll.disable()
  }
  private enable() {
    // 代理better-scroll的enable方法
    this.scroll && this.scroll.enable()
  }
  private refresh() {
    // 代理better-scroll的refresh方法
    this.scroll && this.scroll.refresh()
  }
  public scrollTo(x: number, y: number, time?: number, easing?: object) {
    // 代理better-scroll的scrollTo方法
    this.scroll && this.scroll.scrollTo(x, y, time, easing)
  }
  public scrollToElement(
    el: HTMLElement | string,
    time?: number,
    offsetX?: number | boolean,
    offsetY?: number | boolean,
    easing?: object
  ) {
    // 代理better-scroll的scrollToElement方法
    this.scroll && this.scroll.scrollToElement(el, time, offsetX, offsetY, easing)
  }
  mounted() {
    // 保证在DOM渲染完毕后初始化better-scroll
    setTimeout(() => {
      this._initScroll()
    }, 20)
  }
  @Watch('dataList', { immediate: true, deep: true })
  dataChange(val: Array<any>, oldVal: Array<any>) {
    setTimeout(() => {
      this.refresh()
    }, this.refreshDelay)
  }
}
</script>