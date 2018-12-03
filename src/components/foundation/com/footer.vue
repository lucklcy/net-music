<template>
  <div class="footer">

  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'

@Component({
  components: {}
})
export default class Footer extends mixins(CommonMixin) {}
</script>
<style lang="scss" scoped>
$baseAssets: '../../../assets';
.footer {
  height: $mini-player-height;
}
</style>
