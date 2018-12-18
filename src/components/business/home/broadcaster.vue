<template>
  <div class="main-content">
    <Programs></Programs>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import Slide from '~/foundation/base/slide.vue'
import SongList from '~/foundation/com/songList.vue'
import TabContainer from '~/business/home/tabContainer.vue'
import Broadcastes from '~/foundation/com/broadcastes.vue'
import Programs from '~/foundation/com/programs.vue'
import CommonMixin from '@/mixins/comMix'

interface IBannerDataList {
  imageUrl: string
  url: string | null
  [propName: string]: any
}

@Component({
  components: {
    Slide,
    TabContainer,
    Programs,
    Broadcastes
  }
})
export default class Broadcaster extends mixins(CommonMixin) {}
</script>
<style lang="scss">
.main-content {
  position: relative;
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>


