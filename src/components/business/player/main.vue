<template>

</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State } from 'vuex-class'
export interface ISongDetail {
  id: number
  url: string
}
@Component({
  components: {}
})
export default class SongMainPlayer extends mixins(CommonMixin) {
  private songId: string = ''
  created() {
    let songId = this.$route.query && this.$route.query.id
    this.songId = songId
    this.service.getSongUrl({ id: songId }).then((resultSongDetail: ISongDetail) => {
      console.log({ resultSongDetail })
    })
  }
}
</script>
<style lang="scss" scoped>
</style>


