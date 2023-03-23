<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// BetterScroll 判断滚动是在初始化的时候就进行判断，也就是在 new BScroll 的时候进行计算，如果我们在 created 的时候获取列表数据
// 那显然很有可能我们在数据还没有获取的时候，BetterScroll 已经计算完了，这样页面就滚动不了。
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
// import { computed } from '@vue/reactivity';
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(ObserveDOM)
const wrapper = ref(null)
const scroll = ref(null)
onMounted(() => {
  scroll.value = new BScroll(wrapper.value, {
    observeDOM: true,
    click: true
  })
})

onUnmounted(() => {
  scroll.value.destroy()
})

</script>

<style lang="scss" scoped>
.wrapper {
  // height: 200px;
  overflow: hidden;
  background-color: rgb(183, 183, 183);
}
</style>