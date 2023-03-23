<template>
  <header>
    <div class="head">
      <div class="content">
        <div class="left">
          <div class="back" @click="router.go(-1)" v-if="goBack">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="left-arrow">
              <path d="M0 0 L8 7 L0 14" stroke="#fff" stroke-width="2" fill="none"></path>
            </svg>
          </div>
          <slot name="logo"></slot>
          <slot name="search"></slot>
        </div>
        <div class="middle">
          <slot name="title"></slot>
        </div>
        <div class="right">
          <slot name="change"></slot>
          <router-link :to="userInfo ? '/me' : '/login'" class="head-login" v-if="signinUp">
            <svg class="login-svg" v-if="userInfo">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
            </svg>
            <span class="login-span" v-else>登录|注册</span>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router'
import { useState } from 'hooks/useMappers'

defineProps(['goBack', 'userInfo', 'signinUp'])
const router = useRouter()
const { userInfo } = useState(['userInfo'])
// console.log('userInfo', userInfo)

</script>

<style lang="scss" >
@import '../../style/mixin.scss';

.head {
  width: 100%;
  background-color: #3190e8;
  height: 7vh;
  line-height: 7vh;
  text-align: center;
  position: fixed;
  top: 0;
  overflow: hidden;
  z-index: 10;

  .content {
    height: 100%;
    padding: 0 4vw;
    @include fj();
    color: #fff;
  }

  span {
    @include fontsc(4vw, #fff);
    font-weight: 600;
  }

  .left {
    width: 10vw;
    color: #fff;

    .back {
      .left-arrow {
        width: 5vw;
        height: 3vh;
        transform: rotate(180deg);
      }
    }
  }

  .middle {
    width: 50vw; //注意和组件的title宽度一致
    margin: 0 auto;
    color: #fff;
  }

  .right {
    width: 10vw;
    color: #fff;

    .head-login {

      .login-svg {
        fill: #fff;
        @include wh(5vw, 5vh);
        transform: translateY(21%);
      }

      .login-span {
        width: 14vw;
        @include fontsc(1vh, #fff);
        font-weight: normal;
        transform: translateX(-22%) scale(1.1);
        /* transform: scale(1.5); */
        display: inline-block;
      }
    }
  }
}
</style>