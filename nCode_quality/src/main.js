// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './components/Vuex/store'

//自适应窗口大小
import util from "./assets/js/util.js";
util.zoom();
window.onresize = () => {
  util.zoom();
};
/*import echarts and d3*/
import echarts from 'echarts'
Vue.prototype.$echarts = echarts 

/*import axios*/
import axios from 'axios'
Vue.prototype.$axios=axios
axios.defaults.baseURL = '/api'
axios.defaults.timeout = 15000;  //超时响应
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // 配置请求头（推荐）
axios.defaults.withCredentials = true;   // axios 默认不发送cookie，需要全局设置true发送cookie
Vue.config.productionTip = false

/*improt vuex */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
