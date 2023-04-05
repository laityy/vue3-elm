<template>
  <div class="loginContainer">
    <head-top :title="data.loginWay ? '登录' : '密码登录'" goBack="true">
      <!-- <div slot="changeLogin" class="change_login" @click="changeLoginWay">{{loginWay? "密码登录":"短信登录"}}</div> -->
    </head-top>
    <form class="loginForm" v-if="data.loginWay">
      <section class="input_container phone_number">
        <input type="text" placeholder="账号密码随便输入" name="phone" maxlength="11" v-model="data.phoneNumber">
        <button @click.prevent="getVerifyCode" :class="{ right_phone_number: rightPhoneNumber }"
          v-show="!data.computedTime">获取验证码</button>
        <button @click.prevent v-show="data.computedTime">已发送({{ data.computedTime }}s)</button>
      </section>
      <section class="input_container">
        <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="data.mobileCode">
      </section>
    </form>
    <form class="loginForm" v-else>
      <section class="input_container">
        <input type="text" placeholder="输入账号" v-model.lazy="data.userAccount">
      </section>
      <section class="input_container">
        <input v-if="!data.showPassword" type="password" placeholder="密码" v-model="data.passWord">
        <input v-else type="text" placeholder="输入密码" v-model="data.passWord">
        <div class="button_switch" :class="{ change_to_text: data.showPassword }">
          <div class="circle_button" :class="{ trans_to_right: data.showPassword }" @click="changePassWordType"></div>
          <span>abc</span>
          <span>...</span>
        </div>
      </section>
      <section class="input_container captcha_code_container">
        <input type="text" placeholder="验证码" maxlength="4" v-model="data.codeNumber">
        <div class="img_change_img">
          <img v-show="data.captchaCodeImg" :src="data.captchaCodeImg">
          <div class="change_img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <p class="login_tips">
      温馨提示：未注册过的账号，登录时将自动注册
    </p>
    <p class="login_tips">
      注册过的用户可凭账号密码登录
    </p>
    <div class="login_container" @click="mobileLogin">登录</div>
    <router-link to="/forget" class="to_forget" v-if="!data.loginWay">重置密码？</router-link>
    <alert-tip v-if="data.showAlert" :showHide="data.showAlert" @closeTip="closeTip"
      :alertText="data.alertText"></alert-tip>
  </div>
</template>

<script setup>
import HeadTop from 'components/common/HeadTop'
import AlertTip from 'components/common/AlertTip'
// import { localapi, proapi, imgBaseUrl } from 'src/config/env'
import { mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin } from 'network/getData'
import { computed, onBeforeMount, reactive } from 'vue'
import { useMutations } from 'hooks/useMappers'
import { useRouter } from 'vue-router'
const router = useRouter()
const data = reactive({
  loginWay: false, //登录方式，默认短信登录
  showPassword: false, // 是否显示密码
  phoneNumber: null, //电话号码
  mobileCode: null, //短信验证码
  validate_token: null, //获取短信时返回的验证值，登录时需要
  computedTime: 0, //倒数记时
  userInfo: null, //获取到的用户信息
  userAccount: null, //用户名
  passWord: null, //密码
  captchaCodeImg: null, //验证码地址
  codeNumber: null, //验证码
  showAlert: false, //显示提示组件
  alertText: null, //提示的内容
})
const rightPhoneNumber = computed(() => { return /^1\d{10}$/gi.test(data.phoneNumber) })
const { RECORD_USERINFO } = useMutations(['RECORD_USERINFO'])
//改变登录方式
function changeLoginWay () {
  data.loginWay = !data.loginWay;
}
//是否显示密码
function changePassWordType () {
  data.showPassword = !data.showPassword;
}
//获取验证吗，线上环境使用固定的图片，生产环境使用真实的验证码
async function getCaptchaCode () {
  let res = (await getcaptchas()).data
  data.captchaCodeImg = res.code;
}

onBeforeMount(async () => {
  await getCaptchaCode()
})
//获取短信验证码
let timer
async function getVerifyCode () {
  if (rightPhoneNumber.value) {
    data.computedTime = 30;
    timer = setInterval(() => {
      data.computedTime--;
      if (data.computedTime == 0) {
        clearInterval(timer)
      }
    }, 1000)
    //判读用户是否存在
    let exsis = (await checkExsis(data.phoneNumber, 'mobile')).data
    if (exsis.message) {
      data.showAlert = true;
      data.alertText = exsis.message;
      return
    } else if (!exsis.is_exists) {
      data.showAlert = true;
      data.alertText = '您输入的手机号尚未绑定';
      return
    }
    //发送短信验证码
    let res = (await mobileCode(data.phoneNumber)).data
    if (res.message) {
      data.showAlert = true;
      data.alertText = res.message;
      return
    }
    data.validate_token = res.validate_token;
  }
}
//发送登录信息
async function mobileLogin () {
  if (data.loginWay) {
    if (!rightPhoneNumber) {
      data.showAlert = true;
      data.alertText = '手机号码不正确';
      return
    } else if (!(/^\d{6}$/gi.test(data.mobileCode))) {
      data.showAlert = true;
      data.alertText = '短信验证码不正确';
      return
    }
    //手机号登录
    data.userInfo = (await sendLogin(data.mobileCode, data.phoneNumber, data.validate_token)).data
  } else {
    if (!data.userAccount) {
      data.showAlert = true;
      data.alertText = '请输入手机号/邮箱/用户名';
      return
    } else if (!data.passWord) {
      data.showAlert = true;
      data.alertText = '请输入密码';
      return
    } else if (!data.codeNumber) {
      data.showAlert = true;
      data.alertText = '请输入验证码';
      return
    }
    //用户名登录
    data.userInfo = (await accountLogin(data.userAccount, data.passWord, data.codeNumber)).data
  }
  //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
  if (!data.userInfo.user_id) {
    data.showAlert = true;
    data.alertText = data.userInfo.message;
    if (!data.loginWay) getCaptchaCode();
  } else {
    RECORD_USERINFO(data.userInfo);
    router.go(-1);
  }
}
function closeTip () {
  data.showAlert = false;
}


</script>

<style lang="scss" scoped>
@import '../../style/mixin';

.loginContainer {
  padding-top: 1.95*6vw;

  p,
  span,
  input {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.change_login {
  position: absolute;
  @include ct;
  right: 0.75*6vw;
  @include fontsc(.7*6vw, #fff);
}

.loginForm {
  background-color: #fff;
  margin-top: .6*6vw;

  .input_container {
    display: flex;
    justify-content: space-between;
    padding: .6*6vw .8*6vw;
    border-bottom: 1px solid #f1f1f1;

    input {
      @include fontsc(.7*6vw, #666);
    }

    button {
      @include fontsc(.65*6vw, #fff);
      font-family: Helvetica Neue, Tahoma, Arial;
      padding: .28*6vw .4*6vw;
      border: 1px;
      border-radius: 0.15*6vw;
    }

    .right_phone_number {
      background-color: #4cd964;
    }
  }

  .phone_number {
    padding: .3*6vw .8*6vw;
  }

  .captcha_code_container {
    height: 2.2*6vw;

    .img_change_img {
      display: flex;
      align-items: center;

      img {
        @include wh(3.5*6vw, 1.5*6vw);
        margin-right: .2*6vw;
      }

      .change_img {
        display: flex;
        flex-direction: 'column';
        flex-wrap: wrap;
        width: 2*6vw;
        justify-content: center;

        p {
          @include fontsc(.55*6vw, #666);
        }

        p:nth-of-type(2) {
          color: #3b95e9;
          margin-top: .2*6vw;
        }
      }
    }
  }
}

.login_tips {
  @include fontsc(.5*6vw, red);
  padding: .4*6vw .6*6vw;
  line-height: .5*6vw;

  a {
    color: #3b95e9;
  }
}

.login_container {
  margin: 0 .5*6vw 1*6vw;
  @include fontsc(.7*6vw, #fff);
  background-color: #4cd964;
  padding: .5*6vw 0;
  border: 1px;
  border-radius: 0.15*6vw;
  text-align: center;
}

.button_switch {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  @include wh(2*6vw, .7*6vw);
  padding: 0 .2*6vw;
  border: 1px;
  border-radius: 0.5*6vw;
  position: relative;

  .circle_button {
    transition: all .3s;
    position: absolute;
    top: -1.5vw;
    z-index: 1;
    left: -0.3*6vw;
    @include wh(1.2*6vw, 1.2*6vw);
    box-shadow: 0 0.026667*6vw 0.053333*6vw 0 rgba(0, 0, 0, .1);
    background-color: #f1f1f1;
    border-radius: 50%;
  }

  .trans_to_right {
    transform: translateX(1.3*6vw);
  }

  span {
    @include fontsc(.45*6vw, #fff);
    transform: translateY(.05*6vw);
    line-height: .6*6vw;
  }

  span:nth-of-type(2) {
    transform: translateY(-.08*6vw);
  }
}

.change_to_text {
  background-color: #4cd964;
}

.to_forget {
  float: right;
  @include fontsc(.6*6vw, #3b95e9);
  margin-right: .3*6vw;
}
</style>