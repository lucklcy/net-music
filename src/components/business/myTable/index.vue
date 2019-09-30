<template>
  <div class="my-song-table">
    <TopBar back-route-name='r_home_recommand' title='我的歌单'></TopBar>
    <div class="spinner-container">
      <div class="">
        <span>我创建的歌单</span>
        <div v-for="(item,index) in mySongListArray" :key="index">
          <div v-if="item.userId===userInfo.userId" @click="gotoDetail(item)">
            {{item.name}}
          </div>
        </div>
      </div>
      <div class="">
        <span>我收藏的歌单</span>
        <div v-for="(item,index) in mySongListArray" :key="index">
          <div v-if="item.userId!==userInfo.userId" @click="gotoDetail(item)">
            {{item.name}}
          </div>
        </div>
      </div>
      <div class="loadding">
        <SvgIcon :iconClass="'spinner-bars'" :className="'spinner-bars'"></SvgIcon>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { UserInfo, IPlayList, ICreator, ICategory } from '@/common/interface/base.ts'
import TopBar from '~/foundation/com/topBar.vue'
import { Mutation, State } from 'vuex-class'
import ChangeBackImg from '@/directives/changeBackImg.ts'

@Component({
  components: { TopBar },
  directives: {
    'change-back-img': ChangeBackImg
  }
})
export default class MyTable extends mixins(CommonMixin) {
  @State
  userInfo: UserInfo

  private mySongListArray: IPlayList[] = []

  @Mutation
  changeTableCat: (payload: { type: number; cat: string }) => void
  @Mutation
  setCurrentSongListBackgroundUrl: (backgroundUrl: string) => void

  private gotoDetail(item: IPlayList) {
    this.setCurrentSongListBackgroundUrl(item.coverImgUrl)
    this.$router.push({ name: 'r_song_list', params: { id: item.id } })
  }

  // 初始化时获取歌单数据
  private getMyTable() {
    this.service
      .getUserPlayList({ uid: this.userInfo.userId })
      .then((playListDetail: { playlist: IPlayList[] }) => {
        this.mySongListArray = playListDetail.playlist
      })
  }

  private onOpenPlayList(item: IPlayList) {}

  activated() {
    this.getMyTable()
  }

  created() {
    this.getMyTable()
  }
}
</script>
<style lang="scss" scoped>
$baseAsset: '../../../assets';
.my-song-table {
  @include setSize(100%, 100%);
}
</style>


