<template>
    <!-- el-card小容器 可以理解为自带样式的div -->
    <el-card class="box">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框 -->
        <el-row class="searchBox">
            <el-col>
                <el-input @clear="getAllUsers()" clearable class="searchInput" placeholder="请输入内容" v-model="query">
                    <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button @click="showDiaAddUser()" type="primary">添加用户</el-button>
            </el-col>
        </el-row>

        <!-- 表格
        el-table-column 控制列
        lable 控制表头
        prop的值控制的是该列中每一行单元格的内容
        -->
        <el-table :data="list" style="width: 100%">
            <el-table-column prop="id" label="#" width="80">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="100">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="140">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" width="140">
            </el-table-column>
            <el-table-column label="创建日期" width="200">
                <template slot-scope="scope">
                    {{scope.row.create_time|fmtdate}}
                </template>
            </el-table-column>
            <el-table-column label="用户状态" width="120">
                <!-- 前提：单元格内容是一个组件，不是prop的值 -->
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 对话框 添加用户对话框 -->
        <el-dialog title="收货地址" :visible.sync="dialogFormVisibleAdd">
            <el-form label-position="left" label-width="80px" :model="formdata">
                <el-form-item label="用户名">
                    <el-input v-model="formdata.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="formdata.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="formdata.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="formdata.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: -1,
      list: [],
      // 对话框
      dialogFormVisibleAdd: false,
      // 表单
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 添加用户-发送请求
    async addUser () {
      // 获取表单数据
      const res = await this.$http.post(`users`, this.formdata)
      console.log(res)
      this.getTableData()
      // 关闭对话框
      this.dialogFormVisibleAdd = false
    },
    // 添加用户-展示对话框
    showDiaAddUser () {
      this.dialogFormVisibleAdd = true
    },
    // 清空时获取所有用户
    getAllUsers () {
      // 此时query值为空字符串
      this.getTableData()
    },
    // 搜索用户
    searchUser () {
      this.pagenum = 1
      // 按最新的query发送请求
      this.getTableData()
    },
    // 分页相关的方法
    // 当每页条数改变时，发送请求
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagenum = 1
      this.pagesize = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      // 根据新页码发送请求
      this.pagenum = val
      this.getTableData()
    },
    async getTableData () {
      const AUTH_TOKEN = localStorage.getItem('token')
      //   console.log(AUTH_TOKEN)
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )

      const data = res.data
      const { meta: { msg, status } } = data
      if (status === 200) {
        const { data: { users, total } } = data
        this.list = users
        // 获取总共多少条数据
        this.total = total
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>
