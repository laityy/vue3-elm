<template>
  <div class="alet_container">
    <section class="tip_text_container">
      <div class="tip_icon">
        <span></span>
        <span></span>
      </div>
      <p class="tip_text">{{ alertText }}</p>
      <div class="confrim" @click="closeTip">确认</div>
    </section>
  </div>
</template>

<script setup>
import { reactive, defineProps } from 'vue';

const data = reactive({
  positionY: 0,
  timer: null,
})
defineProps(['alertText'])
const emit = defineEmits(['closeTip'])
function closeTip () {
  emit('closeTip')
}
</script>

<style lang="scss" scoped>
@import '../../style/mixin';

@keyframes tipMove {
  0% {
    transform: scale(1)
  }

  35% {
    transform: scale(.8)
  }

  70% {
    transform: scale(1.1)
  }

  100% {
    transform: scale(1)
  }
}

.alet_container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
}

.tip_text_container {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -6*6vw;
  margin-left: -6*6vw;
  width: 12*6vw;
  animation: tipMove .4s;
  background-color: rgba(255, 255, 255, 1);
  border: 1px;
  padding-top: .6*6vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px;
  border-radius: 0.25*6vw;

  .tip_icon {
    @include wh(3*6vw, 3*6vw);
    border: 0.15*6vw solid #f8cb86;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    span:nth-of-type(1) {
      @include wh(.12*6vw, 1.5*6vw);
      background-color: #f8cb86;
    }

    span:nth-of-type(2) {
      @include wh(.2*6vw, .2*6vw);
      border: 1px;
      border-radius: 50%;
      margin-top: .2*6vw;
      background-color: #f8cb86;
    }
  }

  .tip_text {
    @include fontsc(.7*6vw, #333);
    line-height: .9*6vw;
    text-align: center;
    margin-top: .8*6vw;
    padding: 0 .4*6vw;
  }

  .confrim {
    @include fontsc(.8*6vw, #fff);
    font-weight: bold;
    margin-top: .8*6vw;
    background-color: #4cd964;
    width: 100%;
    text-align: center;
    line-height: 1.8*6vw;
    border: 1px;
    border-bottom-left-radius: 0.25*6vw;
    border-bottom-right-radius: 0.25*6vw;
  }
}
</style>
