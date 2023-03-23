<template>
  <!-- <div>
    <router-view v-slot="{ Component }">
      <transition name="router" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    <svg-icon></svg-icon>
  </div> -->
  <div>
    <router-view v-slot="{ Component }">
      <transition name="router" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <svg-icon></svg-icon>
  </div>
</template>

<script setup>
import SvgIcon from 'components/common/Svg'
//引入全局使用的svg图标
</script>

<style lang="scss" scoped>
.router-enter-active,
.router-leave-active {
  transition: opacity 0.3s ease;
}

.router-enter-from,
//进入起点
.router-leave-to {
  //离开终点
  opacity: 0;
}

// 一般只设置进入的起点和离开的终点
//进入的起点，下一个元素从什么状态进来，离开的终点，当前元素最终离开时候的状态


// .router-enter-to,
// // 离开起点
// .router-leave-from {
//     // 进入终点
//     opacity: 1;
// }
</style>

