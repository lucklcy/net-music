<template>
  <div class="main-content">
    <Slide :autoPlay="isAutoPlay" :loop="isLoop" :showDot="isShowDot" :interval="interval"
      :threshold="threshold" :speed="speed" v-if="data && data.length>0">
      <div v-for="(item,index) in data" :key="index">
        <a :href="item.url">
          <img :src="item.imageUrl">
        </a>
      </div>
    </Slide>
    <div class="slide-no-data" v-else>
      <div class="backgrond"></div>
      <div class="content">
        <span>网易云音乐</span>
      </div>
    </div>
    <TabContainer></TabContainer>
    <Songrec></Songrec>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import Slide from '~/foundation/base/slide.vue'
import Songrec from '~/foundation/com/songrec.vue'
import TabContainer from '~/business/home/tabContainer.vue'
import CommonMixin from '@/mixins/comMix'

interface IBannerDataList {
  imageUrl: string
  url: string | null
  [propName: string]: any
}

@Component({
  components: {
    Slide,
    Songrec,
    TabContainer
  }
})
export default class Recommander extends mixins(CommonMixin) {
  private data: IBannerDataList[] = []
  private isAutoPlay: boolean = true
  private isLoop: boolean = true
  private isShowDot: boolean = true
  private interval: number = 1500
  private threshold: number = 0.1
  private speed: number = 600

  async created() {
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
<style lang="scss">
$baseAssets: '../../../assets';
.main-content {
  position: relative;
  -webkit-overflow-scrolling: touch;
  .slide-no-data {
    position: relative;
    @include setSize(100%, 380px);
    .backgrond {
      @include setSize(100%, 180px);
      background-color: $color-highlight-background;
    }
    .content {
      position: absolute;
      top: 0;
      left: 3%;
      @include setFlexPos(row, center, center);
      @include setSize(94%, 380px);
      background-color: #444;

      border-radius: 10px;
      span {
        font-size: 0.5rem;
        color: #eee;
      }
    }
  }
}
</style>


