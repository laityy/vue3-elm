<template>
  <div class="rating_page">
    <head-top title="账户信息" :go-back='true'></head-top>
    <section class="profile-info">
      <section class="headportrait">
        <input type="file" class="profileinfopanel-upload" @change="uploadAvatar">
        <h2>头像</h2>
        <div class="headportrait-div">
          <img v-if="userInfo" :src="imgBaseUrl + userInfo.avatar" class="headportrait-div-top">
          <span class="headportrait-div-top" v-else>
            <svg>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
            </svg>
          </span>
          <span class="headportrait-div-bottom">
            <svg fill="#d8d8d8">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </div>
      </section>
      <router-link to="/me/info/setusername" class="info-router">
        <section class="headportrait headportraitwo">
          <h2>用户名</h2>
          <div class="headportrait-div">
            <p>{{ username }}</p>
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </router-link>
      <router-link to="/me/info/address" class="info-router">
        <section class="headportrait headportraitwo headportraithree">
          <h2>收货地址</h2>
          <div class="headportrait-div">
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </router-link>
      <section class="bind-phone">
        账号绑定
      </section>
      <section class="info-router" @click="changePhone">
        <section class="headportrait headportraitwo headportraithree">
          <h2><img src="" style="display:inline-block;margin-right:.4*6vw;" alt="">手机</h2>
          <div class="headportrait-div">
            <p>{{ infotel }}</p>
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </section>
      <section class="bind-phone">
        安全设置
      </section>
      <router-link to="/forget" class="info-router">
        <section class="headportrait headportraitwo headportraithree">
          <h2>登录密码</h2>
          <div class="headportrait-div">
            <p>修改</p>
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </router-link>
      <section class="exitlogin" @click="exitlogin">退出登录</section>
    </section>
    <section class="coverpart" v-if="show">
      <section class="cover-background"></section>
      <section class="cover-content " :class="{ 'cover-animate': isEnter, 'cover-animate-leave': isLeave }">
        <div class="sa-icon">
          <span class="sa-body"></span>
          <span class="sa-dot"></span>
        </div>
        <h2>是否退出登录</h2>
        <div class="sa-botton">
          <button class="waiting" @click="waitingThing">再等等</button>
          <div style="display:inline-block;">
            <button class="quitlogin" @click="outLogin">退出登录</button>
          </div>
        </div>
      </section>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
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
import { signOut } from 'network/getData'
import AlertTip from 'components/common/AlertTip'
import { useImgPath } from 'hooks/useImg'
import { imgBaseUrl } from 'config/env'
import { onUnmounted, reactive, toRefs, watch } from 'vue'
import { removeStorage } from 'utils'
import { useRouter } from 'vue-router'
const data = reactive({
  username: '',    //用户名
  resetname: '', //重置用户名
  infotel: '',     //用户手机
  avatar: '',      //用户头像
  show: false,     //显示提示框
  isEnter: true,  //是否登录
  isLeave: false, //是否退出
  showAlert: false,
  alertText: null,
  imgBaseUrl,
})
const { username, show, isEnter, isLeave, showAlert, alertText, infotel } = toRefs(data)
const { userInfo, imgPath } = useState(['userInfo', 'imgPath'])
const { OUT_LOGIN, SAVE_AVANDER } = useMutations(['OUT_LOGIN', 'SAVE_AVANDER'])
const router = useRouter()

function exitlogin () {
  data.show = true;
  data.isEnter = true;
  data.isLeave = false;
}


function waitingThing () {
  //取消退出
  data.isEnter = false
  data.isLeave = true

  data.timer = setTimeout(() => {
    data.show = false
    clearTimeout(data.timer)
  }, 200)
}
//退出登录
async function outLogin () {
  OUT_LOGIN() //删除vuex数据
  waitingThing() //提示框消失
  removeStorage('user_id') //删除localStorage数据
  await signOut()
  router.go(-1)  //路由返回
}
function changePhone () {
  data.showAlert = true;
  data.alertText = '请在手机APP中设置';
}
async function uploadAvatar () {
  //上传头像
  if (userInfo.value) {
    let input = document.querySelector('.profileinfopanel-upload')
    let data = new FormData();
    data.append('file', input.files[0]);
    try {
      let response = await fetch('/eus/v1/users/' + userInfo.value.user_id + '/avatar', {
        method: 'POST',
        credentials: 'include',
        body: data
      })
      let res = await response.json();
      if (res.status == 1) {
        userInfo.value.avatar = res.image_path;
      }
    } catch (error) {
      data.showAlert = true;
      data.alertText = '上传失败';
      throw new Error(error);
    }
  }
}

watch(userInfo, (value) => {
  if (value && value.user_id) {
    data.username = value.username;
    data.infotel = value.mobile;
    data.avatar = value.avatar;
  }
})
</script>

<style lang="scss" scoped>
@import '../../../style/mixin.scss';

.rating_page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f2f2;
  z-index: 202;
  padding-top: 7vh;

  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.profile-info {
  @include wh(100%, 3.1*6vw);

  .profileinfopanel-upload {
    display: block;
    position: absolute;
    opacity: 0;
    top: 2.35*6vw;
    left: 0;
    @include wh(100%, 3.1*6vw);
  }

  .headportrait {
    margin-top: .4*6vw;
    padding: .5*6vw .4*6vw;
    @include fj(space-between);
    align-items: center;
    border-top: 1px solid #ddd;
    background: #fff;

    h2 {
      @include fontsc(.6*6vw, #333);
      font-weight: 500;
      display: flex;
      align-items: center;
    }

    .headportrait-div {
      span {
        display: inline-block;

        svg {
          @include wh(100%, 100%);
        }
      }

      .headportrait-div-top {
        @include wh(2*6vw, 2*6vw);
        @include borderRadius(50%);
        vertical-align: middle;
      }

      .headportrait-div-bottom {
        @include wh(.66667*6vw, 1.4*6vw);
        position: relative;
        top: 0.44*6vw;
      }
    }
  }

  .headportraitwo {
    margin-top: 0;
    padding: .3*6vw .4*6vw;

    .headportrait-div {
      @include fj(left);

      p {
        text-align: left;
        line-height: 1.39*6vw;
        @include fontsc(.7*6vw, #999);
        margin-right: .2*6vw;
        font-weight: 100;
        font-family: Arial;
      }

      .headportrait-div-bottom {
        top: 0;
      }
    }
  }

  .headportraithree {
    border-bottom: 1px solid #ddd;
  }

  .bind-phone {
    padding: .4*6vw .4*6vw;
    @include fontsc(.5*6vw, #666);
  }

  .exitlogin {
    width: 96%;
    margin: 1.3*6vw auto 0;
    line-height: 1.5*6vw;
    @include borderRadius(5px);
    text-align: center;
    background: #d8584a;
    @include fontsc(.6*6vw, #fff);

  }

  .exitlogin:active {
    //:active 伪类匹配被用户激活的元素。当用鼠标交互时，它代表的是用户按下按键和松开按键之间的时间。
    opacity: .8;
    background: $blue;
  }
}

.info-router {
  display: block;
}

.coverpart {
  @include wh(100%, 100%);
  @include allcover;

  .cover-background {
    @include wh(100%, 100%);
    @include allcover;
    background: #000;
    z-index: 100;
    opacity: .2;
  }

  .cover-content {
    width: 94%;
    background: $fc;
    padding: 17px;
    position: absolute;
    top: 20%;
    left: 3%;
    z-index: 1000;
    @include borderRadius(5px);

    .sa-icon {
      @include wh(90px, 90px);
      border: 4px solid #f8bb86;
      @include borderRadius(50%);
      margin: 20px auto;
      position: relative;

      .sa-body {
        @include wh(5px, 47px);
        @include borderRadius(2px);
        background: #f8bb86;
        @include cl;
        top: 10px;
      }

      .sa-dot {
        @include wh(7px, 7px);
        @include borderRadius(50%);
        background: #f8bb86;
        @include cl;
        bottom: 10px;
      }
    }

    h2 {
      width: 100%;
      text-align: center;
      @include fontsc(30px, #575757);
      font-weight: 500;
      margin: 25px 0;
    }

    .sa-botton {
      width: 100%;
      text-align: center;

      button {
        display: inline-block;
        padding: .4*6vw 1*6vw;
        @include borderRadius(5px);
        @include fontsc(.6*6vw, $fc);
        letter-spacing: 1px;
        margin-top: 26px;
      }

      .waiting {
        background: #C1C1C1;
        margin-right: .4*6vw;
      }

      .quitlogin {
        background: rgb(221, 107, 85);
      }
    }

  }
}

@-webkit-keyframes bounceIn {

  from,
  20%,
  40%,
  60%,
  80%,
  100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }

  0% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  20% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    -webkit-transform: scale3d(.9, .9, .9);
    transform: scale3d(.9, .9, .9);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    -webkit-transform: scale3d(.97, .97, .97);
    transform: scale3d(.97, .97, .97);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

@keyframes bounceIn {

  from,
  20%,
  40%,
  60%,
  80%,
  100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }

  0% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  20% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    -webkit-transform: scale3d(.9, .9, .9);
    transform: scale3d(.9, .9, .9);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    -webkit-transform: scale3d(.97, .97, .97);
    transform: scale3d(.97, .97, .97);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

@-webkit-keyframes zoomOut {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  100% {
    opacity: 0;
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  100% {
    opacity: 0;
  }
}

body .coverpart .cover-animate {
  transition: all 1s;
  animation: bounceIn .6s;
}

body .coverpart .cover-animate-leave {
  animation: zoomOut .4s;
}

.router-slid-enter-active,
.router-slid-leave-active {
  transition: all 0.4s;
}

.router-slid-enter-from,
.router-slid-leave-to {
  transform: translateX(12vw);
  opacity: 0;
}
</style>
