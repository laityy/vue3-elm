<template>
  <div class="shoplistitem_container">
    <router-link :to="{ path: '/seller', query: { geohash, id: item.id } }" class="shop_link">
      <section>
        <img :src="data.imgBaseUrl + item.image_path" class="shop_img">
      </section>
      <div class="shop_right">
        <hgroup class="shop_detail_header">
          <h4 :class="item.is_premium ? 'premium' : ''" class="shop_title ellipsis">{{ item.name }}
          </h4>
          <ul class="shop_detail_ul">
            <li v-for="item in item.supports" :key="item.id" class="supports">{{ item.icon_name }}</li>
          </ul>
        </hgroup>
        <h5 class="rating_order_num">
          <section class="rating_order_num_left">
            <section class="rating_section">
              <rating-star :rating='item.rating'></rating-star>
              <span class="rating_num">{{ item.rating }}</span>
            </section>
            <section class="order_section">
              月售{{ item.recent_order_num }}单
            </section>
          </section>
          <section class="rating_order_num_right">
            <span class="delivery_style delivery_left" v-if="item.delivery_mode">{{ item.delivery_mode.text
            }}</span>
            <span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
          </section>
        </h5>
        <h5 class="fee_distance">
          <p class="fee">
            ¥{{ item.float_minimum_order_amount }}起送
            <span class="segmentation">/</span>
            {{ item.piecewise_agent_fee.tips }}
          </p>
          <p class="distance_time">
            <span v-if="Number(item.distance)">{{ item.distance > 1000 ? (item.distance / 1000).toFixed(2) +
              'km' : item.distance + 'm' }}
              <span class="segmentation">/</span>
            </span>
            <span v-else>{{ item.distance }}</span>
            <span class="segmentation">/</span>
            <span class="order_time">{{ item.order_lead_time }}</span>
          </p>
        </h5>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import ratingStar from 'components/common/RatingStar.vue';
import { defineProps, reactive } from 'vue';
import { imgBaseUrl } from 'config/env';
import { useState } from 'hooks/useMappers';

const { geohash } = useState(['geohash'])
// const geohash = computed(() => store.state.geohash)
defineProps(['item'])
const data = reactive({
  imgBaseUrl
})
function zhunshi (supports) {
  let zhunStatus;
  if ((supports instanceof Array) && supports.length) {
    supports.forEach(item => {
      if (item.icon_name === '准') {
        zhunStatus = true;
      }
    })
  } else {
    zhunStatus = false;
  }
  return zhunStatus
}
</script>

<style lang="scss" scoped>
@import '../../style/mixin.scss';

.shoplistitem_container {
  background-color: #fff;
  // margin-bottom: 2vh;
}

span {
  color: #333;
}

.shop_link {
  display: flex;
  border-bottom: 1px solid #f1f1f1;
  padding: 1vh 2vw;
}

.shop_img {
  display: block;
  margin-right: 4vw;
  width: 22vw;
  height: 11vh;
}

.list_back_li {
  height: 20vh;

}

.shop_right {
  flex: auto;

  .shop_detail_header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .shop_title {
      color: #333;
      padding-top: .1vh;
      font-weight: 700;
      width: 40vw;
    }

    .premium::before {
      content: '品牌';
      display: inline-block;
      font-size: 0.5vh;
      line-height: .6vh;
      color: #333;
      background-color: #ffd930;
      padding: 0.8vh 0.3vw;
      border-radius: 0.3vh;
      margin-right: 1vw;
    }

    .shop_detail_ul {
      display: flex;
      transform: scale(.8);
      margin-right: -0.3vh;

      .supports {

        border: 0.025vh solid #f1f1f1;
        padding: 0 0.04vh;
        border-radius: 0.08vh;
        margin-left: 0.05vh;
      }
    }
  }

  .rating_order_num {

    height: 2vh;
    margin-top: 2vh;
    display: flex;
    justify-content: space-between;

    .rating_order_num_left {

      display: flex;

      .rating_section {
        display: flex;

        .rating_num {
          @include fontsc(1vh, #ff6000);
          margin: 0 1vh;
        }
      }

      .order_section {
        transform: scale(.8);
        margin-left: -0.2vh;
        // rem是vh的2.5倍，是vw的5倍
        @include fontsc(1vh, #666)
      }
    }

    .rating_order_num_right {
      display: flex;
      align-items: center;
      transform: scale(.7);
      min-width: 5vh;
      justify-content: flex-end;
      margin-right: -0.8vh;

      .delivery_style {
        font-size: 0.4vh;
        padding: 0.04vh 0.08vh 0;
        border-radius: 0.08vh;
        margin-left: 0.08vh;
        border: 1px;
      }

      .delivery_left {
        color: #fff;
        background-color: #3190e8;
        margin-right: 0.8vw;
        border: 0.025vh solid #3190e8;

      }

      .delivery_right {
        color: #3190e8;
        ;
        border: 0.025vh solid #3190e8;
        ;
      }
    }
  }

  .fee_distance {
    display: flex;
    justify-content: space-between;
    margin-top: 2vh;

    .fee {
      transform: scale(.9);
      font-size: 0.3vw;
    }

    .distance_time {
      transform: scale(.9);

      span {
        color: #999;
      }

      .order_time {
        color: #3190e8;
        ;
      }

      .segmentation {
        color: #ccc;
      }
    }
  }
}
</style>