<template>
  <div class="food">
    <head-top class="head-top" :goBack="true">
      <template #title>
        <span class="title">
          {{ route.query.title }}
        </span>
      </template>
    </head-top>
    <section class="sort-container">
      <div class="sort-items">
        <div class="sort-item">
          <span>{{ route.query.title }}</span>
        </div>
        <div class="sort-item">
          <span>排序</span>
        </div>
        <div class="sort-item">
          <span>
            筛选
          </span>
        </div>
      </div>
    </section>
    <div class="shop-list">
      <shop-list></shop-list>
    </div>
  </div>
</template>

<script setup>
import ShopList from 'components/ShopList/ShopList'
import HeadTop from 'components/common/HeadTop.vue'
// import { reactive } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
// const data = reactive({
//     title: route.query.title
// })
</script>

<style lang="less" scoped>
.head-top {
  position: fixed;
  top: 0;
  width: 100%;
  overflow: hidden;
  z-index: 10;

}

.sort-container {
  position: fixed;
  top: 7vh;
  height: 6vh;
  width: 100%;
  background-color: #fafafa;
  z-index: 10;

  .sort-items {
    display: flex;

    .sort-item {
      width: 33%;
      height: 6vh;
      text-align: center;
      line-height: 6vh;
      border-right: 1px solid #ccc;
    }

    .sort-item:last-child {
      border: 0;
    }

  }
}

.shop-list {
  margin-top: 15vh;
}
</style>