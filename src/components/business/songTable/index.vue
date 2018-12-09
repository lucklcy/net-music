<template>
  <div class="song-table">
    <div class="top">
      <span @click='goBack'>
        <SvgIcon :iconClass="'arrow-left'" :className="'arrow-left'"></SvgIcon>
      </span>
      <span class="title">歌单</span>
      <SvgIcon :iconClass="'table'" :className="'table'"></SvgIcon>
    </div>
    <section class="cotent">
      <div class="high-quality" v-if="highQualitySongList">
        <div class="background" :style="{backgroundImage:'url('+highQualitySongList.coverImgUrl+')'}"></div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { ICreator } from '@/store/state'

interface ICreater {
  avatarUrl: string
  backgroundUrl: string
  nickname: string
  userId: number
  [propName: string]: any
}

interface IPlayList {
  createTime: number
  creator: ICreator
  copywriter?: string
  coverImgUrl: string
  description: string
  name: string
  playCount: number
  shareCount: number
  trackCount: number
  updateTime: number
  userId: number
  tags: string[]
  [propName: string]: any
}

@Component({
  components: {}
})
export default class SongTable extends mixins(CommonMixin) {
  private highQualitySongList: IPlayList | null = null
  private handpickSongListArray: IPlayList[] | null = null

  private goBack() {
    this.$router.push({ name: 'r_home_recommand' })
  }

  created() {
    this.service
      .getHandpickList({ limit: 50 })
      .then((handpickListResult: { playlists: IPlayList[] }) => {
        this.highQualitySongList =
          handpickListResult['playlists'] && handpickListResult['playlists'][0]
      })
    this.service
      .getHighQualityList({ limit: 1 })
      .then((highQualityListResult: { playlists: IPlayList[] }) => {
        console.log({ highQualityListResult })
      })
  }
}
</script>
<style lang="scss" scoped>
$baseAsset: '../../../assets';
.song-table {
  @include setSize(100%, 100%);
  @include setFlexPos(column, flex-start, flex-start);
  .top {
    @include setSize(100%, 100px);
    @include setFlexPos(row, space-between, center);
    background-color: $color-highlight-background;
    z-index: 10;
    color: #fff;
    .arrow-left {
      font-size: 0.56rem;
      margin-left: 32px;
    }
    .title {
      font-size: 0.4rem;
    }
    .table {
      font-size: 0.56rem;
      margin-right: 40px;
    }
  }
  .cotent {
    @include setSize(100%, 100%);
    flex: 1;
    .high-quality {
      position: relative;
      background-color: #efefef;
      @include setSize(100%, 380px);
      .background {
        filter: blur(15px);
        z-index: 9;
        @include setBgImg('', center, center, cover, no-repeat);
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
      }
    }
  }
}
</style>


