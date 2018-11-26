<template>
  <section class="broadcastes">
    <p class="title">{{title}}</p>
    <div class="broadcast-container">
      <ul class="broadcast-list">
        <li v-for="(item,index) in BroadcastList" :key="index">
          <div class="broadcast-item">
            <div class="pic" :style="{backgroundImage:'url('+item.picUrl+')'}"></div>
            <div class="content">
              <span class="name">{{item.name | limitIn(18)}}</span>
              <span class="count">
                <img :src="earPodImg" alt="听过">
                <span>{{item.program.adjustedPlayCount | dealWithPlayCount}}</span>
              </span>
              <span class="desc">{{item.copywriter}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { State } from 'vuex-class'

export interface IDJPrograms {
  id: number
  picUrl: string
  name: string
  copywriter: string
  [propName: string]: any
}

@Component({
  components: {}
})
export default class Broadcastes extends mixins(CommonMixin) {
  private BroadcastList: IDJPrograms[] = []
  private earPodImg: string | ImageData = require('@/assets/img/earPodGray.png')
  private title: string = '推荐电台'

  created() {
    this.service
      .getDjprogram({})
      .then((resultBroadcastList: { result: IDJPrograms[] }) => {
        this.BroadcastList = resultBroadcastList && resultBroadcastList['result']
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }
}
</script>
<style lang="scss" scoped src='./broadcastes.scss'></style>
