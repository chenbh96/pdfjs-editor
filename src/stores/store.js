import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userInfo: null,
        code: null,
        dtype: 0,
        title: "",
        fid: 0,
        students: [],
        firstSave: false,
    },
    mutations: {
        setUserInfo(state, payload) {
            state.userInfo = {...payload};
        },
        setCode(state, payload) {
            state.code = payload;
        },
        setTitle(state, payload) {
            state.title = payload;
        },
        setStudents(state, payload) {
            state.students = payload
        },
        updateDtype(state) {
            state.dtype = 1;
        },
        setFid(state, payload) {
            state.fid = payload;
        },
        updateFirstSave(state) {
            state.firstSave = true;
        }
    },
    actions: {
        setUserInfo(context, payload) {
            context.commit('setUserInfo', payload);
        },
        setCode(context, payload) {
            context.commit('setCode', payload);
        },
        setTitle(context, payload) {
            context.commit('setTitle', payload);
        },
        setStudents(context, payload) {
            context.commit('setStudents', payload);
        },
        updateDtype(context) {
            context.commit('updateDtype');
        },
        setFid(context, payload) {
            context.commit('setFid', payload);
        },
        updateFirstSave(context) {
            context.commit('updateFirstSave');
        }
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        }
    }
});

export default store;