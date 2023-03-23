<template>
  <div class="order">
    <head-top :goBack="true">
      <template #title>
        <span>订单列表</span>
      </template>
    </head-top>
    <footer-tab></footer-tab>
  </div>
</template>

<script setup>
import HeadTop from 'components/common/HeadTop'
import FooterTab from 'components/TabBar/FooterTab'

</script>

<style lang="scss" scoped>
.order {
  height: 100vh;
  background-color: #f5f5f5;
}
</style>

