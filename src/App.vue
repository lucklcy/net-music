<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
    <FmPlayer v-if="playList.length===0 && showFmPlayer"></FmPlayer>
    <SongPlayer v-if="playList.length>0 && showMainPlayer"></SongPlayer>
  </div>
</template>
<script lang="ts">
import SongPlayer from '~/business/player/index.vue'
import FmPlayer from '~/business/fmplayer/index.vue'

import { mixins } from 'vue-class-component'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State, Mutation } from 'vuex-class'
import { IPlaySong, IRoute } from '@/common/interface/base.ts'

@Component({
  components: {
    SongPlayer,
    FmPlayer
  }
})
export default class App extends mixins(CommonMixin) {
  @State
  playList: IPlaySong[]
  @State
  showFmPlayer: boolean
  @State
  showMainPlayer: boolean

  private transitionName: string = ''

  @Watch('$route', { deep: true })
  routerChange(val: IRoute, oldVal: IRoute) {
    //如果to索引大于from索引,判断为前进状态,反之
    if (val.meta.index > oldVal.meta.index) {
      this.transitionName = 'slide-left'
    } else {
      this.transitionName = 'slide-right'
    }
  }
}
</script>


<style lang="scss">
#app {
  @include setSize(100%, 100%);
  z-index: 0;
}
</style>
