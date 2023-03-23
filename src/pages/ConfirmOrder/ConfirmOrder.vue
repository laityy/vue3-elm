<template>
  <div class="confirmOrderContainer">
    <section v-if="!data.showLoading">
      <head-top head-title="确认订单" goBack="true" signin-up='confirmOrder'>
        <template #title>
          <span>确认订单</span>
        </template>
      </head-top>
      <router-link
        :to='{ path: "/confirmOrder/chooseAddress", query: { id: data.checkoutData.cart.id, sig: data.checkoutData.sig } }'
        class="address_container">
        <div class="address_empty_left">
          <svg class="location_icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
          </svg>
          <div class="add_address" v-if="!choosedAddress">请添加一个收货地址</div>
          <div v-else class="address_detail_container">
            <header>
              <span>{{ choosedAddress.name }}</span>
              <span>{{ choosedAddress.sex == 1 ? '先生' : '女士' }}</span>
              <span>{{ choosedAddress.phone }}</span>
            </header>
            <div class="address_detail">
              <span v-if="choosedAddress.tag" :style="{ backgroundColor: iconColor(choosedAddress.tag) }">{{
                choosedAddress.tag }}</span>
              <p>{{ choosedAddress.address_detail }}</p>
            </div>
          </div>
        </div>
        <svg class="address_empty_right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
      </router-link>
      <section class="delivery_model container_style">
        <p class="deliver_text">送达时间</p>
        <section class="deliver_time">
          <p>尽快送达 | 预计 {{ data.checkoutData.delivery_reach_time }}</p>
          <p v-if="data.checkoutData.cart.is_deliver_by_fengniao">蜂鸟专送</p>
        </section>
      </section>
      <section class="pay_way container_style">
        <header class="header_style">
          <span>支付方式</span>
          <div class="more_type" @click="showPayWayFun">
            <span>在线支付</span>
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </header>
        <section class="hongbo">
          <span>红包</span>
          <span>暂时只在饿了么 APP 中支持</span>
        </section>
      </section>
      <section class="food_list">
        <header v-if="data.checkoutData.cart.restaurant_info">
          <img :src="imgBaseUrl + data.checkoutData.cart.restaurant_info.image_path">
          <span>{{ data.checkoutData.cart.restaurant_info.name }}</span>
        </header>
        <ul class="food_list_ul" v-if="data.checkoutData.cart.groups">
          <li v-for="item in data.checkoutData.cart.groups[0]" :key="item.id" class="food_item_style">
            <p class="food_name ellipsis">{{ item.name }}</p>
            <div class="num_price">
              <span>x {{ item.quantity }}</span>
              <span>¥{{ item.price }}</span>
            </div>
          </li>
        </ul>
        <div class="food_item_style" v-if="data.checkoutData.cart.extra">
          <p class="food_name ellipsis">{{ data.checkoutData.cart.extra[0].name }}</p>
          <div class="num_price">
            <span></span>
            <span>¥ {{ data.checkoutData.cart.extra[0].price }}</span>
          </div>
        </div>
        <div class="food_item_style">
          <p class="food_name ellipsis">配送费</p>
          <div class="num_price">
            <span></span>
            <span>¥ {{ data.checkoutData.cart.deliver_amount || 0 }}</span>
          </div>
        </div>
        <div class="food_item_style total_price">
          <p class="food_name ellipsis">订单 ¥{{ data.checkoutData.cart.total }}</p>
          <div class="num_price">
            <span>待支付 ¥{{ data.checkoutData.cart.total }}</span>
          </div>
        </div>
      </section>
      <section class="pay_way container_style">
        <router-link
          :to='{ path: "/confirmOrder/*6vwark", query: { id: data.checkoutData.cart.id, sig: data.checkoutData.sig } }'
          class="header_style">
          <span>订单备注</span>
          <div class="more_type">
            <span class="ellipsis">{{ remarkText || inputText ? remarklist : '口味、偏好等' }}</span>
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </router-link>
        <router-link :to="data.checkoutData.invoice.is_available ? '/confirmOrder/invoice' : ''" class="hongbo"
          :class="{ support_is_available: data.checkoutData.invoice.is_available }">
          <span>发票抬头</span>
          <span>
            {{ data.checkoutData.invoice.status_text }}
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </router-link>
      </section>
      <section class="confrim_order">
        <p>待支付 ¥{{ data.checkoutData.cart.total }}</p>
        <p @click="confrimOrder">确认下单</p>
      </section>
      <transition name="fade">
        <div class="cover" v-if="showPayWay" @click="showPayWayFun"></div>
      </transition>
      <transition name="slid_up">
        <div class="choose_type_Container" v-if="showPayWay">
          <header>支付方式</header>
          <ul>
            <li v-for="item in data.checkoutData.payments" :key="item.id" :class="{ choose: payWayId == item.id }">
              <span>{{ item.name }}<span v-if="!item.is_online_payment">{{ item.description }}</span></span>
              <svg class="address_empty_right" @click="choosePayWay(item.is_online_payment, item.id)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
            </li>
          </ul>
        </div>
      </transition>
    </section>
    <loading v-if="data.showLoading"></loading>
    <!-- <alert-tip v-if="data.showAlert" @closeTip="data.showAlert = false" :alertText="data.alertText"></alert-tip> -->
    <router-view v-slot="{ Component }">
      <transition name="router-slid" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useState, useMutations } from 'hooks/useMappers'
import HeadTop from 'components/common/HeadTop'
// import alertTip from 'components/common/alertTip'
import Loading from 'components/common/Loading'
import { checkout, getAddress, } from 'network/getData'
import { imgBaseUrl } from 'config/env'
import { onBeforeMount, reactive } from 'vue'
import { computed } from '@vue/reactivity'
import { useRoute } from 'vue-router'

const data = reactive({
  geohash: '', //geohash位置信息
  shopId: null, //商店id值
  showLoading: true, //显示加载动画
  checkoutData: null,//数据返回值
  shopCart: null,//购物车数据
  imgBaseUrl, //图片域名
  showPayWay: false,//显示付款方式
  payWayId: 1, //付款方式
  showAlert: false, //弹出框
  alertText: null, //弹出框内容
})
const route = useRoute()
const { userInfo, cartList, choosedAddress } = useState(['userInfo', 'cartList', 'choosedAddress'])
const { INIT_BUYCART, SAVE_SHOPID, SAVE_CART_ID_SIG } = useMutations(['INIT_BUYCART', 'SAVE_SHOPID', 'SAVE_CART_ID_SIG'])
//获取上个页面传递过来的geohash值
data.geohash = route.query.geohash;
//获取上个页面传递过来的shopid值
data.shopId = route.query.shopid;
INIT_BUYCART();
SAVE_SHOPID(data.shopId);
//获取当前商铺购物车信息
data.shopCart = cartList.value[data.shopId];

async function initData () {
  let newArr = new Array;
  Object.values(data.shopCart).forEach(categoryItem => {
    Object.values(categoryItem).forEach(itemValue => {
      Object.values(itemValue).forEach(item => {
        newArr.push({
          attrs: [],
          extra: {},
          id: item.id,
          name: item.name,
          packing_fee: item.packing_fee,
          price: item.price,
          quantity: item.num,
          sku_id: item.sku_id,
          specs: [item.specs],
          stock: item.stock,
        })
      })
    })
  })
  //检验订单是否满足条件
  data.checkoutData = (await checkout(data.geohash, [newArr], data.shopId)).data
  console.log('data', data.checkoutData)
  SAVE_CART_ID_SIG({ cart_id: data.checkoutData.cart.id, sig: data.checkoutData.sig })
  // await initAddress();
  data.showLoading = false;
}
async function initAddress () {
  if (userInfo.value && userInfo.value.user_id) {
    const addressRes = await getAddressList(data.userInfo.user_id);
    if (addressRes instanceof Array && addressRes.length) {
      data.CHOOSE_ADDRESS({ address: addressRes[0], index: 0 });
    }
  }
}
onBeforeMount(async () => {
  await initData()
})

</script>
<style lang="scss" scoped>
@import '../../style/mixin';

.confirmOrderContainer {
  padding-top: 1.95*6vw;
  padding-bottom: 3*6vw;

  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.container_style {
  background-color: #fff;
  margin-top: .4*6vw;
  padding: 0 .7*6vw;
}

.address_container {
  min-height: 3.5*6vw;
  @include fj;
  align-items: center;
  padding: 0 0.6*6vw;
  background: url(../../images/address_bottom.png) left bottom repeat-x;
  background-color: #fff;
  background-size: auto .12*6vw;

  .address_empty_left {
    display: flex;
    align-items: center;

    .location_icon {
      @include wh(.8*6vw, .8*6vw);
      fill: $blue;
      margin-right: .2*6vw;
    }

    .add_address {
      @include fontsc(.7*6vw, #333);
    }

    .address_detail_container {
      margin-left: .2*6vw;

      header {
        @include fontsc(.65*6vw, #333);

        span:nth-of-type(1) {
          font-size: .8*6vw;
          font-weight: bold;
        }
      }

      .address_detail {
        width: 100%;
        display: flex;
        align-items: center;

        span {
          @include fontsc(.5*6vw, #fff);
          border-radius: .15*6vw;
          background-color: #ff5722;
          height: .6*6vw;
          line-height: .6*6vw;
          padding: 0 .2*6vw;
          margin-right: .3*6vw;
        }

        p {
          @include fontsc(.55*6vw, #777);
        }
      }
    }
  }
}

.address_empty_right {
  @include wh(.6*6vw, .6*6vw);
  fill: #999;
}

.delivery_model {
  border-left: .2*6vw solid $blue;
  min-height: 4*6vw;
  @include fj;
  align-items: center;

  .deliver_text {
    @include fontsc(.8*6vw, #333);
    font-weight: bold;
    padding-left: .3*6vw;
  }

  .deliver_time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    p:nth-of-type(1) {
      @include fontsc(.7*6vw, $blue);
    }

    p:nth-of-type(2) {
      @include fontsc(.5*6vw, #fff);
      background-color: $blue;
      width: 2.4*6vw;
      margin-top: .5*6vw;
      text-align: center;
      border-radius: 0.12*6vw;
      padding: .1*6vw;
    }
  }
}

.pay_way {
  .header_style {
    @include fj;
    line-height: 2*6vw;

    span:nth-of-type(1) {
      @include fontsc(.7*6vw, #666);
    }

    .more_type {
      span:nth-of-type(1) {
        @include fontsc(.6*6vw, #aaa);
        width: 10*6vw;
        display: inline-block;
        text-align: right;
        vertical-align: middle;
      }

      svg {
        @include wh(.5*6vw, .5*6vw);
        fill: #ccc;
      }
    }
  }

  .hongbo {
    @include fj;
    border-top: 0.025*6vw solid #f5f5f5;

    span {
      @include fontsc(.6*6vw, #aaa);
      line-height: 2*6vw;

      svg {
        @include wh(.5*6vw, .5*6vw);
        vertical-align: middle;
        fill: #ccc;
      }
    }

    span:nth-of-type(2) {
      color: #aaa;
    }
  }

  .support_is_available {
    span {
      color: #666;
    }
  }
}

.food_list {
  background-color: #fff;
  margin-top: .4*6vw;

  header {
    padding: .7*6vw;
    border-bottom: 0.025*6vw solid #f5f5f5;

    img {
      @include wh(1.2*6vw, 1.2*6vw);
      vertical-align: middle;
    }

    span {
      @include fontsc(.8*6vw, #333);
    }
  }

  .food_list_ul {
    padding-top: .5*6vw;
  }

  .food_item_style {
    @include fj;
    line-height: 1.8*6vw;
    padding: 0 .7*6vw;

    span,
    p {
      @include fontsc(.65*6vw, #666);
    }

    .food_name {
      width: 11*6vw;
    }

    .num_price {
      flex: 1;
      @include fj;
      align-items: center;

      span:nth-of-type(1) {
        color: #f60;
      }
    }
  }

  .total_price {
    border-top: 0.025*6vw solid #f5f5f5;
  }
}

.confrim_order {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 2*6vw;

  p {
    line-height: 2*6vw;
    @include fontsc(.75*6vw, #fff);
  }

  p:nth-of-type(1) {
    background-color: #3c3c3c;
    flex: 5;
    padding-left: .7*6vw;
  }

  p:nth-of-type(2) {
    flex: 2;
    background-color: #56d176;
    text-align: center;
  }
}

.cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .3);
  z-index: 203;
}

.choose_type_Container {
  min-height: 10*6vw;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 204;

  header {
    background-color: #fafafa;
    @include fontsc(.7*6vw, #333);
    text-align: center;
    line-height: 2*6vw;
  }

  ul {
    li {
      @include fj;
      padding: 0 .7*6vw;
      line-height: 2.5*6vw;
      align-items: center;

      span {
        @include fontsc(.7*6vw, #ccc);
      }

      svg {
        @include wh(.8*6vw, .8*6vw);
        fill: #eee;
      }
    }

    .choose {
      span {
        color: #333;
      }

      svg {
        fill: #4cd964;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.slid_up-enter-active,
.slid_up-leave-active {
  transition: all .3s;
}

.slid_up-enter,
.slid_up-leave-active {
  transform: translate3d(0, 10*6vw, 0)
}

.router-slid-enter-active,
.router-slid-leave-active {
  transition: all .4s;
}

.router-slid-enter,
.router-slid-leave-active {
  transform: translate3d(2*6vw, 0, 0);
  opacity: 0;
}
</style>