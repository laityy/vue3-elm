<template>
  <div class="me">
    <head-top :go-back="true" title="我的">
    </head-top>
    <section>
      <section class="profile-number">
        <router-link :to="userInfo && userInfo.user_id ? '/me/info' : '/login'" class="profile-link">
          <img :src="imgBaseUrl + userInfo.avatar" class="privateImage" v-if="userInfo && userInfo.user_id">
          <span class="privateImage" v-else>
            <svg class="privateImage-svg">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
            </svg>
          </span>
          <div class="user-info">
            <p>{{ username }}</p>
            <p>
              <span class="user-icon">
                <svg class="icon-mobile" fill="#fff">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mobile"></use>
                </svg>
              </span>
              <span class="icon-mobile-number">{{ mobile }}</span>
            </p>
          </div>
          <span class="arrow">
            <svg class="arrow-svg" fill="#fff">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </router-link>
      </section>
      <section class="info-data">
        <ul class="clear">
          <router-link to="/balance" tag="li" class="info-data-link">
            <span class="info-data-top"><b>{{ parseInt(balance).toFixed(2) }}</b>元</span>
            <span class="info-data-bottom">我的余额</span>
          </router-link>
          <router-link to="/benefit" tag="li" class="info-data-link">
            <span class="info-data-top"><b>{{ count }}</b>个</span>
            <span class="info-data-bottom">我的优惠</span>
          </router-link>
          <router-link to="/points" tag="li" class="info-data-link">
            <span class="info-data-top"><b>{{ pointNumber }}</b>分</span>
            <span class="info-data-bottom">我的积分</span>
          </router-link>
        </ul>
      </section>
      <section class="profile-1reTe">
        <!-- 我的订单 -->
        <router-link to='/order' class="myorder">
          <aside>
            <svg fill="#4aa5f0">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
            </svg>
          </aside>
          <div class="myorder-div">
            <span>我的订单</span>
            <span class="myorder-divsvg">
              <svg fill="#bbb">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </router-link>
        <!-- 积分商城 -->
        <a href='https://home.m.duiba.com.cn/#/chome/index' class="myorder">
          <aside>
            <svg fill="#fc7b53">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#point"></use>
            </svg>
          </aside>
          <div class="myorder-div">
            <span>积分商城</span>
            <span class="myorder-divsvg">
              <svg fill="#bbb">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </a>
        <!-- 饿了么会员卡 -->
        <router-link to='/vipcard' class="myorder">
          <aside>
            <svg fill="#ffc636">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#vip"></use>
            </svg>
          </aside>
          <div class="myorder-div">
            <span>饿了么会员卡</span>
            <span class="myorder-divsvg">
              <svg fill="#bbb">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </router-link>
      </section>
      <section class="profile-1reTe">
        <!-- 服务中心 -->
        <router-link to='/service' class="myorder">
          <aside>
            <svg fill="#4aa5f0">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#service"></use>
            </svg>
          </aside>
          <div class="myorder-div">
            <span>服务中心</span>
            <span class="myorder-divsvg">
              <svg fill="#bbb">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </router-link>
        <!-- 下载饿了么APP -->
        <router-link to='/download' class="myorder">
          <aside>
            <svg fill="#3cabff">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#download"></use>
            </svg>
          </aside>
          <div class="myorder-div" style="border-bottom:0;">
            <span>下载饿了么APP</span>
            <span class="myorder-divsvg">
              <svg fill="#bbb">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </router-link>
      </section>
    </section>
    <footer-tab></footer-tab>
    <router-view v-slot="{ Component }">
      <transition name="router-slid" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import HeadTop from 'components/common/HeadTop'
import FooterTab from 'components/TabBar/FooterTab'
import { useState, useMutations } from 'hooks/useMappers'
import { useImgPath } from 'hooks/useImg'
import { imgBaseUrl } from 'config/env'
import { reactive, toRefs, watch } from 'vue'
import { computed } from '@vue/reactivity'

const { userInfo } = useState(['userInfo'])
const imgpath = computed(() => {
  let path;
  if (data.avatar.indexOf('/') !== -1) {
    path = imgBaseUrl + data.avatar;
  } else {
    path = data.getImgPath(data.avatar)
  }
  // data.SAVE_AVANDER(path);
  return path;
})
const data = reactive({
  username: '登录/注册',           //用户名
  resetname: '',
  mobile: '暂无绑定手机号',             //电话号码
  balance: 0,            //我的余额
  count: 0,             //优惠券个数
  pointNumber: 0,       //积分数
  avatar: '',             //头像地址
  imgBaseUrl,
})
const { username, mobile, balance, count, pointNumber } = toRefs(data)
function initData () {
  if (data.userInfo && data.userInfo.user_id) {
    data.avatar = data.userInfo.avatar;
    data.username = data.userInfo.username;
    data.mobile = data.userInfo.mobile || '暂无绑定手机号';
    data.balance = data.userInfo.balance;
    data.count = data.userInfo.gift_amount;
    data.pointNumber = data.userInfo.point;
  } else {
    data.username = '登录/注册';
    data.mobile = '暂无绑定手机号';
  }
}
watch(userInfo, () => {
  initData()
}, { immediate: true })
</script>

<style lang="scss" scoped>
@import '../../style/mixin';

.profile_page {

  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.profile-number {
  padding-top: 1.95*6vw;

  .profile-link {
    display: block;
    display: flex;
    box-align: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: $blue;
    padding: .666667*6vw .6*6vw;

    .privateImage {
      display: inline-block;
      @include wh(2.5*6vw, 2.5*6vw);
      border-radius: 50%;
      vertical-align: middle;

      .privateImage-svg {
        background: $fc;
        border-radius: 50%;
        @include wh(2.5*6vw, 2.5*6vw);
      }
    }

    .user-info {
      margin-left: .48*6vw;
      -webkit-box-flex: 1;
      -ms-flex-positive: 1;
      flex-grow: 1;

      p {
        font-weight: 700;
        @include fontsc(.8*6vw, $fc);

        .user-icon {
          @include wh(0.5*6vw, 0.75*6vw);
          display: inline-block;
          vertical-align: middle;
          line-height: 0.75*6vw;

          .icon-mobile {
            @include wh(100%, 100%);
          }
        }

        .icon-mobile-number {
          display: inline-block;
          @include fontsc(.57333*6vw, $fc);

        }
      }

    }

    .arrow {
      @include wh(.46667*6vw, .98*6vw);
      display: inline-block;

      svg {
        @include wh(100%, 100%);
      }
    }
  }
}

.info-data {
  width: 100%;
  background: $fc;
  box-sizing: border-box;

  ul {
    .info-data-link {
      float: left;
      width: 33.33%;
      display: inline-block;
      border-right: 1px solid #f1f1f1;

      span {
        display: block;
        width: 100%;
        text-align: center;
      }

      .info-data-top {
        @include fontsc(.55*6vw, #333);
        padding: .853333*6vw 0 .453333*6vw;

        b {
          display: inline-block;
          @include fontsc(1.2*6vw, #f90);
          font-weight: 700;
          line-height: 1*6vw;
          font-family: Helvetica Neue, Tahoma;
        }
      }

      .info-data-bottom {
        @include fontsc(.57333*6vw, #666);
        font-weight: 400;
        padding-bottom: .453333*6vw;

      }
    }

    .info-data-link:nth-of-type(2) {
      .info-data-top {
        b {
          color: #ff5f3e;
        }
      }

    }

    .info-data-link:nth-of-type(3) {
      border: 0;

      .info-data-top {
        b {
          color: #6ac20b;
        }
      }
    }
  }
}

.profile-1reTe {
  margin-top: .4*6vw;
  background: $fc;

  .myorder {
    padding-left: 1.6*6vw;
    display: flex;
    align-items: center;

    aside {
      @include wh(.7*6vw, .7*6vw);
      margin-left: -.866667*6vw;
      margin-right: .266667*6vw;
      display: flex;
      align-items: center;

      svg {
        @include wh(100%, 100%);
      }
    }

    .myorder-div {
      width: 100%;
      border-bottom: 1px solid #f1f1f1;
      padding: .433333*6vw .266667*6vw .433333*6vw 0;
      @include fontsc(.7*6vw, #333);
      display: flex;
      justify-content: space-between;

      span {
        display: block;
      }

      .myorder-divsvg {
        @include wh(.46667*6vw, .466667*6vw);

        svg {
          @include wh(100%, 100%);
        }
      }
    }
  }

  .myorder:nth-of-type(3) .myorder-div {
    border: 0;
  }
}

// .router-slid-enter-active,
// .router-slid-leave-active {
//   transition: all 0.4s;
// }

// .router-slid-enter-from,
// .router-slid-leave-to {
//   transform: translateX(10vw);
//   opacity: 0;
// }
</style>
