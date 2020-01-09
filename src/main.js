// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import echarts from 'echarts'
import axios from 'axios'
import store from './store'
import './assets/js/jquery.min.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/font-awesome-4.7.0/css/font-awesome.min.css'
import './assets/css/iconfont/iconfont.css'
import App from './App'
import router from './router'
import api from './http'
axios.defaults.baseURL= process.env.NODE_ENV === 'production' ? window.location.protocol+'//'+window.location.host : ''

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(api)
Vue.prototype.$echarts = echarts


// fetchRoute('','/').then(function(router) {
// 	debugger;
// 	/* eslint-disable no-new */
// 	new Vue({
// 	  el: '#app',
// 	  router,
// 	  store,
// 	  render:h => h(App)
// 	  // components: { App },
// 	  // template: '<App/>'
// 	})
// });
// 
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render:h => h(App)
  // components: { App },
  // template: '<App/>'
})
