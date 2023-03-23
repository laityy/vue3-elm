<template>
  <div class="shop">
    <head-top class="head_top" signinUp="shop">
      <template #search>
        <router-link to="/search"><span class="search">搜索</span></router-link>
      </template>
      <template #title>
        <span class="title">{{ data.shopAddress }}</span>
      </template>
    </head-top>
    <div class="nav">
      <div class="container">
        <swiper :slides-per-view="1" :pagination="{ type: 'bullets', }" class="swiper-container">
          <swiper-slide class="items">
            <div class="item" v-for="(foodItem) in data.FoodTypesList1" :key="foodItem.id">
              <router-link
                :to="{ path: '/food', query: { geohash: data.geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link) } }">
                <img :src="data.imgBaseUrl + foodItem.image_url" alt="" srcset="">
                <p>{{ foodItem.title }}</p>
              </router-link>
            </div>
          </swiper-slide>
          <swiper-slide class="items">
            <div class="item" v-for="(foodItem) in data.FoodTypesList2" :key="foodItem.id">
              <router-link
                :to="{ path: '/food', query: { geohash: data.geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link) } }">
                <img :src="data.imgBaseUrl + foodItem.image_url" alt="" srcset="">
                <p>{{ foodItem.title }}</p>
              </router-link>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="shop-list">
      <div class="nearby">
        <svg data-v-070ab150="" class="shop_icon">
          <use data-v-070ab150="" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
        </svg>
        <span>附近商家</span>
      </div>
      <shop-list></shop-list>
    </div>
    <footer-tab></footer-tab>
  </div>
</template>
<script setup>
import HeadTop from 'components/common/HeadTop'
import FooterTab from 'components/TabBar/FooterTab'
import ShopList from 'components/ShopList/ShopList.vue'
import { shopAddress, shopFoodTypes } from 'network/getData'
import SwiperCore, { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/components/scrollbar/scrollbar.less'
import 'swiper/components/pagination/pagination.less'
import 'swiper/swiper.min.css'
import { reactive } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
SwiperCore.use([Pagination])

const route = useRoute()

const data = reactive({
  geohash: route.query.geohash,
  shopAddress: '',
  FoodTypesList1: [],
  FoodTypesList2: [],
  imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
})
onMounted(() => {
  shopFoodTypes(data.geohash).then((res) => {
    for (let i = 0; i < res.data.length; i++) {
      if (i < 8) { data.FoodTypesList1[i] = res.data[i] } else {
        data.FoodTypesList2[i - 8] = res.data[i]
      }
    }
  })
  shopAddress(data.geohash).then((res) => {
    data.shopAddress = res.data.address
  })
})

function getCategoryId (url) {
  let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''));
  if (/restaurant_category_id/gi.test(urlData)) {
    return JSON.parse(urlData).restaurant_category_id.id
  } else {
    return ''
  }
}

// const vLoadMore = {

// }

</script>

<style lang="scss" scoped>
@import '../../style/mixin.scss';

.shop {
  background-color: #f5f5f5;
  color: #fff;
  padding-top: 7vh;

  .head_top {
    .search {
      color: #fff;
      font-weight: normal;
      font-size: 4vw;
    }

    .title {
      display: block;
      width: 50vw;
      overflow: hidden; //（文字长度超出限定宽度，则隐藏超出的内容）
      white-space: nowrap; //（设置文字在一行显示，不能换行）
      text-overflow: ellipsis; //（规定当文本溢出时，显示省略符号来代表被修剪的文本）
      color: #fff;
      font-weight: normal;
      font-size: 4vw;
    }

  }

  .nav {


    .container {
      width: 100%;
      background-color: #fff;
      padding-top: 1vh;

      .swiper-container {
        @include wh(100%, 28vh);

        .items {
          .item {
            float: left; //有时候浮动可以很好替代flex布局，浮动的元素不会重叠
            height: 13vh;
            width: 25%;
            text-align: center;

            img {
              // img是行内元素,但是可以直接给宽高
              width: 11vw;
              margin-top: 1vh;
            }

            p {
              color: #333;
              font-size: 2vh;
              margin-top: 1vh;
            }
          }
        }
      }
    }
  }

  .shop-list {
    margin-bottom: 7vh;
    margin-top: 2vh;

    .nearby {
      @include wh(100%, 5vh);
      @include font(2vh, 5vh);
      padding: 0 0 0 3vw;
      color: #999;
      background-color: #fff;
      border-top: 1px solid #ccc;

      span {
        color: #999;
        font-size: 3vw;
      }

      .shop_icon {
        fill: #999;
        width: 4vw;
        height: 2vh;
        margin-right: 1.2vw;
        vertical-align: middle;
      }
    }
  }
}
</style>