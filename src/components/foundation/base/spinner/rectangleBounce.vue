<template>
  <div class="rectangle-bounce">
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class rectangleBounce extends Vue {}
</script>
<style lang="scss" scoped>
$baseAssets: '../../../../assets';
.rectangle-bounce {
  @include setSize(92px, 132px);
  @include setFlexPos(row, space-between, center);
  text-align: center;
  font-size: 0.42rem;

  & > div {
    background-color: $color-highlight-background;
    height: 100%;
    width: 10px;
    display: inline-block;
    border-radius: 20px;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }

  & .rect2 {
    animation-delay: -1.1s;
  }

  & .rect3 {
    animation-delay: -1s;
  }

  & .rect4 {
    animation-delay: -0.9s;
  }

  & .rect5 {
    animation-delay: -0.8s;
  }

  @keyframes sk-stretchdelay {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }
}
</style>
