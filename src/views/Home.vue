<template>
  <div class="home">
    <Header></Header>
    <Scroll class="home-container" ref="homeContainer" :data-list="[]" @flick='doFlick' :flick="true">
      <div>
        <transition :name="transitionName">
          <keep-alive>
            <router-view />
          </keep-alive>
        </transition>
      </div>
    </Scroll>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Watch } from 'vue-property-decorator'
import Header from '~/foundation/com/header.vue'
import { State, Mutation } from 'vuex-class'
import { UserInfo } from '@/common/interface/base.ts'
import CommonMixin from '@/mixins/comMix'
import { IPlaySong, IRoute } from '@/common/interface/base.ts'
import Scroll from '~/foundation/base/scroll.vue'

@Component({
  components: {
    Header,
    Scroll
  }
})
export default class Home extends mixins(CommonMixin) {
  @State playList: IPlaySong[]

  private transitionName: string = ''

  private doFlick() {
    console.log('doFlick')
  }

  @Watch('$route', { deep: true })
  routerChange(val: IRoute, oldVal: IRoute) {
    let homeContainerScrollElement = this.$refs.homeContainer as Vue & { refresh: () => void }
    this.$nextTick(() => {
      homeContainerScrollElement.refresh()
    })
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

