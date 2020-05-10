import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import  axios from 'axios'
import JSEncrypt from 'jsencrypt'
import Toast from 'vue2-toast'

import routerConfig from './router.config'
import { bindAgreement, localStorage } from './shared/state'
import proxyConfig from './proxy'

Vue.config.productionTip = false
// 使用axios
axios.defaults.baseURL = proxyConfig()
// 每个请求加jwt
axios.interceptors.request.use((config) => {
  if (!Vue.prototype._localStorage.cilJwtToken) {
    Vue.prototype._localStorage.cilJwtToken = window.localStorage.getItem('cilJwtToken');
  }
  config.headers.Authorization = Vue.prototype._localStorage.cilJwtToken;
  return config;
}, (error) => {
  return Promise.reject(error);
})
axios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});
Vue.prototype.$axios = axios

// jsencrypt  RSA加密
Vue.prototype.$jsencrypt = new JSEncrypt()

// 挂载的全局变量
Vue.prototype._bindAgreement = bindAgreement;
Vue.prototype._localStorage = localStorage;

// 使用路由
Vue.use(VueRouter)
// 使用toast组件
Vue.use(Toast)

const router = new VueRouter(routerConfig)

// 动态更改页面title
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next()
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
