import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from 'components/common/toast'
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false
    // 创建事件总线监听
Vue.prototype.$bus = new Vue()

// 安裝插件
Vue.use(toast)

// 解决移动端的300ms的延迟
FastClick.attach(document.body)

// 使用图片懒加载的插件
Vue.use(VueLazyload, {
    preLoad: 1,
    loading: require('assets/img/common/placeholder.png')
})


new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
