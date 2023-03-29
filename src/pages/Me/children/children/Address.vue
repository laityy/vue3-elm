<template>
  <div class="set_address">
    <head-top head-title="编辑地址" go-back='true'>
      <span slot="edit" class="edit" @click="editThing">{{ editText }}</span>
    </head-top>
    <section class="address">
      <ul class="addresslist">
        <li v-for="(item, index) in removeAddress">
          <div>
            <p>{{ item.address }}</p>
            <p><span>{{ item.phone }}</span><span v-if="item.phonepk">、{{ item.phonepk }}</span></p>
          </div>
          <div class="deletesite" v-if="deletesite">
            <span @click="deleteSite(index, item)">x</span>
          </div>
        </li>
      </ul>
      <router-link to='/me/info/address/add'>
        <div class="addsite">
          <span>新增地址</span>
          <span class="addsvg">
            <svg fill="#d8d8d8">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </div>
      </router-link>
    </section>
    <router-view v-slot="{ Component }">
      <transition name="router-slid" mode="out-in">
        <component :is="{ Component }" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import HeadTop from 'components/common/HeadTop'
import { useState, } from 'hooks/useMappers'
// import { getAddressList } from 'network/getData'
import { reactive, watchEffect } from 'vue'

const data = reactive({
  deletesite: false, //是否编辑状态
  editText: '编辑',
  adressList: [], //地址列表
})
const { userInfo } = useState(['userInfo'])
watchEffect(userInfo, () => {
  initData()
}, { immediate: true })
function initData () {
  if (userInfo && userInfo.user_id) {
    saveAddress();
  }
}
function editThing () {
  if (data.editText == '编辑') {
    data.editText = '完成';
    data.deletesite = true;
  } else {
    data.editText = '编辑';
    data.deletesite = false;
  }
}
//删除地址
async function deleteSite (index, item) {
  if (userInfo && userInfo.user_id) {
    await deleteAddress(userInfo.user_id, item.id);
    // removeAddress.splice(index, 1);
  }
}
</script>
  
<style lang="scss" scoped>
@import 'src/style/mixin';

.set_address {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f2f2;
  z-index: 202;
  padding-top: 1.95*6vw;

  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.edit {
  right: 0.4*6vw;
  @include fontsc(0.7*6vw, #fff);
  @include ct;
}

.address {
  width: 100%;
  margin-top: .4*6vw;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;

  .addresslist {
    background: #fff;

    li {
      border-bottom: 1px solid #d9d9d9;
      padding: .4*6vw;
      @include fj(space-between);

      p {
        line-height: .9*6vw;
        @include fontsc(.6*6vw, #333);

        span {
          display: inline-block;
          @include fontsc(.6*6vw, #333);
        }
      }

      .deletesite {
        display: flex;
        align-items: center;

        span {
          display: block;
          @include fontsc(.8*6vw, #999)
        }
      }
    }

    li:nth-of-type(1) {
      background: #FFF8C3;
    }
  }

  .addsite {
    margin-top: .4*6vw;
    background: #fff;
    padding: .2*6vw .4*6vw;
    border-top: 1px solid #d9d9d9;
    @include fj(space-between);

    span {
      display: block;
      @include fontsc(.7*6vw, #333);
      line-height: 1.4*6vw;
    }

    .addsvg {
      @include wh(.66667*6vw, 1.4*6vw);

      svg {
        @include wh(100%, 100%);
      }
    }
  }
}

.router-slid-enter-active,
.router-slid-leave-active {
  transition: all .4s;
}

.router-slid-enter-from,
.router-slid-leave-to {
  transform: translateX(12vw);
  opacity: 0;
}
</style>

