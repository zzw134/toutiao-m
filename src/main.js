import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载vant核心组件库
import Vant from 'vant'
// 加载vant全局样式
import 'vant/lib/index.css'

// 加载全局样式
import './styles/index.css'

// 注册使用vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
