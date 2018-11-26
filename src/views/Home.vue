<template>
  <div class="home">
    <Header></Header>
    <router-view />
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
import Header from '~/foundation/com/header.vue'

import { Mutation } from 'vuex-class'
import { UserInfo } from '@/store/state'
import CommonMixin from '@/mixins/comMix'

@Component({
  components: {
    Header
  }
})
export default class Home extends mixins(CommonMixin) {}
</script>
<style lang="scss">
.home {
  @include setSize(100%, 100%);
  display: flex;
  flex-direction: column;
}
</style>

