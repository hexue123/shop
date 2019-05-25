<template>
  <div class="wrap">
    <el-form class="form" :model="formdata" label-width="80px" label-position="top">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click="handleLogin()" type="primary" class="btn">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async handleLogin() {
      // 使用ES7的await与async使异步操作变得像同步操作，
      // 异步操作的代码前加await，离异步操作最近的函数前加async
      // 代码看起来更整洁，没有回调函数的嵌套
      const res = await this.$http.post("login", this.formdata);
      console.log(res.data);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        // 登录成功，保存用户的token(当前用户的唯一标识)，用于以后使用
        // 使用 localStorage.setItem(key,value)持久存储值
        localStorage.setItem("token", data.token);
        // 登录成功，使用路由实例对象进行编程式导航，来到名字叫home的组件
        this.$router.push({
          name: "home"
        });
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.wrap {
  height: 100%;
  background-color: #314252;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  background-color: #ffffff;
  border-radius: 4px;
  width: 400px;
  padding: 30px;
}
.btn {
  width: 100%;
}
</style>
