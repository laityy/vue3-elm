<template>
  <div class="search">
    <head-top :goBack="true">
      <template #title>
        <span>搜索</span>
      </template>
    </head-top>
    <form class="search_form">
      <input type="search" placeholder="请输入商家或美食名称" class="search_input">
      <input type="submit" value="" class="search_submit">
    </form>

    <footer-tab></footer-tab>
    <transition name="loading">
      <Loading v-if="data.showLoad"></Loading>
    </transition>
  </div>
</template>

<script setup>
import HeadTop from 'components/common/HeadTop'
import FooterTab from 'components/TabBar/FooterTab'
import Loading from 'components/common/Loading';
import { onMounted, reactive } from 'vue';
const data = reactive({
  showLoad: true
})
onMounted(() => {
  data.showLoad = false
})
</script>

<style lang="scss" scoped>
.search {
  height: 100vh;
  background-color: #f5f5f5;
  padding-top: 7vh;
}

.search_form {
  height: 8vh;
  line-height: 8vh;
  display: flex;
  background-color: #fff;
  align-items: center;
  justify-content: center;

  .search_input {
    height: 5vh;
    width: 70vw;
    border: 0.5px solid #e4e4e4;
    font-size: 2vh;
    color: #333;
    border-radius: 0.6vh;
    background-color: #f2f2f2;
    font-weight: 700;
    padding: 0 1.6vh;
  }
}

.search_submit {
  height: 5vh;
  width: 20vw;
  margin-left: 2vw;
  border: 0.5px solid #3190e8;
  font-size: 2vh;
  color: #fff;
  border-radius: 0.6vh;
  background-color: #3190e8;
  font-weight: 700;
  padding: 0 1.6vh;
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 1s
}

.loading-enter,
.loading-leave-active {
  opacity: 0
}
</style>