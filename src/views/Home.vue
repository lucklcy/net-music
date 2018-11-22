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
    <Slide ref="slide" :autoPlay="isAutoPlay" :loop="isLoop" :showDot="isShowDot" :interval="interval"
      :threshold="threshold" :speed="speed" v-if="data && data.length>0">
      <div v-for="(item,index) in data" :key="index">
        <a :href="item.url">
          <img :src="item.imageUrl">
        </a>
      </div>
    </Slide>
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
  }
}
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  .panel-container {
    @include setSize(100%, 100px);
    display: flex;
    margin-bottom: 14px;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .panel-list {
      display: flex;
      justify-content: center;
      align-items: center;
      .panel-item {
        font-size: 0.4rem;
        color: #424242;
        &.recommend {
          margin-right: 220px;
        }
      }
    }
    .under-tag {
      display: inline-block;
      position: relative;
      @include setSize(132px, 10px);
      left: -194px;
      border-radius: 50px;
      border: none;
      background-color: #adadad;
    }
  }
}
</style>

