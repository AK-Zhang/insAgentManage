// 1.0 导入vue核心包
import Vue from 'vue'
// 2.0 导入App.vue的vue对象
import App from './App'
// 3.0 将 vue-route 集成到这个项目中来
import router from './router'
// 3.0.1 将 vueRoute 对象绑定到vue对象上
//使用elsementUi
import promise from 'es6-promise';
promise.polyfill();
import 'babel-polyfill'


import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import loginApi from './api/login.js';
Vue.prototype.$loginapi = loginApi;

import indexApi from './api/index.js'
Vue.prototype.$indexapi = indexApi;

// 导入axios
import axios from 'axios';
//导入全局js
import './assets/lib/jquery.min.js'
import './assets/lib/bootstrap/dist/js/bootstrap.js'


// 6.0 引入全局 css
import './assets/less/base.less'
import './assets/lib/bootstrap/dist/css/bootstrap.min.css'
import './assets/lib/font-awesome/css/font-awesome.min.css'
import gxdd from './assets/js/Css_moudules'
Vue.prototype.$Agentcode = gxdd.Agentcode;


//导入全局字体图标
import './assets/iconfont/iconfont.css'
import './assets/iconfontnew/iconfont.css'

// 8.0 定义一个全局过滤器实现日期的格式化
import moment from 'moment';
Vue.filter('datefmt', function (input, fmtstring) {
  return moment(input).format(fmtstring)
})

Vue.config.productionTip = false;

/* eslint-disable no-new */
window.vue = new Vue({
  el: '#app',
  router,
  store: loginApi.store,
  mounted() {

  },
  components: {
    home: App
  },
  template: '<home/>'
})
