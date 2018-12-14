<template>
  <section class="programs">
    <p class="title">{{title}}</p>
    <div class="program-container">
      <ul class="program-list">
        <li v-for="(item,index) in ProgramList" :key="index">
          <div class="program-item">
            <div class="pic" :style="{backgroundImage:'url('+item.coverUrl+')'}"></div>
            <div class="content">
              <span class="name">{{item.name | limitIn(16)}}</span>
              <span class="count">
                <i class="iconfont icon-erji"></i>
                {{item.listenerCount|dealWithPlayCount}}
              </span>
              <span class="desc">{{item.description | limitIn(46)}}</span>
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
import { IPrograms } from '@/common/interface/base.ts'

@Component({
  components: {}
})
export default class Programs extends mixins(CommonMixin) {
  private ProgramList: IPrograms[] = []
  private title: string = ''

  created() {
    this.service
      .getProgramRecommend({})
      .then((resultProgramsList: { programs: IPrograms[]; name: string }) => {
        this.title = resultProgramsList && resultProgramsList['name']
        this.ProgramList = resultProgramsList && resultProgramsList['programs']
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }
}
</script>
<style lang="scss" scoped src='./programs.scss'></style>
