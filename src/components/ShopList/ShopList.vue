<template>
  <div class="list">
    <ul v-if="data.shopListArr.length > 0">
      <shop-list-item v-for="shopitem in data.shopListArr" :key="shopitem.id" :item="shopitem"></shop-list-item>
    </ul>
    <transition name="loading">
      <Loading v-if="data.showLoad">
      </Loading>
    </transition>
  </div>
</template>


<script setup>
import { nextTick, reactive } from 'vue';
import ShopListItem from './ShopListItem.vue';
import { shopList } from 'network/getData'
import { imgBaseUrl } from 'config/env';
import { useRoute } from 'vue-router';
import Loading from '../common/Loading';
const route = useRoute()
const data = reactive({
  offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
  shopListArr: [], // 店铺列表数据
  preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
  // showBackStatus: false, //显示返回顶部按钮
  // showLoading: true, //显示加载动画
  touchend: false, //没有更多数据
  imgBaseUrl,
  geohash: route.query.geohash,
  showLoad: true
})

const { geohash } = data
const latitude = Number(geohash.substring(0, geohash.indexOf(',')))
const longitude = Number(geohash.substring(geohash.indexOf(',') + 1))
shopList(latitude, longitude, data.offset).then((res) => {
  data.shopListArr = res.data
  nextTick(() => {
    data.showLoad = false
  })
})


</script> 

<style lang="less" scoped>
.list {

  .loading-enter-active,
  .loading-leave-active {
    transition: opacity 1s
  }

  .loading-enter-from,
  .loading-leave-active {
    opacity: 0
  }
}
</style>