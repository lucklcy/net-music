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
    <Slide ref="slide"
           :autoPlay="isAutoPlay"
           :loop="isLoop"
           :showDot="isShowDot"
           :interval="interval"
           :threshold="threshold"
           :speed="speed">
      <div v-for="(item,index) in data"
           :key="index">
        <a :href="item.linkUrl">
          <img :src="item.picUrl">
        </a>
      </div>
    </Slide>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Search from '~/foundation/base/search.vue'
import Slide from '~/foundation/base/slide.vue'

@Component({
  components: {
    Search,
    Slide
  }
})
export default class Home extends Vue {
  private data = [
      {
        linkUrl: 'http://y.qq.com/w/album.html?albummid=0044K2vN1sT5mE',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000001YCZlY3aBifi.jpg',
        id: 11351
      },
      {
        linkUrl: 'https://y.qq.com/m/digitalbum/gold/index.html?_video=true&id=2197820&g_f=shoujijiaodian',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000004ckGfg3zaho0.jpg',
        id: 11372
      }
    ]
    private isAutoPlay:boolean = true
    private isLoop:boolean = true
    private isShowDot:boolean = true
    private interval:number = 1500
    private threshold:number = 0.5
    private speed:number = 500
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

