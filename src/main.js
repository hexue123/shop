// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// 引入element ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式，这样login.vue组件的样式才会生效
import "@/assets/index.css"
import router from './router'
// 引入moment
import moment from "moment"
// 导入自己为vue写的插件
import Http from "@/plugins/http";
// 让Vue使用已经作为插件的axios
Vue.use(Http);


Vue.use(ElementUI)

// 定义一个全局过滤器，用于在任何地方处理时间格式
// 但是需要下载moment  npm i moment
Vue.filter("fmData", (v) => {
    return moment(v).format("YYYY-MM-DD");
})


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})