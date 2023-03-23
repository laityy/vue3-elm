<!--  -->
<template>
    <div class="tab-item" :class="{ 'active': isActive }" @click="changeUrl(path)">
        <slot name="img"></slot>
        <slot name="text"></slot>
    </div>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router'
import { defineProps, computed } from 'vue';


let props = defineProps(['path'])
const route = useRoute()
const router = useRouter()
let isActive = computed(() => route.path == props.path)
function changeUrl (link) {
    if (link == '/search' || link == '/shop') {
        router.push({ path: link, query: { geohash: 12 } })
    } else {
        router.push(link)
    }

}

</script>
<style lang="scss">
.tab-item {
    float: left;
    height: 7vh;
    text-align: center;
    width: 25vw;
    font-size: 3.5vw;
    padding-top: 1vh;
    background-color: #fff;
    border-right: 1px solid #ccc;
}

.tab-item:nth-of-type(4) {
    border: 0;
}

.active p {
    color: #3190e8;
}
</style>



