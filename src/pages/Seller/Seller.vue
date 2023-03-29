<template>
  <div class="seller">
    <div class="top-nav">
      <div class="goback" @click="router.go(-1)">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="arrow">
          <path d="M0 0 L8 7 L0 14" stroke="#fff" stroke-width="2" fill="none"></path>
        </svg>
      </div>
      <nav class="top">
        <img :src="imgBaseUrl + data.sellerDetailData.image_path" alt="">
        <section class="right">
          <h1>{{ data.sellerDetailData.name }}</h1>
          <p> 商家配送／{{ data.sellerDetailData.float_minimum_order_amount }}分钟送达／配送费¥{{
            data.sellerDetailData.float_delivery_fee }}</p>
          <p>公告：{{ promotionInfo }}</p>
        </section>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="arrow">
          <path d="M0 0 L8 7 L0 14" stroke="#fff" stroke-width="1" fill="none"></path>
        </svg>
      </nav>
      <div class="toggle">
        <div @click="toggle('商品')"><span :class="{ active: data.isShow == '商品' }">商品</span></div>
        <div @click="toggle('评价')"><span :class="{ active: data.isShow == '评价' }">评价</span></div>
      </div>
    </div>
    <div class="container">
      <transition name="slide-fade" mode="out-in">
        <section class="food-container" v-show="data.isShow == '商品'">
          <div class="side-bar" ref="sideWrapper">
            <ul class="items">
              <li class="item" v-for="(item, index) in data.menuList" :key="index"
                :class="{ active: index === data.menuIndex }" @click="chooseMenu(index)">
                {{ item.name }}
              </li>
            </ul>
          </div>
          <div class="commodity-list" ref="foodWrapper">
            <ul class="list">
              <li v-for="(item, index) in data.menuList" :key="index">
                <header>
                  <div class="left">
                    <h2>{{ item.name }}</h2>
                    <span>{{ item.description }}</span>
                  </div>
                  <span>···</span>
                </header>
                <div class="commodity" v-for="(foods, foodindex) in foodsList(index)" :key="foodindex">
                  <router-link to="/home" class="detail_link">
                    <img :src="imgBaseUrl + foods.image_path" alt="">
                  </router-link>
                  <section class="commodity-detail">
                    <section class="detail-right">
                      <h3>
                        <span class="title">{{ foods.name }}</span>
                        <span class="zhaopai">招牌</span>
                      </h3>
                      <p class="description-content">{{ foods.description }}</p>
                      <p class="description-rating">
                        <span>
                          月售{{ foods.month_sales }}份
                        </span>
                        <span>
                          好评率{{ foods.satisfy_rate }}%
                        </span>
                      </p>
                      <p class="description-price">
                        <span class="price">${{ foods.specfoods[0].price }}</span>
                        <buy-cart :shopId='data.shopId' :foods='foods' @moveInCart="listenInCart"
                          @showChooseList="showChooseList" @showReduceTip="showReduceTip"
                          @showMoveDot="showMoveDotFun"></buy-cart>
                      </p>
                    </section>
                  </section>
                </div>
              </li>
            </ul>
          </div>
          <section class="buy_cart_container">
            <section @click="toggleCartList" class="cart_icon_num">
              <div class="cart_icon_container"
                :class="{ cart_icon_activity: data.totalPrice > 0, move_in_cart: data.receiveInCart }"
                ref="cartContainer">
                <span v-if="totalNum" class="cart_list_length">
                  {{ totalNum }}
                </span>
                <svg class="cart_icon">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
                </svg>
              </div>
              <div class="cart_num">
                <div>¥ {{ data.totalPrice }}</div>
                <div>配送费¥￥{{ deliveryFee }}</div>
              </div>
            </section>
            <section class="gotopay" :class="{ gotopay_acitvity: minimumOrderAmount <= 0 }">
              <span class="gotopay_button_style" v-if="minimumOrderAmount > 0">还差¥{{ minimumOrderAmount }}起送</span>
              <router-link :to="{ path: '/confirmOrder', query: { geohash: data.geohash, shopid: data.shopId } }"
                class="gotopay_button_style" v-else>去结算</router-link>
            </section>
          </section>
          <transition name="toggle-cart">
            <section class="cart_food_list" v-show="data.showCartList && data.cartFoodList.length">
              <header>
                <h4>购物车</h4>
                <div @click="clearCart">
                  <svg>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-*6vwove"></use>
                  </svg>
                  <span class="clear_cart">清空</span>
                </div>
              </header>
              <section class="cart_food_details" id="cartFood">
                <ul>
                  <li v-for="(item, index) in data.cartFoodList" :key="index" class="cart_food_li">
                    <div class="cart_list_num">
                      <p class="ellipsis">{{ item.name }}</p>
                      <p class="ellipsis">{{ item.specs }}</p>
                    </div>
                    <div class="cart_list_price">
                      <span>¥</span>
                      <span>{{ item.price }}</span>
                    </div>
                    <section class="cart_list_control">
                      <span
                        @click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                        <svg>
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                        </svg>
                      </span>
                      <span class="cart_num">{{ item.num }}</span>
                      <svg class="cart_add"
                        @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                      </svg>
                    </section>
                  </li>
                </ul>
              </section>
            </section>
          </transition>
        </section>
      </transition>
      <transition name="slide-fade" mode="out-in">
        <section class="rating-container" v-show="data.isShow == '评价'">
          <div class="rating-content" ref="ratingWrapper">
            <div>
              <header class="rating_header">
                <section class="rating_header_left">
                  <p>{{ data.sellerDetailData.rating }}</p>
                  <p>综合评价</p>
                  <p>高于周边商家{{ (data.ratingScoresData.compare_rating * 100).toFixed(1) }}%</p>
                </section>
                <section class="rating_header_right">
                  <p>
                    <span>服务态度</span>
                    <rating-star :rating='data.ratingScoresData.service_score'></rating-star>
                    <span class="rating_num">{{ (data.ratingScoresData.service_score * 1).toFixed(1) }}</span>
                  </p>
                  <p>
                    <span>菜品评价</span>
                    <rating-star :rating='data.ratingScoresData.food_score'></rating-star>
                    <span class="rating_num">{{ (data.ratingScoresData.food_score * 1).toFixed(1) }}</span>
                  </p>
                  <p>
                    <span>总体评价</span>
                    <rating-star :rating='data.ratingScoresData.overall_score'></rating-star>
                    <span class="rating_num">{{ (data.ratingScoresData.overall_score * 1).toFixed(1) }}</span>
                  </p>
                  <p>
                    <span>送达时间</span>
                    <span class="delivery_time">{{ data.ratingScoresData.deliver_time }}分钟</span>
                  </p>
                </section>
              </header>
              <ul class="tag_list_ul">
                <li v-for="(item, index) in data.ratingTagsList" :key="index"
                  :class="{ unsatisfied: item.unsatisfied, tagActivity: data.ratingTageIndex == index }"
                  @click="changeTgeIndex(index, item.name)">{{ item.name }}({{ item.count }})</li>
              </ul>
              <ul class="rating_list_ul">
                <li v-for="(item, index) in data.ratingList" :key="index" class="rating_list_li">
                  <img class="user_avatar" :src="useImgPath(item.avatar)">
                  <section class="rating_list_details">
                    <header>
                      <section class="username_star">
                        <p class="username">{{ item.username }}</p>
                        <p class="star_desc">
                          <rating-star :rating='item.rating_star'></rating-star>
                          <span class="time_spent_desc">{{ item.time_spent_desc }}</span>
                        </p>
                      </section>
                      <time class="rated_at">{{ item.rated_at }}</time>
                    </header>
                    <ul class="food_img_ul">
                      <li v-for="(item, index) in item.item_ratings" :key="index">
                        <img v-if="item.image_hash" :src="useImgPath(item.image_hash)">
                      </li>
                    </ul>
                    <ul class="food_name_ul">
                      <li v-for="(item, index) in item.item_ratings" :key="index" class="ellipsis">
                        {{ item.food_name }}
                      </li>
                    </ul>
                  </section>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </transition>
    </div>
    <!-- <router-view></router-view> -->
    <transition name="loading">
      <Loading v-if="data.showLoad"></Loading>
    </transition>
  </div>
</template>

<script setup>
import BScroll from '@better-scroll/core'
import Loading from 'components/common/Loading'
import buyCart from 'components/common/buyCart'
import RatingStar from 'components/common/RatingStar'
import { imgBaseUrl } from 'config/env'
import { sellerDetails, foodMenu, getRatingList, ratingScores, ratingTags } from 'network/getData'
import { nextTick, computed, onMounted, onBeforeMount, reactive, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useState, useMutations } from 'hooks/useMappers'
import { useImgPath } from 'hooks/useImg'
const router = useRouter()
const route = useRoute()
const data = reactive({
  isShow: '商品',
  showLoad: true,
  geohash: route.query.geohash, //geohash位置信息
  shopId: route.query.id, //商店id值
  sellerDetailData: {}, //商铺详情
  // showActivities: false, //是否显示活动详情
  menuList: [], //食品侧边栏列表
  menuIndex: 0, //已选菜单索引值，默认为0
  menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
  shopListTop: [], //商品列表的高度集合
  ratingList: null, //评价列表
  ratingOffset: 0, //评价获取数据offset值
  ratingScoresData: {}, //评价总体分数
  ratingTagsList: null, //评价分类列表
  ratingTageIndex: 0, //评价分类索引
  foodScroll: null,  //食品列表scroll
  sideScroll: null,  //侧边栏scroll
  ratingScroll: null, //评价scroll
  imgBaseUrl,
  showCartList: false,//显示购物车列表
  receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
  showSpecs: false,//控制显示食品规格
  specsIndex: 0, //当前选中的规格索引值
  choosedFoods: null, //当前选中视频数据
  timer: null,//定时器
  showDeleteTip: false, //多规格商品点击减按钮，弹出提示框
  showMoveDot: [], //控制下落的小圆点显示隐藏
  windowHeight: null, //屏幕的高度
  elLeft: 0, //当前点击加按钮在网页中的绝对top值
  elBottom: 0, //当前点击加按钮在网页中的绝对left值
  totalPrice: 0, //总共价格
  cartFoodList: [], //购物车商品列表
})
/*
后端数据太多，对食物列表渲染的数据做处理，
*/
function foodsList (index) {
  if (data.menuList[index].foods.length > 20) {
    return data.menuList[index].foods.slice(0, 10)
  } else {
    return data.menuList[index].foods
  }
}

const { latitude, longitude, cartList } = useState(['latitude', 'longitude', 'cartList'])
const { SAVE_GEOHASH, SAVE_SHOPDETAIL } = useMutations(['SAVE_GEOHASH', 'SAVE_SHOPDETAIL'])
const promotionInfo = computed(() => data.sellerDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。')
const deliveryFee = computed(() => {  //配送费
  if (data.sellerDetailData) {
    return data.sellerDetailData.float_delivery_fee;
  } else {
    return null;
  }
})
// const shopCart = computed(() => {//当前商店购物信息
//   return { ...cartList.value[data.shopId] };
// })
const shopCart = ref(null)
// watch(shopCart, () => {
//   initCategoryNum()
// })
watchEffect(() => { //watchEffect的回调会立即执行，不需要指定 immediate: true
  // shopCart.value = { ...cartList.value[data.shopId] }
  shopCart.value = cartList.value[data.shopId]
  // console.log('initCate111', (shopCart.value))
  initCategoryNum()
  console.log('shopCart,', shopCart.value)
  console.log('cartList,', cartList.value[data.shopId])
})
const totalNum = computed(() => { //购物车中总共商品的数量
  let num = 0;
  data.cartFoodList.forEach(item => {
    num += item.num
  })
  return num
})
const minimumOrderAmount = computed(() => {//还差多少元起送，为负数时显示去结算按钮
  if (data.sellerDetailData) {
    return data.sellerDetailData.float_minimum_order_amount - data.totalPrice;
  } else {
    return null;
  }
})

const { ADD_CART, REDUCE_CART, INIT_BUYCART, CLEAR_CART } = useMutations([
  'ADD_CART', 'REDUCE_CART', 'INIT_BUYCART', 'CLEAR_CART'
])
const initData = async () => {
  // console.log('init')
  // console.log('count', ++data.count)
  if (!latitude.value) {
    //获取位置信息
    SAVE_GEOHASH(data.geohash);
  }

  //获取商铺信息
  // console.log('data.sellerDetailData---before', data.sellerDetailData)
  data.sellerDetailData = (await sellerDetails(data.shopId, latitude.value, longitude.value)).data
  // console.log('data.sellerDetailData---after', data.sellerDetailData)
  // await sellerDetails(data.shopId, latitude.value, longitude.value).then((res) => {
  //   data.sellerDetailData = res.data
  // });
  // console.log('@ssss@', document.querySelector('.commodity-list').scrollHeight)
  //获取商铺食品列表
  data.menuList = (await foodMenu(data.shopId)).data.slice(0, 20)

  // await foodMenu(data.shopId).then((res) => {
  //   data.menuList = res.data
  // });
  // console.log('@ssss@', document.querySelector('.commodity-list').scrollHeight)
  // 评论列表
  data.ratingList = (await getRatingList(data.shopId, data.ratingOffset)).data
  // await getRatingList(data.shopId, data.ratingOffset).then((res) => {
  //   // console.log('getRatingList---response', res)
  //   data.ratingList = res.data
  // })
  // 商铺评论详情
  data.ratingScoresData = (await ratingScores(data.shopId)).data
  // console.log('===================================', data.ratingScoresData)
  // console.log(data.ratingScoresData.service_score.toFixed(1))
  // 评论Tag列表
  data.ratingTagsList = (await ratingTags(data.shopId)).data
  // await ratingTags(data.shopId).then((res) => {
  //   data.ratingTagsList = res.data
  // })
  SAVE_SHOPDETAIL(data.sellerDetailData)
}
async function changeTgeIndex (index, name) {
  data.ratingTageIndex = index;
  data.ratingOffset = 0;
  data.ratingTagName = name;
  let res = await getRatingList(data.shopId, data.ratingOffset, name);
  data.ratingList = [...res];
  nextTick(() => {
    data.ratingScroll.refresh();
  })
}
const cartContainer = ref(null)
//监听圆点是否进入购物车
function listenInCart () {
  if (!data.receiveInCart) {
    data.receiveInCart = true;
    cartContainer.value.addEventListener('animationend', () => {
      data.receiveInCart = false;
    })
    cartContainer.value.addEventListener('webkitAnimationEnd', () => {
      data.receiveInCart = false;
    })
  }
}

//显示规格列表
function showChooseList (foods) {
  if (foods) {
    data.choosedFoods = foods;
  }
  data.showSpecs = !data.showSpecs;
  data.specsIndex = 0;
}
//记录当前所选规格的索引值
function chooseSpecs (index) {
  data.specsIndex = index;
}
//多规格商品加入购物车
function addSpecs (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) {
  ADD_CART({ shopid: data.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock });
  showChooseList();
}
//显示提示，无法减去商品
function showReduceTip () {
  data.showDeleteTip = true;
  clearTimeout(data.timer);
  data.timer = setTimeout(() => {
    clearTimeout(data.timer);
    data.showDeleteTip = false;
  }, 3000);
}
//显示下落圆球
function showMoveDotFun (showMoveDot, elLeft, elBottom) {
  data.showMoveDot = [...data.showMoveDot, ...showMoveDot];
  data.elLeft = elLeft;
  data.elBottom = elBottom;
}
//控制购物列表是否显示
function toggleCartList () {
  data.cartFoodList.length ? data.showCartList = !data.showCartList : true;
}
//加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
function addToCart (category_id, item_id, food_id, name, price, specs) {
  ADD_CART({ shopid: data.shopId, category_id, item_id, food_id, name, price, specs });
}
//移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
function removeOutCart (category_id, item_id, food_id, name, price, specs) {
  REDUCE_CART({ shopid: data.shopId, category_id, item_id, food_id, name, price, specs });
}
function clearCart () {
  toggleCartList();
  CLEAR_CART(data.shopId);
}
/**
 * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
 */
function initCategoryNum () {
  let newArr = [];
  let cartFoodNum = 0;
  data.totalPrice = 0;
  data.cartFoodList = [];
  data.menuList.forEach((item, index) => {
    if (shopCart.value && shopCart.value[item.foods[0].category_id]) {
      let num = 0;
      Object.keys(shopCart.value[item.foods[0].category_id]).forEach(itemid => {
        Object.keys(shopCart.value[item.foods[0].category_id][itemid]).forEach(foodid => {
          let foodItem = shopCart.value[item.foods[0].category_id][itemid][foodid];
          num += foodItem.num;
          if (item.type == 1) {
            data.totalPrice += foodItem.num * foodItem.price;
            if (foodItem.num > 0) {
              data.cartFoodList[cartFoodNum] = {};
              data.cartFoodList[cartFoodNum].category_id = item.foods[0].category_id;
              data.cartFoodList[cartFoodNum].item_id = itemid;
              data.cartFoodList[cartFoodNum].food_id = foodid;
              data.cartFoodList[cartFoodNum].num = foodItem.num;
              data.cartFoodList[cartFoodNum].price = foodItem.price;
              data.cartFoodList[cartFoodNum].name = foodItem.name;
              data.cartFoodList[cartFoodNum].specs = foodItem.specs;
              cartFoodNum++;
            }
          }
        })
      })
      newArr[index] = num;
    } else {
      newArr[index] = 0;
    }
  })
  data.totalPrice = data.totalPrice.toFixed(2);
  data.categoryNum = [...newArr];
}

// await等待promise的执行完成，
// console.log('data,', data)
onBeforeMount(async () => {
  await initData() //会被多次执行？？？
  getFoodListHeight()
  // console.log('data,', data)
  // console.log('router,', router)
  // console.log('route,', route)
  // console.log('route.query._value,', route.query._value)
  //执行顺序： setup的同步代码 ==> 进入生命周期钩子 ==> await卡住initData(),进入initData ==> 执行initData同步代码，每个await都会卡住，等待promise执行完
  INIT_BUYCART();
  bScroll()
  // console.log('initCate222')
  initCategoryNum()

  hideLoading()
})



console.log('setup================================================???????????????')




const hideLoading = () => {
  data.showLoad = false
}
const foodWrapper = ref(null) //食物列表
const sideWrapper = ref(null) //左侧边栏
const ratingWrapper = ref(null) //评价内容
const bScroll = () => {
  data.foodScroll = new BScroll(foodWrapper.value, {
    // observeDOM: true,  //引入ObserveDom插件，scroll自动调用refresh
    probeType: 3,
    click: true,
    scrollY: true
  })
  data.sideScroll = new BScroll(sideWrapper.value, {
    // observeDOM: true,
    // probeType: 3,
    click: true,
    scrollY: true
  })
  data.ratingScroll = new BScroll(ratingWrapper.value, {
    // observeDOM: true,
    probeType: 3,
    click: true,
    scrollY: true
  })
  console.log('scroll-rating', data.ratingScroll.scrollerHeight)//使用await后可以正常读取
  console.log('scroll-side', data.sideScroll.scrollerHeight)//使用await后可以正常读取
  console.log('scroll-food', data.foodScroll.scrollerHeight)//使用await后可以正常读取
}

watch(() => data.isShow, () => {
  if (!data.ratingScroll.scrollerHeight) {
    data.ratingScroll.refresh()
  }
  console.log('watch-scroll-rating', data.ratingScroll.scrollerHeight)
})

const toggle = (v) => {
  // if (data.ratingScroll.scrollerHeight == 0) {
  //   data.ratingScroll.refresh()
  // }
  data.isShow = v

}

//获取食品列表的高度，存入shopListTop
const getFoodListHeight = () => {
  if (foodWrapper.value) {
    // console.log('foodw.value', foodWrapper.value)
    // console.log('foodw.valuechildren', foodWrapper.value.children[0].children)
    const listArr = Array.from(foodWrapper.value.children[0].children);
    listArr.forEach((item, index) => {
      // console.log('item.offsetTop;', item)
      data.shopListTop[index] = item.offsetTop //要使offsetTop正常生效，需要给父元素定位，否则会找最近的 table, td, th, body
    });
    // console.log('listArr', listArr)
    // console.log('shopListTop', data.shopListTop)
  }
}

const chooseMenu = (index) => {
  data.menuIndex = index;
  //menuIndexChange解决运动时listenScroll依然监听的bug
  data.menuIndexChange = false;
  data.foodScroll.scrollTo(0, -data.shopListTop[index], 500);
  // data.foodScroll.on('scrollEnd', () => {
  //   data.menuIndexChange = true;
  // })
}

// onMounted(() => {
//   console.log('@ssss@', document.querySelector('.commodity-list').scrollHeight) //同步执行
  // debugger
  // bScroll()
  // nextTick(() => {
  //   console.log(456)
  //   // debugger
  //   getFoodListHeight()
  // })
// })

</script>

<style lang="scss" scoped>
@import '../../style/mixin.scss';

.loading-leave-active,
.loading-enter-active {
  transition: opacity 0.3s;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(30vw);
  opacity: 0;
}

.seller {
  height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;

  .top-nav {
    // position: fixed;
    // top: 0;
    // width: 100%;
    // z-index: 9;
    // overflow: hidden;

    .goback {
      position: fixed;

      .arrow {
        width: 4vw;
        height: 2vh;
        transform: rotate(180deg);
      }
    }

    .top {
      padding: 1vh 2vw 1vh 2vw;
      display: flex;
      align-items: center;
      background-color: rgba(119, 103, 137, 0.43);

      img {
        height: 11vh;
        width: 20vw;
        margin-right: 2vw;
        border-radius: 2vw;
      }

      .right {
        position: relative;

        h1,
        p {
          color: #fff;
          margin-bottom: 1vh;
        }

        h1 {
          font-size: 5vw;
          font-weight: 700;
        }

        p {
          font-size: 2vw;
        }


      }

      .arrow {
        position: absolute;
        right: 2vw;
        transform: translateY(-20%);
        width: 4vw;
        height: 2vh;
      }
    }

    .toggle {
      background-color: #fff;
      padding: 2vh 0;

      div {
        display: inline-block;
        width: 50%;
        text-align: center;
        font-size: 4vw;

        span {
          padding-bottom: 1vh;
        }
      }

      .active {
        color: #3190e8;
        border-bottom: 2px solid #3190e8;
      }
    }
  }

  .container {
    position: relative;

    .food-container {
      display: flex;

      .side-bar {
        flex: 1;
        height: 72vh;
        overflow-y: hidden;

        .item {
          color: #666;
          width: 100%;
          font-size: 4vw;
          padding: 3vh 4vw 2vh 6vw; //上右下左
          border-bottom: 0.5px solid #ededed;
          border-left: 1px solid #f8f8f8;
          position: relative;
        }

        .active {
          color: #666;
          font-weight: 700;
          background-color: #fff;
          border-left: 1vw solid #3190e8;
        }
      }

      .commodity-list {
        flex: 3;
        height: 72vh;
        overflow: hidden;
        position: relative;

        header {
          // background-color: #ccc;
          padding-right: 2vw;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .left {
            display: flex;
            padding: 3vh 2vw 1.5vh 4vw;

            h2 {
              font-weight: 700;
              font-size: 4vw;
              margin-right: 2vw;
            }

            span {
              font-size: 3vw;
              margin-top: 0.6vh;
            }
          }
        }

        .commodity {
          width: 100%;
          background-color: #fff;
          display: flex;
          padding: 2vh 3vw;
          border-bottom: 1px solid #f5f5f5;

          .detail_link {
            flex: 1;

            img {
              height: 9vh;
              width: 17vw;
              margin-right: 2vw;

            }
          }

          .commodity-detail {
            flex: 3;

            .detail-right {
              width: 100%;


              h3 {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5vh;

                .title {
                  font-weight: 700;
                  font-size: 4vw;
                }

                .zhaopai {
                  color: rgb(240, 115, 115);
                  border: 1px solid rgb(240, 115, 115);
                  border-radius: 2vw;
                  height: 3.5vw;
                  line-height: 3.5vw;
                  font-size: 2vw;
                }
              }

              .description-content {
                font-size: 3vw;
                color: #999;
                line-height: 3vw;
                margin-bottom: 0.5vh;
              }

              .description-rating {
                margin-bottom: 0.5vh;

                span {
                  font-size: 3vw;
                  line-height: 4vw;
                  color: #333;
                }
              }

              .description-price {
                display: flex;
                justify-content: space-between;

                .price {
                  font-size: 4vw;
                  color: #f60;
                  font-weight: bold;
                  margin-right: 2vw;
                }
              }
            }
          }

        }
      }


      .cart_food_list {
        position: fixed;
        width: 100%;
        padding-bottom: 8vh;
        z-index: 12;
        bottom: 0;
        left: 0;
        background-color: #fff;

        header {
          @include fj;
          align-items: center;
          padding: 1vh 4vw;
          background-color: #eceff1;

          svg {
            @include wh(3vw, 3vw);
            vertical-align: middle;
          }

          h4 {
            @include fontsc(3.5vw, #666);
          }

          .clear_cart {
            @include fontsc(3vw, #666);
          }
        }

        .cart_food_details {
          background-color: #fff;
          max-height: 100vw;
          overflow-y: auto;

          .cart_food_li {
            @include fj;
            padding: 4vw 3.5vw;

            .cart_list_num {
              width: 55%;

              p:nth-of-type(1) {
                @include fontsc(4.3vw, #666);
                font-weight: bold;
              }

              p:nth-of-type(2) {
                @include fontsc(2.5vw, #666);
              }
            }

            .cart_list_price {
              font-size: 0;

              span:nth-of-type(1) {
                @include fontsc(3.7vw, #f60);
                font-family: Helvetica Neue, Tahoma;

              }

              span:nth-of-type(2) {
                @include fontsc(4vw, #f60);
                font-family: Helvetica Neue, Tahoma;
                font-weight: bold;
              }
            }

            .cart_list_control {
              display: flex;
              align-items: center;

              span {
                display: flex;
                align-items: center;
                justify-content: center;
              }

              svg {
                @include wh(6vw, 6vw);
                fill: #3190e8;
              }

              .specs_reduce_icon {
                fill: #999;
              }

              .cart_num {
                @include fontsc(4vw, #666);
                min-width: 7vw;
                text-align: center;
                font-family: Helvetica Neue, Tahoma;
              }
            }
          }
        }
      }

    }

    .buy_cart_container {
      position: absolute;
      background-color: #3d3d3f;
      bottom: -7vh;
      left: 0;
      z-index: 13;
      display: flex;
      @include wh(100%, 7vh);

      .cart_icon_num {
        flex: 1;

        .cart_icon_container {
          display: flex;
          background-color: #3d3d3f;
          position: absolute;
          padding: 2.5vw;
          border: 1vw solid #444;
          border-radius: 50%;
          left: 3vw;
          top: -4vw;

          .cart_icon {
            @include wh(8vw, 4vh);
          }

          .cart_list_length {
            position: absolute;
            top: 1vw;
            right: 1vw;
            background-color: #ff461d;
            line-height: 1.6vh;
            text-align: center;
            border-radius: 50%;
            border: 0.025*6vw solid #ff461d;
            min-width: .7*6vw;
            height: .7*6vw;
            @include fontsc(.5*6vw, #fff);
            font-family: Helvetica Neue, Tahoma, Arial;
          }
        }

        .move_in_cart {
          animation: mymove .5s ease-in-out;
        }

        .cart_icon_activity {
          background-color: #3190e8;
        }

        .cart_num {
          @include ct;
          left: 22vw;

          div {
            color: #fff;
          }

          div:nth-of-type(1) {
            font-size: 5vw;
            font-weight: bold;
            margin-bottom: .6vw;
          }

          div:nth-of-type(2) {
            font-size: 2.5vw;
          }
        }
      }

      .gotopay {
        position: absolute;
        right: 0;
        background-color: #535356;
        @include wh(25vw, 100%);
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        .gotopay_button_style {
          @include fontsc(4vw, #fff);
          font-weight: bold;
        }
      }

      .gotopay_acitvity {
        background-color: #4cd964;
      }
    }

    .rating-container {
      background-color: #f5f5f5;
      height: 79vh;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 10;

      .rating-content {
        height: 100%;
        overflow: hidden;
      }

      p,
      span,
      li,
      time {
        font-family: Helvetica Neue, Tahoma, Arial;
      }

      .rating_header {
        display: flex;
        background-color: #fff;
        padding: .8*6vw .5*6vw;
        margin-bottom: 0.5*6vw;

        .rating_header_left {
          flex: 3;
          text-align: center;

          p:nth-of-type(1) {
            @include fontsc(1.2*6vw, #f60);
            margin-bottom: 0.5vh;
          }

          p:nth-of-type(2) {
            @include fontsc(.65*6vw, #666);
            margin-bottom: 0.5vh;
          }

          p:nth-of-type(3) {
            @include fontsc(.4*6vw, #999);
          }
        }

        .rating_header_right {
          flex: 4;

          p {
            font-size: .65*6vw;
            line-height: 1*6vw;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            span:nth-of-type(1) {
              color: #666;
              margin-right: .5*6vw;
            }

            .rating_num {
              margin: 0 2vw 0 1vw;
              @include fontsc(.55*6vw, #f60);
            }

            .delivery_time {
              @include fontsc(.4*6vw, #999);
            }
          }
        }
      }

      .tag_list_ul {
        display: flex;
        flex-wrap: wrap;
        background-color: #fff;
        padding: .5*6vw;

        li {
          @include fontsc(.6*6vw, #6d7885);
          padding: .3*6vw .3*6vw;
          background-color: #ebf5ff;
          border-radius: 0.2*6vw;
          border: 1px;
          margin: 0 .4*6vw .2*6vw 0;
        }

        .unsatisfied {
          background-color: #f5f5f5;
          color: #aaa;
        }

        .tagActivity {
          background-color: #3190e8;
          color: #fff;
        }
      }

      .rating_list_ul {
        background-color: #fff;
        padding: 0 .5*6vw;

        .rating_list_li {
          border-top: 1px solid #f1f1f1;
          display: flex;
          padding: .6*6vw 0;

          .user_avatar {
            @include wh(1.5*6vw, 1.5*6vw);
            border: 0.025*6vw;
            border-radius: 50%;
            margin-right: .8*6vw;
          }

          .rating_list_details {
            flex: 1;

            header {
              display: flex;
              flex: 1;
              justify-content: space-between;
              margin-bottom: .3*6vw;

              .username_star {
                @include fontsc(.55*6vw, #666);

                .username {
                  color: #666;
                  margin-bottom: .2*6vw;
                }

                .star_desc {
                  display: flex;
                  align-items: center;

                  .time_spent_desc {
                    @include fontsc(.55*6vw, #666);
                    margin-left: .15*6vw;
                  }
                }
              }

              .rated_at {
                @include fontsc(.4*6vw, #999);
              }
            }

            .food_img_ul {
              display: flex;
              flex-wrap: wrap;
              margin-bottom: .4*6vw;

              li {
                img {
                  @include wh(3*6vw, 3*6vw);
                  margin-right: .4*6vw;
                  display: block;
                }
              }
            }

            .food_name_ul {
              display: flex;
              flex-wrap: wrap;

              li {
                @include fontsc(.55*6vw, #999);
                width: 2.2*6vw;
                padding: .2*6vw;
                border: 0.025*6vw solid #ebebeb;
                border-radius: 0.15*6vw;
                margin-right: .3*6vw;
                margin-bottom: 4px;
              }
            }
          }
        }
      }
    }
  }


}

.toggle-cart-enter-active,
.toggle-cart-leave-active {
  transition: all .3s ease-out;
}

.toggle-cart-enter-from,
.toggle-cart-leave-to {
  transform: translateY(100%);
}
</style>