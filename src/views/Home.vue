<template>
  <div class="home">
    <Header></Header>
    <Scroll class="home-container" ref="homeContainer" :data-list="[]" @flick='doFlick' :flick="true">
      <div>
        <router-view />
      </div>
    </Scroll>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Watch } from 'vue-property-decorator'
import Header from '~/foundation/com/header.vue'
import Footer from '~/foundation/com/footer.vue'
import { State, Mutation } from 'vuex-class'
import { UserInfo } from '@/common/interface/base.ts'
import CommonMixin from '@/mixins/comMix'
import { IPlaySong } from '@/common/interface/base.ts'
import Scroll from '~/foundation/base/scroll.vue'

interface IRoute {
  fullPath: string
  name: string
  path: string
  [propName: string]: any
}

@Component({
  components: {
    Header,
    Footer,
    Scroll
  }
})
export default class Home extends mixins(CommonMixin) {
  @State playList: IPlaySong[]

  private doFlick() {
    console.log('doFlick')
  }

  @Watch('$route', { deep: true })
  routerChange(val: IRoute, oldVal: IRoute) {
    let homeContainerScrollElement = this.$refs.homeContainer as Vue & { refresh: () => void }
    this.$nextTick(() => {
      homeContainerScrollElement.refresh()
    })
  }
}
</script>
<style lang="scss">
.home {
  @include setSize(100%, 100%);
  display: flex;
  flex-direction: column;
  .home-container {
    flex: 1;
    overflow: hidden;
  }
}
</style>

