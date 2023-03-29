const RECORD_USERINFO = 'RECORD_USERINFO'
const GET_USERINFO = 'GET_USERINFO'
const SAVE_CITY = 'SAVE_CITY'
const SAVE_PLACE = 'SAVE_PLACE'
const SAVE_GEOHASH = 'SAVE_GEOHASH'
const SAVE_SHOPDETAIL = 'SAVE_SHOPDETAIL'
const ADD_CART = 'ADD_CART'
const REDUCE_CART = 'REDUCE_CART'
const INIT_BUYCART = 'INIT_BUYCART'
const CLEAR_CART = 'CLEAR_CART'
const SAVE_SHOPID = 'SAVE_SHOPID'
const SAVE_CART_ID_SIG = 'SAVE_CART_ID_SIG'
import { setStorage, getStorage } from '../utils'

export default {
    [RECORD_USERINFO](state, info) {
        state.userInfo = info
        state.login = true
        setStorage('user_id', info.user_id)
    },
    [GET_USERINFO](state, info) {
        state.userInfo = info
    },
    [SAVE_CITY](state, { name, id }) {
        state.cityName = name
        state.cityId = id
    },
    [SAVE_PLACE](state, name) {
        state.placeName = name
    },
    [SAVE_GEOHASH](state, geohash) {
        state.geohash = geohash
        let latitude = geohash.substring(0, geohash.indexOf(','))
        let longitude = geohash.substring(geohash.indexOf(',') + 1)
        state.latitude = Number(latitude)
        state.longitude = Number(longitude)
    },
    [SAVE_SHOPDETAIL](state, detail) {
        state.shopDetail = detail
    },
    //保存商铺id
    [SAVE_SHOPID](state, shopid) {
        state.shopid = shopid
    },
    // 加入购物车
    [ADD_CART](
        state,
        {
            shopid,
            category_id,
            item_id,
            food_id,
            name,
            price,
            specs,
            packing_fee,
            sku_id,
            stock,
        }
    ) {
        let cart = state.cartList
        let shop = (cart[shopid] = cart[shopid] || {})
        let category = (shop[category_id] = shop[category_id] || {})
        let item = (category[item_id] = category[item_id] || {})
        if (item[food_id]) {
            item[food_id]['num']++
        } else {
            item[food_id] = {
                num: 1,
                id: food_id,
                name: name,
                price: price,
                specs: specs,
                packing_fee: packing_fee,
                sku_id: sku_id,
                stock: stock,
            }
        }
        state.cartList = { ...cart }
        //存入localStorage
        setStorage('buyCart', JSON.stringify(state.cartList))
    },
    // 移出购物车
    [REDUCE_CART](
        state,
        { shopid, category_id, item_id, food_id, name, price, specs }
    ) {
        let cart = state.cartList
        let shop = cart[shopid] || {}
        let category = shop[category_id] || {}
        let item = category[item_id] || {}
        if (item && item[food_id]) {
            if (item[food_id]['num'] > 0) {
                item[food_id]['num']--
                state.cartList = { ...cart }
                //存入localStorage
                setStorage('buyCart', JSON.stringify(state.cartList))
            } else {
                //商品数量为0，则清空当前商品的信息
                item[food_id] = null
            }
        }
    },
    //网页初始化时从本地缓存获取购物车数据
    [INIT_BUYCART](state) {
        let initCart = getStorage('buyCart')
        if (initCart) {
            state.cartList = JSON.parse(initCart)
        }
    },
    //清空当前商品的购物车信息
    [CLEAR_CART](state, shopid) {
        state.cartList[shopid] = null
        state.cartList = { ...state.cartList } //用扩展运算符实现浅拷贝
        setStorage('buyCart', JSON.stringify(state.cartList))
    },
    //保存下单后购物id 和 sig
    [SAVE_CART_ID_SIG](state, { cart_id, sig }) {
        state.cartId = cart_id
        state.sig = sig
    },
}
