<template>
  <div class="home">
    <Search></Search>
    <div class="panel-container">
      <div class="panel-list">
        <span class="panel-item recommend">个性推荐</span>
        <span class="panel-item broadcaster">主播电台</span>
      </div>
      <div class="under-tag"></div>
    </div>
    <Slide :autoPlay="isAutoPlay" :loop="isLoop" :showDot="isShowDot" :interval="interval"
      :threshold="threshold" :speed="speed" v-if="data && data.length>0">
      <div v-for="(item,index) in data" :key="index">
        <a :href="item.url">
          <img :src="item.imageUrl">
        </a>
      </div>
    </Slide>
    <div class="tab border-1px">
      <ul class="container">
        <li class="item">
          <div class="pic fm-img">FM</div>
          <span>私人FM</span>
        </li>
        <li class="item">
          <div class="pic recommand-img">推荐</div>
          <span>每日推荐</span>
        </li>
        <li class="item">
          <div class="pic song-list-img">歌单</div>
          <span>歌单</span>
        </li>
        <li class="item">
          <div class="pic ranking-list-img">排行</div>
          <span>排行榜</span>
        </li>
      </ul>
    </div>
    <section class="recommand">
      <p class="title">推荐歌单</p>
      <div class="recommand-container">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import Search from '~/foundation/base/search.vue'
import Slide from '~/foundation/base/slide.vue'
import service from '@/service'
import CommonMixin from '@/mixins/comMix.ts'

interface IBannerDataList {
  imageUrl: string
  url: string | null
  [propName: string]: any
}

@Component({
  components: {
    Search,
    Slide
  }
})
export default class Home extends mixins(CommonMixin) {
  private data: IBannerDataList[] = []
  private isAutoPlay: boolean = true
  private isLoop: boolean = true
  private isShowDot: boolean = true
  private interval: number = 1500
  private threshold: number = 0.1
  private speed: number = 600

  async created() {
    let resultLogin = await this.service.login({ phone: 15618334565, password: 'forget416' })
    this.service
      .getBanner({})
      .then((resultBanner: { banners: IBannerDataList[] }) => {
        this.data = resultBanner && resultBanner['banners']
      })
      .catch((err: Error) => {
        console.log(err)
      })
    this.service
      .getRecommendList({})
      .then((resultRecommendList: { banners: IBannerDataList[] }) => {
        console.log({ resultRecommendList })
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }
}
</script>
<style lang="scss" scoped src="./Home.scss"></style>

