// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from '@/util/currency.js'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueLazyload, { // 懒加载
  loading: "/static/loading-svg/loading-bars.svg",
})

Vue.use(infiniteScroll) // 滚动加载

Vue.filter("currency", currency) // 全局过滤器

// Vuex的store
const store = new Vuex.Store({
  state: {
    nickName: '', //用户名
    cartCount: 0  // 购物车数量
  },
  mutations: {
    updateUserInfo (state, nickName) { // 用户名信息在头部组件，需要被其他每个组件共享数据
      state.nickName = nickName;
    },
    updateCartCount(state, cartCount) { // 购物车累加
      state.cartCount += cartCount
    },
    initCartCount(state, cartCount) { // 购物车加载
      state.cartCount = cartCount
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,   // 注册到Vue的根组件
  router,
  components: { App },
  template: '<App/>'
})
