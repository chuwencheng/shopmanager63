<template>
    <div class="login-wrap">
        <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
            <h2>用户登录</h2>
            <el-form-item label="用户名">
                <el-input v-model="formdata.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formdata.password"></el-input>
            </el-form-item>
            <el-button @click.prevent="handlelogin()" class="login-btn" type="primary">登录</el-button>
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
    // 登录请求
    async handlelogin() {
      const res = await this.$http.post(`login`, this.formdata);
      console.log(res);
      // 前提：api-server 必须是启动状态
      // console.log(res)
      const { data: { data: { token }, meta: { msg, status } } } = res;

      if (status === 200) {
        // 将token永久保存
        localStorage.setItem("token", token);

        // 渲染home组件
        this.$router.push({
          name: "home"
        });
      } else {
        // 用户名或密码错误
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  background-color: #fff;
  width: 400px;
  border-radius: 5px;
  padding: 30px;
}
.login-btn {
  width: 100%;
}
</style>
