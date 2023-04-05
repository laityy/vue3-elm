import { getUser, getAddressList } from 'network/getData'
export default {
    async getUserInfo({ commit }) {
        let res = await getUser()
        commit('RECORD_USERINFO', res.data)
    },
    async saveAddress({ commit, state }) {
        if (state.removeAddress.length > 0) return

        let addres = await getAddressList(state.userInfo.user_id)
        commit('SAVE_ADDRESS', addres)
    },
}
