import { computed } from '@vue/reactivity'
import { useStore, mapState, mapMutations, mapActions } from 'vuex'
//封装vuex的map函数
export const useState = function (mapper) {
    const store = useStore()
    const storeStateFn = mapState(mapper)
    // mapState返回的是对象，key是对应的state的key，value是mappedState函数，函数返回值是state的值
    // console.log(storeStateFn)
    // console.log(mapActions(['a', 'b', 'c']))
    const storeState = {}
    Object.keys(storeStateFn).forEach((keyFn) => {
        const fn = storeStateFn[keyFn].bind({ $store: store })
        storeState[keyFn] = computed(fn)
    })
    return storeState
}

export const useMutations = function (mapper) {
    const store = useStore()
    const storeMutationsFn = mapMutations(mapper)
    // console.log(storeMutationsFn)

    const storeMutations = {}

    Object.keys(storeMutationsFn).forEach((keyFn) => {
        storeMutations[keyFn] = storeMutationsFn[keyFn].bind({ $store: store })
    })
    // console.log(storeMutations)

    return storeMutations
}
export const useActions = function (mapper) {
    const store = useStore()
    const storeActionsFn = mapActions(mapper)
    // console.log(storeMutationsFn)

    const storeActions = {}

    Object.keys(storeActionsFn).forEach((keyFn) => {
        storeActions[keyFn] = storeActionsFn[keyFn].bind({ $store: store })
    })
    // console.log(storeMutations)

    return storeActions
}
