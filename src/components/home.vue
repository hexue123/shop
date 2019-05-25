<template>
  <el-container class="container">
    <el-header class="header">
      <!-- 头部 -->
      <el-row>
        <el-col :span="1">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="19" class="mid">
          <h3>vue后台管理</h3>
        </el-col>
        <el-col :span="3" class="loginout">
          <a href="javscript:;" @click.prevent="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">

        <!-- :unique-opened="true" 默认只展开一个自己菜单   -->
        <el-menu :unique-opened="true" default-active="2">
          <!-- 选项1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-3"> <i class="el-icon-location"></i>用户列表</el-menu-item>
          </el-submenu>

          <!-- 选项2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-3"> <i class="el-icon-location"></i>角色列表</el-menu-item>
            <el-menu-item index="1-4"> <i class="el-icon-location"></i>权限列表</el-menu-item>
          </el-submenu>

          <!-- 选项3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-3"> <i class="el-icon-location"></i>商品列表</el-menu-item>
            <el-menu-item index="1-3"> <i class="el-icon-location"></i>分类参数</el-menu-item>
            <el-menu-item index="1-3"> <i class="el-icon-location"></i>商品分类</el-menu-item>
          </el-submenu>

          <!-- 选项4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-3"> <i class="el-icon-location"></i>订单列表</el-menu-item>
          </el-submenu>

          <!-- 选项5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-3"> <i class="el-icon-location"></i>数据报表</el-menu-item>
          </el-submenu>
              
        </el-menu>
      </el-aside>

      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    // 在vue实例创建前，检测一下是否登录过，即要求登录后，才可进入home组件，更安全些
    beforeCreate(){
        if(!localStorage.getItem("token")){
            //提示下登录
            this.$message.warning("请先登录");
            // 使用编程式导航，因为没登录么，所以去登录
            this.$router.push({
                name:"login"
            });   
        }
    },
    methods:{
        // 点击退出功能
        handleLoginout(){
        // 1.清除token
        localStorage.clear();
        // 2.回到登录组件
        this.$router.push({
            name:"login"
        });
        // 3.提示
        this.$message.success("退出成功");
        }
    }
};
</script>

<style>
.container {
  height: 100%;
  /* background-color: yellow; */
}
.header {
  background-color: gray;
}
.aside {
  /* background-color: pink; */
}
.main {
  /* background-color: aquamarine; */
}
.mid {
  text-align: center;
  line-height: 60px;
}
.loginout > a {
  line-height: 60px;
  text-decoration: none;
  color: black;
}
</style>
