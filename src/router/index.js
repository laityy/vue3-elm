import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('pages/Home/Home')
const City = () => import('pages/City/City')
const Shop = () => import('pages/Shop/Shop')
const Search = () => import('pages/Search/Search')
const Order = () => import('pages/Order/Order')
const Me = () => import('pages/Me/Me')
const Info = () => import('pages/Me/children/Info')
const SetUserName = () => import('pages/Me/children/children/SetUserName')
const Address = () => import('pages/Me/children/children/Address')
const Login = () => import('pages/Login/Login')

const Food = () => import('pages/Food/Food')
const Seller = () => import('pages/Seller/Seller')
const SellerDetail = () => import('pages/Seller/SellerDetail')
const SellerSafe = () => import('pages/Seller/children/SellerSafe')
const FoodDetail = () => import('pages/Seller/FoodDetail')
const ConfirmOrder = () => import('pages/ConfirmOrder/ConfirmOrder')
const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    // 首页
    {
        path: '/home',
        component: Home,
    },
    // 地名选择
    {
        path: '/city/:cityname',
        component: City,
        props: true,
    },
    // 店铺一览页
    {
        path: '/shop',
        component: Shop,
    },
    //搜索
    {
        path: '/search',
        component: Search,
    },
    //订单列表
    {
        path: '/order',
        component: Order,
    },
    //我的
    {
        path: '/me',
        component: Me,
        children: [
            {
                path: 'info',
                component: Info,
                children: [
                    {
                        path: 'setusername',
                        component: SetUserName,
                    },
                    {
                        path: 'address',
                        component: Address,
                    },
                ],
            },
        ],
    },
    {
        path: '/login',
        component: Login,
    },
    //
    {
        path: '/food',
        component: Food,
    },
    //卖家详情页
    {
        path: '/seller',
        component: Seller,
        children: [
            {
                path: 'foodDetail', //食品详情页
                component: FoodDetail,
            },
            {
                path: 'sellerDetail', //卖家详情页
                component: SellerDetail,
                children: [
                    {
                        path: 'sellerSafe', //卖家安全认证页
                        component: SellerSafe,
                    },
                ],
            },
        ],
    },
    //确认订单页面
    {
        path: '/confirmOrder',
        component: ConfirmOrder,
    },
]

const router = createRouter({
    routes,
    history: createWebHistory(),
})

export default router
