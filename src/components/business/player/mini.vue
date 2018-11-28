<template>
  <div class="palyer-mini">
    <span class="mini-item mini-first"></span>
    <span class="mini-item mini-second"></span>
    <span class="mini-item mini-third"></span>
    <span class="mini-item mini-fourth"></span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Mini extends Vue {}
</script>
<style lang="scss" scoped>
.palyer-mini {
  @include setSize(60px, 68px);
  @include setFlexPos(row, space-between, flex-end);
  .mini-item {
    display: inline-block;
    width: 2px;
    background-color: #adadad;
    border: none;
    border-radius: 10px;
    &.mini-first {
      height: 50%;
    }
    &.mini-second {
      height: 90%;
    }
    &.mini-third {
      height: 60%;
    }
    &.mini-fourth {
      height: 80%;
    }
  }
}
</style>
