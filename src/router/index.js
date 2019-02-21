import Vue from 'vue'
import { Message } from 'element-ui'
import Router from 'vue-router'
// import Login from '../components/login.vue'
// webpack项目模板 提供@->自动找到src文件夹
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Goodslist from '@/components/goodslist.vue'
import Goodsadd from '@/components/goodsadd.vue'

Vue.use(Router)

const router = new Router({
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  }, {
    name: 'home',
    path: '/',
    component: Home,
    children: [{
      name: 'users',
      path: '/users',
      component: Users
    }, {
      name: 'rights',
      path: '/rights',
      component: Rights
    }, {
      name: 'roles',
      path: '/roles',
      component: Roles
    },{
      name: 'goods',
      path: '/goods',
      component: Goodslist
    },{
      name: 'goodsadd',
      path: '/goodsadd',
      component: Goodsadd
    }]
  }]
})

// 路由的导航守卫
// 路由生效前，先来这里
// 当路由变化时，会执行导航守卫中的代码
// to 是要去的路径，from是从哪个路径来
// next() 方法让代码继续执行
router.beforeEach((to, from, next) => {
  // 如果要去的是login ，继续登录
  if (to.name === "login") {
    next()
  } else {
    // 如果要去的不是login
    const token = localStorage.getItem("token")
    // 判断是否有token if 没有token，渲染login
    if (!token) {
      // 提示
      // this.$message.warning("请先登录")
      Message.warning("请先登录")
      router.push({
        name: "login"
      })
      return
    }
    // if 有token ，继续执行代码
    next()
  }
  // console.log(to,from)
  // next()
})

export default router