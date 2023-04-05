# 基于vue3的elm项目

## 目录结构
|-- 
    |-- .gitignore
    |-- babel.config.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- vue.config.js
    |-- problems  
    |   |-- 2023-3-31git推送问题.txt
    |-- public
    |   |-- favicon.ico
    |   |-- index.html
    |-- src
        |-- App.vue
        |-- main.js
        |-- assets
        |-- components
        |   |-- common
        |   |   |-- AlertTip.vue  //提示框
        |   |   |-- buyCart.vue   //购物车
        |   |   |-- HeadTop.vue   //顶部导航
        |   |   |-- Loading.vue   //加载中动画
        |   |   |-- RatingStar.vue  //评分
        |   |   |-- Svg.vue   
        |   |-- ShopList
        |   |   |-- ShopList.vue
        |   |   |-- ShopListItem.vue
        |   |-- TabBar
        |       |-- FooterTab.vue
        |       |-- TabItem.vue
        |-- config
        |   |-- env.js
        |-- hooks       //组合式函数
        |   |-- useImg.js
        |   |-- useMappers.js
        |-- images   
        |   |-- 164ad0b6a3917599.jpg
        |   |-- address_bottom.png
        |   |-- default.jpg
        |   |-- icon_loading.png
        |-- network     //网络请求 
        |   |-- getData.js
        |-- pages       //路由组件
        |   |-- City    //城市
        |   |   |-- City.vue
        |   |-- ConfirmOrder  //确认订单
        |   |   |-- ConfirmOrder.vue
        |   |-- Food     //食物分类(4类)
        |   |   |-- Food.vue
        |   |-- Home     //首页
        |   |   |-- Home.vue
        |   |-- Login    //登录
        |   |   |-- Login.vue
        |   |-- Me       //我的
        |   |   |-- Me.vue
        |   |   |-- children
        |   |       |-- Info.vue
        |   |       |-- children
        |   |           |-- Address.vue
        |   |           |-- SetUserName.vue
        |   |-- Order   //订单
        |   |   |-- Order.vue
        |   |-- Search  //搜索
        |   |   |-- Search.vue
        |   |-- Seller  //卖家主页
        |   |   |-- FoodDetail.vue
        |   |   |-- Seller.vue
        |   |   |-- SellerDetail.vue
        |   |   |-- SellerRate.vue
        |   |   |-- children
        |   |       |-- SellerSafe.vue
        |   |-- Shop  //店铺列表
        |       |-- Shop.vue
        |-- plugins
        |   |-- better-scroll.js
        |-- router    //路由配置
        |   |-- index.js
        |-- store     //状态管理
        |   |-- actions.js
        |   |-- index.js
        |   |-- mutations-type.js
        |   |-- mutations.js
        |   |-- state.js
        |-- style     //全局样式
        |   |-- common.scss  //公共样式
        |   |-- mixin.scss   //混入样式
        |   |-- scroll.scss  //滚动样式
        |-- utils     //工具函数
            |-- index.js
