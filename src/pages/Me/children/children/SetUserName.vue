<template>
  <div class="set_username">
    <head-top head-title="修改用户名" go-back='true'></head-top>
    <section class="setname">
      <section class="setname-top">
        <input type="text" placeholder="输入用户名" :class="{ 'setname-input': bordercolor }" @input="inputThing"
          v-model="inputValue">
        <div>
          <p v-if="earn">用户名只能修改一次（5-24字符之间）</p>
          <p class="unlikep" v-else>用户名长度在5到24位之间</p>
        </div>
      </section>
      <section class="reset">
        <button :class="{ fontopacity: opacityall }" @click="resetName">确认修改</button>
      </section>
    </section>
  </div>
</template>

<script setup>
import HeadTop from 'components/common/HeadTop'
import { useImgPath } from 'hooks/useImg'
import { useState, useMutations } from 'hooks/useMappers'
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const data = reactive({
  earn: true,     //输入框提醒
  bordercolor: false,  //输入框边框颜色
  opacityall: false,   //字体透明度
  inputValue: '',       //输入框的内容
  newusername: ''         //新用户名
})
const { userInfo } = useState(['userInfo'])
const { RETSET_NAME } = useMutations(['RETSET_NAME'])
const router = useRouter()

function inputThing () {
  if (data.inputValue.length < 5 || data.inputValue.length > 24) {
    data.earn = false;
    data.bordercolor = true;
    data.opacityall = false;
    return false;
  } else {
    data.earn = true;
    data.bordercolor = false;
    data.opacityall = true;
    return true;
  }
}
function resetName () {
  let checkResult = data.inputThing();
  if (!checkResult) {
    return;
  }
  data.RETSET_NAME(data.inputValue);
  router.go(-1);
}

</script>

<style lang="scss" scoped>
@import 'src/style/mixin';

.set_username {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 202;
  background: #f2f2f2;
  padding-top: 1.95*6vw;

  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.setname {
  width: 15.2*6vw;
  margin: 0 auto;

  .setname-top {
    padding-top: .4*6vw;

    input {
      background: none;
      width: 15.2*6vw;
      border: 1px solid #ddd;
      @include borderRadius(2px);
      padding: .2*6vw .1*6vw;
      line-height: 1.2*6vw;
      font-size: .7*6vw;
      display: block;
    }

    .setname-input {
      border-color: #ea3106;
    }

    p {
      width: 100%;
      @include fontsc(.4*6vw, #666);
      padding: .4*6vw 0 1*6vw;
    }

    .unlikep {
      @include fontsc(.58*6vw, #ea3106);
      padding-top: .1*6vw;
    }
  }

  .reset {
    width: 100%;
    background: #3199e8;

    button {
      display: block;
      width: 100%;
      background: none;
      line-height: 2*6vw;
      @include fontsc(.7*6vw, #fff);
      opacity: .6;
      transition: all 1s;
    }

    .fontopacity {
      transition: all 1s;
      opacity: 1;
    }
  }
}
</style>
