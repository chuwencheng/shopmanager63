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
                    <el-menu default-active="2-1" class="menu" :unique-opened="true" :router="true">
                        <!-- 用户管理-->
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>用户管理</span>
                            </template>
                            <!-- 1.<router-link></router-link> 改标识-->
                            <el-menu-item index="/users">
                                <i class="el-icon-menu"></i>
                                用户列表
                            </el-menu-item>
                        </el-submenu>
                        <!-- 权限管理-->
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>权限管理</span>
                            </template>
                            <el-menu-item index="/roles">
                                <i class="el-icon-menu"></i>
                                角色列表
                            </el-menu-item>
                            <el-menu-item index="/rights">
                                <i class="el-icon-menu"></i>
                                权限列表
                            </el-menu-item>
                        </el-submenu>
                        <!-- 商品管理-->
                        <el-submenu index="3">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>商品管理</span>
                            </template>
                            <el-menu-item index="3-1">
                                <i class="el-icon-menu"></i>
                                商品列表
                            </el-menu-item>
                            <el-menu-item index="3-1">
                                <i class="el-icon-menu"></i>
                                分类参数
                            </el-menu-item>
                            <el-menu-item index="3-1">
                                <i class="el-icon-menu"></i>
                                商品分页
                            </el-menu-item>
                        </el-submenu>
                        <!--订单管理-->
                        <el-submenu index="4">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>订单管理</span>
                            </template>
                            <el-menu-item index="4-1">
                                <i class="el-icon-menu"></i>
                                订单列表
                            </el-menu-item>
                        </el-submenu>
                        <!--数据统计-->
                        <el-submenu index="5">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>数据统计</span>
                            </template>
                            <el-menu-item index="5-1">
                                <i class="el-icon-menu"></i>
                                数据报表
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
  // 登录权限，如果用户没有登录不能进入home.vue,显示login.vue
  beforeMount () {
    if (!localStorage.getItem('token')) {
      this.$router.push({
        name: 'login'
      })
    }
  },
  methods: {
    // 退出
    handleLoginout () {
      // 1.清除token
      localStorage.clear()
      // 2.跳转到login
      this.$router.push({
        name: 'login'
      })
      // 提示
      this.$message.warning('退出成功')
    }
  }
}
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
/* .aside {
  background: red;
} */
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
