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
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.palyer-mini {
  @include setSize(64px, 78px);
  display: flex;
  padding-top: 8px;
  justify-content: space-between;
  .mini-item {
    display: inline-block;
    @include setSize(12px, 100%);
    background-color: #adadad;
    border: none;
    border-radius: 10px;
    &.mini-first {
      height: 90%;
    }
    &.mini-second {
      height: 64%;
    }
    &.mini-third {
      height: 40%;
    }
  }
}
</style>
