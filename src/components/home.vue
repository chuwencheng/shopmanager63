<template>
    <el-container class="container">
        <!-- 头部 -->
        <el-header class="header">
            <el-row>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <img src="../assets/logo.png" alt="">
                    </div>
                </el-col>
                <el-col :span="19" class="middle">
                    <h2>电商后台管理系统</h2>
                </el-col>
                <el-col :span="1">
                    <a href="#" @click.prevent="handleLoginout()" class="loginout">退出</a>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside class="aside" width="200px">
                <!-- 导航 -->
                <el-aside class="aside" width="200px">
                    <!-- default-active:默认展开项
                    :unique-opened: 只允许同时展开一项
                    :router 开启路由模式
                    开启后, 设置el-menu-item的index值 为路由标识
                    -->
                    <el-menu @select="fn" :default-active="$route.name" class="menu" :unique-opened="true" :router="true">
                        <!-- 用户管理-->
                        <el-submenu :index="item1.order +'' " v-for="(item1,i) in menus" :key="item1.id">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{item1.authName}}</span>
                            </template>
                            <!-- 1.<router-link></router-link> 改标识-->
                            <el-menu-item :index="item2.path" v-for="(item2,i) in item1.children" :key="item2.id">
                                <i class="el-icon-menu"></i>
                                {{item2.authName}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
            </el-aside>
            <el-main class="main">
                <!-- 2.提供容器 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    };
  },
  // 登录权限，如果用户没有登录不能进入home.vue,显示login.vue
  beforeMount() {
    // 路由的导航守卫完成了判断，所有这段代码注释掉
    // if (!localStorage.getItem("token")) {
    //   this.$router.push({
    //     name: "login"
    //   });
    // }
  },
  created() {
    this.getMenus();
  },
  methods: {
    // 菜单默认展开
    fn(index, indexPath) {
      //   console.log(this.$route.name);
    },
    // 动态获取左侧菜单
    async getMenus() {
      const res = await this.$http.get(`menus`);
      // console.log(res)
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.menus = data;
        // console.log(this.menus)
      }
    },
    // 退出
    handleLoginout() {
      // 1.清除token
      localStorage.clear();
      // 2.跳转到login
      this.$router.push({
        name: "login"
      });
      // 提示
      this.$message.warning("退出成功");
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  background-color: #b3c0d1;
}
.middle {
  text-align: center;
  line-height: 60px;
}
.aside .menu {
  height: 100%;
}
.main {
  background: gray;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
</style>
