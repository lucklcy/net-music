<template>
  <Scroll :dataList="dataArray" class="scroll">
    <div>
      <div class="slider-wrapper">
        <div v-for='item in dataArray'>
          <a href="">
                  <img :src="item" alt="">
              </a>
        </div>
      </div>
      <ul v-for='(item,index) in dataArray'>
        <li>{{index+1}}</li>
      </ul>
    </div>
  </Scroll>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Scroll from '~/foundation/base/scroll.vue'

@Component({
  components: {
    Scroll
  }
})
export default class Banner extends Vue {
  private dataArray: Array<string> = [
    'http://wx2.sinaimg.cn/large/006nLajtly1fk65lrevkqj30dw0dwadz.jpg',
    'http://wx4.sinaimg.cn/large/92bd278dly1fvh536kh42j20dw0dwq49.jpg'
  ]
}
</script>
<style lang="scss" scoped>
.scroll {
  @include setSize(100%, 500px);
  border: 1px solid #999;
  .slider-wrapper {
    width: 100%;
    position: relative;
    overflow: hidden;
  }
}
</style>
