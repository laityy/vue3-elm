<template>
  <section class="cart_module">
    <section v-if="!foods.specifications.length" class="cart_button">
      <transition name="showReduce">
        <span
          @click="removeOutCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock)"
          v-if="foodNum">
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
          </svg>
        </span>
      </transition>
      <transition name="fade">
        <span class="cart_num" v-if="foodNum">{{ foodNum }}</span>
      </transition>
      <svg class="add_icon"
        @click="addToCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock, $event)">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
      </svg>
    </section>
    <section v-else class="choose_specification">
      <section class="choose_icon_container">
        <transition name="showReduce">
          <svg class="specs_reduce_icon" v-if="foodNum" @click="showReduceTip">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
          </svg>
        </transition>
        <transition name="fade">
          <span class="cart_num" v-if="foodNum">{{ foodNum }}</span>
        </transition>
        <span class="show_chooselist" @click="showChooseList(foods)">选规格</span>
      </section>
    </section>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import { useState, useMutations } from 'hooks/useMappers'
import { computed } from '@vue/reactivity';
const props = defineProps(['foods', 'shopId'])
const emit = defineEmits(['showMoveDot', 'showChooseList', 'showReduceTip'])
const { cartList } = useState(['cartList'])

const { ADD_CART, REDUCE_CART } = useMutations([
  'ADD_CART', 'REDUCE_CART',
])

const showMoveDot = reactive([])
const shopCart = computed(() => Object.assign({}, cartList.value[props.shopId]))
const foodNum = computed(() => {
  let category_id = props.foods.category_id;
  let item_id = props.foods.item_id;
  if (shopCart.value && shopCart.value[category_id] && shopCart.value[category_id][item_id]) {
    let num = 0;
    Object.values(shopCart.value[category_id][item_id]).forEach((item, index) => {
      num += item.num;
    })
    return num;
  } else {
    return 0;
  }
})


//移出购物车
function removeOutCart (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) {
  if (foodNum.value > 0) {
    REDUCE_CART({ shopid: props.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock });
  }
}
//加入购物车，计算按钮位置。
function addToCart (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock, event) {
  ADD_CART({ shopid: props.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock });
  let elLeft = event.target.getBoundingClientRect().left;
  let elBottom = event.target.getBoundingClientRect().bottom;
  showMoveDot.push(true);
  emit('showMoveDot', showMoveDot, elLeft, elBottom);
}
//显示规格列表
function showChooseList (foodScroll) {
  emit('showChooseList', foodScroll)
}
//点击多规格商品的减按钮，弹出提示
function showReduceTip () {
  emit('showReduceTip')
}

</script>

<style lang="scss" scoped>
@import '../../style/mixin';

.cart_module {
  .add_icon {
    position: relative;
    z-index: 9;
  }

  .cart_button {
    display: flex;
    align-items: flex-start;
  }

  svg {
    @include wh(5vw, 5vw);
    fill: #3190e8;
  }

  .specs_reduce_icon {
    fill: #999;
  }

  .cart_num {
    @include fontsc(4vw, #666);
    margin: 0 1vw;
    text-align: center;
    font-family: Helvetica Neue, Tahoma;
  }

  .choose_specification {
    .choose_icon_container {
      display: flex;
      align-items: center;

      .show_chooselist {
        display: block;
        @include fontsc(.55rem, #fff);
        padding: .1rem .2rem;
        background-color: $blue;
        border-radius: 0.2rem;
        border: 1px solid $blue;
      }
    }
  }
}

.showReduce-enter-active,
.showReduce-leave-active {
  transition: all .3s ease-out;
}

.showReduce-enter,
.showReduce-leave-active {
  opacity: 0;
  transform: translateX(1rem);
}

.fade-enter-active,
.fade-leave-active {
  transition: all .3s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.fadeBounce-enter-active,
.fadeBounce-leave-active {
  transition: all .3s;
}

.fadeBounce-enter,
.fadeBounce-leave-active {
  opacity: 0;
  transform: scale(.7);
}
</style>

