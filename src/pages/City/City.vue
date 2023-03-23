<template>
  <div class="city">
    <head-top class="home_top" :goBack="true">

      <template #title>
        <span class="title">{{ cityName }}</span>
      </template>
      <template #change>
        <span class="change" @click="router.go(-1)">切换城市</span>
      </template>
    </head-top>
    <div class="city_from">
      <div class="input">
        <input type="search" placeholder="输入学校、商务楼、地址" v-model="data.inputValue" @keyup.enter="submit">
      </div>
      <div class="submit" @click="submit">
        <span>提交</span>
      </div>
    </div>
    <div class="history">
      <div class="title" v-if="data.clearIsShow">
        <span>搜索历史</span>
      </div>
      <ul class="list" v-if="data.placeList.length > 0">
        <div v-for="(item, index) in data.placeList" :key="index" class="item" @click="nextPage(index, item)">
          <span class="top">{{ item.name }}</span>
          <span class="bottom">{{ item.address }}</span>
        </div>
      </ul>
      <div class="clear" @click="clearAll" v-if="data.placeList.length > 0">
        <span>清除全部</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeadTop from 'components/common/HeadTop'
import { reactive } from '@vue/reactivity';
import { searchPlace } from 'network/getData'
import { setStorage, getStorage } from 'utils';
import { useRouter } from 'vue-router';
import { useState, useMutations } from 'hooks/useMappers'

const router = useRouter()
const data = reactive({
  inputValue: '',
  placeList: [],
  placeHistory: [],
  clearIsShow: true
})

const { cityName, cityId } = useState(['cityName', 'cityId'])
const { SAVE_PLACE, SAVE_GEOHASH } = useMutations(['SAVE_PLACE', 'SAVE_GEOHASH'])
// const saveePlaceName = (item) => store.commit('SAVE_PLACE', item.name)  //保存地址到vuex
// const saveGeohash = (geohash) => store.commit('SAVE_GEOHASH', geohash)
function init () {
  if (getStorage('placeHistory')) {
    data.placeList = JSON.parse(getStorage('placeHistory'));
  }
  else {
    data.placeList = [];
  }
}
init()
function nextPage (index, item) {
  let history = getStorage('placeHistory')
  let choosePlace = data.placeList[index];
  let geohash = item.geohash
  if (history) {
    let checkrepeat = false;
    data.placeHistory = JSON.parse(history);
    data.placeHistory.forEach(v => {
      if (v.geohash == geohash) {
        checkrepeat = true;
      }
    })
    if (!checkrepeat) {
      data.placeHistory.push(choosePlace)
    }
  } else {
    data.placeHistory.push(choosePlace)
  }
  setStorage('placeHistory', JSON.stringify(data.placeHistory))
  SAVE_PLACE(item.name)
  SAVE_GEOHASH(geohash)
  router.push({ path: '/shop', query: { geohash } })
}
function clearAll () {
  localStorage.clear()
  data.placeList = []
}

function submit () {
  data.clearIsShow = false
  if (data.inputValue) {
    searchPlace(cityId.value, data.inputValue).then((res) => {
      data.placeList = res.data
    })
  } else {
    alert('请正确输入')
  }
}
</script>

<style lang="less" scoped>
.city {
  background-color: #f5f5f5;

  .home_top {
    position: relative;
    text-align: center;

    .back {
      position: absolute;
      left: 3vh;
      top: -0.2vh;
      color: #fff;
    }

    .title {
      display: inline-block;
      font-size: 2.6vh;
      color: #fff;
      font-weight: 700;
    }

    .change {
      position: absolute;
      right: 3vh;
      color: #fff;
    }
  }

  .city_from {
    width: 100%;
    padding: 2vh 4vh;
    background-color: #fff;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    margin-top: 8.7vh;

    .input {}

    input {
      padding: 0 0.1vh;
      font-size: 2.3vh;
      color: #333;
      width: 100%;
      height: 4.5vh;
      line-height: 4.5vh;
      border: 1px solid #c0c0c0;
      border-radius: 0.5vh;
    }

    .submit {
      width: 100%;
      height: 4.5vh;
      background-color: #3190e8;

      text-align: center;
      line-height: 4.5vh;
      margin-top: 2vh;
      border-radius: 0.5vh;

      span {
        color: #fff;
      }
    }

  }

  .history {
    position: relative;
    overflow: hidden;

    .title {
      width: 100%;
      height: 3.5vh;
      line-height: 3.5vh;
      background-color: transparent;
      color: #333;
      font-size: 1.5vh;
      padding-left: 2vh;
      border-bottom: 1px solid #ccc;
    }

    .list {
      float: left;
      top: 0;
      width: 100%;
      background-color: #fff;

      .item {
        display: block;
        border-bottom: 1px solid #ccc;
        padding: 1vh 2vh;

        .top {
          width: 94vw;
          font-size: 2.5vh;
        }

        .bottom {
          display: block;
          overflow: hidden;
          width: 94vw;
          font-size: 1.8vh;
          color: #979797;
          margin-top: 1vh;
        }
      }
    }

    .clear {
      float: left;
      width: 100%;
      height: 5vh;
      line-height: 5vh;
      background-color: #fff;
      text-align: center;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>