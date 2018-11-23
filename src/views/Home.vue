<template>
  <div class="home">
    <Header></Header>
    <div class="main-content">
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
      <SongList></SongList>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import Header from '~/foundation/com/header.vue'
import Slide from '~/foundation/base/slide.vue'
import SongList from '~/foundation/com/songList.vue'
import service from '@/service'
import { Mutation } from 'vuex-class'
import { UserInfo } from '@/store/state'
import CommonMixin from '@/mixins/comMix'

interface IBannerDataList {
  imageUrl: string
  url: string | null
  [propName: string]: any
}

@Component({
  components: {
    Header,
    Slide,
    SongList
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

  @Mutation
  protected setUserInfo!: (payload: UserInfo) => void

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
<style lang="scss" scoped src="./Home.scss"></style>

