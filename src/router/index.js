import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
export default new Router({
    routes: [
        // home组件的路由配置
        {
            name: "home",
            path: "/",
            component: Home,
            // 渲染完毕home组件后，实现组件嵌套
            children: [{
                name: "users",
                path: "/users",
                component: Users
            }]
        },
        {
            name: "login",
            path: "/login",
            component: Login
        }
    ]
})