<template>
  <div class="loading_container">
    <div class="load_img" :style="{ backgroundPositionY: -(positionY % 7) * 10.5 + 'vw' }">
    </div>
    <svg class="load_ellipse" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <ellipse cx="26" cy="10" rx="26" ry="10" style="fill:#ddd;stroke:none;"></ellipse>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const timer = ref()
const positionY = ref(0)
onMounted(() => {
  timer.value = setInterval(() => {
    positionY.value++
  }, 600)
})
onUnmounted(() => {
  clearInterval(timer.value)
})

</script>

<style lang="scss" scoped>
@import '../../style/mixin';

@keyframes load {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-50px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes ellipse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.3);
  }

  100% {
    transform: scale(1);
  }
}

.loading_container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @include wh(10.5vw, 10.5vw);
}

.load_img {
  @include wh(100%, 100%);
  background: url(../../images/icon_loading.png) no-repeat 0 0;
  background-size: 10.5vw auto;
  transform: translateY(0px);
  animation: load .6s infinite ease-in-out;
  position: relative;
  z-index: 11;
}

.load_ellipse {
  position: absolute;
  @include wh(16vw, 8.4vw);
  top: 4.5vh;
  left: -1.5vw;
  z-index: 10;
  animation: ellipse .6s infinite ease-in-out;
}

// .loading_cover {
//     position: fixed;
//     top: 0;
//     width: 100%;
//     height: 100%;
//     left: 0;
//     z-index: 10;
//     background-color: #e4e4e4;
// }
</style>
