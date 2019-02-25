<template>
  <div class="login-wrap">
    <el-form :rules="rules" ref="ruleForm" class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handlelogin('ruleForm')" class="login-btn" type="primary">登录</el-button>
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
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [{ required: true, min: 5, max: 8 }]
      }
    };
  },
  methods: {
    // 登录请求
    handlelogin(ruleForm) {
      this.$refs[ruleForm].validate(async valid => {
        if (valid) {
          const res = await this.$http.post(`login`, this.formdata);
          // console.log(res)
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
        } else {
          this.$message.error("验证错误");
          return false;
        }
      });
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
