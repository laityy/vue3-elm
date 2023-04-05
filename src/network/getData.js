import axios from 'axios'
import { dataStr, getStorage } from '../utils'
const proxy = ''
let str = ''
export const hotCity = () => axios.get(`${proxy}/v1/cities?type=hot`)
export const allCity = () => axios.get(`${proxy}/v1/cities?type=group`)
export const guessCity = () =>
    axios.get('https://elm.cangdu.org/v1/cities?type=guess')
export const searchPlace = (cityid, value) =>
    axios.get(`${proxy}/v1/pois?type=search&city_id=${cityid}&keyword=${value}`)
export const shopAddress = (geohash) => axios.get(`${proxy}/v2/pois/${geohash}`) //获取页shop面地址信息
export const shopFoodTypes = (geohash) =>
    axios.get(
        `${proxy}/v2/index_entry?geohash=${geohash}&group_type=1&flags[]=F`
    )

export const shopList = (
    latitude,
    longitude,
    offset,
    restaurant_category_id = '',
    restaurant_category_ids = '',
    order_by = '',
    delivery_mode = '',
    support_ids = []
) => {
    let supportStr = ''
    support_ids.forEach((item) => {
        if (item.status) {
            supportStr += '&support_ids[]=' + item.id
        }
    })
    let data = {
        latitude,
        longitude,
        offset,
        limit: '20',
        'extras[]': 'activities',
        keyword: '',
        restaurant_category_id,
        'restaurant_category_ids[]': restaurant_category_ids,
        order_by,
        'delivery_mode[]': delivery_mode + supportStr,
    }
    const Str = dataStr(data)
    return axios.get(`${proxy}/shopping/restaurants?${Str}`)
}

//search页面搜索结果
export const searchRestaurant = (geohash, keyword) => {
    str = dataStr({
        'extras[]': 'restaurant_activity',
        geohash,
        keyword,
        type: 'search',
    })
    return axios.get(`${proxy}/v4/restaurants${str}`)
}

/**
 * 获取seller页面商铺详情
 */

export const sellerDetails = (shopid, latitude, longitude) => {
    str = dataStr({
        latitude,
        longitude:
            longitude +
            '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics',
    })

    return axios.get(`${proxy}/shopping/restaurant/${shopid}?${str}`)
}

/**
 * 获取seller页面菜单列表
 */

export const foodMenu = (restaurant_id) =>
    axios.get(`${proxy}/shopping/v2/menu?restaurant_id=${restaurant_id}`)

/**
 * 获取商铺评价列表
 */

export const getRatingList = (shopid, offset, tag_name = '') => {
    str = dataStr({
        has_content: true,
        offset,
        limit: 10,
        tag_name,
    })
    // console.log('sdffffff', `${proxy}/shopping/restaurant/${str}`)
    return axios.get(`${proxy}/ugc/v2/restaurants/${shopid}/ratings?${str}`)
}

/**
 * 获取商铺评价分数
 */

export const ratingScores = (shopid) =>
    axios.get(`${proxy}/ugc/v2/restaurants/${shopid}/ratings/scores`)

/**
 * 获取商铺评价分类
 */

export const ratingTags = (shopid) =>
    axios.get(`${proxy}/ugc/v2/restaurants/${shopid}/ratings/tags`)

/**
 * 确认订单
 */

export const checkout = (geohash, entities, shopid) => {
    return axios.post(`${proxy}/v1/carts/checkout`, {
        come_from: 'web',
        geohash,
        entities,
        restaurant_id: shopid,
    })
}

/**
 * 获取地址列表
 */

export const getAddress = (id, sig) =>
    axios.get(`${proxy}/v1/carts/${id}/addresses?${sig}`)

/**
 * 获取短信验证码
 */

export const mobileCode = (phone) =>
    axios.post('/v4/mobile/verify_code/send', {
        mobile: phone,
        scene: 'login',
        type: 'sms',
    })

/**
 * 获取图片验证码
 */

export const getcaptchas = () => axios.post('/v1/captchas', {})

/**
 * 检测帐号是否存在
 */

export const checkExsis = (checkNumber, type) => {
    str = dataStr({
        [type]: checkNumber,
        type,
    })
    return axios.get('/v1/users/exists?' + str)
}

/**
 * 账号密码登录
 */
export const accountLogin = (username, password, captcha_code) =>
    axios.post(`${proxy}/v2/login`, { username, password, captcha_code })

/**
 * 获取用户信息
 */

export const getUser = () => {
    str = dataStr({ user_id: getStorage('user_id') })
    return axios.get('/v1/user?' + str)
}

/**
 * 手机号登录
 */

export const sendLogin = (code, mobile, validate_token) =>
    axios.post('/v1/login/app_mobile', {
        code,
        mobile,
        validate_token,
    })

/**
 *个人中心里编辑地址
 */

export const getAddressList = (user_id) =>
    axios.get('/v1/users/' + user_id + '/addresses')

/**
 * 退出登录
 */
export const signOut = () => axios.get('/v2/signout')
