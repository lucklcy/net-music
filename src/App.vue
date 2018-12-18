<template>
  <div id="app">
    <router-view />
    <SongPlayer v-show="playList.length>0"></SongPlayer>
  </div>
</template>
<script lang="ts">
import SongPlayer from '~/business/player/index.vue'

import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State, Mutation } from 'vuex-class'
import { IPlaySong } from '@/common/interface/base.ts'

@Component({
  components: {
    SongPlayer
  }
})
export default class App extends mixins(CommonMixin) {
  @State playList: IPlaySong[]
}
</script>


<style lang="scss">
#app {
  @include setSize(100%, 100%);
  z-index: 0;
}
</style>
