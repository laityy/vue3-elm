<template>
  <div class="home">
    <head-top class="head-top" signinUp="home">
      <template #logo>
        <router-link :to="{ path: '/home' }" class="head-logo">
          <span id="elm">ele.me</span>
        </router-link>
      </template>
    </head-top>
    <nav class="now_position">
      <div class="top">
        <span class="left">当前定位城市</span>
        <span class="right">定位不准时，请在城市列表中选择</span>
      </div>
      <div class="middle">
        <span class="left">{{ data.nowCity }}</span>
        <span class="right ">
          <router-link :to="'/city/' + data.nowCity">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="arrow">
              <path d="M0 0 L8 7 L0 14" stroke="#666" stroke-width="1" fill="none"></path>
            </svg>
          </router-link>
        </span>
      </div>
      <div class="bottom"></div>
    </nav>
    <section class="hot">
      <div class="text">
        <span>热门城市</span>
      </div>
      <div class="hot_city">
        <div v-for="(item) in data.hotCityGroup" :key="item.id" class="city">
          <router-link :to="'/city/' + item.name" @click="SAVE_CITY({ name: item.name, id: item.id })">{{
            item.name }}</router-link>
        </div>
      </div>
      <div class="bottom"></div>
    </section>
    <section class="cityGroup">
      <div class="oneCity" v-for="(list, name, index) in  data.cityGroup" :key="index">
        <div class="title">
          <span class="left">{{ name }}</span>
          <span>(按字母排序)</span>
        </div>
        <div class="list">
          <span v-for="(item, index) in list" :key="index" class="cityname">
            <router-link :to="'/city/' + item.name" @click="SAVE_CITY({ name: item.name, id: item.id })">{{
              item.name }}</router-link>
          </span>
        </div>
        <div class="bottom"></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import HeadTop from 'components/common/HeadTop'
import { hotCity, allCity, guessCity } from 'network/getData'
import { reactive } from '@vue/reactivity'
// import { useStore } from 'vuex';
import { useMutations } from 'hooks/useMappers'
import { onMounted, onBeforeMount, nextTick } from 'vue';
const data = reactive({
  hotCityGroup: [],
  cityGroup: {},
  nowCity: '武汉',
  nowCityId: '7'
})
const { SAVE_CITY } = useMutations(['SAVE_CITY'])
// const changeCityName = (item) => store.commit('SAVE_CITY', { name: item.name, id: item.id })



const initData = async () => {
  // await hotCity().then((res) => {
  //   data.hotCityGroup = res.data
  // })
  data.hotCityGroup = (await hotCity()).data
  // console.log('datahot', data.hotCityGroup)
  await allCity().then((res) => {
    for (let i = 10; i < 36; i++) {
      let letter = (i).toString(36).toUpperCase()
      if (res.data[letter]) {
        data.cityGroup[letter] = res.data[letter]
      }
    }
    // console.log('@then里面直接调用@', document.querySelector('.cityGroup').scrollHeight) //@ssss@ 19109
    nextTick(() => {
      // console.log('@nextTick@', document.querySelector('.cityGroup').scrollHeight) //@ssss@ 19109
    })

  })
  // console.log(12222)
  // console.log('@使用await@', document.querySelector('.cityGroup').scrollHeight) //@使用await@ 19109
  // console.log('@不使用await@', document.querySelector('.cityGroup').scrollHeight) //@不使用await@ 0
  guessCity().then((res) => {
    data.nowCity = res.data.name
    data.nowCityId = res.data.id
    // console.log(res);
    SAVE_CITY(res.data)
  })
}
onBeforeMount(async () => {
  await initData()
  // console.log('sdfsdf', document.querySelector('.cityGroup').clientHeight)
})
onMounted(() => {
  // console.log('@@', document.querySelector('.cityGroup').scrollHeight)  //0
  // setTimeout(() => { console.log('@@', document.querySelector('.cityGroup').scrollHeight) }, 2000)
})



</script>

<style lang="less" scoped>
.head-top {
  position: relative;

  #tubiao {
    fill: #fff;
    width: 5vw;
    height: 5vh;
  }

  #elm {
    color: #fff;
  }

  .head-login {
    position: absolute;
    top: 19%;
  }
}

.now_position {
  margin-top: 7vh;

  .top {
    overflow: hidden;
    border: 1px solid #ccc;
    font-size: 1.5vh;
    padding: 2vh 1vh 1vh 1vh;

    .left {
      float: left;
      font-size: 1vh;
      color: #666;
    }

    .right {
      float: right;
      font-weight: 900;
      font-size: 1vh;
      color: #9f9f9f;
    }
  }

  .middle {
    overflow: hidden;
    padding: 2vh 2vh 2vh 1vh;
    margin-bottom: 2px solid #ccc;

    .left {
      float: left;
      font-size: 3vh;
      color: #3190e8;
    }

    .right {
      float: right;

      .arrow {

        width: 5vw;
        height: 2vh;

      }
    }
  }

  .bottom {
    width: 100%;
    height: 1.5vh;
    border-top: 2px solid #e4e4e4;
    border-bottom: 2px solid #e4e4e4;
    background-color: #f2f2f2;
  }
}

.hot {
  .text {
    color: #666;
    font-size: 2vh;
    text-indent: 1vh;
    padding: 1.5vh 1vh;
    border-bottom: 1px solid #ccc;
  }

  .hot_city {
    width: 100%;
    overflow: hidden;

    .city {
      height: 6vh;
      line-height: 6vh;
      width: 25vw;
      float: left;
      font-size: 2vh;
      background-color: #fff;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      text-align: center;

      a {
        color: #3190e8;
      }
    }

    .city:nth-of-type(4n) {
      border-right: 0;
    }

  }

  .bottom {
    width: 100%;
    height: 1.5vh;
    border-top: 2px solid #e4e4e4;
    border-bottom: 2px solid #e4e4e4;
    background-color: #f2f2f2;
  }
}

.cityGroup {
  .oneCity {
    .title {
      width: 100%;
      height: 5vh;
      background-color: #fff;
      line-height: 5vh;
      color: #999;
      font-size: 1.5vh;
      border-bottom: 1px solid #bdbdbd;

      .left {
        color: #666;
        font-size: 2.5vh;
        margin: 0 2vw;
      }

      .right {}
    }

    .list {
      overflow: hidden;

      .cityname {
        height: 6vh;
        line-height: 6vh;
        width: 25vw;
        float: left;
        font-size: 2vh;
        background-color: #fff;
        color: #666;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        text-align: center;
      }

      .cityname:nth-of-type(4n) {
        border-right: 0;
      }
    }

    .bottom {
      width: 100%;
      height: 1.5vh;
      border-top: 2px solid #e4e4e4;
      border-bottom: 2px solid #e4e4e4;
      background-color: #f2f2f2;
    }
  }

}
</style>