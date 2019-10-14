<template>
  <div class="top-list">
    <TopBar back-route-name='r_home_recommand' title='排行榜'></TopBar>
    <section class="content">
      <div class="official-title">
        <span>官方榜</span>
      </div>
      <ul class="official-list" v-if="officialList && officialList.length>0">
        <li class="item" v-for="(item,index) in officialList" :key="index" @click="goToSongList(item)">
          <div class="pic" :style="{backgroundImage:'url('+item.coverImgUrl+')'}">
            <div class="frequency">
              <span>{{item.updateFrequency}}</span>
            </div>
          </div>
          <div class="label-list border-bottom-1px">
            <span class="item" v-for="(innerIntem,innerIndex) in item.tracks">
              <span class="name">{{innerIndex+1}}.&nbsp;{{innerIntem.first+' - '+innerIntem.second
                | limitIn(16)}}</span>
            </span>
          </div>
        </li>
      </ul>
      <div class="spinner first" v-else>
        <SvgIcon :iconClass="'spinner-bars'" :className="'spinner-bars'"></SvgIcon>
      </div>
      <div class="global-title">
        <span>全球榜</span>
      </div>
      <ul class="global-list" v-if="globalList && globalList.length>0">
        <li class="item" v-for="(item,index) in globalList" :key="index" @click="goToSongList(item)">
          <div class="pic" :style="{backgroundImage:'url('+item.coverImgUrl+')'}">
            <div class="frequency">
              <span>{{item.updateFrequency}}</span>
            </div>
          </div>
          <div class="name">
            <span>{{item.name}}</span>
          </div>
        </li>
        <li class="item space-holder" v-if="globalList.length%3===2">
          &nbsp;
        </li>
      </ul>
      <div class="spinner second" v-else>
        <SvgIcon :iconClass="'spinner-bars'" :className="'spinner-bars'"></SvgIcon>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { ITopSongListDetail, IPlaylist } from '@/common/interface/base.ts'
import TopBar from '~/foundation/com/topBar.vue'
import { isEmpty } from '@/utils'
import { Mutation } from 'vuex-class'
import { Y, N } from '@/common/const'

@Component({
  components: {
    TopBar
  }
})
export default class TopList extends mixins(CommonMixin) {
  // 官方榜单
  private officialList: ITopSongListDetail[] = []
  // 全球榜单
  private globalList: ITopSongListDetail[] = []

  @Mutation
  setCurrentSongListBackgroundUrl: (backgroundUrl: string) => void
  private goToSongList(item: IPlaylist) {
    this.setCurrentSongListBackgroundUrl(item.coverImgUrl)
    this.$router.push({
      name: 'r_song_list',
      params: { id: item.id },
      query: {
        subscribed: item['subscribed'] ? Y : N
      }
    })
  }

  private dealWithTopList(topList: ITopSongListDetail[]) {
    let tempOfficialList: ITopSongListDetail[] = []
    let tempGlobalList: ITopSongListDetail[] = []
    const officalListNameArray = ['云音乐飙升榜', '云音乐新歌榜', '云音乐原创榜', '云音乐热歌榜']
    if (topList && topList.length > 0) {
      topList.forEach((item: ITopSongListDetail, index: number) => {
        let { name } = item
        if (officalListNameArray.indexOf(name) !== -1) {
          tempOfficialList.push(item)
        } else {
          tempGlobalList.push(item)
        }
      })
      this.officialList = tempOfficialList
      this.globalList = tempGlobalList
    }
  }

  created() {
    this.service.getTopListDetail({}).then((topListDetailResult: { list: ITopSongListDetail[] }) => {
      let topList = topListDetailResult['list']
      this.dealWithTopList(topList)
    })
  }
}
</script>
<style lang="scss" scoped src='./index.scss'></style>

