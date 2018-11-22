<template>
  <div class="palyer-mini">
    <span class="mini-item mini-first"></span>
    <span class="mini-item mini-second"></span>
    <span class="mini-item mini-third"></span>
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
  @include setSize(64px, 88px);
  display: flex;
  padding-top: 14px;
  justify-content: flex-start;
  .mini-item {
    display: inline-block;
    width: 12px;
    background-color: #adadad;
    border: none;
    border-radius: 10px;
    &.mini-first {
      height: 86%;
      margin-right: 10px;
    }
    &.mini-second {
      width: 11px;
      height: 66%;
      margin-right: 10px;
    }
    &.mini-third {
      width: 11px;
      height: 42%;
    }
  }
}
</style>
