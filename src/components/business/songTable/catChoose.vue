<template>
  <div class="cat-choose">
    <div class="top">
      <span class="cancel">取消</span>
      <span class="content">筛选歌单</span>
    </div>
  </div>
</template>
<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue, Prop } from 'vue-property-decorator'
import CommonMixin from '@/mixins/comMix'
import { Mutation, State } from 'vuex-class'

interface ICategory {
  category: number
  createTime: number
  hot: boolean
  id: number
  name: string
  position: number
  type: number
  usedCount: number
}

@Component({
  components: {}
})
export default class CatChooser extends mixins(CommonMixin) {
  @State tableCat: string
  private cat: string = ''
  private limit: number = 20
  private categoryList: ICategory[] = []

  @Mutation changeTableCat: (payload: { type: number; cat: string }) => void

  private changeCat(name: string) {
    this.changeTableCat({ type: 0, cat: name })
  }

  private getCategoryList() {
    this.service.getCategoryList({}).then((categoryListResult: { playlists: IPlayList[] }) => {
      console.log({ categoryListResult })
    })
  }

  created() {
    this.getCategoryList()
  }
}
</script>
<style lang="scss" scoped>
$baseAsset: '../../../assets';
.cat-choose {
  @include setSize(100%, 100%);
  @include setFlexPos(column, flex-start, flex-start);
  .top {
    background-color: $color-highlight-background;
    @include setSize(100%, 138px);
    @include setFlexPos(row, flex-start, center);
    .cancel {
      font-size: 0.42rem;
      color: #fff;
      margin-left: 40px;
    }
    .content {
      font-size: 0.42rem;
      color: #fff;
      text-align: center;
      margin-left: 320px;
    }
  }
}
</style>


