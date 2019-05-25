import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
export default new Router({
    routes: [
        // home组件的路由配置
        {
            name: "home",
            path: "/",
            component: Home
        },
        {
            name: "login",
            path: "/login",
            component: Login
        }
    ]
})