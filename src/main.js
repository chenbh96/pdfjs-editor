import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import api from '@/utils/api' // 导入api接口

Vue.config.productionTip = false;
Vue.prototype.$api = api; // 将api挂载到vue的原型上
Vue.use(VueRouter);

var router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        { path: '/', redirect: '/index' }
    ]
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
