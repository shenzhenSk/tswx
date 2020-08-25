import Vue from 'vue'
import Vuex from 'vuex'
import {
    getAppid,
    getMobileCode
} from "../api/user"
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: "",
    },
    mutations: {
        SET_TOKEN(state, token) => {
            state.token = token
        },
    },
    actions: {
        
    },
    modules: {}
})
