<template>
  <div class="home">
    <Header></Header>
    <router-view />
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import Header from '~/foundation/com/header.vue'
import Footer from '~/foundation/com/footer.vue'
import { State, Mutation } from 'vuex-class'
import { UserInfo } from '@/store/state'
import CommonMixin from '@/mixins/comMix'
import { IPlaySong } from '@/store/state'

@Component({
  components: {
    Header,
    Footer
  }
})
export default class Home extends mixins(CommonMixin) {
  @State playList: IPlaySong[]
}
</script>
<style lang="scss">
.home {
  @include setSize(100%, 100%);
  display: flex;
  flex-direction: column;
}
</style>

