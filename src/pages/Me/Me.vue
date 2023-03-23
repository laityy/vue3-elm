<template>
    <div class="me">
        <head-top>
            <template #back>
                <span> &lt; </span>
            </template>
            <template #title>
                <span>我的</span>
            </template>
        </head-top>
        <section class="me-number">
            <router-link to="/me/info" class="me-number-info">
                <img src="../../images/default.jpg" alt="">
                <div class="middle">
                    <p>121111111</p>
                    <p>
                        <span>手机</span>
                        <span>暂时未绑定</span>
                    </p>
                </div>
                <span>></span>
            </router-link>
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

</script>

<style lang="scss" scoped>
@import '../../style/mixin.scss';

.me {
    height: 100vh;
    background-color: #f5f5f5;
    padding-top: 7vh;

    .me-number {
        border-top: 1px solid $fc;
        padding: 3vh 3vw;
        background-color: $blue;

        p,
        span {
            color: #fff
        }

        .me-number-info {
            display: flex;
            align-items: center;

            img {
                display: inline-block;
                @include wh(18vw, 9vh);
                border-radius: 50%;

            }

            .middle {
                margin-left: 3vw;
                flex-grow: 1; //flex-grow 项在 flex 容器中分配剩余空间的相对比例

                @include fontsc(4.5vw, #fff);


            }
        }




    }
}
</style>